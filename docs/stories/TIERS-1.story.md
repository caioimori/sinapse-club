# TIERS-1: Database Functions & RLS Policies for Access Control

> **Status:** Ready
> **Epic:** Access Control & Tiers (ADR-002)
> **Assigned to:** @data-engineer (Dara)
> **Complexity:** L (Low)
> **Created:** 2026-03-31
> **ADR Reference:** `docs/architecture/ADR-002-access-control-tiers.md`

---

## Objective

Create the foundational database layer for the tier-based access control system: helper functions, rate-limiting table, schema changes, and updated RLS policies.

---

## Acceptance Criteria

### AC-1: role_rank() function
- [x] `role_rank(text)` function exists and returns correct integer for each role
- [x] Function is IMMUTABLE for query optimizer benefit
- [x] Mapping: admin=100, instructor=90, premium=30, pro=20, free=10, else=0

### AC-2: user_has_course_access() function
- [x] `user_has_course_access(UUID)` function exists as SECURITY DEFINER
- [x] Returns true for admin/instructor
- [x] Returns true if user has active enrollment for the course
- [x] Returns true if user is premium AND course.included_in_premium = true
- [x] Returns false otherwise

### AC-3: user_can_create_thread() function
- [x] `user_can_create_thread()` function exists as SECURITY DEFINER
- [x] Returns true for pro+ users (role_rank >= 20)
- [x] Returns true for free users with < 3 threads this month
- [x] Returns false for free users at or over the limit

### AC-4: increment_thread_count trigger
- [x] Trigger fires AFTER INSERT on posts
- [x] Only increments for free users creating threads (type='thread' with category_id)
- [x] Uses UPSERT on free_tier_limits (user_id, period_start)

### AC-5: free_tier_limits table
- [x] Table created with: id, user_id, period_start, threads_created
- [x] UNIQUE constraint on (user_id, period_start)
- [x] RLS enabled: users can only SELECT own rows

### AC-6: courses.included_in_premium column
- [x] Boolean column added, DEFAULT false
- [x] Existing courses unaffected (default false = not included)

### AC-7: Updated RLS policies
- [x] Posts SELECT: tier-gated by forum_categories.access
- [x] Posts INSERT: thread creation enforces user_can_create_thread()
- [x] Marketplace: pro+ only for SELECT and INSERT
- [x] Benefits: pro+ only for SELECT
- [x] Subscriptions: users can only read own row

### AC-8: TypeScript types updated
- [x] `courses` type includes `included_in_premium: boolean`
- [x] `free_tier_limits` table interface added to database.ts
- [x] New functions added to Functions type

---

## Scope

### IN
- role_rank() function
- user_has_course_access() function
- user_can_create_thread() function + trigger
- free_tier_limits table + RLS
- courses.included_in_premium column
- Updated RLS policies for posts, marketplace, benefits, subscriptions
- TypeScript type updates

### OUT
- Middleware changes (TIERS-2)
- UI components (TIERS-3)
- Payment/webhook changes (TIERS-4)
- Lessons RLS (deferred until lessons are populated)

---

## Dependencies

- ADR-002 approved (DONE)
- Existing tables: profiles, posts, courses, enrollments, forum_categories, marketplace_listings, benefits, subscriptions

---

## Technical Notes

- Use ADR-002 sections 2-5 as the source of truth for SQL
- role_rank uses 10/20/30/90/100 scale (not 1-5) per user briefing for wider gaps
- All functions use SECURITY DEFINER to access profiles table
- Migration applied via Supabase MCP

---

## File List

- `src/types/database.ts` -- updated with new types
- Supabase migration (applied via MCP, not local file)

---

## Progress

- [x] AC-1: role_rank() function
- [x] AC-2: user_has_course_access() function
- [x] AC-3: user_can_create_thread() function
- [x] AC-4: increment_thread_count trigger
- [x] AC-5: free_tier_limits table
- [x] AC-6: courses.included_in_premium column
- [x] AC-7: Updated RLS policies
- [x] AC-8: TypeScript types updated
