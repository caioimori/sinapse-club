# PRD — sinapse.club

> Product Requirements Document
> Status: DRAFT (aguardando enriquecimento com dados de pesquisa)
> Owner: @product (Vector) | Reviewed by: @pm (Morgan)
> Created: 2026-03-27

---

## 1. Vision & Purpose

### 1.1 Product Vision

**sinapse.club** e a comunidade de inteligencia artificial mais acessivel e atualizada do mundo lusofono. Uma plataforma que conecta profissionais e entusiastas de AI a todo conteudo relevante do ecossistema global — traduzido, curado e discutido em portugues.

### 1.2 Problem Statement

Profissionais de tecnologia no Brasil e paises lusofonos enfrentam 3 barreiras criticas para se manterem atualizados em AI:

1. **Barreira linguistica:** 95%+ do conteudo de ponta sobre AI esta em ingles (X, Reddit, papers, docs oficiais). Muitos profissionais entendem ingles, mas absorvem melhor em portugues.

2. **Fragmentacao de fontes:** Informacao relevante esta espalhada entre X (threads), Reddit (r/MachineLearning, r/LocalLLaMA), docs oficiais (OpenAI, Anthropic, Google), newsletters, YouTube — exigindo horas de curadoria diaria.

3. **Falta de comunidade local:** Comunidades globais de AI no Discord/Reddit nao tem contexto brasileiro (regulamentacao, mercado, cultura). Nao existe um espaco premium para profissionais de AI lusofono.

### 1.3 Solution

Uma plataforma que resolve os 3 problemas simultaneamente:

| Problema | Solucao sinapse.club |
|----------|---------------------|
| Barreira linguistica | Traducao automatica EN↔PT com AI (toggle bilingual) |
| Fragmentacao | Curadoria automatica de X, Reddit, docs, com feed unificado |
| Falta de comunidade | Forum + courses + lives + calendar em PT-BR |

### 1.4 Success Metrics (MVP)

| Metrica | Target (3 meses) | Target (6 meses) |
|---------|-------------------|-------------------|
| Assinantes pagos | 100 | 500 |
| MAU (Monthly Active Users) | 500 | 2,000 |
| Retention D30 | > 40% | > 50% |
| NPS | > 40 | > 50 |
| Cursos vendidos | 50 | 300 |
| Conteudo curado/dia | 20+ items | 50+ items |

---

## 2. Target Audience

### 2.1 Primary Persona — "O Profissional Curioso"

```
Nome: Rafael, 28 anos
Cargo: Desenvolvedor Full Stack, Sao Paulo
Renda: R$ 8-15k/mes
Ingles: Intermediario-avancado (le bem, mas prefere PT)
Comportamento:
  - Segue AI influencers no X mas nao consegue acompanhar tudo
  - Ja tentou comunidades no Discord mas achou bagunca
  - Quer aplicar AI no trabalho mas nao sabe por onde comecar
  - Gastaria R$ 50-100/mes em uma comunidade que valha a pena
JTBD: "Quero me manter atualizado sobre AI sem gastar 2h/dia filtrando conteudo em ingles"
```

### 2.2 Secondary Persona — "O Empreendedor AI-First"

```
Nome: Camila, 34 anos
Cargo: Founder de startup AI, Florianopolis
Renda: R$ 15-30k/mes
Ingles: Fluente
Comportamento:
  - Ja consome conteudo global em ingles
  - Precisa de uma rede de profissionais de AI no Brasil
  - Quer um espaco para compartilhar e recrutar
  - Pagaria premium por acesso a especialistas
JTBD: "Quero encontrar e me conectar com outros builders de AI no Brasil"
```

### 2.3 Tertiary Persona — "O Estudante Dedicado"

```
Nome: Lucas, 22 anos
Cargo: Estudante de Ciencia da Computacao, BH
Renda: R$ 2-4k/mes (estagio)
Ingles: Basico-intermediario
Comportamento:
  - Quer entrar no mercado de AI
  - Precisa de conteudo estruturado (cursos)
  - Sensivel a preco mas investe em educacao
  - Mais ativo em comunidade (posts, perguntas)
JTBD: "Quero aprender AI de forma estruturada e em portugues"
```

---

## 3. Feature Specification

### 3.1 EPIC 1 — Forum & Feed Curado

**Priority: P0 (MVP Core)**

#### 3.1.1 Feed de Conteudo Curado

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Curadoria automatica | Ingestao de conteudo de X, Reddit, docs oficiais via API | P0 |
| Traducao EN↔PT | Traducao automatica com AI (DeepL/GPT) | P0 |
| Toggle bilingual | Usuario alterna entre original (EN) e traduzido (PT) | P0 |
| Source badges | Indicador visual da fonte (X, Reddit, Docs, etc.) | P0 |
| Feed categorizado | Spaces: AI News, LLMs, Computer Vision, NLP, Tools, etc. | P0 |
| Filtros | Por fonte, categoria, data, popularidade | P1 |
| Busca | Full-text search em conteudo curado e user-generated | P1 |

#### 3.1.2 Conteudo User-Generated

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Posts | Texto rico (markdown), imagens, links, code blocks | P0 |
| Comentarios | Threaded comments em posts | P0 |
| Reacoes | Like, save, share | P0 |
| Mencoes | @username em posts e comentarios | P1 |
| Polls | Enquetes simples | P2 |
| Rich text editor | Toolbar com formatacao, code blocks, embeds | P0 |

#### 3.1.3 Spaces (Categorias)

| Space | Descricao | Tipo |
|-------|-----------|------|
| AI News | Feed curado automatico | Curated |
| LLMs & Agents | Claude, GPT, Gemini, open-source | Curated + UGC |
| Coding & Tools | Frameworks, SDKs, ferramentas | UGC |
| Carreira AI | Vagas, transicao, portfolio | UGC |
| Show & Tell | Projetos da comunidade | UGC |
| Off-topic | Conversas gerais | UGC |

---

### 3.2 EPIC 2 — Cursos

**Priority: P0 (MVP Core)**

#### 3.2.1 Course Player

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Video player | Player embarcado (Mux/Bunny) com controles | P0 |
| Modulos e aulas | Estrutura hierarquica: curso > modulo > aula | P0 |
| Progresso | Tracking de progresso por aula/modulo/curso | P0 |
| Velocidade | 0.5x, 1x, 1.25x, 1.5x, 2x | P0 |
| Notas por timestamp | Notas vinculadas ao momento do video | P2 |
| Download (offline) | Download de aulas para assistir offline | P3 |

#### 3.2.2 Tipos de Curso

| Tipo | Modelo | Acesso | Pricing |
|------|--------|--------|---------|
| Perpetuo | Gravado, sempre disponivel | Compra unica | R$ 97 - R$ 497 |
| Lancamento | Gravado + lives exclusivas | Janela de venda | R$ 297 - R$ 997 |
| Mini-curso | Curto, tematico (3-5 aulas) | Gratuito ou pago | Free - R$ 47 |

#### 3.2.3 Certificados

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Certificado de conclusao | PDF gerado automaticamente | P2 |
| Badge no perfil | Badge visivel na comunidade | P2 |
| LinkedIn share | Compartilhar certificado no LinkedIn | P3 |

---

### 3.3 EPIC 3 — Calendario & Eventos

**Priority: P1 (MVP+)**

#### 3.3.1 Eventos

| Tipo | Audiencia | Formato | Frequencia |
|------|-----------|---------|------------|
| Lives abertas | Assinantes forum | YouTube/Meet | 1-2x/semana |
| Office hours | Alunos de cursos | Google Meet/Zoom | 1x/semana por curso |
| Workshops | Assinantes premium | Zoom interativo | 1-2x/mes |
| AMAs | Comunidade | Forum thread | 1x/mes |

#### 3.3.2 Features do Calendario

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Calendar view | Visualizacao mensal/semanal/lista | P1 |
| Agendamento | Criar e agendar eventos | P1 |
| Lembretes | Email + push notification | P1 |
| Google Calendar sync | Adicionar ao Google Calendar | P1 |
| Gravacao | Gravar lives e disponibilizar replay | P2 |
| RSVP | Confirmar presenca | P1 |

---

### 3.4 EPIC 4 — Auth & User Management

**Priority: P0 (MVP Core)**

#### 3.4.1 Autenticacao

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Email/senha | Registro e login basico | P0 |
| OAuth | Google, GitHub, Apple | P0 |
| Magic link | Login sem senha via email | P1 |
| 2FA | Autenticacao de dois fatores | P2 |

#### 3.4.2 Perfil de Usuario

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Avatar + bio | Foto, descricao, links | P0 |
| Roles | Free, Pro, Premium, Admin, Instructor | P0 |
| Stats | Posts, comments, courses, streak, points | P1 |
| Badges | Conquistas visuais | P2 |
| Portfolio | Links para projetos | P3 |

---

### 3.5 EPIC 5 — Billing & Subscriptions

**Priority: P0 (MVP Core)**

#### 3.5.1 Tiers

| Tier | Preco | Acesso |
|------|-------|--------|
| **Free** | R$ 0 | Feed curado (limitado), 1 space, sem cursos |
| **Pro** | R$ 49/mes | Forum completo, todos os spaces, lives, calendario |
| **Premium** | R$ 97/mes | Pro + workshops, office hours, conteudo exclusivo |
| **Curso avulso** | R$ 97-997 | Acesso ao curso comprado (lifetime) |

> Pricing sera validado com dados da pesquisa financeira (Fase 1)

#### 3.5.2 Payment Features

| Feature | Descricao | Priority |
|---------|-----------|----------|
| Stripe Checkout | Pagamento com cartao | P0 |
| PIX | Pagamento instantaneo via PIX | P0 |
| Boleto | Boleto bancario | P2 |
| Subscription management | Upgrade, downgrade, cancel | P0 |
| Trial | 7 dias gratis no Pro | P1 |
| Cupons | Codigos de desconto | P1 |
| Invoices | Nota fiscal automatica | P2 |

---

### 3.6 EPIC 6 — Landing Page & Onboarding

**Priority: P0 (MVP Core)**

#### 3.6.1 Landing Page

| Secao | Conteudo |
|-------|----------|
| Hero | Headline + sub + CTA "Comece gratis" |
| Problema | 3 dores do publico |
| Solucao | Como sinapse.club resolve |
| Features | Cards das features principais |
| Pricing | Tabela de tiers |
| Social proof | Depoimentos, numeros |
| FAQ | Perguntas frequentes |
| CTA final | Formulario de cadastro |

#### 3.6.2 Onboarding

| Step | Acao |
|------|------|
| 1 | Escolher idioma preferido (PT-BR / EN) |
| 2 | Selecionar interesses (LLMs, CV, NLP, Tools, Carreira) |
| 3 | Escolher tier (Free / Pro trial) |
| 4 | Tour guiado (3 steps) |
| 5 | Primeiro post ou curtida |

---

## 4. Technical Requirements (Preview)

> Detalhes completos em `docs/architecture/system-design.md` (Fase 3)

### 4.1 Stack Overview

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | Next.js 15 (App Router) | SSR, RSC, performance, ecosystem |
| Styling | Tailwind CSS 4 | Design system tokens, utility-first |
| UI Library | shadcn/ui + Radix | Acessibilidade, customizavel |
| Backend | Supabase (Postgres + Auth + Realtime) | Rapido para MVP, escalavel |
| Video | Mux ou Bunny.net | HLS streaming, adaptive quality |
| Payments | Stripe | Global, PIX via Stripe BR |
| Translation | DeepL API + GPT-4o fallback | Qualidade + custo |
| Curation | X API v2 + Reddit API + RSS | Fontes de conteudo |
| Search | Supabase Full-Text ou Meilisearch | Search rapido |
| Hosting | Vercel | Edge functions, CDN, preview deploys |
| Email | Resend | Transactional emails |
| Analytics | PostHog | Product analytics, feature flags |

### 4.2 Integrações Externas

| Integracao | Uso | API |
|------------|-----|-----|
| X (Twitter) | Curadoria de threads e posts sobre AI | X API v2 |
| Reddit | Curadoria de r/MachineLearning, r/LocalLLaMA, etc. | Reddit API |
| LLM Docs | Changelogs de OpenAI, Anthropic, Google, Meta | RSS + scraping |
| DeepL | Traducao automatica de alta qualidade | DeepL API |
| GPT-4o | Traducao fallback + summarization | OpenAI API |
| Google Calendar | Sync de eventos | Google Calendar API |
| Stripe | Pagamentos e subscriptions | Stripe API |
| Mux/Bunny | Video hosting e streaming | Mux/Bunny API |
| Resend | Emails transacionais | Resend API |

---

## 5. MVP Scope Definition

### 5.1 IN Scope (MVP v1)

- [x] Landing page com pricing
- [x] Auth (email + Google OAuth)
- [x] Feed curado com traducao EN↔PT
- [x] 3 spaces iniciais (AI News, LLMs, Coding & Tools)
- [x] Posts user-generated com comentarios
- [x] 1 curso perpetuo lancado
- [x] Stripe payments (cartao + PIX)
- [x] 2 tiers (Free + Pro)
- [x] Perfil basico de usuario
- [x] Onboarding flow

### 5.2 OUT of Scope (MVP v1)

- Gamification (leaderboard, badges, streaks)
- Calendar/events
- Certificados
- App mobile nativo
- Notificacoes push
- DMs / messaging
- Polls
- Download offline
- Boleto
- 2FA

### 5.3 MVP Timeline Target

| Semana | Deliverable |
|--------|-------------|
| 1-2 | Auth + DB schema + layout base |
| 3-4 | Forum (feed curado + posts + traducao) |
| 5-6 | Courses (player + modulos + progresso) |
| 7 | Billing (Stripe + tiers) |
| 8 | Landing page + onboarding + polish |

---

## 6. Risks & Dependencies

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| X API rate limits/custos | Curadoria limitada | Cache agressivo + RSS fallback |
| Qualidade de traducao AI | UX ruim | Review humano + DeepL (melhor qualidade) |
| Conversao de free→paid | Revenue | Valor claro no tier pago, trial 7d |
| Churn alto | Revenue | Engagement loops (streaks, notificacoes) |
| Custos de infra video | Margin | Bunny.net (mais barato) + lazy loading |

---

## Appendix

### A. Documentos Relacionados

| Documento | Path | Status |
|-----------|------|--------|
| Competitive Analysis | `docs/prd/research/competitive-analysis.md` | 🔄 In progress |
| Financial Model | `docs/prd/research/financial-model.md` | 🔄 In progress |
| Strategic Positioning | `docs/prd/research/strategic-positioning.md` | 🔄 In progress |
| Design System | `docs/design/design-system/sinapse-club-design-system.md` | ✅ v1 |
| System Architecture | `docs/architecture/system-design.md` | 📋 Planned |
| Database Schema | `docs/architecture/database-schema.md` | 📋 Planned |
| Security Spec | `docs/architecture/security-spec.md` | 📋 Planned |

### B. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-27 | PRD initial draft | @product (Vector) + Imperator |
