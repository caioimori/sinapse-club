# System Architecture — sinapse.club

> Owner: @architect (Aria) | Reviewed by: @cybersecurity (Fortress)
> Status: DRAFT v1
> Created: 2026-03-27

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Web App  │  │  Mobile  │  │   PWA    │  │  Email   │           │
│  │ (Next.js) │  │ (future) │  │ (future) │  │ (Resend) │           │
│  └─────┬─────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘           │
│        └───────────────┴─────────────┴──────────────┘               │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS
┌────────────────────────────────┼────────────────────────────────────┐
│                          EDGE LAYER                                  │
│  ┌─────────────────────────────┴─────────────────────────────────┐  │
│  │                      Vercel Edge Network                       │  │
│  │  - CDN (static assets, ISR pages)                             │  │
│  │  - Edge Functions (middleware: auth, geo, rate limiting)       │  │
│  │  - Edge Config (feature flags)                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────┐
│                       APPLICATION LAYER                              │
│  ┌───────────────┐  ┌──────────────────┐  ┌──────────────────────┐ │
│  │  Next.js App   │  │  API Routes      │  │  Server Actions     │ │
│  │  (App Router)  │  │  (/api/*)        │  │  (mutations)        │ │
│  │                │  │                  │  │                     │ │
│  │  - RSC pages   │  │  - Webhooks      │  │  - Form submissions │ │
│  │  - Layouts     │  │  - Stripe hooks  │  │  - CRUD operations  │ │
│  │  - Streaming   │  │  - Curation jobs │  │  - File uploads     │ │
│  └───────┬────────┘  └────────┬─────────┘  └──────────┬──────────┘ │
│          └────────────────────┴────────────────────────┘            │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────┐
│                        DATA LAYER (Supabase)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL   │  │  Auth        │  │  Realtime    │              │
│  │  (database)   │  │  (Supabase   │  │  (WebSocket) │              │
│  │              │  │   Auth)      │  │              │              │
│  │  - RLS       │  │  - OAuth     │  │  - Feed live │              │
│  │  - Functions │  │  - JWT       │  │  - Presence  │              │
│  │  - Triggers  │  │  - Roles     │  │  - Notifs    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Storage      │  │  Edge Funcs  │  │  Cron Jobs   │              │
│  │  (S3-compat)  │  │  (Deno)      │  │  (pg_cron)   │              │
│  │              │  │              │  │              │              │
│  │  - Avatars   │  │  - Curation  │  │  - Fetch X   │              │
│  │  - Uploads   │  │  - Translate │  │  - Fetch RSS │              │
│  │  - Thumbs    │  │  - Summarize │  │  - Cleanup   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────┐
│                      EXTERNAL SERVICES                               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │  Stripe   │ │  Mux/     │ │  DeepL    │ │  OpenAI   │          │
│  │  Payments │ │  Bunny    │ │  Translate│ │  GPT-4o   │          │
│  └───────────┘ │  Video    │ └───────────┘ └───────────┘          │
│  ┌───────────┐ └───────────┘ ┌───────────┐ ┌───────────┐          │
│  │  Resend   │ ┌───────────┐ │  X API    │ │  Reddit   │          │
│  │  Email    │ │  PostHog  │ │  v2       │ │  API      │          │
│  └───────────┘ │  Analytics│ └───────────┘ └───────────┘          │
│                └───────────┘                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

| Principio | Descricao |
|-----------|-----------|
| **Server-first** | RSC e Server Actions como padrao; client components somente quando interatividade e necessaria |
| **Edge-optimized** | Middleware e cache no edge (Vercel) para latencia minima no Brasil |
| **RLS-secured** | Toda query ao banco passa por Row Level Security do Supabase |
| **Event-driven** | Curation pipeline e assíncrona via Supabase Edge Functions + pg_cron |
| **Progressive** | MVP simples, complexidade adicionada incrementalmente |
| **Cost-conscious** | Escolhas que minimizam custo no MVP (Supabase free tier, Bunny vs Mux) |

---

## 2. Tech Stack Detail

### 2.1 Frontend

```yaml
framework: Next.js 15 (App Router)
language: TypeScript 5.x (strict mode)
styling: Tailwind CSS 4
ui_components: shadcn/ui (Radix primitives)
state: Zustand (minimal client state)
forms: React Hook Form + Zod
rich_text: Tiptap (ProseMirror-based)
video_player: Vidstack (modern, accessible)
icons: Lucide
charts: Recharts (analytics dashboard, future)
```

### 2.2 Backend

```yaml
runtime: Next.js Server (Node.js) + Supabase Edge Functions (Deno)
database: Supabase PostgreSQL 15
auth: Supabase Auth (JWT, OAuth, magic link)
realtime: Supabase Realtime (WebSocket channels)
storage: Supabase Storage (S3-compatible)
cron: Supabase pg_cron (curation pipeline)
search: PostgreSQL Full-Text Search (tsvector) → Meilisearch (future)
cache: Vercel Data Cache + ISR
```

### 2.3 External Services

```yaml
payments: Stripe (Checkout, Subscriptions, Customer Portal)
video: Bunny.net Stream (cost-effective, global CDN)
translation:
  primary: DeepL API (highest quality EN↔PT)
  fallback: OpenAI GPT-4o-mini (cheaper, good enough)
email: Resend (transactional) + React Email (templates)
analytics: PostHog (self-hostable, feature flags, session replay)
monitoring: Sentry (error tracking)
```

### 2.4 Justificativa de Escolhas

| Decisao | Escolha | Alternativa descartada | Razao |
|---------|---------|------------------------|-------|
| Framework | Next.js 15 | Remix, SvelteKit | Ecosystem, RSC, Vercel integration |
| Database | Supabase | PlanetScale, Neon | Auth + Realtime + Storage + RLS all-in-one |
| Video | Bunny.net | Mux | 5-10x mais barato, CDN forte na LATAM |
| Translation | DeepL | Apenas GPT | Melhor qualidade PT-BR especificamente |
| UI | shadcn/ui | Material UI, Chakra | Nao e dependency — copy/paste, full control |
| Payments | Stripe | Hotmart, Pagar.me | PIX + cartao + subscription management |
| Rich text | Tiptap | Slate, Draft.js | Extensível, markdown support, collaborative (future) |
| Video player | Vidstack | Video.js, Plyr | Modern, React-native, HLS, a11y |

---

## 3. Data Flow Architecture

### 3.1 Content Curation Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                CURATION PIPELINE (async)                 │
│                                                          │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │ SOURCES │    │  INGEST     │    │  PROCESS        │ │
│  │         │    │             │    │                 │ │
│  │ X API ──┼───→│ Supabase    │───→│ 1. Deduplicate  │ │
│  │ Reddit ─┤    │ Edge Func   │    │ 2. Classify     │ │
│  │ RSS ────┤    │ (pg_cron    │    │ 3. Translate    │ │
│  │ Docs ───┘    │  triggers)  │    │ 4. Summarize    │ │
│  └─────────┘    └─────────────┘    │ 5. Score        │ │
│                                    └────────┬────────┘ │
│                                             │          │
│                 ┌───────────────────────────┘          │
│                 │                                      │
│  ┌──────────────▼──────────────┐                      │
│  │  STORE                       │                      │
│  │                              │                      │
│  │  curated_content table       │                      │
│  │  - original_text (EN)        │                      │
│  │  - translated_text (PT)      │                      │
│  │  - source (x/reddit/rss)     │                      │
│  │  - category (space)          │                      │
│  │  - relevance_score           │                      │
│  │  - created_at                │                      │
│  └──────────────┬──────────────┘                      │
│                 │                                      │
│  ┌──────────────▼──────────────┐                      │
│  │  DELIVER                     │                      │
│  │                              │                      │
│  │  - Supabase Realtime push    │                      │
│  │  - ISR revalidation          │                      │
│  │  - Email digest (daily)      │                      │
│  └─────────────────────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Pipeline Schedule

| Job | Frequencia | Fonte | Volume estimado |
|-----|------------|-------|-----------------|
| X API fetch | Cada 15 min | Listas curadas + keywords | ~100 tweets/hora |
| Reddit fetch | Cada 30 min | r/MachineLearning, r/LocalLLaMA, etc. | ~50 posts/hora |
| RSS fetch | Cada 1 hora | OpenAI blog, Anthropic blog, etc. | ~10 items/hora |
| Docs changelog | Cada 6 horas | GitHub releases, changelogs | ~5 items/dia |
| Translation batch | Cada 15 min | Queue de items nao traduzidos | Batch de 20 |
| Cleanup | Diario (3am BRT) | Remover conteudo > 30 dias low-score | Variable |

### 3.3 Authentication Flow

```
User → Login page
  ├→ Email/Password → Supabase Auth → JWT → Session cookie
  ├→ Google OAuth → Supabase Auth → JWT → Session cookie
  └→ Magic Link → Email → Callback → JWT → Session cookie

JWT contains:
  - user_id (uuid)
  - role (free/pro/premium/admin/instructor)
  - subscription_status (active/trialing/canceled)

Middleware (Edge):
  - Verify JWT on every request
  - Redirect unauthenticated users
  - Check role-based access for gated content
  - Rate limiting per user tier
```

### 3.4 Payment Flow

```
User clicks "Assinar Pro"
  → Stripe Checkout Session (server action)
    → Stripe hosted page (PIX or Card)
      → Payment success
        → Stripe webhook → /api/webhooks/stripe
          → Update user role in Supabase
          → Create subscription record
          → Send welcome email (Resend)
          → Unlock gated content (RLS auto-handles)

Subscription lifecycle:
  - checkout.session.completed → activate
  - invoice.payment_succeeded → renew
  - invoice.payment_failed → grace period (3 days)
  - customer.subscription.deleted → downgrade to free
```

---

## 4. Folder Structure

```
sinapse-plataform/
├── docs/                          # Project documentation
├── public/                        # Static assets
│   ├── fonts/
│   └── images/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth routes (login, register, callback)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── callback/
│   │   ├── (dashboard)/           # Authenticated routes
│   │   │   ├── feed/              # Forum feed
│   │   │   ├── spaces/[slug]/     # Individual space
│   │   │   ├── courses/           # Course catalog
│   │   │   ├── courses/[id]/      # Course player
│   │   │   ├── calendar/          # Calendar view
│   │   │   ├── profile/           # User profile
│   │   │   ├── settings/          # User settings
│   │   │   └── layout.tsx         # Dashboard layout (sidebar + topbar)
│   │   ├── (marketing)/           # Public routes
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── pricing/
│   │   │   └── about/
│   │   ├── api/                   # API routes
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/
│   │   │   └── curation/
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css
│   ├── components/                # Shared components
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── feed/                  # Feed-specific components
│   │   ├── courses/               # Course-specific components
│   │   ├── calendar/              # Calendar components
│   │   ├── layout/                # Layout components (sidebar, topbar)
│   │   └── shared/                # Cross-cutting components
│   ├── lib/                       # Utilities and configurations
│   │   ├── supabase/              # Supabase client (server + browser)
│   │   ├── stripe/                # Stripe helpers
│   │   ├── translation/           # DeepL/GPT translation
│   │   ├── curation/              # Content curation logic
│   │   └── utils.ts               # General utilities
│   ├── hooks/                     # Custom React hooks
│   ├── stores/                    # Zustand stores
│   ├── types/                     # TypeScript types
│   └── config/                    # App configuration
├── supabase/
│   ├── migrations/                # Database migrations
│   ├── functions/                 # Edge Functions
│   │   ├── curate-x/              # X API curation
│   │   ├── curate-reddit/         # Reddit curation
│   │   ├── translate/             # Translation service
│   │   └── stripe-webhooks/       # (alternative to API route)
│   └── seed.sql                   # Seed data
├── tests/                         # Test files
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 5. Infrastructure

### 5.1 Environments

| Environment | URL | Database | Purpose |
|-------------|-----|----------|---------|
| Development | localhost:3000 | Supabase local (Docker) | Dev + testing |
| Preview | *.vercel.app | Supabase branch DB | PR previews |
| Staging | staging.sinapse.club | Supabase staging project | QA + demos |
| Production | sinapse.club | Supabase production | Live |

### 5.2 CI/CD Pipeline

```
Push to branch
  → Vercel Preview Deploy (automatic)
  → Run tests (GitHub Actions)
  → Supabase migration check

Merge to main
  → Vercel Production Deploy
  → Supabase migration apply
  → PostHog deployment tracking
  → Sentry release
```

### 5.3 Estimated Costs (MVP)

| Service | Tier | Cost/month | Notes |
|---------|------|------------|-------|
| Vercel | Pro | $20 | Sufficient for MVP |
| Supabase | Pro | $25 | 8GB DB, 250GB bandwidth |
| Bunny.net | Pay-as-you-go | $5-20 | ~100GB video storage |
| DeepL | API Pro | $25 | 500k characters/month |
| Stripe | 3.4% + R$0.39/tx | Variable | Brazilian rates |
| Resend | Free tier | $0 | 3k emails/month |
| PostHog | Free tier | $0 | 1M events/month |
| Sentry | Free tier | $0 | 5k errors/month |
| Domain | Annual | ~$15/year | sinapse.club |
| **TOTAL** | | **~$75-90/month** | Before revenue |

---

## 6. Security Considerations

> Detalhes completos em `docs/architecture/security-spec.md`

### 6.1 Key Security Measures

| Area | Measure |
|------|---------|
| Auth | Supabase Auth (bcrypt, JWT, refresh tokens) |
| Authorization | RLS policies per table, role-based |
| Data | All data encrypted at rest (Supabase default) |
| Transport | HTTPS everywhere (Vercel default) |
| API Keys | Environment variables, never client-side |
| Rate Limiting | Edge middleware per tier |
| LGPD | Consent management, data export, deletion |
| Input | Zod validation on all inputs (client + server) |
| XSS | React default escaping + CSP headers |
| CSRF | SameSite cookies + Supabase PKCE |

---

## 7. Scalability Path

| Phase | Users | Action |
|-------|-------|--------|
| MVP | 0-500 | Current architecture (Supabase Pro) |
| Growth | 500-5k | Upgrade Supabase, add caching (Redis) |
| Scale | 5k-50k | Meilisearch for search, dedicated video CDN |
| Enterprise | 50k+ | Multi-region, microservices extraction |

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-27 | Initial architecture doc | @architect (Aria) + Imperator |
