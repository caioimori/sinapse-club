# Auditoria de Capacidade & Custo — Supabase + Vercel

**Projeto:** sinapse.club (fórum Next.js 16 + Supabase)
**Data:** 2026-04-22
**Contexto:** Soft launch iminente · audiência @caioimori · monetização R$29,90/ano
**Stack auditada:** Next.js 16 (App Router, RSC) na Vercel + Supabase (Postgres + Auth + Storage + 3 Edge Functions) + Upstash Redis (rate limit) + Sentry + Vercel Analytics

---

## TL;DR — Recomendação Executiva (5 linhas)

1. **Fica em Supabase Free + Vercel Hobby até ~500 usuários ativos/mês.** Gratuito, aguenta o soft launch tranquilo.
2. **No primeiro sinal de tração real (>500 MAU OU qualquer pico de tráfego vindo do Twitter), sobe Supabase Pro (US$25) e Vercel Pro (US$20).** Total: ~R$230/mês. Isso cobre até ~10k MAU sem stress.
3. **NÃO migre nada agora.** Migrar Supabase→Neon ou Vercel→Cloudflare custa 2-4 semanas de trabalho e você ainda não sabe se tem problema. Portabilidade é ótima, mas otimização prematura é pior.
4. **O risco financeiro maior não é o preço base — é bandwidth/egress em pico viral.** Vercel cobra US$0,15/GB acima de 1TB. Um post bombando com imagens pode custar R$500 num dia ruim. Mitigação: usar CDN de imagens agressivamente (já configurado para Supabase Storage).
5. **Gatilho de migração para Cloudflare/Neon: custo mensal passar de R$1.500 com <5k assinantes pagos.** Aí vale a pena. Antes disso, o tempo de engenharia vale mais que a economia.

---

## 1. Como Funciona o Bolso — Entendendo Antes dos Números

Antes dos números, 3 conceitos que explicam 90% dos custos de infra:

### 1.1. **Conexão de banco ≠ usuário**
Quando um usuário abre a home do fórum, o servidor abre uma **conexão** com o Postgres, pega os dados, fecha. Cada conexão consome memória no banco (~10MB). Um Postgres pequeno aguenta ~60 conexões simultâneas. **O limite não é quantos usuários você tem — é quantos estão carregando página ao mesmo tempo.**

**Por isso existe o "pooler" (PgBouncer/Supavisor):** é um porteiro que pega 1000 requisições e distribui em 60 conexões reais. Supabase já vem com isso ligado. Sem pooler, você quebra com 50 usuários simultâneos. Com pooler, aguenta 1000+.

**Analogia:** conexão é mesa de restaurante, pooler é o maitre que faz todo mundo rodar rápido. Sem maitre, o salão vira fila.

### 1.2. **MAU (Monthly Active Users) ≠ usuários totais**
Supabase cobra Auth por MAU — usuário que fez login no mês. Usuário cadastrado que não voltou não conta. **Um fórum com 10.000 cadastros mas 2.000 que logaram no mês = 2.000 MAU.**

Free: 50.000 MAU. Pro: 100.000 MAU. Excedente: US$0,00325/MAU (R$0,016).

### 1.3. **Bandwidth (egress) é o bandido silencioso**
Toda vez que um usuário vê uma imagem ou carrega a página, bytes saem do seu servidor. Vercel Hobby dá 100GB/mês. Pro dá 1TB. **Se um post viraliza no Twitter com screenshot pesado, você pode queimar 100GB em 2h.**

Exemplo real: um post com imagem de 500KB, visto 200k vezes = 100GB. Um tweet viral gera isso tranquilo.

### 1.4. **Function invocations = cada request dinâmico**
No Next.js, toda rota que não é estática (qualquer coisa com dados do banco) conta como invocação de função. Home do fórum, feed, notificações — cada pageview é 1+ invocações. **1 usuário ativo = ~50 invocações/dia típicas em fórum.**

---

## 2. Capacidade Atual — Onde Você Quebra Primeiro

### 2.1. Diagnóstico do stack atual

Auditando seu código, encontrei:

| Componente | Situação | Carga esperada |
|---|---|---|
| Supabase Postgres | Free tier (ou Pro se já migrou) | Queries normais + 22 migrations + triggers de XP/reputação |
| Supabase Realtime | **Não está em uso ativo** (grepei `.channel(`, achei zero subscriptions reais) | Custo zero de realtime |
| Supabase Auth | OAuth GitHub + Google + email | 1 MAU por login/mês |
| Supabase Storage | Avatares + uploads de post | Bandwidth é o risco |
| Vercel Next.js 16 | App Router, RSC, middleware com CSP nonces | Cada pageview dinâmico = 1 function call |
| Upstash Redis | Rate limit (já configurado) | Free tier: 10k comandos/dia (suficiente) |
| Sentry | Monitoring condicional (só se DSN setado) | Free: 5k errors/mês |
| Edge Functions | `curate-rss`, `translate-content`, `publish-curated` | Cron de curadoria — poucas invocações/dia |

**Boa notícia:** você NÃO usa realtime subscriptions (Postgres Changes), que é o item mais caro do Supabase. Usa polling via React Query, que é barato e escalável. Decisão técnica ótima pro seu perfil de custo.

### 2.2. Quando cada camada quebra

| Camada | Limite Free | Quebra em | Sintoma |
|---|---|---|---|
| **Supabase DB storage** | 500 MB | ~50k posts com texto médio + 10k usuários | Operação escrita falha, site fica read-only |
| **Supabase MAU** | 50.000 | Nunca no soft launch | Auth começa a cobrar overage |
| **Supabase bandwidth** | 5 GB/mês | ~100k pageviews com imagens pequenas | Cobra US$0,09/GB |
| **Supabase conexões** | 60 diretas / 200 pooler | Traffic burst de ~300 req/s simultâneos | Erro `too many connections` |
| **Supabase compute (Micro)** | 2 vCPU shared, 1GB RAM | Query lenta sob ~50 req/s sustained | Latência sobe, timeouts |
| **Vercel bandwidth** | 100 GB/mês | ~200k pageviews COM imagens, ou 2M pageviews de texto puro | Site derruba no Hobby, cobra overage no Pro |
| **Vercel invocations** | 1M/mês | ~20k MAU com uso típico (50 inv/usuário/dia) | Cobra overage |
| **Upstash Redis Free** | 10k cmd/dia | ~5k usuários únicos ativos/dia | Rate limit deixa de funcionar |

### 2.3. **Onde quebra PRIMEIRO**

Pra um fórum com seu padrão de uso (leitura dominante, escrita moderada, imagens em posts):

1. **Vercel bandwidth Hobby (100GB)** — quebra antes de tudo se tiver qualquer spike.
2. **Supabase Storage bandwidth Free (5GB)** — segundo gargalo, imagens em posts populares.
3. **Supabase DB conexões** — só se tiver pico concorrente >300 req/s.

**Gatilhos pra fazer upgrade (ordem de prioridade):**
- Atingiu 70GB de bandwidth Vercel num mês → sobe pra Pro IMEDIATAMENTE (evita site cair)
- Passou de 500 MAU ou R$1.500/mês de receita → sobe tudo pra Pro, libera dor de cabeça
- Qualquer erro de "too many connections" no Sentry → sobe Supabase Pro (vem com Small compute)

---

## 3. Tabela de Custos por Estágio

Valores em **R$/mês**, câmbio US$1 = R$5,80. Inclui overage realista (não só o base).

### 3.1. Stack atual (Supabase + Vercel)

| Estágio | Supabase | Vercel | Upstash | Sentry | Total R$/mês |
|---|---|---|---|---|---|
| **0-100 usuários** (soft launch) | Free (R$0) | Hobby (R$0) | Free | Free | **R$0** |
| **100-1.000 usuários** | Free ainda aguenta se sem viralizada | Hobby arrisca (bandwidth) | Free | Free | **R$0-50** se pico |
| **1k-10k MAU** | Pro US$25 = R$145 | Pro US$20 = R$116 + ~R$30 overage | Free (ainda) | Free | **R$290-350** |
| **10k-50k MAU** | Pro + compute Small US$15 + bandwidth ~R$60 = R$260 | Pro + 2TB overage R$200 = R$316 | Pay-as-you-go R$20 | R$150 (Team tier) | **R$750-900** |
| **50k-200k MAU** | Pro + Large compute US$110 + overages ~R$400 = R$1000 | Pro + 5TB = R$580 | R$60 | R$300 | **R$1.900-2.400** |
| **200k+ MAU** | Team US$599 base + overages = R$4.500 | Enterprise (custom, ~R$3.000+) | R$150 | R$500 | **R$8.000+** |

**Observação crítica:** o salto grande é entre 10k-50k MAU. É onde você precisa começar a otimizar queries, cachear agressivamente, usar CDN de imagens. Antes disso, é "paga e vive".

### 3.2. Custo por assinante pago (sanity check de margem)

Assinatura: R$29,90/ano = R$2,49/mês por usuário pago.

Supondo taxa de conversão de 5% (fórum paywall hard):

| MAU | Pagantes (5%) | Receita/mês | Custo infra | Margem |
|---|---|---|---|---|
| 1.000 | 50 | R$124 | R$0-50 | Positivo |
| 10.000 | 500 | R$1.245 | R$350 | 72% |
| 50.000 | 2.500 | R$6.225 | R$900 | 86% |
| 200.000 | 10.000 | R$24.900 | R$2.400 | 90% |

**Infra não é o problema da margem — conversão é.** Se a taxa de conversão for 2% em vez de 5%, em 1k MAU você tá no prejuízo. Foco do Caio deve ser conversão, não economia de infra no soft launch.

---

## 4. Alternativas de Mercado — Didático

### 4.1. Alternativas de Banco (Postgres)

#### **Neon** ⭐ (principal alternativa)
- **O que é:** Postgres serverless. Compute escala a zero quando ninguém usa (paga zero entre requests).
- **Preço:** Free 0.5GB, Launch plan US$19 (=R$110), Scale US$69.
- **Vantagem específica pro seu caso:** fórum tem tráfego irregular (picos quando Caio posta no Twitter, morto de madrugada). Scale-to-zero economiza real. Migração de Supabase→Neon é ~2-4 dias (é Postgres puro, RLS policies portam 100%).
- **Desvantagem:** você PERDE Auth, Storage, Edge Functions do Supabase. Teria que substituir: Auth.js/Clerk (US$25/mês), Cloudflare R2 ou Backblaze (Storage), Vercel Functions (já tem).
- **Quando migra:** quando custo Supabase passar R$800/mês E você usar <30% dos serviços adjacentes (Auth/Storage/Edge). Hoje você usa tudo = Supabase compensa.

#### **Railway**
- **O que é:** Postgres gerenciado simples, pay-per-use (CPU + RAM + storage separados).
- **Preço:** ~US$5 base + uso. Típico US$20-50/mês em apps pequenos.
- **Vantagem:** transparência total de custo (você vê CPU/RAM).
- **Desvantagem:** não tem Auth/Storage integrados. Replica = pago separado. Menos "platform", mais "infra crua".
- **Quando faz sentido:** nunca pra você agora. Faz sentido se você quiser controle fino e estiver disposto a operar mais.

#### **Render**
- **Similar a Railway**, preço parecido, menos hype. Postgres a partir de US$6. Mesma desvantagem.

#### **Fly.io**
- **Postgres em VM Fly Machines.** Controle total. US$0 free tier small, ~US$20/mês pequeno.
- **Vantagem:** latência global (edge). Desvantagem: você administra replicas, backups, tuning. **Não é pra você.**

#### **PlanetScale**
- **Ignorar.** Removeu free tier em 2024, mínimo US$39/mês, e é MySQL/Vitess — migração do Postgres é trabalho alto. Só vale pra quem precisa de sharding extremo (milhões de usuários).

#### **Self-hosted Postgres (Hetzner/DigitalOcean)**
- **Preço:** VPS US$5-20/mês aguenta fácil 10k MAU se bem configurado.
- **Vantagem:** 10x mais barato que Supabase no mesmo escalão.
- **Desvantagem:** VOCÊ opera. Backup? Seu. Upgrade de versão? Seu. Security patch? Seu. Replica em caso de falha? Seu. **Pra um builder que não é dev, é suicídio operacional.** Só vale se tiver um sócio SRE dedicado.

### 4.2. Alternativas de Hosting (substitui Vercel)

#### **Cloudflare Pages + Workers** ⭐ (principal alternativa)
- **Preço:** Pro plano US$5/mês flat (não é per-user). **Bandwidth ILIMITADO e sem custo.**
- **Vantagem matadora:** no cenário 10k-50k MAU, você economiza ~R$300/mês só de bandwidth.
- **Desvantagem crítica pro seu caso:** **Next.js 16 App Router + RSC tem edge cases no Cloudflare.** O adapter `@opennextjs/cloudflare` melhorou muito, mas features novas do Next 16 (turbo, algumas APIs do RSC) podem quebrar. Migração = 1-2 semanas de debug + testar tudo.
- **Quando migra:** quando bandwidth Vercel passar de R$400/mês sustained. Antes disso, tempo > economia.

#### **Netlify**
- **Preço:** Pro US$19/user/mês. Similar ao Vercel mas ligeiramente mais barato em overage (US$55/100GB banda extra vs US$150/TB Vercel — mas Vercel inclui 1TB no Pro).
- **Vantagem:** nenhuma significativa sobre Vercel pra Next.js.
- **Desvantagem:** suporte a Next.js sempre um passo atrás da Vercel.
- **Recomendação:** não migrar.

#### **Railway/Render (Next.js em container)**
- **Preço:** US$5-30/mês típico.
- **Vantagem:** tudo num lugar só (app + DB).
- **Desvantagem:** você perde edge network, otimizações Next.js, Vercel Analytics integrado. Latência pior pra usuário BR.
- **Recomendação:** não migrar.

#### **Coolify self-hosted + VPS**
- **Preço:** US$5-20 VPS + 0 software.
- **Vantagem:** controle total, custo mínimo.
- **Desvantagem:** operação. Mesma lógica do self-hosted Postgres: **não é pra você**.

### 4.3. Matriz de decisão

| Cenário | Stack recomendada | Custo/mês |
|---|---|---|
| Soft launch (hoje) | Supabase Free + Vercel Hobby | R$0 |
| Tração inicial (500-5k MAU) | Supabase Pro + Vercel Pro | R$260-350 |
| Crescimento (5k-20k MAU) | Supabase Pro + Vercel Pro + overages | R$400-700 |
| Escala provada (20k+ MAU) | **Migrar hosting pra Cloudflare**, manter Supabase Pro | R$500-1.000 |
| Hyperscale (100k+ MAU) | **Avaliar split:** Neon+Clerk+Cloudflare+R2 | R$2.000-4.000 |

---

## 5. Riscos Específicos do Seu Fórum

### 5.1. Realtime / Subscriptions
**Status:** não usa. Você faz polling via React Query (requests periódicos). Isso é bom — realtime subscriptions no Supabase são o item mais caro e com maior lock-in. **Mantém assim**. Se um dia precisar (chat ao vivo, notificações push), reavalia.

### 5.2. OAuth / Auth
**Status:** GitHub + Google OAuth rodando no Supabase Auth. Lock-in: **médio**.
- Se migrar pra Clerk ou Auth.js, usuários existentes precisam re-autenticar (OAuth tokens não portam entre provedores).
- Banco de perfis (`profiles` table) porta fácil — é Postgres puro.
- **Mitigação:** faça migração Auth ANTES de ter muitos usuários, ou nunca. Em 50k MAU, forçar re-login quebra churn.

### 5.3. RLS Policies
**Status:** 22 migrations com RLS extenso (tiers, paywall, reputação). Portabilidade: **alta**.
- RLS é padrão Postgres, qualquer Postgres (Neon, Railway, self-hosted) executa as policies idênticas.
- Edge Functions do Supabase (`curate-rss`, `translate-content`) são Deno, NÃO portam direto pra Vercel Functions (que são Node). Seriam ~2 dias de reescrita.

### 5.4. Storage de imagens
**Status:** Supabase Storage com CDN nativo. Bandwidth conta separado do DB.
- Alternativa mais barata em escala: **Cloudflare R2** (zero egress fees) + Supabase só pra metadados. Migração: 1-2 dias.
- **Quando migrar:** quando bandwidth Storage Supabase passar R$200/mês sustained.

### 5.5. Risco viral (o maior)
Caio tem audiência @caioimori em crescimento. **Um tweet bombando pode gerar 500k pageviews em 24h.** Simulação:
- 500k pageviews × 300KB/pageview médio (HTML + imagens + JS) = **150GB num dia**.
- Vercel Hobby: **site cai** (passa os 100GB/mês em um dia).
- Vercel Pro: continua rodando, cobra R$150 de overage. **Aceitável**.
- **Ação:** antes de qualquer push grande de marketing, ESTEJA no Pro. Custo de R$260/mês vs risco de site fora do ar no dia mais importante = decisão óbvia.

---

## 6. Plano de Ação — 3 Fases

### Fase 1 — AGORA (soft launch, próximos 30 dias)
- [x] **Manter stack atual** (Free tiers). Zero custo, plataforma pronta aguenta.
- [ ] **Configurar alertas**: Vercel Dashboard → 70% bandwidth; Supabase → 70% DB storage; Sentry → errors spike.
- [ ] **Verificar compressão de imagens**: em Next.js 16 o `next/image` com `remotePatterns` do Supabase já entrega WebP automaticamente — conferir que está em uso em TODOS os uploads de usuários.
- [ ] **Decidir com Matheus:** quem paga o Pro quando migrar? (Relevante pois Vercel/domínio é dele.)

### Fase 2 — Primeiro sinal de tração (>500 MAU OU pré-push de marketing)
- [ ] **Subir Supabase → Pro** (US$25 = R$145). Libera compute Small, 8GB DB, pooler robusto.
- [ ] **Subir Vercel → Pro** (US$20 = R$116). Libera 1TB bandwidth, 1M invocations, sem risco de queda viral.
- [ ] **Custo total:** R$260/mês. Aguenta até ~10k MAU sem pensar.

### Fase 3 — Quando custo passar R$1.500/mês (provavelmente 20k+ MAU)
- [ ] Auditar onde está queimando: bandwidth? Compute DB? Functions? Sentry descobre.
- [ ] **Se bandwidth**: migrar hosting pra Cloudflare Pages + adapter `@opennextjs/cloudflare`. Economia ~R$400/mês em 20k MAU.
- [ ] **Se DB**: avaliar Neon scale-to-zero OU Supabase Team (US$599) dependendo de uso de Auth/Storage.
- [ ] **Se Storage bandwidth**: migrar assets pra Cloudflare R2, Supabase só pra metadados.

---

## 7. Resumo Didático — "Por que não migrar agora?"

Três razões claras:

1. **Migração custa tempo, não só dinheiro.** 2-4 semanas de trabalho pra economizar R$300/mês significa só faz sentido se você JÁ está pagando muito. Hoje você paga zero.

2. **Você ainda não sabe onde vai quebrar.** Otimizar pra gargalo hipotético é desperdício. Espera o dado real.

3. **Supabase tem um combo que nenhuma alternativa replica em 1 lugar.** DB + Auth + Storage + Edge Functions + Realtime + Dashboard visual. Migrar = Frankenstein de 4 providers. Só faz sentido se o combo específico Supabase estiver custando desproporcional ao que você usa dele.

**Regra prática:** enquanto você estiver usando 3+ serviços do Supabase ativamente E custo < R$800/mês, fica. Quando um dos dois deixar de ser verdade, avalia split.

---

## Fontes Consultadas

- [Supabase Pricing & Fees](https://supabase.com/pricing)
- [Supabase Compute and Disk Docs](https://supabase.com/docs/guides/platform/compute-and-disk)
- [Supabase Pricing 2026 — Complete Breakdown (Metacto)](https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance)
- [Supabase Pricing at 10K-100K Users (DesignRevision)](https://designrevision.com/blog/supabase-pricing)
- [Vercel Pricing Plans](https://vercel.com/pricing)
- [Vercel Fluid Compute Pricing](https://vercel.com/docs/functions/usage-and-pricing)
- [Vercel Pricing Breakdown 2026 (DeployHandbook)](https://deployhandbook.com/pricing/vercel)
- [Neon vs Supabase (Bytebase)](https://www.bytebase.com/blog/neon-vs-supabase/)
- [Neon vs Supabase vs PlanetScale for Next.js 2026 (Dev.to)](https://dev.to/whoffagents/neon-vs-supabase-vs-planetscale-managed-postgres-for-nextjs-in-2026-2el4)
- [Cloudflare Workers & Pages Pricing](https://www.cloudflare.com/plans/developer-platform/)
- [Vercel vs Cloudflare Pages Edge Deployment 2026 (Contra Collective)](https://contracollective.com/blog/vercel-vs-cloudflare-pages-edge-deployment-2026)
- [Next.js on Cloudflare vs Vercel (Dev.to)](https://dev.to/dev_tips/nextjs-on-cloudflare-vs-vercel-why-pretty-deploys-dont-scale-2m9a)
