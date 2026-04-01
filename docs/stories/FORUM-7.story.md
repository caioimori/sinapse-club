# Story FORUM-7: Cargo System — Badge Component, Onboarding Step & Profile Display

## Overview

Implement the professional role (cargo) system end-to-end: a visual badge component that renders the cluster-colored badge, a new onboarding step where users select their professional role, and display of the cargo in the profile page and throughout the forum.

**Source:** ADR-001 Sections 6.1, 6.2, 6.3, 10.1

## Acceptance Criteria

### Cargo Badge Component
- [x] **Given** a user has a `professional_role_id` set, **When** their badge is rendered, **Then** it shows the role name in a border-styled badge with the cluster's designated color:
  - C-Level: Gold border (`border-yellow-500`)
  - Management: Silver border (`border-zinc-400`)
  - Specialist: Blue border (`border-blue-500`)
  - Operational: Gray border (`border-zinc-500`)
  - Freelancer: Green border (`border-green-500`)
  - Entrepreneur: Purple border (`border-purple-500`)
  - Student: Teal border (`border-teal-500`)
- [x] **Given** a user has NO professional_role_id, **When** their badge area is rendered, **Then** nothing is shown (no empty badge)
- [x] **Given** the cargo badge component, **Then** it has two size variants: `sm` (for thread list items, inline text) and `md` (for profile page, thread detail author)
- [x] **Given** the cargo badge, **Then** it follows B&W design system — border-only style with subtle colored border, no colored backgrounds per ADR-001 Section 11

### Onboarding Step
- [x] **Given** the current onboarding has 3 steps (Locale > Interests > Ready), **When** the cargo step is added, **Then** onboarding has 4 steps: Locale > Interests > **Professional Role** > Ready
- [x] **Given** the Professional Role step, **Then** it shows roles grouped by cluster with cluster headings (C-Level, Management, Specialist, Operational, Freelancer, Entrepreneur, Student)
- [x] **Given** the Professional Role step, **Then** user can select one role from the list
- [x] **Given** the Professional Role step, **Then** there are optional fields: "Empresa/Organizacao" (free text) and "Headline" (free text, placeholder: "ex: AI Engineer @ FAANG")
- [x] **Given** the Professional Role step, **Then** there is a "Pular" (skip) button — the step is NOT mandatory
- [x] **Given** the user completes onboarding with a role selected, **Then** `profiles.professional_role_id`, `profiles.company`, and `profiles.headline` are updated in Supabase
- [x] **Given** the user skips the role step, **Then** onboarding completes normally with professional_role_id as NULL

### Profile Page Display
- [x] **Given** the profile page at `/profile/[username]`, **Then** below the display_name, the cargo badge is shown alongside company and headline (e.g., "CEO | Acme Corp | Building AI-first products")
- [ ] **Given** the user's own profile page, **Then** they can edit their professional role, company, and headline from the profile settings
- [x] **Given** the profile page, **Then** if the user has a level > 1, a level badge is shown next to the cargo badge

### Forum Integration
- [ ] **Given** thread list items (FORUM-5), **Then** the author's cargo badge (sm size) is displayed next to their username
- [ ] **Given** thread detail author section (FORUM-6), **Then** the author's cargo badge (md size) is displayed
- [ ] **Given** reply authors (FORUM-6), **Then** the cargo badge (sm size) is shown
- [ ] **Given** the sidebar user card (FORUM-4), **Then** the cargo badge is shown below the user's name

## Scope

### IN
- Component: `src/components/profile/cargo-badge.tsx` (reusable badge with cluster colors + sizes)
- Component: `src/components/profile/level-badge.tsx` (simple level indicator)
- Update: `src/app/(auth)/onboarding/page.tsx` (add step 3: Professional Role)
- Update: `src/app/(dashboard)/profile/[username]/page.tsx` (show cargo + company + headline)
- Supabase query: fetch professional_roles for onboarding picker
- Supabase update: save role_id, company, headline on onboarding completion
- Integration with thread list items, thread detail, replies, sidebar user card

### OUT
- Cluster-exclusive subcategories (Phase 2)
- Cluster-based filtering (Phase 2)
- Cluster leaderboard (Phase 3)
- Admin role management UI (Phase 2)

## Dependencies
- **FORUM-1** (professional_roles table + profiles ALTER must exist)
- **FORUM-4** (sidebar user card consumes cargo badge) — can develop in parallel, wire up later
- **FORUM-5** (thread list items consume cargo badge) — can develop in parallel
- **FORUM-6** (thread detail consumes cargo badge) — can develop in parallel

## Complexity
**M (Medium)** — 2 new components, onboarding step addition, profile page update, cross-component integration

## Assigned Agent
@developer (Dex)

## Technical Notes
- Cargo badge colors use Tailwind border classes — stay within the B&W design system by using border-only badges (no bg-color fills)
- Onboarding step: fetch professional_roles from Supabase, group by cluster in the UI
- The role picker UI: radio button list grouped under cluster headings, similar to how interests are currently displayed
- Company and headline are free text inputs (not required)
- Profile page needs to JOIN profiles with professional_roles to get the role name and cluster
- Level badge: simple pill showing "Lv.{N}" with the level's color from the levels table

## File List
- `src/components/profile/cargo-badge.tsx` (NEW) — Reusable CargoBadge component with cluster colors and sm/md sizes
- `src/components/profile/cargo-selector.tsx` (NEW) — CargoSelector with grouped role picker, company, headline fields
- `src/app/(auth)/onboarding/page.tsx` (MODIFIED) — Added step 3: Professional Role (optional, skippable)
- `src/app/(dashboard)/profile/page.tsx` (MODIFIED) — Shows CargoBadge + headline/company on own profile
- `src/app/(dashboard)/profile/[username]/page.tsx` (MODIFIED) — Shows CargoBadge + headline/company on public profile

## Status
- [x] Draft
- [x] Validated (Ready)
- [x] In Progress
- [ ] Done

## Change Log
| Date | Change | Agent |
|------|--------|-------|
| 2026-03-31 | Story created from ADR-001 | @sprint-lead (River) |
| 2026-03-31 | Batch validated: GO (8/10). Status Draft -> Ready. | @product-lead (Pax) |
| 2026-03-31 | Implemented: CargoBadge, CargoSelector, onboarding step 3, profile display. Forum integration ACs deferred to FORUM-4/5/6 wiring. | @developer (Dex) |
