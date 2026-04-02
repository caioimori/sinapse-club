# TIERS-2: Middleware & Server Access Control

> **Status:** Done
> **Epic:** Access Control & Tiers (ADR-002)
> **Assigned to:** @developer (Dex)
> **Complexity:** M (Medium)
> **Created:** 2026-03-31
> **ADR Reference:** `docs/architecture/ADR-002-access-control-tiers.md`

---

## Objective

Implement server-side tier enforcement: Next.js middleware route gating, shared access utility library, and server component access checks for courses.

---

## Acceptance Criteria

### AC-1: Access utility library
- [x] `src/lib/access.ts` created with:
  - `roleRank(role)` function mirroring DB role_rank()
  - `hasAccess(userRole, requiredRole)` boolean helper
  - `canAccessCourse(userRole, isEnrolled, includedInPremium)` helper
  - `TIER_FEATURES` constant with feature flags per tier
  - `UserRole` type exported

### AC-2: Middleware tier gating
- [x] `src/lib/supabase/middleware.ts` updated
- [x] Routes /marketplace, /tools, /benefits gated to pro+
- [x] Redirect to /pricing with ?upgrade={tier}&from={path} when access denied
- [x] Admin/instructor always passes

### AC-3: Course page server-side check
- [x] Course lesson pages call `user_has_course_access` RPC
- [x] Non-preview lessons without access show EnrollWall (placeholder until TIERS-3)
- [x] Preview lessons always render

### AC-4: Forum category server-side check
- [x] Forum pages filter categories by user role
- [x] Locked categories visible but marked (for TIERS-3 lock icons)

---

## Scope

### IN
- `src/lib/access.ts` utility library
- Middleware updates for tier-gated routes
- Server component access checks in course pages
- Forum category filtering by tier

### OUT
- UI components (TIERS-3)
- Payment flows (TIERS-4)
- Database changes (TIERS-1, prerequisite)

---

## Dependencies

- TIERS-1 completed (DB functions exist)
- Existing middleware in `src/lib/supabase/middleware.ts`

---

## File List

- `src/lib/access.ts` — Access utility library (roleRank, hasAccess, canAccessCourse, TIER_FEATURES)
- `src/lib/supabase/middleware.ts` — Tier-gated routes (pro+ for marketplace/tools/benefits)
- `src/app/(dashboard)/courses/[slug]/page.tsx` — Course access check via RPC
- `src/app/(dashboard)/forum/page.tsx` — Category locked prop
- `src/app/(dashboard)/forum/[category]/page.tsx` — Tier redirect on category access
- `src/app/(dashboard)/forum/new/page.tsx` — Thread creation limit check
- `src/components/forum/category-card.tsx` — Lock icon for pro categories
- `src/components/forum/thread-create-form.tsx` — ThreadLimitIndicator integration
- `src/components/layout/sidebar.tsx` — Lock icons on tier-gated sidebar items

---

## Progress

- [x] AC-1: Access utility library
- [x] AC-2: Middleware tier gating
- [x] AC-3: Course page server-side check
- [x] AC-4: Forum category server-side check
