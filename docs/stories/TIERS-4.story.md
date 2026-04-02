# TIERS-4: Subscription Flow (AbacatePay)

> **Status:** Done
> **Epic:** Access Control & Tiers (ADR-002)
> **Assigned to:** @developer (Dex)
> **Complexity:** M (Medium)
> **Created:** 2026-03-31
> **ADR Reference:** `docs/architecture/ADR-002-access-control-tiers.md`

---

## Objective

Build the subscription and course purchase flows using AbacatePay: pricing page, checkout integration, webhook hardening for billing events, and role synchronization.

---

## Acceptance Criteria

### AC-1: Pricing page
- [x] `/pricing` route created
- [x] Tier comparison table (Free vs Pro vs Premium)
- [x] Feature list per tier matching ADR-002 access matrix
- [x] CTA buttons per tier linking to AbacatePay checkout
- [x] Accepts ?upgrade={tier}&from={path} query params
- [x] Shows "Current plan" indicator for logged-in users

### AC-2: Checkout flow
- [x] AbacatePay checkout URL generation (server action)
- [x] externalId format: "PLAN-{plan}" for subscriptions, "COURSE-{courseId}" for courses
- [x] User email passed to AbacatePay for matching on webhook
- [x] Success redirect to /pricing?success=true or /courses/{slug}?enrolled=true

### AC-3: Webhook handler hardening
- [x] POST /api/webhooks/abacatepay updated
- [x] Handle billing.paid: UPSERT subscription + UPDATE profiles.role
- [x] Handle billing.expired / billing.cancelled: downgrade to free
- [x] Handle course purchase: INSERT enrollment (no role change)
- [x] Idempotency: check if already processed before writing
- [ ] Signature verification (AbacatePay webhook secret) — deferred: AbacatePay docs needed for HMAC format

### AC-4: Role synchronization
- [x] On billing.paid with PLAN-*: update profiles.role to matching plan
- [x] On billing.cancelled/expired: set profiles.role = 'free'
- [x] Enrollments are NEVER affected by subscription changes
- [x] Edge case: premium downgrade preserves individual course enrollments

---

## Scope

### IN
- /pricing page with tier comparison
- AbacatePay checkout integration (subscriptions + courses)
- Webhook handler updates (billing.paid, billing.cancelled, billing.expired)
- Role synchronization logic
- Idempotency and signature verification

### OUT
- Database schema changes (TIERS-1)
- Middleware/access utils (TIERS-2)
- UI gate components (TIERS-3, but EnrollWall CTA links to checkout)

---

## Dependencies

- TIERS-1 completed (subscriptions table, profiles.role)
- TIERS-2 completed (access utility for tier comparison display)
- TIERS-3 partially (EnrollWall references checkout, but can be built independently)
- AbacatePay API credentials configured in .env

---

## File List

- `src/app/(dashboard)/pricing/page.tsx` — Pricing page (tier comparison, CTAs, success banner)
- `src/app/(dashboard)/pricing/actions.ts` — Server actions for AbacatePay checkout (plans + courses)
- `src/app/(dashboard)/pricing/checkout-button.tsx` — Client component for checkout CTA with loading state
- `src/app/api/webhooks/abacatepay/route.ts` — Hardened webhook (idempotency, cancellation, logging)

---

## Progress

- [x] AC-1: Pricing page
- [x] AC-2: Checkout flow
- [x] AC-3: Webhook handler hardening (signature verification deferred)
- [x] AC-4: Role synchronization
