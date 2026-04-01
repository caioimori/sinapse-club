# Story FORUM-1: Database Foundation — Forum Categories, Subcategories, Roles, Badges & Levels

## Overview

Create all new database tables, ALTER existing tables, seed data, and RLS policies required for the forum MVP. This is the foundation story that unblocks all frontend work.

**Source:** ADR-001 Sections 2.2, 2.3, 3.1, 6.1, 7.2, 9.1, 12

## Acceptance Criteria

### Forum Categories & Subcategories
- [ ] **Given** the database has no forum tables, **When** migrations run, **Then** `forum_categories` table exists with columns: id, slug, name, description, icon, color, sort_order, access, is_active, threads_count, posts_count, last_thread_id, last_thread_at, created_at
- [ ] **Given** `forum_categories` exists, **When** seed runs, **Then** 14 categories are inserted matching ADR-001 Section 3.1 exactly (AI para Ads, AI para E-commerce, AI para Infoprodutos, AI para Afiliados, AI Copywriting, AI para SEO & Conteudo, LLMs & Agentes, Automacao & No-Code, AI Generativa, Negocios & Estrategia, Carreira em AI, Marketplace, Ferramentas & Reviews, Off-topic & Networking)
- [ ] **Given** `forum_subcategories` table exists, **When** seed runs, **Then** ~60 subcategories are inserted distributed across the 14 categories per ADR-001 Section 3.1
- [ ] **Given** categories exist, **Then** RLS allows SELECT for all active categories, INSERT/UPDATE/DELETE restricted to admin role

### Posts Table Extension
- [ ] **Given** the `posts` table exists, **When** migration runs, **Then** new columns are added: category_id (FK forum_categories), subcategory_id (FK forum_subcategories), is_solved, is_sticky, last_reply_at, last_reply_by (FK profiles), tags (TEXT[])
- [ ] **Given** posts has new columns, **Then** existing posts with space_id are NOT affected (category_id defaults to NULL)
- [ ] **Given** the PostType enum in database.ts, **When** updated, **Then** "thread" is added as a valid type

### Professional Roles (Cargo System)
- [ ] **Given** no professional_roles table, **When** migration runs, **Then** table exists with: id, slug, name, cluster, icon, sort_order, is_active
- [ ] **Given** professional_roles exists, **When** seed runs, **Then** 20+ roles across 7 clusters are inserted (C-Level, Management, Specialist, Operational, Freelancer, Entrepreneur, Student)
- [ ] **Given** profiles table, **When** migration runs, **Then** new columns added: professional_role_id (FK), company, headline, threads_count, replies_count, reputation, featured_badge_id (FK)
- [ ] **Given** professional_roles, **Then** RLS allows SELECT for all, INSERT/UPDATE/DELETE restricted to admin

### Badges & Levels
- [ ] **Given** no badges table, **When** migration runs, **Then** `badges` and `user_badges` tables exist per ADR-001 Section 2.2
- [ ] **Given** no levels table, **When** migration runs, **Then** `levels` table exists with 10 levels seeded per ADR-001 Section 7.2 (Novato through Oraculo)
- [ ] **Given** badges table, **When** seed runs, **Then** initial badges are created for each level + cargo clusters
- [ ] **Given** new tables, **Then** RLS: badges/levels SELECT for all; user_badges SELECT for all, INSERT via triggers/admin only

### Placeholder Tables
- [ ] **Given** ADR defines marketplace_listings, tools, benefits for future phases, **When** migration runs, **Then** tables are created (empty, no seed data needed for MVP)

### Type System
- [ ] **Given** `src/types/database.ts`, **When** updated, **Then** new types added: ProfessionalCluster, BadgeType, BadgeRarity, MarketplaceType, ThreadSort, and interfaces for ForumCategory, ForumSubcategory, ProfessionalRole, Badge, UserBadge, Level
- [ ] **Given** existing Profile interface, **When** updated, **Then** new fields reflected: professional_role_id, company, headline, threads_count, replies_count, reputation, featured_badge_id

## Scope

### IN
- Supabase migrations for all new tables (forum_categories, forum_subcategories, professional_roles, badges, user_badges, levels, marketplace_listings, tools, benefits)
- ALTER posts table (add forum columns)
- ALTER profiles table (add cargo + gamification columns)
- Seed data: 14 categories, ~60 subcategories, 20+ professional roles, 10 levels, initial badges
- RLS policies for all new tables
- TypeScript type updates in database.ts
- Indexes for performance

### OUT
- Space-to-category data migration (separate story FORUM-2)
- Sample threads/content (separate story FORUM-3)
- Frontend components (separate stories)
- XP trigger functions (Phase 2)
- Reputation trigger functions (Phase 2)

## Dependencies
- None (this is the foundation)

## Complexity
**L (Large)** — 6 new tables, 2 ALTERs, extensive seed data, RLS policies, type system updates

## Assigned Agent
@data-engineer (Dara)

## Technical Notes
- Migration numbering: start at 020 per ADR-001 Section 9.1
- All columns must match ADR-001 SQL exactly
- Use gen_random_uuid() for all PKs
- Seed professional roles covering all 7 clusters from ADR-001 Section 6.1
- Category access: Marketplace is 'pro', all others 'free'
- Do NOT drop or modify the spaces table — it stays for backwards compatibility

## File List
_To be populated during implementation._

## Status
- [x] Draft
- [x] Validated (Ready)
- [ ] In Progress
- [ ] Done

## Change Log
| Date | Change | Agent |
|------|--------|-------|
| 2026-03-31 | Story created from ADR-001 | @sprint-lead (River) |
| 2026-03-31 | Batch validated: GO (9/10). Status Draft -> Ready. | @product-lead (Pax) |
