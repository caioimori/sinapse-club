# Story FORUM-3: Sample Threads & Realistic Content Seeding

## Overview

Seed 15-20 sample threads with realistic AI-for-business content distributed across forum categories. These threads make the MVP demo convincing — an empty forum looks dead. Each thread should have 2-5 sample replies to simulate community activity.

**Source:** ADR-001 Section 8.1 (Item 14: Sample Threads)

## Acceptance Criteria

- [x] **Given** forum_categories and forum_subcategories are seeded (FORUM-1), **When** sample content migration runs, **Then** 15-20 threads exist in the `posts` table with type='thread', category_id set, title set, and realistic content
- [x] **Given** sample threads, **Then** they are distributed across at least 8 of the 14 categories (no category should have more than 4 threads to simulate organic distribution)
- [x] **Given** each sample thread, **Then** it has 2-5 sample replies in the `comments` table with varied content
- [x] **Given** sample threads, **Then** content is in Portuguese (PT-BR), written as if by real community members discussing AI applied to business
- [x] **Given** sample threads, **Then** some threads have `is_sticky: true` (1-2 per active category) to demonstrate pinned threads
- [x] **Given** sample threads, **Then** `views_count` and `likes_count` have realistic non-zero values (e.g., 15-200 views, 3-30 likes)
- [x] **Given** sample threads, **Then** at least 2 threads have `is_solved: true` with a reply marked as solution to demonstrate the Q&A pattern
- [x] **Given** sample threads, **Then** `last_reply_at` is set to varied timestamps within the last 7 days to simulate recent activity
- [x] **Given** sample threads, **Then** they use varied `tags` arrays (e.g., ['chatgpt', 'prompts'], ['meta-ads', 'roi'], ['n8n', 'automacao'])

## Scope

### IN
- SQL seed file with 15-20 threads (INSERT INTO posts)
- SQL seed file with 50-80 replies (INSERT INTO comments)
- Realistic PT-BR content about AI for business topics
- Varied metadata (views, likes, solved, sticky, tags, timestamps)
- A system/admin user to be the author of seeded content (or use existing admin)

### OUT
- User avatars/profiles for fake authors (use the existing admin user or a few seed profiles)
- Real-time data (this is static seed data)
- Images or media in threads (text-only for MVP)

## Dependencies
- **FORUM-1** (tables + categories must exist)
- **FORUM-2** (feed killed, so threads are the primary content)

## Complexity
**S (Small)** — Content creation + SQL inserts. No code logic, just data.

## Assigned Agent
@developer (Dex)

## Technical Notes
- Content topics should cover: prompt engineering tips, Meta Ads + AI workflow, n8n automation recipes, career transition stories, tool comparisons (Claude vs GPT vs Gemini), e-commerce AI strategies
- Use the admin user (or create 3-4 seed profiles with different professional roles) as authors
- Set `created_at` to staggered dates within the past 2 weeks
- Sample thread titles (examples):
  - "Como usei o Claude para criar 50 anuncios no Meta Ads em 1 hora"
  - "n8n vs Make: qual o melhor para automacao com AI?"
  - "Minha experiencia migrando de dev para AI Engineer"
  - "Prompt framework que dobrou meu ROI em Google Ads"
  - "[Resolvido] Como conectar API do GPT-4 com Shopify?"

## File List
- `supabase/migrations/20250331000027_seed_sample_threads.sql` — SQL migration with 18 threads + 70 replies (reference/backup)
- `scripts/seed-forum-threads.mjs` — Node.js script that seeds data via Supabase REST API

## Status
- [x] Draft
- [x] Validated (Ready)
- [x] In Progress
- [x] Done

## Change Log
| Date | Change | Agent |
|------|--------|-------|
| 2026-03-31 | Story created from ADR-001 | @sprint-lead (River) |
| 2026-03-31 | Batch validated: GO (8/10). Status Draft -> Ready. | @product-lead (Pax) |
| 2026-03-31 | Implemented: 18 threads + 70 replies seeded via REST API. 13 categories populated, 3 solved, 2 sticky. All AC met. Status Ready -> Done. | @developer (Dex) |
