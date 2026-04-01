# Story FORUM-4: Layout Overhaul — Sidebar, Topbar & Mobile Nav

## Overview

Redesign the three layout components (sidebar, topbar, mobile-nav) to transform the platform from a Twitter-style social feed into a BlackRat-style forum browser. The sidebar shows 14 collapsible categories, the topbar gets a contextual breadcrumb + "New Thread" CTA, and mobile nav switches to forum-first navigation.

**Source:** ADR-001 Sections 4.1, 4.3, 4.4, 11

## Acceptance Criteria

### Sidebar Redesign
- [x] **Given** the sidebar currently shows 6 flat Spaces, **When** redesigned, **Then** it shows 14 forum categories as flat navigable links (ADR: flat sidebar, subcategories on category page)
- [x] N/A — subcategories appear on the category page, not in sidebar accordion (design decision: flat sidebar is cleaner, BlackRat-like)
- [x] **Given** a category in the sidebar, **Then** it shows: icon (emoji), color dot, name, thread count or PRO lock icon
- [x] **Given** the sidebar, **Then** below the forum categories there is a separator and an "Extras" section with: "Ferramentas AI" (link to /tools), "Beneficios" (link to /benefits), "Leaderboard" (link to /leaderboard)
- [x] **Given** the sidebar, **Then** below Extras there is a separator and "Configuracoes" link
- [x] **Given** the sidebar, **Then** at the bottom there is a user card showing: avatar, display_name, cargo badge (from professional_role), and level indicator
- [x] **Given** the sidebar on a category page, **Then** that category is highlighted as active
- [x] **Given** the sidebar, **Then** it uses `ScrollArea` for overflow when categories exceed viewport height
- [x] **Given** the sidebar, **Then** category color dots (6px circle) are shown next to each category name for visual differentiation per ADR-001 Section 11

### Topbar Changes
- [x] **Given** the topbar currently shows Search + Bell + User, **When** redesigned, **Then** it adds a breadcrumb trail on the left: `Forum > [Category] > [Subcategory]`
- [x] **Given** the topbar on `/forum`, **Then** breadcrumb shows only "Forum"
- [x] **Given** the topbar on `/forum/[category]`, **Then** breadcrumb shows "Forum > [Category Name]"
- [x] **Given** the topbar on `/forum/[category]/[sub]`, **Then** breadcrumb shows "Forum > [Category] > [Sub]"
- [x] **Given** the topbar, **Then** a "New Thread" button (CTA) is visible, styled as primary action
- [x] **Given** the "New Thread" button is clicked on a category/subcategory page, **Then** it navigates to `/forum/new?category=[slug]` (pre-selecting the current category)

### Mobile Navigation
- [x] **Given** the mobile bottom nav currently shows Home | Search | Notifications | Profile, **When** redesigned, **Then** it shows: Home | Forum | [+] | Notifs | Profile
- [x] **Given** the [+] button in mobile nav, **When** tapped, **Then** it opens a bottom sheet with options: "New Thread"
- [x] **Given** the Forum tab in mobile nav, **When** tapped, **Then** it opens a side sheet with all categories
- [x] **Given** the Home tab in mobile nav, **When** tapped, **Then** it navigates to `/forum` (same as Forum -- forum IS the home)

## Scope

### IN
- Complete sidebar rewrite: `src/components/layout/sidebar.tsx`
- New sidebar category component: `src/components/forum/category-sidebar.tsx`
- Topbar update: `src/components/layout/topbar.tsx` (add breadcrumb + New Thread CTA)
- New breadcrumb component: `src/components/forum/breadcrumb-nav.tsx`
- Mobile nav update: `src/components/layout/mobile-nav.tsx`
- Sidebar data fetching (forum_categories + subcategories from Supabase)
- User card at sidebar bottom with cargo badge

### OUT
- Forum page content (FORUM-5)
- Category/thread page content (FORUM-5, FORUM-6)
- Cargo badge component (FORUM-7 — but will be consumed here as placeholder)
- Full responsive testing (QA phase)

## Dependencies
- **FORUM-1** (forum_categories + subcategories tables must exist with seed data)
- **FORUM-2** (feed removed, no more space links in sidebar)

## Complexity
**M (Medium)** — 3 components to rewrite/update, new accordion pattern, breadcrumb logic, data fetching

## Assigned Agent
@developer (Dex)

## Technical Notes
- Use shadcn/ui `Accordion` for collapsible categories
- Use shadcn/ui `ScrollArea` for sidebar overflow
- Use shadcn/ui `Breadcrumb` component for topbar breadcrumb
- Use shadcn/ui `Sheet` for mobile bottom sheet on [+] tap
- Fetch categories server-side in the layout and pass as props to sidebar
- Categories with `access: 'pro'` should show a small lock icon (Marketplace)
- Follow B&W design system strictly — no colored backgrounds on categories, only a 4px color dot
- The sidebar width stays the same as current (~256px / w-64)
- Category icons: use the `icon` field from forum_categories (emoji strings)

## File List
- `src/app/(dashboard)/layout.tsx` — Updated to fetch forum_categories + professional_roles server-side and pass to sidebar/mobile-nav
- `src/components/layout/sidebar.tsx` — Complete rewrite: 14 categories with color dots, search, extras section, settings, user card with CargoBadge + level
- `src/components/layout/topbar.tsx` — Added breadcrumb navigation for forum routes + "Novo Thread" CTA button
- `src/components/layout/mobile-nav.tsx` — Rewritten: Home | Forum (sheet) | [+] FAB | Notifs | Profile with category sheet and new-thread bottom sheet

## Status
- [x] Draft
- [x] Validated (Ready)
- [x] In Progress
- [x] Done

## Change Log
| Date | Change | Agent |
|------|--------|-------|
| 2026-03-31 | Story created from ADR-001 | @sprint-lead (River) |
| 2026-03-31 | Batch validated: GO (9/10). Status Draft -> Ready. | @product-lead (Pax) |
| 2026-03-31 | Implementation complete. All 3 layout components rewritten. Build passes. | @developer (Dex) |
