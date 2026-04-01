# ADR-001: Forum BlackRat Clone — Architectural Decision Record

> **Author:** @architect (Aria)
> **Date:** 2026-03-31
> **Status:** PROPOSED
> **Scope:** Full-platform evolution from Twitter-style feed to BlackRat-style forum
> **Constraint:** DO NOT touch courses (EPIC-3) — separate product

---

## 1. Executive Summary

The sinapse.club platform currently operates as a Twitter-style micro-feed with 6 flat Spaces. The target is to evolve it into a BlackRat-style hierarchical forum with 14+ categories, 40+ subcategories, threads, gamification, professional clusters (cargos), marketplace, tools, and benefits — all adapted from digital marketing to the AI-for-business niche.

This ADR defines the complete evolution path: schema changes, navigation architecture, feed-vs-forum coexistence, cargo system, and MVP visual prioritization.

---

## 2. Schema Evolution

### 2.1 What EXISTS and STAYS (no breaking changes)

| Table | Status | Notes |
|-------|--------|-------|
| `profiles` | EVOLVE | Add `professional_role`, `cluster`, `company`, `headline` fields |
| `posts` | EVOLVE | Rename mental model: posts become threads. Add `category_id`, `subcategory_id`, `is_solved`, `views_count` already exists |
| `comments` | STAYS | Comments become "replies" in thread context. Already has `parent_id` for nesting |
| `reactions` | STAYS | Works as-is for likes/saves on threads and replies |
| `follows` | STAYS | User-to-user following persists |
| `spaces` | DEPRECATE | Replaced by `forum_categories` + `forum_subcategories`. Migration path: map 6 spaces to new categories |
| `curated_content` | STAYS | RSS pipeline continues feeding curated threads |
| `courses/*` | DO NOT TOUCH | Separate product |
| `subscriptions` | STAYS | Tier system used for access control |

### 2.2 New Tables

#### `forum_categories`
The top-level forum sections (replaces `spaces`).

```sql
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,                          -- emoji or lucide icon name
  color TEXT,                         -- hex color for visual identity
  sort_order INT DEFAULT 0,
  access TEXT DEFAULT 'free',         -- 'free' | 'pro' | 'premium'
  is_active BOOLEAN DEFAULT true,
  threads_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,         -- total replies across all threads
  last_thread_id UUID,               -- for "latest activity" display
  last_thread_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `forum_subcategories`
Second-level hierarchy within each category.

```sql
CREATE TABLE forum_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  access TEXT DEFAULT 'free',         -- can override parent
  is_active BOOLEAN DEFAULT true,
  threads_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  last_thread_id UUID,
  last_thread_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, slug)
);
```

#### `forum_threads` (evolves from `posts`)
Instead of creating a new table, we EXTEND `posts` with forum-specific columns. This preserves all existing feed functionality while adding forum semantics.

```sql
-- Add to posts table
ALTER TABLE posts ADD COLUMN category_id UUID REFERENCES forum_categories(id);
ALTER TABLE posts ADD COLUMN subcategory_id UUID REFERENCES forum_subcategories(id);
ALTER TABLE posts ADD COLUMN is_solved BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN is_sticky BOOLEAN DEFAULT false;     -- category-level pin (vs is_pinned which is global)
ALTER TABLE posts ADD COLUMN last_reply_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN last_reply_by UUID REFERENCES profiles(id);
ALTER TABLE posts ADD COLUMN tags TEXT[] DEFAULT '{}';
```

**Rationale:** Reusing `posts` avoids data duplication, preserves existing reactions/comments/follow logic, and allows the same PostCard component to render in both feed and forum views. The `category_id` presence distinguishes a "forum thread" from a "feed post" (where category_id is NULL and space_id is set).

#### `badges`
Achievement/milestone system.

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,                 -- emoji or image URL
  type TEXT NOT NULL,                 -- 'milestone' | 'level' | 'achievement' | 'cargo' | 'manual'
  requirement_type TEXT,              -- 'xp' | 'posts' | 'replies' | 'likes_received' | 'streak' | NULL (manual)
  requirement_value INT,              -- threshold for auto-award
  rarity TEXT DEFAULT 'common',       -- 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  awarded_by UUID REFERENCES profiles(id),  -- NULL = auto-awarded, else admin
  UNIQUE(user_id, badge_id)
);
```

#### `professional_roles` (Cargo System)

```sql
CREATE TABLE professional_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cluster TEXT NOT NULL,              -- 'c-level' | 'management' | 'specialist' | 'operational' | 'freelancer' | 'student'
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
```

**Profiles extension for cargos:**

```sql
ALTER TABLE profiles ADD COLUMN professional_role_id UUID REFERENCES professional_roles(id);
ALTER TABLE profiles ADD COLUMN company TEXT;
ALTER TABLE profiles ADD COLUMN headline TEXT;       -- "CEO @ Company" or "AI Engineer"
```

#### `marketplace_listings` (Phase 2+)

```sql
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                 -- 'hiring' | 'offering' | 'collaboration'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,                      -- 'dev' | 'design' | 'marketing' | 'consulting' | 'other'
  budget_range TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  responses_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);
```

#### `tools` (Phase 3+)

```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  url TEXT,                           -- external link or internal route
  access TEXT DEFAULT 'free',         -- 'free' | 'pro' | 'premium'
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `benefits` (Phase 3+)

```sql
CREATE TABLE benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_logo TEXT,
  description TEXT,
  discount_text TEXT,                 -- "20% de desconto" or "1 mes gratis"
  url TEXT,
  coupon_code TEXT,
  access TEXT DEFAULT 'pro',          -- 'pro' | 'premium'
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `levels` (Gamification config)

```sql
CREATE TABLE levels (
  level INT PRIMARY KEY,
  name TEXT NOT NULL,                 -- "Novato", "Aprendiz", etc.
  xp_required INT NOT NULL,
  perks TEXT[],                       -- unlocked features
  badge_id UUID REFERENCES badges(id),
  color TEXT                          -- level color indicator
);
```

### 2.3 Profiles Evolution Summary

```sql
-- Current fields that stay:
-- id, username, display_name, avatar_url, header_url, bio, role,
-- locale, interests, points, xp, level, streak_days, streak_last,
-- streak_shields, followers_count, following_count, github_*,
-- website_url, location, onboarded, created_at, updated_at

-- NEW fields:
ALTER TABLE profiles ADD COLUMN professional_role_id UUID REFERENCES professional_roles(id);
ALTER TABLE profiles ADD COLUMN company TEXT;
ALTER TABLE profiles ADD COLUMN headline TEXT;
ALTER TABLE profiles ADD COLUMN threads_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN replies_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN reputation INT DEFAULT 0;       -- separate from XP, earned by helpful replies
ALTER TABLE profiles ADD COLUMN featured_badge_id UUID REFERENCES badges(id);  -- displayed badge
```

---

## 3. Category Mapping: BlackRat to AI Niche

### 3.1 BlackRat Original (22 categories) to sinapse.club (14 categories)

The BlackRat has 22 categories focused on digital marketing. We consolidate to 14 categories focused on AI applied to business/marketing/growth, removing redundancy and adapting to our niche.

| # | sinapse.club Category | Inspired By (BlackRat) | Subcategories | Access |
|---|----------------------|------------------------|---------------|--------|
| 1 | **AI para Ads** | Facebook Ads, Google Ads, TikTok Ads, Native Ads, Pinterest, Kwai, Bing, YouTube | Meta Ads + AI, Google Ads + AI, TikTok Ads + AI, YouTube Ads + AI, Outras Plataformas, Tutoriais, Perguntas | free |
| 2 | **AI para E-commerce** | Dropshipping | Dropshipping com AI, Automacao de Loja, Precificacao Inteligente, Tutoriais, Perguntas | free |
| 3 | **AI para Infoprodutos** | PLR, Lancamentos | Criacao de Curso com AI, Lancamentos, PLR + AI, Tutoriais, Perguntas | free |
| 4 | **AI para Afiliados** | Afiliados | Estrategias com AI, Automacao de Trafego, Funis Inteligentes, Tutoriais, Perguntas | free |
| 5 | **AI Copywriting** | Copywriting | Prompts para Copy, Scripts de Vendas, Headlines/Hooks, Email Marketing, Tutoriais, Perguntas | free |
| 6 | **AI para SEO & Conteudo** | SEO | SEO Tecnico com AI, Conteudo Automatizado, Link Building, YouTube SEO, Tutoriais, Perguntas | free |
| 7 | **LLMs & Agentes** | (novo - core AI) | ChatGPT/OpenAI, Claude/Anthropic, Gemini/Google, Agentes Autonomos, Fine-tuning, Open Source, Tutoriais, Perguntas | free |
| 8 | **Automacao & No-Code** | Infraestrutura, WordPress | Make/Zapier/n8n, APIs & Integracoes, Chatbots, WhatsApp Business, Tutoriais, Perguntas | free |
| 9 | **AI Generativa** | (novo - creative AI) | Imagens (Midjourney/DALL-E), Video (Sora/Runway), Audio/Voz, Design, Tutoriais, Perguntas | free |
| 10 | **Negocios & Estrategia** | Area Empresarial, Biohacking | Modelos de Negocio, Gestao com AI, Produtividade, Financas, Tutoriais, Perguntas | free |
| 11 | **Carreira em AI** | (novo) | Vagas & Oportunidades, Portfolio, Transicao de Carreira, Freelancing AI, Perguntas | free |
| 12 | **Marketplace** | Contrate uma Pessoa, Divulgue seu Trampo | Contrate um Profissional, Ofereca seus Servicos, Parcerias & Collabs, Projetos | pro |
| 13 | **Ferramentas & Reviews** | (novo) | Reviews de Tools, Comparativos, Descontos/Cupons, Lancamentos, Perguntas | free |
| 14 | **Off-topic & Networking** | (similar to BR's general) | Apresente-se, Off-topic, Feedback da Plataforma, Eventos & Meetups | free |

### 3.2 Mapping of Current 6 Spaces to New Categories

| Current Space | Maps To |
|--------------|---------|
| AI News | Distributed across all categories (curated content becomes threads in relevant categories) |
| LLMs & Agents | Category 7: LLMs & Agentes |
| Coding & Tools | Category 8: Automacao & No-Code + Category 13: Ferramentas & Reviews |
| Carreira AI | Category 11: Carreira em AI |
| Show & Tell | Category 14: Off-topic & Networking (subcategory) |
| Off-topic | Category 14: Off-topic & Networking |

**Migration strategy:** Create new categories/subcategories first. Migrate existing posts by mapping `space_id` to `category_id`. Keep `space_id` column but mark spaces as `is_active: false`. No data deletion.

---

## 4. Navigation Architecture

### 4.1 Sidebar Redesign

The current sidebar shows 6 flat Spaces. The new sidebar needs to show 14 categories with collapsible subcategories. This is a fundamental shift from "social media feed selector" to "forum category browser."

```
SIDEBAR STRUCTURE:

[sinapse.club logo]

-- FORUM --
  > AI para Ads          (7 sub)
  > AI para E-commerce   (5 sub)
  > AI para Infoprodutos (5 sub)
  > AI para Afiliados    (5 sub)
  > AI Copywriting       (6 sub)
  > AI para SEO          (6 sub)
  > LLMs & Agentes       (8 sub)
  > Automacao & No-Code  (5 sub)
  > AI Generativa        (5 sub)
  > Negocios             (5 sub)
  > Carreira em AI       (5 sub)
  > Marketplace [PRO]    (4 sub)
  > Ferramentas          (5 sub)
  > Off-topic            (4 sub)

[separator]

-- EXTRAS --
  Ferramentas AI    (tools page)
  Beneficios        (benefits page)
  Leaderboard       (ranking page)

[separator]

  Configuracoes

[user card with cargo badge]
```

**Implementation:** The sidebar becomes a `ScrollArea` with collapsible `Accordion` items. Each category shows thread count and latest activity indicator. Subcategories appear on click/expand.

### 4.2 Page Structure

```
/forum                         -- NEW: forum home (all categories overview, PRIMARY entry point)
/forum/[category-slug]         -- NEW: category page (subcategories + pinned + latest)
/forum/[category-slug]/[sub]   -- NEW: subcategory page (thread list)
/forum/thread/[id]             -- NEW: thread detail (title + body + replies)
/forum/new                     -- NEW: create thread (select category/subcategory)
/marketplace                   -- NEW: marketplace listing page
/marketplace/new               -- NEW: create listing
/tools                         -- NEW: tools directory
/benefits                      -- NEW: benefits/partners page
/leaderboard                   -- NEW: ranking page
/profile/[username]            -- EXISTS: add cargo badge, reputation, badges section
/courses/*                     -- DO NOT TOUCH
```

### 4.3 Topbar Changes

Current topbar has: Search + Bell + User dropdown.

New topbar adds:
- Breadcrumb trail: `Forum > AI para Ads > Meta Ads + AI`
- "New Thread" CTA button (context-aware: knows current category)
- Notification badge with unread count

### 4.4 Mobile Navigation

Current bottom nav: Home | Search | Notifications | Profile

New bottom nav:
```
Home (feed) | Forum | New + | Notifications | Profile
```

The "New +" button opens a bottom sheet with options: "New Thread" | "New Post" | "New Listing" (if pro).

---

## 5. Decision: Feed vs Forum — FORUM ONLY

### 5.1 Decision: KILL THE FEED — Forum is the only product

The Twitter-style feed is **removed entirely**. The forum IS the platform. This mirrors BlackRat exactly: 35K members, R$97/month, no feed — just a well-organized forum.

**Rationale:**
- Two systems split user attention and engagement (where do I post?)
- BlackRat validates that forum-only works at scale
- Curated RSS content becomes auto-threads in relevant categories (no separate feed needed)
- Single mental model: enter → categories → threads. Clean, professional, proven.
- Less code = less bugs = faster MVP = higher quality

### 5.2 What Happens to Existing Feed Components

| Component | Action |
|-----------|--------|
| `/feed` route | **REMOVE** — redirect to `/forum` |
| `post-card.tsx` | **ADAPT** — becomes `thread-list-item.tsx` |
| `create-post.tsx` | **ADAPT** — becomes `thread-create-form.tsx` (add title + category picker) |
| `comment-section.tsx` | **REUSE** — thread replies use same nesting logic |
| `rich-editor.tsx` | **REUSE** — as-is for thread body |
| `spaces` table | **DEPRECATE** — replaced by `forum_categories` |
| RSS pipeline | **REDIRECT** — curated content posts as threads in categories |

### 5.3 Entry Point

After login, users land on `/forum` — the forum home with category overview, latest threads, and activity stats. There is no feed. The forum IS the product.

### 5.4 Curated Content in Forum Context

The existing RSS curation pipeline (curate-rss → translate → publish) continues working but publishes threads into forum categories instead of feed posts:
- OpenAI/Anthropic news → "LLMs & Agentes" category
- Marketing AI tools → "Ferramentas & Reviews" category
- Career articles → "Carreira em AI" category

This preserves the automation investment while fitting the forum model.

---

## 6. Cargo System (Professional Roles)

### 6.1 Role Taxonomy

| Cluster | Roles | Badge Color |
|---------|-------|-------------|
| **C-Level** | CEO, CTO, CMO, COO, CFO | Gold |
| **Management** | Diretor, Head, Gerente, Coordenador | Silver |
| **Specialist** | Especialista, Analista Senior, Tech Lead, Consultor | Blue |
| **Operational** | Analista, Assistente, Estagiario, CLT | Gray |
| **Freelancer** | Freelancer, Autonomo, Consultor Independente | Green |
| **Entrepreneur** | Founder, Co-Founder, Solo Founder | Purple |
| **Student** | Estudante, Em Transicao | Teal |

### 6.2 Onboarding Flow (Step 2.5 — between Interests and Ready)

Current onboarding: Locale > Interests > Ready (3 steps).

New onboarding: Locale > Interests > **Professional Role** > Ready (4 steps).

The new step presents:
1. "Qual seu cargo/papel profissional?" — select from list grouped by cluster
2. Optional: "Empresa/organizacao" — free text
3. Optional: "Headline" — free text ("AI Engineer @ FAANG" style)

### 6.3 Display in UI

- **Post/Thread header:** `@username` now also shows `[CEO]` or `[Freelancer]` badge next to the role badge (admin/pro)
- **Profile page:** Cargo appears below display_name with company
- **Forum thread list:** Cargo badge visible in author column
- **Sidebar user card:** Shows cargo badge

### 6.4 Cluster-Based Features

| Feature | Implementation | Phase |
|---------|---------------|-------|
| Filter threads by cluster | Query param `?cluster=c-level` | MVP |
| Cluster-exclusive subcategories | `subcategory.access = 'c-level'` | Phase 2 |
| Cluster networking | Filter users by cluster in member directory | Phase 2 |
| Cluster leaderboard | Separate rankings per cluster | Phase 3 |

---

## 7. Gamification Architecture

### 7.1 XP Actions (already partially in schema, needs triggers)

| Action | XP | Cooldown |
|--------|-----|----------|
| Create thread | +15 | None |
| Reply to thread | +5 | None |
| Receive like | +2 | None |
| Mark reply as solution | +10 (to solver) | None |
| Daily login | +5 | 24h |
| 7-day streak | +25 bonus | Weekly |
| 30-day streak | +100 bonus | Monthly |
| First post in new category | +10 | Per category |

### 7.2 Level Progression

| Level | Name | XP Required | Perks |
|-------|------|-------------|-------|
| 1 | Novato | 0 | Basic access |
| 2 | Aprendiz | 100 | Can create polls |
| 3 | Membro | 300 | Custom avatar frame |
| 4 | Contribuidor | 700 | Access to Marketplace |
| 5 | Especialista | 1500 | Can pin own thread (1/week) |
| 6 | Veterano | 3000 | Access to beta features |
| 7 | Expert | 6000 | Custom badge |
| 8 | Mestre | 12000 | Mentor badge + private area |
| 9 | Lenda | 25000 | Exclusive area |
| 10 | Oraculo | 50000 | Everything + moderator tools |

### 7.3 Reputation (separate from XP)

Reputation is earned specifically from helpful content:
- Reply marked as solution: +10 rep
- Reply liked by thread author: +3 rep
- Thread with 10+ likes: +5 rep

Reputation unlocks trust-based features (moderator, verified answers).

---

## 8. MVP Visual Prioritization

### 8.1 Phase 1 — MVP Visual Demo (PRIORITY: what needs to exist NOW)

This is what makes the presentation convincing. Focus on **visual completeness** over functional depth.

| Component | Effort | Visual Impact | Priority |
|-----------|--------|---------------|----------|
| Forum home page (`/forum`) with category grid | M | HIGH | P0 |
| Forum sidebar with 14 categories (collapsible) | M | HIGH | P0 |
| Category page with thread list | M | HIGH | P0 |
| Thread detail page with replies | M | HIGH | P0 |
| Cargo badge in posts/profiles | S | HIGH | P0 |
| Professional role onboarding step | S | MEDIUM | P0 |
| Forum breadcrumb in topbar | S | MEDIUM | P0 |
| Thread creation form (category + subcategory picker) | M | MEDIUM | P0 |
| Category/subcategory seed data (all 14 + ~60 subs) | S | HIGH | P0 |
| Sample threads (10-15 seed threads across categories) | S | HIGH | P0 |

**Phase 1 Total:** ~5-7 days of dev work

### 8.2 Phase 2 — Functional Depth

| Component | Effort | Priority |
|-----------|--------|----------|
| Gamification UI (XP bar, level badge, streak display) | M | P1 |
| Badges system (awards, display on profile) | M | P1 |
| Leaderboard page | S | P1 |
| Marketplace listings CRUD | M | P1 |
| Thread sorting (latest, popular, unsolved) | S | P1 |
| Thread tags | S | P1 |
| "Mark as solved" flow | S | P1 |
| Category stats (threads count, latest activity) | S | P1 |

### 8.3 Phase 3 — Full Experience

| Component | Effort | Priority |
|-----------|--------|----------|
| Tools directory | S | P2 |
| Benefits/partners page | S | P2 |
| Cluster-exclusive areas | M | P2 |
| Moderation tools | M | P2 |
| Reputation system triggers | M | P2 |
| Member directory with filters | M | P2 |
| Notification system (real-time) | L | P2 |
| Full-text search across threads | M | P2 |

### 8.4 Placeholders for MVP

Things that can be visually present but functionally stubbed:

- **Tools page:** Show 5 tool cards with icons + descriptions, clicking shows "Em breve" modal
- **Benefits page:** Show 8 partner cards with logos + discount text, clicking shows "Em breve"
- **Leaderboard:** Show mock data (10 users with XP/level), no real-time calculation yet
- **Marketplace:** Show category overview with "Em breve" message
- **Thread stats:** Can show 0 until real data flows in
- **Subcategory thread counts:** Show 0, will populate naturally

---

## 9. Migration Strategy

### 9.1 Database Migration Order

```
Migration 020: forum_categories + forum_subcategories (seed data)
Migration 021: ALTER posts (add category_id, subcategory_id, is_solved, is_sticky, last_reply_at, last_reply_by, tags)
Migration 022: professional_roles (seed data) + ALTER profiles
Migration 023: badges + user_badges + levels (seed data)
Migration 024: marketplace_listings
Migration 025: tools + benefits (seed data)
```

### 9.2 Space-to-Category Migration

```sql
-- Run after migrations 020-021
-- Map existing posts from spaces to categories
UPDATE posts SET category_id = (
  SELECT fc.id FROM forum_categories fc WHERE fc.slug = CASE
    WHEN space_id = (SELECT id FROM spaces WHERE slug = 'llms-agents') THEN 'llms-agentes'
    WHEN space_id = (SELECT id FROM spaces WHERE slug = 'coding-tools') THEN 'automacao-no-code'
    WHEN space_id = (SELECT id FROM spaces WHERE slug = 'carreira-ai') THEN 'carreira-ai'
    WHEN space_id = (SELECT id FROM spaces WHERE slug = 'show-and-tell') THEN 'off-topic'
    WHEN space_id = (SELECT id FROM spaces WHERE slug = 'off-topic') THEN 'off-topic'
    WHEN space_id = (SELECT id FROM spaces WHERE slug = 'ai-news') THEN 'llms-agentes'  -- default for curated
  END
) WHERE category_id IS NULL AND space_id IS NOT NULL;

-- Deactivate old spaces
UPDATE spaces SET is_active = false;
```

### 9.3 Type System Update

```typescript
// New types to add to database.ts
export type PostType = "post" | "curated" | "announcement" | "poll" | "repost" | "reply" | "thread";
export type ProfessionalCluster = "c-level" | "management" | "specialist" | "operational" | "freelancer" | "entrepreneur" | "student";
export type BadgeType = "milestone" | "level" | "achievement" | "cargo" | "manual";
export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type MarketplaceType = "hiring" | "offering" | "collaboration";
export type ThreadSort = "latest" | "popular" | "unsolved" | "unanswered";
```

---

## 10. Component Architecture

### 10.1 New Components Needed

```
src/components/
  forum/
    category-card.tsx          -- Card for forum home grid
    category-sidebar.tsx       -- Collapsible category list for sidebar
    thread-list.tsx            -- Thread list with sorting controls
    thread-list-item.tsx       -- Single thread row (title, author, stats, last reply)
    thread-detail.tsx          -- Full thread view (title + body + metadata)
    thread-reply.tsx           -- Single reply in thread (reuse PostCard pattern)
    thread-create-form.tsx     -- Category/sub picker + title + rich editor
    breadcrumb-nav.tsx         -- Forum > Category > Subcategory
    forum-stats.tsx            -- Category statistics sidebar widget
    solved-badge.tsx           -- [RESOLVED] badge on threads

  profile/
    cargo-badge.tsx            -- Professional role badge component
    level-badge.tsx            -- Level indicator
    badge-collection.tsx       -- Grid of earned badges
    reputation-display.tsx     -- Reputation score

  gamification/
    xp-progress-bar.tsx        -- XP bar showing progress to next level
    leaderboard-table.tsx      -- Ranking table
    streak-indicator.tsx       -- Fire streak counter

  marketplace/
    listing-card.tsx           -- Marketplace listing card
    listing-form.tsx           -- Create/edit listing

  shared/
    coming-soon-modal.tsx      -- "Em breve" placeholder
```

### 10.2 Reusable from Existing

- `PostCard` — Can be adapted for thread replies with minimal changes
- `CreatePost` (rich editor) — Reused for thread creation with added title field
- `RichEditor` — Reused as-is for thread body
- `CommentSection` — Reused for thread replies (already has nesting)
- All shadcn/ui components — Already installed

### 10.3 Layout Changes

The dashboard layout needs conditional rendering:
- Forum pages use wider content area (no `max-w-2xl` constraint)
- Forum sidebar is different from feed sidebar (categories vs spaces)
- Solution: Layout group `(dashboard)` gets a forum-aware sidebar that detects route

---

## 11. Design System Compliance

All new components MUST follow the existing B&W design system:

- **Colors:** Only `foreground`, `muted-foreground`, `background`, `muted`, `border`, `accent`, `destructive`
- **Typography:** Inter for body, JetBrains Mono for code/monospace
- **Borders:** `border-border` (zinc-200 light / zinc-800 dark)
- **Radius:** Use `--radius` variable (0.625rem base)
- **Spacing:** Consistent with existing components (px-4, py-3 for card content)
- **Icons:** Lucide React (already used everywhere)
- **No color badges:** Role badges use border-only style, not colored backgrounds
- **Category colors:** The ONLY exception — categories get a subtle color dot (4px circle) for visual differentiation in the sidebar, not a full color treatment

---

## 12. RLS Policy Requirements

```sql
-- forum_categories: read all active, write admin only
-- forum_subcategories: read all active (filtered by access), write admin only
-- posts (threads): read if category access matches user tier, write if authenticated
-- badges: read all, write admin only
-- user_badges: read all, write via triggers/admin
-- professional_roles: read all, write admin only
-- marketplace_listings: read if pro+, write if pro+ and authenticated
-- tools: read all, write admin only
-- benefits: read if pro+, write admin only
-- levels: read all, write admin only
```

---

## 13. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Posts table becomes overloaded (feed + forum) | Medium | Proper indexing on category_id, subcategory_id. Separate queries for feed vs forum. |
| Sidebar with 14 categories is too long | Medium | Collapsible accordion + "Show all" toggle. Pin favorite categories. |
| Migration breaks existing feed | High | Additive-only schema changes. No column removal. Conditional rendering. |
| Performance with nested subcategories | Low | Categories/subcategories are small static datasets. Cache aggressively. |
| Cargo system feels forced | Low | Make it optional in onboarding (skip button). Can set later in settings. |

---

## 14. Decision Log

| Decision | Chosen | Rejected | Rationale |
|----------|--------|----------|-----------|
| Thread storage | Extend `posts` table | New `threads` table | Reuses all existing logic (reactions, comments, follow, components). Simpler migration. |
| Feed vs Forum | **Forum only (kill feed)** | Coexist (dual-mode) | BlackRat validates forum-only at 35K members. Two systems split engagement. Curated content becomes forum threads. One product, maximum quality. |
| Primary entry point | `/forum` | `/feed` | Forum IS the product. No secondary mode. |
| Category count | 14 (consolidated) | 22 (1:1 BlackRat copy) | AI niche is narrower than full digital marketing. 14 covers all without empty categories. |
| Cargo selection | Onboarding step + settings | Mandatory at registration | Lower friction. Users can skip and set later. |
| Subcategory display | Collapsible in sidebar | Separate page | BlackRat uses sidebar navigation. More discoverable. |

---

## 15. Next Steps

1. **@sprint-lead** creates stories for Phase 1 (MVP Visual Demo)
2. **@data-engineer** implements migrations 020-025
3. **@developer** builds forum components in order: sidebar > home > category > thread
4. **@developer** adds cargo system to onboarding + profile
5. **@developer** seeds categories, subcategories, professional roles, sample threads
6. All work references this ADR as the architectural source of truth

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-31 | Initial ADR created | @architect (Aria) |
| 2026-03-31 | Feed killed — forum-only decision. Updated sections 4.2, 5, 14. | @sinapse-orqx (Imperator) |
