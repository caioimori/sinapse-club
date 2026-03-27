# Epic Index — sinapse.club MVP

> Owner: @pm (Morgan) | Stories: @sm (River) | Validation: @po (Pax)
> Status: DRAFT v1
> Created: 2026-03-27

---

## Epic Overview

| Epic | Title | Priority | Stories | Estimated Weeks |
|------|-------|----------|---------|-----------------|
| EPIC-1 | Auth & User Management | P0 | 6 | 1.5 |
| EPIC-2 | Forum & Feed Curado | P0 | 8 | 2.5 |
| EPIC-3 | Courses & Video Player | P0 | 6 | 2 |
| EPIC-4 | Billing & Subscriptions | P0 | 5 | 1.5 |
| EPIC-5 | Landing Page & Onboarding | P0 | 4 | 1 |
| EPIC-6 | Calendar & Events | P1 | 4 | 1 |
| **TOTAL** | | | **33 stories** | **~9.5 semanas** |

---

## Implementation Order (Critical Path)

```
Semana 1-2:    EPIC-1 (Auth) — foundation para tudo
               ↓
Semana 2-4:    EPIC-2 (Forum) — core do produto
               ↓ (paralelo)
Semana 3-5:    EPIC-3 (Courses) — segundo pilar
               ↓
Semana 5-6:    EPIC-4 (Billing) — monetizacao
               ↓
Semana 7-8:    EPIC-5 (Landing + Onboarding) — go-to-market
               ↓
Semana 8-9:    EPIC-6 (Calendar) — complemento
               ↓
Semana 9-10:   Polish + QA + Soft Launch
```

---

## EPIC-1: Auth & User Management

**Goal:** Sistema de autenticacao e perfil de usuario completo.
**Depends on:** Nada (foundation)
**Blocks:** Todos os outros epics

### Stories

| # | Story | Priority | Est. |
|---|-------|----------|------|
| 1.1 | Setup projeto Next.js + Supabase + Tailwind + shadcn/ui | P0 | 0.5d |
| 1.2 | Schema de database: profiles, spaces (migration 001-002) | P0 | 0.5d |
| 1.3 | Auth flow: register, login, OAuth (Google), callback | P0 | 1d |
| 1.4 | Profile page: avatar, bio, interests, locale toggle | P0 | 1d |
| 1.5 | Dashboard layout: sidebar + topbar + responsive | P0 | 1.5d |
| 1.6 | RLS policies para profiles e spaces | P0 | 0.5d |

### Acceptance Criteria (Epic-level)
- [ ] Usuario consegue criar conta com email ou Google
- [ ] Perfil criado automaticamente no registro (trigger)
- [ ] Dashboard layout renderiza com sidebar e topbar
- [ ] RLS bloqueando acesso nao autorizado
- [ ] Mobile responsive (bottom nav)

---

## EPIC-2: Forum & Feed Curado

**Goal:** Feed de conteudo curado + posts user-generated + traducao EN↔PT.
**Depends on:** EPIC-1 (auth + layout)
**Blocks:** EPIC-4 (precisa de spaces para paywall)

### Stories

| # | Story | Priority | Est. |
|---|-------|----------|------|
| 2.1 | Schema: posts, comments, reactions, curated_content (migration 003-006) | P0 | 0.5d |
| 2.2 | Spaces listing + navigation (sidebar integration) | P0 | 0.5d |
| 2.3 | Post creation: rich text editor (Tiptap) + submit flow | P0 | 1.5d |
| 2.4 | Feed view: post list, author info, reactions, timestamps | P0 | 1d |
| 2.5 | Comments: threaded comments on posts | P0 | 1d |
| 2.6 | Reactions: like + save (optimistic UI) | P0 | 0.5d |
| 2.7 | Curation pipeline: X API + Reddit API + RSS ingest + translate | P0 | 2d |
| 2.8 | Translation toggle: EN↔PT switch per curated item | P0 | 1d |

### Acceptance Criteria (Epic-level)
- [ ] Feed mostra posts user-generated e curated mixed
- [ ] Conteudo curado aparece com source badge (X, Reddit, etc.)
- [ ] Toggle EN↔PT funciona em cada item curado
- [ ] Rich text editor funciona para criacao de posts
- [ ] Comentarios threaded funcionam
- [ ] Like/save atualiza em tempo real
- [ ] Pipeline de curadoria roda a cada 15-30 min
- [ ] Busca full-text funciona

---

## EPIC-3: Courses & Video Player

**Goal:** Catalogo de cursos + player de video + progresso.
**Depends on:** EPIC-1 (auth)
**Can run parallel to:** EPIC-2

### Stories

| # | Story | Priority | Est. |
|---|-------|----------|------|
| 3.1 | Schema: courses, modules, lessons, enrollments, progress (migration 007-009) | P0 | 0.5d |
| 3.2 | Course catalog page: card grid, filters, search | P0 | 1d |
| 3.3 | Course detail page: description, modules, CTA (buy/continue) | P0 | 1d |
| 3.4 | Video player: Vidstack + Bunny.net integration + progress tracking | P0 | 2d |
| 3.5 | Module/lesson navigation: sidebar with completion checkmarks | P0 | 1d |
| 3.6 | Enrollment + access control: RLS per enrolled user | P0 | 1d |

### Acceptance Criteria (Epic-level)
- [ ] Catalogo mostra cursos publicados com thumbnail e info
- [ ] Video player funciona com Bunny.net (HLS adaptive)
- [ ] Progresso salvo por aula (posicao + completion)
- [ ] Apenas alunos enrolled podem acessar aulas (RLS)
- [ ] Aulas preview acessiveis a todos
- [ ] Velocidade de playback funciona (0.5x - 2x)

---

## EPIC-4: Billing & Subscriptions

**Goal:** Pagamentos via Stripe (cartao + PIX), tiers, paywall.
**Depends on:** EPIC-1 (auth), EPIC-2 (spaces para paywall), EPIC-3 (courses para compra)

### Stories

| # | Story | Priority | Est. |
|---|-------|----------|------|
| 4.1 | Schema: subscriptions (migration 010) + Stripe setup | P0 | 0.5d |
| 4.2 | Stripe Checkout: subscription flow (Pro, Premium) com PIX + cartao | P0 | 1.5d |
| 4.3 | Stripe webhooks: sync subscription status → update user role | P0 | 1d |
| 4.4 | Course purchase: one-time payment → enrollment | P0 | 1d |
| 4.5 | Paywall: gate spaces e conteudo por tier (RLS-driven) | P0 | 1d |

### Acceptance Criteria (Epic-level)
- [ ] Usuario assina Pro/Premium via Stripe Checkout
- [ ] PIX e cartao funcionam como metodo de pagamento
- [ ] Webhook atualiza role do usuario automaticamente
- [ ] Compra de curso cria enrollment
- [ ] Paywall bloqueia conteudo de spaces Pro/Premium para free users
- [ ] Customer portal para gerenciar subscription

---

## EPIC-5: Landing Page & Onboarding

**Goal:** Landing page publica + fluxo de onboarding para novos usuarios.
**Depends on:** EPIC-4 (pricing funcional)

### Stories

| # | Story | Priority | Est. |
|---|-------|----------|------|
| 5.1 | Landing page: hero, problema, solucao, features, pricing, FAQ, CTA | P0 | 2d |
| 5.2 | Pricing section: cards interativos dos tiers | P0 | 0.5d |
| 5.3 | Onboarding flow: locale + interests + tour | P0 | 1d |
| 5.4 | SEO: meta tags, OG image, structured data, sitemap | P1 | 0.5d |

### Acceptance Criteria (Epic-level)
- [ ] Landing page renderiza todas as secoes do copy doc
- [ ] CTAs linkam para auth e checkout
- [ ] Onboarding coleta locale e interests
- [ ] Tour guiado mostra feed, spaces, e cursos
- [ ] Meta tags e OG image corretos
- [ ] Pagina carrega em < 2s (LCP)

---

## EPIC-6: Calendar & Events

**Goal:** Calendario de eventos + RSVP + integracao Google Calendar.
**Depends on:** EPIC-1 (auth), EPIC-4 (access control por tier)

### Stories

| # | Story | Priority | Est. |
|---|-------|----------|------|
| 6.1 | Schema: events, rsvps (migration 011) | P1 | 0.5d |
| 6.2 | Calendar view: month/week/list com eventos | P1 | 1.5d |
| 6.3 | Event creation (admin): formulario + recurrence | P1 | 1d |
| 6.4 | RSVP + Google Calendar link + reminder email | P1 | 1d |

### Acceptance Criteria (Epic-level)
- [ ] Calendario mostra eventos por mes/semana/lista
- [ ] RSVP funciona com contagem de confirmados
- [ ] "Adicionar ao Google Calendar" gera link correto
- [ ] Apenas membros com acesso adequado veem eventos premium

---

## Story Template

Cada story em `docs/stories/` segue este formato:

```markdown
# Story {epicNum}.{storyNum}: {title}

## Overview
Brief description.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Notes
Implementation details.

## File List
Files created/modified.

## Status
- [ ] Draft
- [ ] Validated
- [ ] In Progress
- [ ] Done
```

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-27 | Initial epic index + stories | @pm (Morgan) + @sm (River) + Imperator |
