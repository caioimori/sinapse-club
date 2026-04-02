# ADR-002: Access Control & Tier System

> **Status:** ACCEPTED
> **Author:** @architect (Aria)
> **Date:** 2026-03-31
> **Supersedes:** None
> **Related:** ADR-001 (Forum), database-schema.md, security-spec.md

---

## 1. Context

sinapse.club has two distinct products with different monetization models:

| Product | Model | Gateway |
|---------|-------|---------|
| **Forum** (community) | Recurring subscription (free / pro / premium) | AbacatePay |
| **Courses** (education) | One-time purchase per course | AbacatePay |

The platform needs a unified access control system that governs both products while keeping their billing independent.

### Current State

- `profiles.role` stores the user's tier: `free | pro | premium | admin | instructor`
- `subscriptions` table tracks billing state (Stripe-shaped, used by AbacatePay)
- `enrollments` table tracks course purchases (user_id + course_id)
- `user_has_access(required_access TEXT)` checks role hierarchy for forum/space access
- Middleware handles auth redirect but has **no tier-gating logic**
- RLS policies exist for spaces/posts but are role-based only — no enrollment checks on courses
- Webhook at `/api/webhooks/abacatepay` handles `billing.paid` but not cancellation/expiry properly

---

## 2. Decision: Tiered Access Model

### 2.1 Tier Hierarchy

```
admin > instructor > premium > pro > free
  5         4           3       2     1
```

Numeric mapping enables simple comparisons:

```sql
CREATE OR REPLACE FUNCTION public.role_rank(r TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE r
    WHEN 'admin' THEN 5
    WHEN 'instructor' THEN 4
    WHEN 'premium' THEN 3
    WHEN 'pro' THEN 2
    WHEN 'free' THEN 1
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### 2.2 Access Matrix

| Resource | Free | Pro | Premium | Admin | Instructor |
|----------|------|-----|---------|-------|------------|
| **Forum: free categories** | Read + Write (limited) | Full | Full | Full | Full |
| **Forum: pro categories** | -- | Full | Full | Full | Full |
| **Forum: premium categories** | -- | -- | Full | Full | Full |
| **Threads/month** | 3 | Unlimited | Unlimited | Unlimited | Unlimited |
| **Marketplace** | View only | Full CRUD | Full CRUD | Full CRUD | Full CRUD |
| **Tools** | -- | Full | Full | Full | Full |
| **Benefits** | -- | Full | Full | Full | Full |
| **Course catalog (listing)** | View all | View all | View all | View all | View all |
| **Course preview lessons** | Yes | Yes | Yes | Yes | Yes |
| **Course full content** | Enrolled only | Enrolled only | ALL courses | Full | Own + enrolled |
| **Events: free** | Yes | Yes | Yes | Yes | Yes |
| **Events: pro** | -- | Yes | Yes | Yes | Yes |
| **Events: course** | Enrolled | Enrolled | Yes | Yes | Yes |

### 2.3 Two Independent Access Dimensions

```
ACCESS = max(SUBSCRIPTION_ACCESS, ENROLLMENT_ACCESS)
```

- **Subscription access:** Derived from `profiles.role` (synced from `subscriptions`)
- **Enrollment access:** Derived from `enrollments` (per-course, perpetual)

A user with `role = 'free'` who bought Course X has:
- Forum access: free tier (limited)
- Course X access: full (via enrollment)
- Course Y access: none

A user with `role = 'premium'` has:
- Forum access: premium tier (full)
- ALL courses: full access (subscription benefit)

---

## 3. Schema Changes

### 3.1 New Table: `free_tier_limits`

Tracks rate limits for free-tier users.

```sql
CREATE TABLE public.free_tier_limits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month       DATE NOT NULL,  -- first day of month (2026-04-01)
  threads_created INTEGER NOT NULL DEFAULT 0,
  marketplace_views INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, month)
);

CREATE INDEX idx_free_limits_user_month ON public.free_tier_limits(user_id, month);

ALTER TABLE public.free_tier_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own limits"
  ON public.free_tier_limits FOR SELECT
  USING (auth.uid() = user_id);
```

### 3.2 Alter `subscriptions` — Add `user_id` unique constraint

```sql
-- subscriptions should be 1:1 with user (latest subscription)
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id);
```

### 3.3 New Column: `courses.included_in_premium`

```sql
ALTER TABLE public.courses
  ADD COLUMN included_in_premium BOOLEAN NOT NULL DEFAULT true;
```

This allows future courses to be excluded from the Premium bundle (e.g., high-ticket masterclasses).

---

## 4. Refined Access Functions

### 4.1 `user_has_access` (Forum/Space/Feature access)

Replace the existing function with a rank-based version:

```sql
CREATE OR REPLACE FUNCTION public.user_has_access(required_access TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Admin and instructor always pass
  IF user_role IN ('admin', 'instructor') THEN RETURN true; END IF;

  -- Rank comparison
  RETURN public.role_rank(user_role) >= public.role_rank(required_access);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 4.2 `user_has_course_access` (Course content access)

New function for course-specific checks:

```sql
CREATE OR REPLACE FUNCTION public.user_has_course_access(target_course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Admin always has access
  IF user_role = 'admin' THEN RETURN true; END IF;

  -- Instructor has access to own courses
  IF user_role = 'instructor' THEN
    IF EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = target_course_id AND instructor_id = auth.uid()
    ) THEN RETURN true; END IF;
  END IF;

  -- Premium users get all premium-included courses
  IF user_role = 'premium' THEN
    IF EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = target_course_id AND included_in_premium = true
    ) THEN RETURN true; END IF;
  END IF;

  -- Direct enrollment check (purchased individually)
  RETURN EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = target_course_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 4.3 `user_can_create_thread` (Free tier rate limiter)

```sql
CREATE OR REPLACE FUNCTION public.user_can_create_thread()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  current_month DATE;
  thread_count INTEGER;
  max_threads CONSTANT INTEGER := 3;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Non-free users have unlimited threads
  IF user_role != 'free' THEN RETURN true; END IF;

  -- Check monthly limit for free users
  current_month := date_trunc('month', CURRENT_DATE)::DATE;

  SELECT COALESCE(threads_created, 0) INTO thread_count
  FROM public.free_tier_limits
  WHERE user_id = auth.uid() AND month = current_month;

  RETURN COALESCE(thread_count, 0) < max_threads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 4.4 `increment_thread_count` (Called after thread creation)

```sql
CREATE OR REPLACE FUNCTION public.increment_thread_count()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  current_month DATE;
BEGIN
  -- Only count for free users, only for new threads (not replies)
  IF NEW.type NOT IN ('thread', 'post') OR NEW.reply_to IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT role INTO user_role
  FROM public.profiles WHERE id = NEW.author_id;

  IF user_role = 'free' THEN
    current_month := date_trunc('month', CURRENT_DATE)::DATE;

    INSERT INTO public.free_tier_limits (user_id, month, threads_created)
    VALUES (NEW.author_id, current_month, 1)
    ON CONFLICT (user_id, month)
    DO UPDATE SET threads_created = free_tier_limits.threads_created + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_increment_thread_count
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.increment_thread_count();
```

---

## 5. Updated RLS Policies

### 5.1 Lessons — Enrollment OR Premium OR Preview

Replace the existing lessons policy:

```sql
DROP POLICY IF EXISTS "Lessons visible to enrolled users or preview" ON public.lessons;

CREATE POLICY "Lessons visible based on access"
  ON public.lessons FOR SELECT
  USING (
    is_preview = true
    OR public.user_has_course_access(course_id)
  );
```

### 5.2 Posts — Thread creation with rate limit

```sql
-- Keep existing SELECT policy (space-access based)
-- Update INSERT to enforce thread limit for free users

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;

CREATE POLICY "Users can create posts within tier limits"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND (
      -- Replies/comments are always allowed
      reply_to IS NOT NULL
      -- New threads require capacity check
      OR public.user_can_create_thread()
    )
    AND (
      -- Space access check (if posting to a space)
      space_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.spaces s
        WHERE s.id = space_id
        AND public.user_has_access(s.access)
      )
    )
  );
```

### 5.3 Forum Categories — Access-gated reads

```sql
DROP POLICY IF EXISTS "Anyone can read active categories" ON public.forum_categories;

CREATE POLICY "Categories visible based on access"
  ON public.forum_categories FOR SELECT
  USING (
    is_active = true
    AND public.user_has_access(access)
  );
```

### 5.4 Marketplace — Pro+ only for create/update

```sql
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active listings (browse/discover)
CREATE POLICY "Active listings visible to pro+"
  ON public.marketplace_listings FOR SELECT
  USING (
    is_active = true
    AND public.user_has_access('pro')
  );

-- Only pro+ can create
CREATE POLICY "Pro+ can create listings"
  ON public.marketplace_listings FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND public.user_has_access('pro')
  );

-- Authors can update own
CREATE POLICY "Authors can update own listings"
  ON public.marketplace_listings FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete own
CREATE POLICY "Authors can delete own listings"
  ON public.marketplace_listings FOR DELETE
  USING (auth.uid() = author_id);
```

### 5.5 Tools & Benefits — Pro+ read access

```sql
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools visible to pro+"
  ON public.tools FOR SELECT
  USING (is_active = true AND public.user_has_access(access));

CREATE POLICY "Benefits visible to pro+"
  ON public.benefits FOR SELECT
  USING (is_active = true AND public.user_has_access(access));
```

---

## 6. Middleware Logic (Next.js)

### 6.1 Tier-Gated Routes

Extend `src/lib/supabase/middleware.ts` to enforce tier at the edge:

```typescript
// Route → minimum required role mapping
const TIER_GATED_ROUTES: Record<string, UserRole> = {
  '/marketplace': 'pro',
  '/tools': 'pro',
  '/benefits': 'pro',
};

// In updateSession(), after onboarding check:
const tierRoute = Object.entries(TIER_GATED_ROUTES)
  .find(([route]) => pathname.startsWith(route));

if (tierRoute && profile) {
  const [, requiredRole] = tierRoute;
  if (roleRank(profile.role) < roleRank(requiredRole)) {
    const url = request.nextUrl.clone();
    url.pathname = '/pricing';
    url.searchParams.set('upgrade', requiredRole);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
}
```

### 6.2 Course Route Middleware

Course content pages (`/courses/[slug]/lessons/[lessonId]`) need enrollment check. This is better handled at the page level (server component) rather than middleware, because it requires a DB lookup per course.

```typescript
// In courses/[slug]/lessons/[lessonId]/page.tsx (server component)
const { data: hasAccess } = await supabase
  .rpc('user_has_course_access', { target_course_id: course.id });

if (!hasAccess && !lesson.is_preview) {
  return <EnrollWall course={course} />;
}
```

### 6.3 `roleRank` Utility (Shared)

```typescript
// src/lib/access.ts
export type UserRole = 'free' | 'pro' | 'premium' | 'admin' | 'instructor';

const ROLE_RANKS: Record<UserRole, number> = {
  free: 1,
  pro: 2,
  premium: 3,
  instructor: 4,
  admin: 5,
};

export function roleRank(role: UserRole): number {
  return ROLE_RANKS[role] ?? 0;
}

export function hasAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleRank(userRole) >= roleRank(requiredRole);
}

export function canAccessCourse(
  userRole: UserRole,
  isEnrolled: boolean,
  courseIncludedInPremium: boolean
): boolean {
  if (userRole === 'admin' || userRole === 'instructor') return true;
  if (userRole === 'premium' && courseIncludedInPremium) return true;
  return isEnrolled;
}

// Feature flags per tier
export const TIER_FEATURES = {
  free: {
    maxThreadsPerMonth: 3,
    canAccessMarketplace: false,
    canAccessTools: false,
    canAccessBenefits: false,
    canAccessAllCourses: false,
    forumAccess: 'free' as const,
  },
  pro: {
    maxThreadsPerMonth: Infinity,
    canAccessMarketplace: true,
    canAccessTools: true,
    canAccessBenefits: true,
    canAccessAllCourses: false,
    forumAccess: 'pro' as const,
  },
  premium: {
    maxThreadsPerMonth: Infinity,
    canAccessMarketplace: true,
    canAccessTools: true,
    canAccessBenefits: true,
    canAccessAllCourses: true,
    forumAccess: 'premium' as const,
  },
} as const;
```

---

## 7. Payment Flows

### 7.1 Subscription Flow (Forum tiers)

```
User clicks "Upgrade to Pro" on /pricing
  → Frontend creates AbacatePay checkout (externalId: "PLAN-pro")
  → User pays on AbacatePay hosted page
  → AbacatePay webhook → POST /api/webhooks/abacatepay
    → event: "billing.paid", externalId: "PLAN-pro"
    → Find user by email
    → UPSERT subscriptions (plan='pro', status='active')
    → UPDATE profiles SET role='pro'
  → User refreshes → middleware sees role='pro' → full access
```

### 7.2 Course Purchase Flow

```
User clicks "Buy Course" on /courses/[slug]
  → Frontend creates AbacatePay checkout (externalId: "COURSE-{courseId}")
  → User pays
  → Webhook → POST /api/webhooks/abacatepay
    → event: "billing.paid", externalId: "COURSE-{courseId}"
    → Find user by email
    → INSERT enrollments (user_id, course_id, status='active')
    → (NO role change — course purchase does NOT upgrade forum tier)
  → User refreshes → RLS allows lesson access via enrollment
```

### 7.3 Cancellation Flow

```
AbacatePay webhook → event: "billing.expired" or "billing.cancelled"
  → Find user by subscription ID
  → UPDATE subscriptions SET status='canceled', canceled_at=NOW()
  → UPDATE profiles SET role='free'
  → (enrollments are UNTOUCHED — purchased courses remain accessible)
```

### 7.4 Webhook Handler Updates Required

The current webhook handler needs these fixes:

1. **Handle cancellation properly** (currently a no-op `break`)
2. **Do NOT upgrade forum tier on course purchase** (current code is correct here)
3. **Add signature verification** (AbacatePay webhook secret)
4. **Add idempotency** (check if already processed)

---

## 8. UI Component Specifications

### 8.1 `<UpgradeWall>`

Shown when a user tries to access tier-gated forum content.

```
Props:
  requiredTier: 'pro' | 'premium'
  currentTier: UserRole
  featureName: string  (e.g., "Marketplace", "Coding & Tools category")
  returnPath: string

Behavior:
  - Displays locked content overlay
  - Shows tier comparison (what they get)
  - CTA button → /pricing?upgrade={requiredTier}&from={returnPath}
  - If user is 'pro' and content needs 'premium', show Premium upsell
```

### 8.2 `<EnrollWall>`

Shown when a user tries to access a course they haven't purchased.

```
Props:
  course: { id, title, price_cents, slug, included_in_premium }
  userRole: UserRole

Behavior:
  - Shows course preview info (thumbnail, description, curriculum outline)
  - If user is premium AND course.included_in_premium → auto-enroll (should not happen, RLS handles it)
  - Price display: "R$ {price/100}"
  - CTA: "Comprar Curso" → AbacatePay checkout
  - Secondary CTA: "Ou assine Premium e acesse todos" → /pricing
```

### 8.3 `<TierBadge>`

Visual indicator of user tier.

```
Props:
  role: UserRole

Renders:
  free     → (no badge)
  pro      → "PRO" badge (accent color)
  premium  → "PREMIUM" badge (gold)
  admin    → "ADMIN" badge (red)
  instructor → "INSTRUCTOR" badge (blue)
```

### 8.4 `<FeatureGate>`

Client-side wrapper that conditionally renders children or an upgrade prompt.

```
Props:
  requiredTier: UserRole
  fallback?: ReactNode  (defaults to <UpgradeWall>)
  children: ReactNode

Usage:
  <FeatureGate requiredTier="pro">
    <MarketplaceContent />
  </FeatureGate>
```

### 8.5 `<ThreadLimitIndicator>`

Shows free users their remaining thread quota.

```
Props:
  used: number
  max: number  (3)

Renders:
  "2/3 threads this month" with progress bar
  When 3/3: "Limit reached. Upgrade to Pro for unlimited."
```

---

## 9. Access Check Flow Diagram

```
                    ┌──────────────────┐
                    │  User Request    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Next.js         │
                    │  Middleware       │
                    │                  │
                    │  1. Auth check   │
                    │  2. Onboarding   │
                    │  3. Tier gate    │
                    │     (routes)     │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐  ┌──▼──────────┐  ┌▼──────────────┐
     │  Forum Page    │  │ Course Page │  │ Feature Page  │
     │                │  │             │  │ (Mkt/Tools)   │
     │  Server:       │  │ Server:     │  │               │
     │  role check    │  │ enrollment  │  │ Middleware     │
     │  via RLS       │  │ check via   │  │ already       │
     │                │  │ RPC         │  │ gated         │
     └────────┬───────┘  └──┬──────────┘  └───────────────┘
              │              │
     ┌────────▼───────┐  ┌──▼──────────┐
     │  Supabase RLS  │  │ Supabase    │
     │                │  │ RPC         │
     │ user_has_      │  │ user_has_   │
     │ access()       │  │ course_     │
     │                │  │ access()    │
     │ Checks:        │  │             │
     │ role_rank()    │  │ Checks:     │
     │                │  │ 1. admin?   │
     └────────────────┘  │ 2. instr?   │
                         │ 3. premium? │
                         │ 4. enrolled?│
                         └─────────────┘
```

---

## 10. Security Layers (Defense in Depth)

| Layer | What It Protects | Mechanism |
|-------|-----------------|-----------|
| **L1: Middleware** | Route access (redirect) | `roleRank()` comparison in Next.js middleware |
| **L2: Server Components** | Page-level data | RPC calls (`user_has_course_access`) before rendering |
| **L3: RLS Policies** | Row-level data | `user_has_access()` in Supabase policies — final authority |
| **L4: Client UI** | Visual gates | `<FeatureGate>`, `<UpgradeWall>` — cosmetic, not security |

**Critical rule:** L3 (RLS) is the ONLY true security boundary. L1, L2, and L4 are UX optimizations. Even if middleware is bypassed, RLS prevents data leakage.

---

## 11. Migration Plan

### New Migration: `20250331000030_access_control_tiers.sql`

Consolidated migration containing:

1. `role_rank()` function
2. `free_tier_limits` table + RLS
3. `courses.included_in_premium` column
4. `subscriptions.user_id` unique constraint
5. Updated `user_has_access()` function
6. New `user_has_course_access()` function
7. New `user_can_create_thread()` function
8. `increment_thread_count()` trigger
9. Updated RLS policies (lessons, posts, categories, marketplace, tools, benefits)

---

## 12. Implementation Stories

This ADR should be implemented across these stories:

| Story | Scope | Agent |
|-------|-------|-------|
| Access-1: DB migration | Functions, tables, RLS | @data-engineer |
| Access-2: Middleware tier gates | Next.js middleware + `src/lib/access.ts` | @developer |
| Access-3: UI gate components | `UpgradeWall`, `EnrollWall`, `FeatureGate`, `TierBadge` | @developer |
| Access-4: Webhook hardening | Cancellation handling, idempotency, signature verify | @developer |
| Access-5: Free tier limits UI | `ThreadLimitIndicator`, monthly counter display | @developer |
| Access-6: Pricing page | Tier comparison, checkout integration | @developer |

---

## 13. Open Questions

| # | Question | Decision |
|---|----------|----------|
| 1 | Should course purchase grant temporary Pro access to the forum? | **NO** — Keep products independent. Course buyers get course access only. If they want forum Pro, they subscribe separately. Simplifies billing logic significantly. |
| 2 | Should `instructor` role always have full course access or only their own? | Own courses + explicitly enrolled. Instructors are content creators, not subscribers. |
| 3 | Should free users see locked content (blurred) or get redirected? | **Blurred/locked overlay** (UpgradeWall). Better conversion than redirect — shows value before paywall. Forum categories should be visible in sidebar with a lock icon. |
| 4 | AbacatePay vs Stripe? | **AbacatePay** for now (already integrated, Brazilian payment methods). Schema keeps Stripe field names for future migration flexibility. |

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-31 | Initial ADR | @architect (Aria) |
