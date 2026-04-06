# Product Roadmap Modularizado — sinapse.club

```
Versao: 1.0
Data: 2026-04-03
Autor: Vector (Product Operations Orchestrator)
Estrategia: Forum-first launch, modulos independentes
Referencia: BlackRat (35K membros, R$97/mes)
```

---

## 1. Definicao dos Modulos

### MOD-01: Forum (P0)

| Campo | Valor |
|-------|-------|
| Nome | Forum |
| Descricao | Forum de discussao estilo BlackRat com 14 categorias, subcategorias, threads, replies, reactions, pins |
| Escopo | Home do forum, navegacao por categoria/subcategoria, criacao de thread, detail de thread, replies, likes/saves, share, pins, forum stats |
| Status | MVP funcional (~70%). 10 componentes, 5 rotas, 8 stories DONE |
| Falta | Search, pagination, sorting, edit/delete posts, markdown rendering, moderation tools, user mentions |
| Prioridade | **P0** — Nucleo do produto |

### MOD-02: Access Control & Tiers (P0)

| Campo | Valor |
|-------|-------|
| Nome | Access Control |
| Descricao | Sistema de tiers (Free/Pro/Premium) com gating de conteudo, feature gates, thread limits, upgrade walls |
| Escopo | feature-gate, enroll-wall, upgrade-wall, tier-badge, thread-limit-indicator, hasAccess() helper, migration de RLS por tier |
| Status | Implementado (~85%). 4 stories TIERS DONE. 6 componentes de access |
| Falta | Enforcement end-to-end testado, edge cases de downgrade |
| Prioridade | **P0** — Necessario para cobrar |

### MOD-03: Billing & Payments (P0)

| Campo | Valor |
|-------|-------|
| Nome | Billing |
| Descricao | Checkout via AbacatePay (PIX + cartao), webhook para sync de role, pagina de pricing |
| Escopo | Pricing page, checkout-button, createCheckout server action, webhook handler, abacatepay.ts client |
| Status | Parcial (~40%). Infraestrutura montada (7 arquivos). Checkout flow implementado |
| Falta | Testes E2E, cancelamento, email confirmacao, retry logic, reconciliation |
| Prioridade | **P0** — Sem billing nao ha receita |

### MOD-04: Landing Page & Onboarding (P0)

| Campo | Valor |
|-------|-------|
| Nome | Landing & Onboarding |
| Descricao | Landing page publica de conversao + fluxo de onboarding pos-registro |
| Status | Landing existe (~60%). Onboarding existe (~70%) com 4 steps |
| Falta | FAQ section, social proof/testimonials, pricing alignment, SEO completo, OG image |
| Prioridade | **P0** — Sem landing nao ha conversao |

### MOD-05: Gamification (P1)

| Campo | Valor |
|-------|-------|
| Nome | Gamificacao |
| Descricao | Sistema de XP, niveis, badges, leaderboard, streaks |
| Status | DB pronto (~15%). Triggers SQL criados. Leaderboard page usa mock data |
| Falta | XP triggers ativos no app, UI de badges, level-up animations, XP history |
| Prioridade | **P1** — Leaderboard basico no launch, resto depois |

### MOD-06: Courses (P2 — Em Breve)

| Campo | Valor |
|-------|-------|
| Nome | Cursos |
| Descricao | Catalogo de cursos gravados com video player |
| Status | Parcial (~40%). Catalogo e player existem |
| Falta | Enrollment flow completo, progresso por aula, completion tracking |
| Prioridade | **P2** — Showcase no launch, enrollment completo depois |

### MOD-07: Calendar & Events (P2 — Em Breve)

| Campo | Valor |
|-------|-------|
| Nome | Calendario |
| Descricao | Calendario de eventos da comunidade com RSVP |
| Status | Stub funcional (~20%). Page busca eventos reais do DB |
| Falta | Criacao de eventos (admin), RSVP, Google Calendar integration |
| Prioridade | **P2** |

### MOD-08: Marketplace (P2 — Em Breve)

| Campo | Valor |
|-------|-------|
| Nome | Marketplace |
| Descricao | Marketplace de servicos entre membros |
| Status | Stub (~5%). UI estatica com 4 categorias |
| Prioridade | **P2** |

### MOD-09: Tools AI (P2 — Em Breve)

| Campo | Valor |
|-------|-------|
| Nome | Ferramentas AI |
| Descricao | Suite de ferramentas AI para membros |
| Status | Stub (~5%). ComingSoonModal implementado |
| Prioridade | **P2** |

### MOD-10: Benefits (P2 — Em Breve)

| Campo | Valor |
|-------|-------|
| Nome | Beneficios Parceiros |
| Descricao | Programa de beneficios e descontos com parceiros |
| Status | Stub (~5%). ComingSoonModal implementado |
| Prioridade | **P2** |

### MOD-11: Cargo System (P1)

| Campo | Valor |
|-------|-------|
| Nome | Cargos Profissionais |
| Descricao | Sistema de cargos/roles profissionais com clusters e badges visuais |
| Status | Funcional (~75%). Selecao no onboarding, badge no perfil e sidebar |
| Falta | Troca de cargo pos-onboarding, validacao, cargos custom |
| Prioridade | **P1** — Funcional para launch |

### MOD-12: Profile & Settings (P1)

| Campo | Valor |
|-------|-------|
| Nome | Perfil & Configuracoes |
| Descricao | Pagina de perfil do usuario e configuracoes |
| Status | Funcional (~60%) |
| Falta | Edicao completa, upload avatar, privacy settings, delete account |
| Prioridade | **P1** — Basico funciona para launch |

---

## 2. Forum Launch Checklist (P0)

### Epicos para Launch

#### EPIC-8: Forum Polish & Search (P0) — ~5.5 dias

| # | Story | Prioridade | Est. | Descricao |
|---|-------|-----------|------|-----------|
| LAUNCH-1 | Forum Search & Filter | P0 | 1.5d | Full-text search em threads (titulo + corpo). Filtros por categoria. Search bar no topbar |
| LAUNCH-2 | Pagination & Sorting | P0 | 1d | Pagination cursor-based. Sorting: Recentes, Populares, Sem Resposta |
| LAUNCH-3 | Edit & Delete Own Posts | P0 | 0.5d | Autor edita/deleta proprios threads e replies. Soft delete |
| LAUNCH-4 | Markdown Rendering | P0 | 1d | Markdown no corpo de threads/replies. Code blocks com syntax highlighting. Preview |
| LAUNCH-5 | Basic Moderation Tools | P0 | 1d | Admin: delete thread, lock thread, ban user. Report button + report queue |
| LAUNCH-6 | User Mentions (@) | P1 | 0.5d | @username em replies com autocomplete |

#### EPIC-9: Billing End-to-End (P0) — ~3.5 dias

| # | Story | Prioridade | Est. | Descricao |
|---|-------|-----------|------|-----------|
| BILL-1 | Pricing Consistency Fix | P0 | 0.5d | Alinhar precos landing vs dashboard. Single source of truth |
| BILL-2 | Checkout E2E Testing | P0 | 1d | Testar fluxo completo: clique -> pagamento -> webhook -> acesso |
| BILL-3 | Subscription Cancellation | P0 | 1d | Cancelamento, downgrade graceful, webhook de cancelamento |
| BILL-4 | Payment Failure Handling | P0 | 0.5d | Retry logic, grace period, notificacao de falha |
| BILL-5 | Confirmation & Receipt | P1 | 0.5d | Email de confirmacao. Recibo no dashboard |

#### EPIC-10: Landing Page de Conversao (P0) — ~2 dias

| # | Story | Prioridade | Est. | Descricao |
|---|-------|-----------|------|-----------|
| LAND-1 | Pricing Alignment & FAQ | P0 | 0.5d | Corrigir precos, adicionar FAQ section |
| LAND-2 | Social Proof & Testimonials | P0 | 0.5d | Contador de membros, depoimentos, logos |
| LAND-3 | SEO & OG Image | P0 | 0.5d | Meta tags, OG image, structured data, sitemap |
| LAND-4 | Onboarding Polish | P1 | 0.5d | Tour guiado pos-onboarding, welcome email |

#### EPIC-11: Gamificacao Minima Viavel (P1) — ~2 dias

| # | Story | Prioridade | Est. | Descricao |
|---|-------|-----------|------|-----------|
| GAME-1 | XP Triggers Reais | P1 | 1d | Triggers: criar thread (+10), reply (+5), like recebido (+2), daily login (+3) |
| GAME-2 | Leaderboard Real | P1 | 0.5d | Substituir mock por query real. Top 20. Filtro semanal/mensal/all-time |
| GAME-3 | XP Display no Profile | P1 | 0.5d | XP, level, streak no perfil e sidebar. Progress bar |

#### EPIC-12: Notificacoes Basicas (P1) — ~2 dias

| # | Story | Prioridade | Est. | Descricao |
|---|-------|-----------|------|-----------|
| NOTIF-1 | Notification System Foundation | P1 | 1d | Tabela notifications, polling/Realtime, dropdown no topbar |
| NOTIF-2 | Reply Notifications | P1 | 0.5d | Notificar replies na sua thread |
| NOTIF-3 | System Notifications | P1 | 0.5d | Welcome, level-up, admin announcements |

### Resumo

| Epic | Est. | Bloqueia Launch? |
|------|------|-----------------|
| EPIC-8: Forum Polish | 5.5d | SIM |
| EPIC-9: Billing E2E | 3.5d | SIM |
| EPIC-10: Landing | 2d | SIM |
| EPIC-11: Gamificacao | 2d | NAO |
| EPIC-12: Notificacoes | 2d | NAO |
| **TOTAL P0** | **11d** | |
| **TOTAL P0+P1** | **15d** | |

---

## 3. "Coming Soon" Modules

Todos os modulos P2 ja estao adequados para launch:

- **Courses:** Catalogo visivel, video player funciona. "Em breve" no enrollment
- **Calendar:** Menu ativo, mostra eventos se existirem no DB
- **Marketplace:** ComingSoonModal ja implementado, lock icon por tier
- **Tools AI:** ComingSoonModal ja implementado
- **Benefits:** ComingSoonModal ja implementado

**Nenhum modulo P2 requer trabalho adicional para o launch.**

---

## 4. Launch Criteria

### GO/NO-GO Checklist

#### Funcional (P0 — Bloqueante)

- [ ] Forum: search funciona (busca por titulo/corpo)
- [ ] Forum: pagination existe
- [ ] Forum: sorting funciona (recentes, populares)
- [ ] Forum: edit/delete de proprios posts funciona
- [ ] Forum: report button existe (moderacao minima)
- [ ] Forum: markdown renderiza em threads e replies
- [ ] Billing: checkout completo funciona (clique -> pagamento -> acesso)
- [ ] Billing: precos consistentes entre landing e dashboard
- [ ] Billing: cancelamento funciona (downgrade graceful)
- [ ] Landing: FAQ section existe
- [ ] Landing: pricing correto e alinhado
- [ ] Landing: meta tags e OG image configurados
- [ ] Auth: login Google funciona em producao
- [ ] Auth: registro + onboarding funciona end-to-end

#### Qualidade (P0 — Bloqueante)

- [ ] Zero erros criticos no console (producao)
- [ ] Mobile responsive em todas as paginas do forum
- [ ] Tempo de carregamento < 3s na landing (LCP)
- [ ] RLS policies ativas em TODAS as tabelas com dados de usuario
- [ ] Sem secrets expostos no frontend
- [ ] Webhook do AbacatePay validado com signature check

#### Nice-to-Have (P1)

- [ ] Leaderboard com dados reais
- [ ] XP triggers ativos
- [ ] Notificacoes de reply
- [ ] User mentions (@)
- [ ] Email de boas-vindas
- [ ] Tour guiado pos-onboarding

### Estrategia de Launch

**Soft Launch (Fase 1):**
- 50-100 pessoas (rede pessoal, early adopters)
- Validar billing flow, encontrar bugs, coletar feedback
- 1-2 semanas
- Sucesso: 5+ assinaturas pagas, 0 bugs criticos

**Public Launch (Fase 2):**
- Landing page aberta, ads podem comecar
- Meta: 100 membros em 30 dias, 20+ pagantes, NPS > 40

---

## 5. Issues Criticas Detectadas

| Issue | Detalhe | Impacto |
|-------|---------|---------|
| **Pricing mismatch** | Landing: Free/R$49 Pro/R$97 Premium. Dashboard: Free/R$97 Pro/R$197 Premium | CRITICO |
| **Feed morto** | Rota /feed ainda existe. ADR-001 pivotar para forum-only | BAIXO — redirecionar |
| **Leaderboard mock** | Dados hardcoded | MEDIO — substituir ou esconder |
| **Spaces rota** | /spaces ainda existe | BAIXO — legacy, remover |

---

## 6. Roadmap Visual

```
NOW (P0 — Semana 1-3)          NEXT (P1 — Semana 4-6)         LATER (P2 — Q3+)
========================        ========================         ====================
Forum Search & Filter           Gamificacao Real (XP/Levels)     Courses Enrollment
Pagination & Sorting            Notificacoes Basicas             Calendar + RSVP
Edit/Delete Posts                Leaderboard Real                 Marketplace MVP
Markdown Rendering              User Mentions                    Tools AI Suite
Basic Moderation                Profile Polish                   Benefits Program
Billing E2E                     Onboarding Tour                  Real-time Features
Pricing Consistency             Welcome Email                    Analytics Dashboard
Landing FAQ + Social Proof      Cargo Edit                       Admin Panel Full
SEO & OG Image                  Streak Notifications             Community Events
Checkout Testing                                                 Referral Program
Cancellation Flow
```

---

## 7. Stack Tecnico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (Auth, Database, RLS, Realtime), Next.js Server Actions |
| Payments | AbacatePay (PIX + Cartao) |
| Video | Vidstack player (Bunny.net) |
| Deploy | Vercel (forum.sinapse.club) |
| Auth | Supabase Auth (Google OAuth) |

---

*Documento gerado por Vector (product-orqx) em 2026-04-03.*
*Baseado em analise completa: 97 arquivos fonte, 9 migrations, 13 stories, 15 rotas.*
