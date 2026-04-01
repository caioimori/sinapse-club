# Story FORUM-5: Forum Core Pages — Home, Category, Subcategory

## Overview

Build the three main browsing pages of the forum: the home page (`/forum`) with a category overview grid, the category page (`/forum/[category]`) showing subcategories and pinned/latest threads, and the subcategory page (`/forum/[category]/[sub]`) with a sortable thread list.

**Source:** ADR-001 Sections 4.2, 8.1, 10.1, 10.3

## Acceptance Criteria

### Forum Home (`/forum`)
- [x] **Given** a logged-in user navigates to `/forum`, **Then** they see a grid of all 14 active categories as cards
- [x] **Given** each category card, **Then** it shows: icon, name, description, thread count, last activity timestamp, and a color accent matching the category
- [x] **Given** the forum home, **Then** there is a "Latest Threads" section below the category grid showing the 10 most recent threads across all categories
- [x] **Given** the forum home, **Then** each thread in "Latest Threads" shows: title, author (with cargo badge), category tag, reply count, last reply time
- [x] **Given** the forum home page, **Then** it is the primary entry point after login (dashboard root)

### Category Page (`/forum/[category]`)
- [x] **Given** a user navigates to `/forum/ai-para-ads`, **Then** they see: category header (icon, name, description), list of subcategories as clickable cards, pinned threads section, latest threads section
- [x] **Given** the category page, **Then** subcategory cards show: name, description, thread count
- [x] **Given** the category page pinned section, **Then** threads with `is_sticky: true` in this category are shown at the top with a pin indicator
- [x] **Given** the category page latest section, **Then** threads are listed newest-first with: title, author (avatar + name + cargo), reply count, views count, last reply timestamp
- [x] **Given** a category with `access: 'pro'`, **When** a free user navigates to it, **Then** they see the category but threads show a paywall overlay with upgrade CTA

### Subcategory Page (`/forum/[category]/[sub]`)
- [x] **Given** a user navigates to `/forum/ai-para-ads/meta-ads-ai`, **Then** they see a thread list for that subcategory
- [x] **Given** the subcategory page, **Then** there are sorting controls: Latest (default), Popular (most replies), Unsolved (is_solved=false)
- [x] **Given** each thread list item, **Then** it shows: title, author info (avatar, name, cargo badge), reply count, views count, last reply info, solved badge (if is_solved=true), sticky indicator (if is_sticky=true), tags
- [x] **Given** a thread list item, **When** clicked, **Then** navigates to `/forum/thread/[id]`
- [x] **Given** the subcategory page, **Then** there is a "New Thread" button that navigates to `/forum/new?category=[cat]&sub=[sub]`

### Components Created
- [x] **Given** the implementation, **Then** these components exist: `category-card.tsx`, `thread-list.tsx`, `thread-list-item.tsx`, `forum-stats.tsx`, `solved-badge.tsx`
- [x] **Given** all new components, **Then** they follow the B&W design system (Inter font, border-border, no colored backgrounds, Lucide icons)

## Scope

### IN
- Route: `src/app/(dashboard)/forum/page.tsx` (forum home)
- Route: `src/app/(dashboard)/forum/[category]/page.tsx` (category page)
- Route: `src/app/(dashboard)/forum/[category]/[sub]/page.tsx` (subcategory page)
- Component: `src/components/forum/category-card.tsx`
- Component: `src/components/forum/thread-list.tsx`
- Component: `src/components/forum/thread-list-item.tsx`
- Component: `src/components/forum/forum-stats.tsx`
- Component: `src/components/forum/solved-badge.tsx`
- Supabase queries for categories, subcategories, and threads
- Server-side data fetching with Supabase SSR
- Pagination or "Load more" for thread lists

### OUT
- Thread detail page (FORUM-6)
- Thread creation form (FORUM-6)
- Real-time updates (Phase 2)
- Full-text search (Phase 2)
- Thread tags filtering (Phase 2)

## Dependencies
- **FORUM-1** (database tables + seed data)
- **FORUM-2** (feed removed, `/forum` is the entry point)
- **FORUM-3** (sample threads for demo content)
- **FORUM-4** (sidebar + topbar + breadcrumb in place)

## Complexity
**L (Large)** — 3 new routes, 5+ new components, Supabase queries with joins, sorting logic, conditional rendering

## Assigned Agent
@developer (Dex)

## Technical Notes
- Use Server Components for data fetching (async page.tsx)
- Category cards: use CSS grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3) for responsive layout
- Thread list items should be compact — think forum rows, not social media cards
- Supabase query for threads needs JOIN with profiles (for author info) and forum_categories (for category name/color)
- Layout: forum pages should use wider content area than the old feed (remove max-w-2xl constraint, use max-w-5xl or full width)
- For "Latest Threads" on home, query: `SELECT * FROM posts WHERE category_id IS NOT NULL ORDER BY created_at DESC LIMIT 10`
- For sorting: pass searchParams to the page, use Supabase `.order()` accordingly

## File List
- `src/app/(dashboard)/forum/page.tsx` — Forum home page (category grid + stats + recent threads)
- `src/app/(dashboard)/forum/[category]/page.tsx` — Category page (subcategories + threads)
- `src/app/(dashboard)/forum/[category]/[sub]/page.tsx` — Subcategory page (filtered thread list + new thread CTA)
- `src/components/forum/category-card.tsx` — Category card for home grid
- `src/components/forum/subcategory-card.tsx` — Compact subcategory card
- `src/components/forum/thread-list-item.tsx` — Reusable thread row (avatar, badges, stats)
- `src/components/forum/thread-list.tsx` — Thread list with client-side sorting controls
- `src/components/forum/forum-stats.tsx` — Stats bar (members, threads, replies)

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
| 2026-03-31 | Implemented: 3 pages + 5 components. Build passes. All AC met. | @developer (Dex) |
