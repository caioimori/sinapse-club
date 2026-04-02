# TIERS-3: UI Access Gate Components

> **Status:** Done
> **Epic:** Access Control & Tiers (ADR-002)
> **Assigned to:** @developer (Dex)
> **Complexity:** M (Medium)
> **Created:** 2026-03-31
> **ADR Reference:** `docs/architecture/ADR-002-access-control-tiers.md`

---

## Objective

Build the client-side access gate components that provide visual feedback for tier-restricted content: upgrade walls, enrollment walls, feature gates, tier badges, and thread limit indicators.

---

## Acceptance Criteria

### AC-1: UpgradeWall component
- [x] `src/components/access/upgrade-wall.tsx` created
- [x] Props: requiredTier, featureName, returnPath
- [x] Displays locked content overlay with tier comparison
- [x] CTA links to /pricing?upgrade={tier}&from={returnPath}
- [x] Shows upsell from pro to premium when applicable

### AC-2: EnrollWall component
- [x] `src/components/access/enroll-wall.tsx` created
- [x] Props: courseTitle, coursePrice, courseSlug, includedInPremium
- [x] Shows course preview info (thumbnail, description)
- [x] Price display in BRL
- [x] Primary CTA: "Comprar Curso" (links to checkout)
- [x] Secondary CTA: "Ou assine Premium" (links to /pricing)

### AC-3: FeatureGate component
- [x] `src/components/access/feature-gate.tsx` created
- [x] Props: userRole, requiredTier, featureName, returnPath, fallback, children
- [x] Renders children if user tier >= requiredTier
- [x] Renders fallback otherwise
- [x] Uses access utility from TIERS-2

### AC-4: TierBadge component
- [x] `src/components/access/tier-badge.tsx` created
- [x] Props: tier (UserRole)
- [x] free = no badge, pro = "PRO" accent, premium = "PREMIUM" gold
- [x] admin = "ADMIN" red, instructor = "INSTRUCTOR" blue
- [x] Compact variant for inline use (size prop)

### AC-5: ThreadLimitIndicator component
- [x] `src/components/access/thread-limit-indicator.tsx` created
- [x] Props: currentCount, maxCount (default 3), userRole
- [x] Shows "X/3 threads this month" with progress bar
- [x] At limit: shows upgrade CTA
- [x] Only visible to free users (Pro+ returns null)

### AC-6: Integration in existing pages
- [x] Forum pages: locked categories show lock icon + redirect to /pricing
- [x] Sidebar: tier-gated extras with lock icons
- [x] Course detail: inline lock/enroll UI with RPC access check
- [x] Profile: TierBadge next to username
- [x] Thread create form: ThreadLimitIndicator integrated

---

## Scope

### IN
- 5 new components in src/components/access/
- Integration in forum, marketplace, tools, benefits, courses, profile pages
- B&W design system compliance (existing theme)

### OUT
- Database changes (TIERS-1)
- Middleware changes (TIERS-2, prerequisite)
- Payment/checkout flows (TIERS-4)

---

## Dependencies

- TIERS-1 completed (DB functions for thread count queries)
- TIERS-2 completed (access utility library, middleware)

---

## File List

- `src/components/access/upgrade-wall.tsx` — UpgradeWall component
- `src/components/access/enroll-wall.tsx` — EnrollWall component
- `src/components/access/feature-gate.tsx` — FeatureGate component
- `src/components/access/tier-badge.tsx` — TierBadge component
- `src/components/access/thread-limit-indicator.tsx` — ThreadLimitIndicator component
- `src/components/access/index.ts` — Barrel export
- `src/components/layout/sidebar.tsx` — TierBadge + lock icons integrated
- `src/app/(dashboard)/profile/page.tsx` — TierBadge integrated
- `src/components/forum/thread-create-form.tsx` — ThreadLimitIndicator integrated
- `src/components/forum/category-card.tsx` — Lock icon for pro categories

---

## Progress

- [x] AC-1: UpgradeWall component
- [x] AC-2: EnrollWall component
- [x] AC-3: FeatureGate component
- [x] AC-4: TierBadge component
- [x] AC-5: ThreadLimitIndicator component
- [x] AC-6: Integration in existing pages
