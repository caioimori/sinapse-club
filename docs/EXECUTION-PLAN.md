# Plano de Execucao — sinapse.club MVP Launch

> Owner: Imperator (sinapse-orqx)
> Status: ACTIVE
> Created: 2026-03-27
> Target Launch: 2-3 semanas

---

## Estado Atual

### Pronto
- [x] Codigo MVP (6 EPICs, 17 rotas, build clean)
- [x] Supabase project ativo (sa-east-1, 14 tabelas, RLS)
- [x] Design system light-first
- [x] Feed Twitter-style + GitHub integration
- [x] AbacatePay SDK integrado
- [x] 16 docs de projeto

### Pendente para Launch
- [ ] Deploy (coordenar com Soier)
- [ ] Google OAuth configurado no Supabase
- [ ] AbacatePay API key configurada
- [ ] Pipeline de curadoria funcional (X, Reddit, RSS)
- [ ] Conteudo seed no forum
- [ ] Brand identity final (logo, OG image, favicon)
- [ ] Landing page copy final
- [ ] Waitlist / pre-launch campaign
- [ ] Dominio sinapse.club apontando

---

## FASE 1: INFRAESTRUTURA & DEPLOY
**Timeline:** Dias 1-3
**Blocker para tudo**

### 1.1 Coordenar deploy com Soier
- **Lead:** @devops (Gage) + Caio (coordenacao com Soier)
- **Acao:** Decidir se usa o repo do Soier ou cria novo
- **Opcoes:**
  A. Push para o repo do Soier → deploy automatico na Vercel
  B. Criar repo novo → conectar na Vercel do Soier
  C. Transferir Vercel project para conta do Caio
- **Handoff:** Soier entrega acesso ao repo + Vercel → @devops configura env vars
- **Artifact:** Repo URL + Vercel project URL + .env.production configurado
- **Validacao:** `sinapse.club` responde com 200

### 1.2 Configurar Supabase Auth
- **Lead:** @devops (Gage)
- **Acao:**
  - Habilitar Google OAuth no Supabase dashboard
  - Configurar redirect URLs (sinapse.club/auth/callback)
  - Gerar SUPABASE_SERVICE_ROLE_KEY para webhooks
- **Artifact:** Auth providers ativos, redirect URLs corretos
- **Validacao:** Login com Google funciona em producao

### 1.3 Configurar AbacatePay
- **Lead:** @devops (Gage) + Caio (conta AbacatePay)
- **Acao:**
  - Criar conta em abacatepay.com
  - Gerar API key
  - Configurar webhook URL: sinapse.club/api/webhooks/abacatepay
  - Criar products: PLAN-pro (R$49), PLAN-premium (R$97)
- **Artifact:** API key configurada, webhook ativo
- **Validacao:** Billing de teste cria e confirma

### 1.4 Dominio
- **Lead:** @devops (Gage)
- **Acao:** Apontar sinapse.club para Vercel (DNS)
- **Depends on:** 1.1
- **Artifact:** sinapse.club acessivel via HTTPS

---

## FASE 2: BRAND & ASSETS
**Timeline:** Dias 2-5 (paralelo com Fase 1)

### 2.1 Logo e Identidade Visual
- **Lead:** @brand (Meridian)
- **Handoff de:** Design system doc (`docs/design/design-system/`)
- **Acao:**
  - Logo mark (icone sinapse neural)
  - Logotipo (sinapse.club wordmark)
  - Favicon (16x16, 32x32, apple-touch)
  - OG Image (1200x630 para social shares)
- **Artifact:** `/public/logo.svg`, `/public/favicon.ico`, `/public/og-image.png`
- **Handoff para:** @dev (implementar no layout)
- **Validacao:** Logo renderiza no nav, favicon no browser tab, OG image no Twitter card

### 2.2 Brand Voice & Tone
- **Lead:** @brand (Meridian) → @copy (Quill)
- **Handoff de:** Narrative doc (`docs/launch/narrative.md`)
- **Acao:**
  - Revisar e finalizar tagline
  - Tom de voz para posts da comunidade
  - Templates de comunicacao (welcome email, digest)
- **Artifact:** `docs/brand/voice-guide.md`
- **Handoff para:** @content (para criacao de conteudo)

---

## FASE 3: PIPELINE DE CURADORIA
**Timeline:** Dias 3-7
**Core do produto — sem isso nao ha valor**

### 3.1 Setup de fontes
- **Lead:** @dev (Dex) + @architect (Aria)
- **Acao:**
  - Configurar X API v2 (listas curadas de AI influencers)
  - Configurar Reddit API (r/MachineLearning, r/LocalLLaMA, r/ClaudeAI)
  - Configurar RSS feeds (OpenAI blog, Anthropic blog, Google AI, Meta AI)
  - Implementar Supabase Edge Functions para ingestao
  - Configurar pg_cron para execucao periodica
- **Handoff de:** System architecture doc (`docs/architecture/system-design.md`)
- **Artifact:** Edge Functions deployadas, cron jobs ativos
- **Validacao:** Conteudo aparece em `curated_content` table a cada 15-30 min

### 3.2 Pipeline de traducao
- **Lead:** @dev (Dex)
- **Acao:**
  - Integrar DeepL API para traducao EN→PT
  - Batch translate items pendentes
  - Toggle bilingual funcional no feed
- **Depends on:** 3.1
- **Artifact:** `translation_status = 'translated'` para items processados
- **Validacao:** Feed mostra conteudo curado com toggle EN/PT

### 3.3 Publicacao automatica
- **Lead:** @dev (Dex)
- **Acao:**
  - Score de relevancia (simples: likes + engagement do source)
  - Auto-publish items com score > threshold
  - Criar posts no feed a partir de curated_content
- **Depends on:** 3.2
- **Artifact:** Posts curados aparecendo no feed com source badges
- **Validacao:** Feed tem pelo menos 20 items curados por dia

---

## FASE 4: CONTEUDO SEED
**Timeline:** Dias 5-8 (paralelo com Fase 3)

### 4.1 Posts inaugurais
- **Lead:** @content (content-orqx) + Caio
- **Handoff de:** Spaces definidos no DB seed
- **Acao:**
  - 5-10 posts inaugurais por Caio em cada space
  - Welcome post no AI News
  - Thread "Como usar o sinapse.club" (tutorial)
  - Thread "Apresente-se" no Off-topic
- **Artifact:** Posts criados no Supabase via app
- **Validacao:** Feed nao esta vazio quando novos usuarios entram

### 4.2 Perfil do Caio como fundador
- **Lead:** Caio
- **Acao:**
  - Avatar, bio, GitHub conectado
  - Header banner
  - Primeiros posts e replies
  - Mostrar como exemplo de perfil completo
- **Artifact:** Perfil de referencia visivel

---

## FASE 5: LANDING PAGE & SEO
**Timeline:** Dias 6-10

### 5.1 Landing page final
- **Lead:** @copy (Quill) + @dev (Dex)
- **Handoff de:** Landing copy doc (`docs/launch/landing-copy.md`)
- **Acao:**
  - Revisar copy com dados reais (numero de membros, posts)
  - Adicionar OG image e meta tags finais
  - Performance audit (LCP < 2s)
  - Adicionar depoimentos reais (beta users)
- **Artifact:** Landing page live em sinapse.club
- **Validacao:** Lighthouse score > 90

### 5.2 SEO setup
- **Lead:** @growth (Catalyst) + @dev (Dex)
- **Acao:**
  - Sitemap.xml gerado automaticamente
  - robots.txt configurado
  - Structured data (Organization, WebSite)
  - Google Search Console verificado
- **Artifact:** Site indexavel pelo Google
- **Validacao:** `site:sinapse.club` retorna resultados em 1-2 semanas

---

## FASE 6: PRE-LAUNCH
**Timeline:** Dias 8-12

### 6.1 Waitlist / beta fechado
- **Lead:** @growth (Catalyst) + @storytelling (Arc)
- **Acao:**
  - Ativar founder pricing (Pro R$29, Premium R$67)
  - 50 convites beta para early adopters
  - Coletar feedback dos primeiros usuarios
  - Iterar sobre bugs e UX
- **Handoff de:** Growth strategy doc
- **Artifact:** 50 usuarios beta ativos

### 6.2 Social media launch prep
- **Lead:** @content (content-orqx) + @copy (Quill)
- **Acao:**
  - 5 threads para X preparadas
  - 3 posts LinkedIn preparados
  - 5 carrosseis Instagram preparados
  - Email de launch para waitlist
- **Depends on:** 6.1 (precisa de depoimentos beta)
- **Artifact:** Content calendar com 2 semanas de conteudo

---

## FASE 7: LAUNCH
**Timeline:** Dia 14+

### 7.1 Soft launch
- **Lead:** Imperator (orquestracao) + Caio (execucao)
- **Acao:**
  - Abrir waitlist completa
  - Publicar thread de lancamento no X
  - Post no LinkedIn
  - Email para lista
- **Artifact:** sinapse.club aberto para o publico

### 7.2 Monitoramento pos-launch
- **Lead:** @growth (Catalyst) + @dev (Dex)
- **Acao:**
  - Monitorar signups, DAU, retention
  - Fix bugs criticos em < 24h
  - Responder feedback da comunidade
- **Metricas alvo (semana 1):**
  - 200 signups
  - 30 Pro subscribers
  - 50 posts/dia (curado + UGC)

---

## Mapa de Handoffs

```
FASE 1 (Infra)              FASE 2 (Brand)            FASE 3 (Pipeline)
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│ @devops          │        │ @brand           │       │ @dev             │
│ + Soier (deploy) │        │ (logo, assets)   │       │ (curation funcs) │
│ + Caio (contas)  │        │       │          │       │ + @architect     │
└────────┬─────────┘        │       ▼          │       └────────┬─────────┘
         │                  │ @copy (voice)    │                │
         │                  └────────┬─────────┘                │
         │                           │                          │
         ▼                           ▼                          ▼
FASE 4 (Seed)               FASE 5 (Landing)          FASE 6 (Pre-launch)
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│ @content + Caio  │        │ @copy + @dev     │       │ @growth          │
│ (posts inaugurais│        │ @growth (SEO)    │       │ @storytelling    │
│  perfil fundador)│        │                  │       │ @content         │
└─────────────────┘        └─────────────────┘       └────────┬─────────┘
                                                              │
                                                              ▼
                                                     FASE 7 (Launch)
                                                     ┌─────────────────┐
                                                     │ Imperator        │
                                                     │ + Caio           │
                                                     │ + @growth        │
                                                     └─────────────────┘
```

---

## Decisoes Pendentes (Caio)

| # | Decisao | Contexto | Urgencia |
|---|---------|----------|----------|
| 1 | Como integrar com repo do Soier? | Ele tem Vercel + repo, precisamos alinhar | BLOCKER |
| 2 | Conta AbacatePay existe? | Precisamos da API key | Fase 1 |
| 3 | Dominio sinapse.club ja comprado? | DNS pointing | Fase 1 |
| 4 | Google OAuth client ID | Criar em console.cloud.google.com | Fase 1 |
| 5 | DeepL API key | Para traducao do pipeline | Fase 3 |
| 6 | X API access | Para curadoria de tweets | Fase 3 |
| 7 | Quem sao os 50 beta testers? | Lista de early adopters | Fase 6 |

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-27 | Initial execution plan | Imperator |
