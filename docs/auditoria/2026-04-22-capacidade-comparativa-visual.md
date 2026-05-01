# Auditoria de Capacidade — Visao Panoramica Comparativa

**Projeto:** sinapse.club (forum Next.js 16 + Supabase)
**Data:** 2026-04-22
**Complemento de:** `2026-04-22-capacidade-supabase-vercel.md`
**Objetivo:** Panorama do mercado de infra — Caio bate o olho e entende onde cada player se encaixa, quanto custa crescer, o que trava pra migrar, e quando agir.

---

## Legenda de status (usada em varias tabelas)

| Emoji | Significado pro caso Caio |
|---|---|
| OK | Recomendado agora ou candidato solido |
| DEPOIS | Avaliar so quando escalar / condicional |
| EVITAR | Nao faz sentido pro perfil do Caio |
| N/A | Nao aplicavel ou fora do escopo |

---

## 1. Banco de Dados — Supabase vs 9 alternativas

### O que esta tabela mostra
Compara Supabase com os 9 principais players de Postgres gerenciado (mais 1 self-hosted). As colunas foram escolhidas pra responder perguntas que **realmente pesam no bolso de um forum pequeno-medio**: quanto aguenta no free, quanto custa o primeiro plano pago, se tem Auth/Storage/Realtime embutidos (pra voce nao virar Frankenstein de 5 providers), e o quao travado voce fica no produto.

| Provider | Free tier | Pro/mes (base) | Conexoes simultaneas | Storage incluso | Bandwidth | Realtime? | Auth? | RLS/Postgres puro? | Escala a zero? | Lock-in | Nota (1-10) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Supabase** | 500MB DB, 50k MAU, 5GB bw, 2 projetos | US$25 | 60 diretas / 200 pooler | 8GB | 250GB | Nativo | Nativo (GitHub/Google/+) | Sim (Postgres puro + RLS) | Nao (sempre ligado) | Medio (Auth+Storage+Edge) | **9** |
| **Neon** | 0.5GB, 1 projeto, auto-suspend | US$19 (Launch) | Pooler ilimitado | 10GB | Incluso generoso | Nao nativo | Nao | Sim (Postgres puro) | **Sim** (pausa em 5min idle) | Baixo (so DB) | **8** |
| **Railway** | Trial US$5 credito | Pay-per-use (~US$5-20) | Limite via RAM do plano | Conforme plano | Conforme plano | Nao | Nao | Sim | Nao | Baixo | **6** |
| **Render** | Postgres US$6 (nao tem free real) | US$7-19 | Conforme plano | 1-10GB | Incluso | Nao | Nao | Sim | Nao | Baixo | **5** |
| **Fly.io** | Creditos iniciais, Machines small | ~US$20 pequeno | Configuravel | Configuravel | Incluso | Nao | Nao | Sim (Fly Postgres e Postgres puro) | Sim (scale-to-zero Machines) | Baixo (mas voce opera) | **5** |
| **Xata** | 15GB, 3 branches | US$20 (Pro) | Serverless (sem limite rigido) | 15GB | Incluso | Limitado | Nao | **Nao** (Postgres por tras mas API propria) | Sim | **Alto** (API Xata) | **4** |
| **Turso** | 500 DBs, 9GB total, 1 bilhao reads/mes | US$29 | Edge replicas | 24GB | Incluso | Via sync | Nao | **Nao** (SQLite/libSQL, nao Postgres) | Nao aplica | **Alto** (migrar Postgres→SQLite) | **3** pro Caio |
| **PlanetScale** | Removeu free em 2024 | US$39 (minimo) | Ilimitado (Vitess) | 10GB | Incluso | Nao | Nao | **Nao** (MySQL/Vitess) | Nao | Alto (MySQL) | **2** pro Caio |
| **AWS RDS** | 12 meses free (t2.micro) | US$15-30 tipico pequeno | Conforme instance | Conforme | Cobra egress | Nao | Nao | Sim | Nao | Baixo (vendor AWS) | **4** |
| **Self-host Hetzner** | N/A (VPS custa) | US$5 (CX22) a US$20 | Voce define | Voce define | 20TB inclusos | Nao | Nao | Sim | Nao | **Zero** | **3** (operacao > economia) |

### O que isso significa pro Caio
Tres coisas saltam:

1. **Supabase ganha no "combo"**: e o unico que da DB + Auth + Storage + Realtime + Edge Functions num preco fixo. Todos os outros voce monta a mao. Pra quem nao e dev, isso vale ouro.
2. **Neon e o unico concorrente serio pra o seu caso**: Postgres puro, escala a zero (paga menos quando ninguem usa), migracao e limpa. Fica como Plano B quando Supabase passar de R$800/mes E voce estiver usando pouco de Auth/Storage.
3. **Xata, Turso, PlanetScale nao servem**: ou mudam a API (trabalho alto) ou mudam o banco (MySQL/SQLite). So considerar em casos extremos de escala que voce nao vai ter.

---

## 2. Hosting — Vercel vs 6 alternativas

### O que esta tabela mostra
Onde seu Next.js 16 roda. Foco em colunas que matam forum com picos virais: bandwidth incluso (o maior risco), preco do overage (o que acontece quando bombar), suporte nativo a Next.js 16 (que e bleeding edge), e preview deploys (voce usa muito).

| Provider | Free tier | Pro/mes | Bandwidth incluso | Function invocations | Build minutes | Edge global? | Next.js 16 first-class? | Preview deploys | Overage bandwidth | Nota |
|---|---|---|---|---|---|---|---|---|---|---|
| **Vercel** | 100GB bw, 1M inv, 6000 build min | US$20/seat | 1TB | 1M (Pro: 1M incluso, apos pay) | 6000 (Pro) | Sim | **Sim** (mantem o framework) | Ilimitado | US$0,15/GB apos 1TB | **9** |
| **Cloudflare Pages** | 500 builds/mes, bw ilimitado | US$5 flat (Workers Paid) | **Ilimitado** | 10M/dia Pages Functions | 500/mes (Pro 5000) | Sim (310+ cidades) | Parcial (via @opennextjs/cloudflare, melhorando rapido) | Ilimitado | **Zero** | **8** (se adapter maduro) |
| **Netlify** | 100GB bw, 125k inv, 300 build min | US$19/seat | 1TB | 2M | 25000 | Sim | Um passo atras do Vercel | Ilimitado | US$55/100GB | **6** |
| **Railway** | Trial US$5 | Pay-per-use | Nao limitado (cobra egress) | Container 24/7 | Build gratis | Nao (1 regiao) | Sim (container) | Sim | Inclui no uso | **5** |
| **Render** | Static Sites free, Web Service US$7 | US$7-25 | 100GB free, apos US$10/100GB | Container 24/7 | Inclui | Nao (multi-regiao limitado) | Sim (container) | Sim | US$10/100GB | **5** |
| **Fly.io** | Small Machines free credits | ~US$5-15 | Incluso 160GB apos paga | Machines sob demanda | Inclui | Sim (regiao edge) | Sim (container) | Via CLI | US$0,02/GB | **5** |
| **Coolify + Hetzner** | N/A | US$5 (VPS) | 20TB incluso Hetzner | Voce opera | Local | Nao | Sim (Node nativo) | Configuravel | Zero | **3** (operacao > economia) |

### O que isso significa pro Caio
Duas opcoes serias pro Caio na vida real:

1. **Vercel** agora — paga pelo casamento com Next.js 16. Todo release novo do framework funciona no primeiro dia. Pra quem nao tem tempo de debugar adapter, isso e o produto.
2. **Cloudflare Pages** depois — quando bandwidth virar problema (>R$400/mes sustained em overage Vercel), o salto economico e brutal porque bandwidth e **zero**. Unico catch: adapter `@opennextjs/cloudflare` evolui rapido mas ainda tem edge cases em features novas do Next 16. Migracao = 1-2 semanas de validacao.

Resto (Netlify, Railway, Render, Fly, Coolify) nao oferecem vantagem suficiente pra trocar.

---

## 3. Cenarios de Crescimento — Custo mensal por estagio

### O que esta tabela mostra
Pega o mesmo volume de usuarios ativos/mes e compara 4 stacks lado-a-lado. **Receita** assume conversao de 5% em assinatura R$29,90/ano = R$2,49/mes por pagante. **Margem** e `(Receita - Custo) / Receita`. Valores em R$/mes (US$1 = R$5,80).

| MAU | Stack ATUAL (Supa Free + Vercel Hobby) | Stack PRO (Supa Pro + Vercel Pro) | Stack CLOUDFLARE+NEON (CF Pages + Neon Launch + Clerk) | Stack SELF-HOST (Hetzner CX22 + Supabase self-host) | Receita (5% conv) | Margem Stack PRO |
|---:|---|---|---|---|---:|---:|
| 100 | R$0 | R$260 | R$200 | R$30 (VPS) + seu tempo | R$12 | **Prejuizo** |
| 1.000 | R$0-50 (arrisca overage) | R$260 | R$260 (Neon Launch R$110 + Clerk R$145 + CF R$29) | R$30 + tempo | R$124 | **Prejuizo** (~R$130) |
| 5.000 | Quebrado (bw Vercel) | R$290 | R$290 | R$60 + tempo | R$623 | **54%** |
| 10.000 | Quebrado | R$350 | R$320 | R$80 + tempo | R$1.245 | **72%** |
| 50.000 | N/A | R$900 | R$650 | R$180 + SRE caro | R$6.225 | **86%** |
| 100.000 | N/A | R$1.600 | R$1.100 | R$400 + SRE | R$12.450 | **87%** |

### O que isso significa pro Caio
1. **Em 100-1k MAU todas as stacks dao prejuizo se voce pagar Pro cedo demais.** Fica no Free ate 500+ MAU.
2. **Entre 5k-10k MAU voce entra em margem verde robusta** (>70%) — e aqui que o produto comeca a "se pagar".
3. **Split Cloudflare+Neon so paga o trabalho de migrar a partir de 50k MAU** (economia de R$250/mes). Antes disso, o delta nao justifica 2-4 semanas de obra.
4. **Self-host e enganoso**: o custo em R$ e baixissimo, mas sem SRE dedicado, 1 incidente de 12h devora qualquer economia anual. Infra nao e o problema, operacao e.

---

## 4. Lock-in e Esforco de Migracao

### O que esta tabela mostra
Quando voce muda de provider, algumas coisas portam sozinhas e outras precisam ser reescritas. Esta tabela estima **semanas de trabalho real** e **risco** (probabilidade de algo quebrar em producao).

| De | Para | Porta facil (copia e cola) | Quebra / precisa reescrever | Semanas | Risco |
|---|---|---|---|---:|---|
| Supabase DB | Neon | Schema SQL, 22 migrations, RLS policies, triggers | Nada no DB | 0.5 | Baixo |
| Supabase Auth | Clerk / Auth.js | Tabela `profiles` | OAuth tokens (usuarios re-logam), cookies, middleware auth, RLS com `auth.uid()` | 2 | **Medio-Alto** (churn de re-login) |
| Supabase Storage | Cloudflare R2 | URLs nos posts (script) | Upload handlers, policies de bucket, transformacao de imagem | 1 | Baixo |
| Supabase Edge Functions | Vercel Functions | Logica de negocio | Runtime Deno → Node, imports, crons | 0.5 | Baixo |
| Vercel | Cloudflare Pages | Codigo Next.js | Features bleeding-edge do Next 16 (RSC cache, turbo), middleware edge, Analytics | 1-2 | **Medio** |
| Vercel | Netlify | Codigo Next.js | Adapter proprio, features novas atrasadas | 1 | Medio |
| Stack Supabase completo | Neon + Clerk + R2 + Vercel Fns | DB | Tudo acima somado | **4-6** | **Alto** |
| Supabase | Self-host Supabase | DB + tudo (e o mesmo software) | Voce assume operacao, backups, upgrades | 2 (setup) + infinito | **Muito alto** |

### O que isso significa pro Caio
1. **Supabase nao e armadilha**: o DB em si tem lock-in zero (Postgres puro). O custo real de sair e Auth e Storage.
2. **Auth e o ponto mais caro de migrar**: forcar usuarios a re-logar em escala (>10k MAU) machuca retencao. Decisao: ou migra Auth cedo (baixo volume) ou nunca.
3. **Migracao total de stack = 4-6 semanas de um dev experiente.** So faz sentido se economia anual passar R$10k. Hoje voce paga R$0. Nao migra.

---

## 5. Matriz de Decisao — Quando migrar?

### O que esta tabela mostra
Gatilhos **concretos e mensuraveis** (nao "quando comecar a doer") ligados a acao recomendada. Serve como checklist operacional: Caio olha o dashboard, bate com a linha, executa.

| Gatilho (qualquer um verdadeiro) | Severidade | Acao recomendada | Agente |
|---|---|---|---|
| Bandwidth Vercel >70GB no mes | **ALTA** | Subir Vercel Pro **hoje** (evita site cair em tweet viral) | DevOps |
| DB storage Supabase >400MB (80% do free) | ALTA | Subir Supabase Pro | DevOps |
| Erro `too many connections` no Sentry | **CRITICA** | Subir Supabase Pro (vem com compute Small) | DevOps |
| Receita mensal recorrente >R$1.500 | Media | Subir tudo pra Pro (R$260 nao pesa mais) | Product |
| MAU >500 | Media | Subir tudo pra Pro preventivo | Product |
| Bandwidth Vercel Pro >R$400/mes sustained (3+ meses) | Media | Avaliar migracao hosting pra Cloudflare | Architect |
| Storage bandwidth Supabase >R$200/mes sustained | Media | Migrar assets pra R2, Supabase so metadados | DevOps |
| Custo total infra >R$1.500/mes e <5k pagantes | **ALTA** | Auditar queries lentas, cache agressivo, revisar plano | Architect |
| Latencia p95 Supabase >500ms sustained | Media | Subir compute (Small → Medium → Large) | Data Engineer |
| 1 incidente de downtime no mes >30min | **CRITICA** | Revisar arquitetura, nao migrar na cabeca quente | Architect |
| Tweet do Caio viralizou e site caiu | **CRITICA** | Pro **imediato**, pos-mortem calmo | DevOps |
| Custo passou R$3.000/mes | **ALTA** | Avaliacao formal split stack (Neon+R2+Clerk) | Architect |

### O que isso significa pro Caio
Voce nao precisa "sentir" quando migrar. A tabela dita. O jeito pratico: configure alertas no Vercel, Supabase e Sentry pros numeros da coluna 1, e quando um piscar, executa a coluna 3.

---

## 6. Big Picture — Mapa do Ecossistema

### O que este mapa mostra
O mercado de infra pra web app moderno se divide em **4 categorias mentais**. Cada player tem um lugar. Confusao vem de comparar categorias diferentes como se fossem a mesma coisa.

```
+-------------------------------------------------------------+
|           BaaS ALL-IN-ONE (DB+Auth+Storage+Fns)             |
|                                                             |
|    [Supabase] <- VOCE ESTA AQUI (OK soft launch)            |
|    [Firebase] — Google, NoSQL, lock-in alto                 |
|    [AWS Amplify] — AWS mas complexo                         |
|                                                             |
+------------------------+------------------------------------+
                         |
                         | split (quando escalar)
                         v
+---------------------+  +---------------------+  +------------+
|   DB SPECIALISTS    |  | AUTH SPECIALISTS    |  |  STORAGE   |
|                     |  |                     |  |            |
|   [Neon] OK DEPOIS  |  |   [Clerk] OK        |  | [R2] OK    |
|   [Railway PG]      |  |   [Auth.js]         |  | [S3]       |
|   [PlanetScale]     |  |   [WorkOS]          |  | [Backblaze]|
|   EVITAR (MySQL)    |  |   [Auth0]           |  +------------+
|   [Xata] EVITAR     |  +---------------------+
|   [Turso] EVITAR    |
+---------------------+

+-------------------------------------------------------------+
|               HOSTING / EDGE (frontend + SSR)               |
|                                                             |
|    [Vercel] <- VOCE ESTA AQUI (OK, casa com Next 16)        |
|    [Cloudflare Pages] OK DEPOIS (economia bw)               |
|    [Netlify] — similar Vercel, nao vale trocar              |
|    [AWS Amplify Hosting] — complexo                         |
|                                                             |
+-------------------------------------------------------------+

+-------------------------------------------------------------+
|          VPS / CONTAINER (voce opera)                       |
|                                                             |
|    [Hetzner] — mais barato do mercado (EU)                  |
|    [DigitalOcean] — UX melhor                               |
|    [Fly.io] — edge global em VMs                            |
|    [Railway] — container PaaS hibrido                       |
|    [Render] — container PaaS                                |
|                                                             |
|    EVITAR PRO CAIO — operacao devora economia               |
+-------------------------------------------------------------+
```

### O que isso significa pro Caio
- **Hoje voce esta em BaaS all-in-one + Edge hosting.** E a escolha certa pra builder nao-dev.
- **A evolucao natural e "split" lateral**: quebra o BaaS em 3 especialistas quando o all-in-one ficar caro ou limitado. Nao e descer pra VPS.
- **VPS self-host nao e um degrau — e uma outra carreira.** Entrar so com sinergia com alguem SRE.

---

## 7. Resumo Visual — 1 linha por provider

### O que esta tabela mostra
Bate-olho final. Cada provider do universo analisado, uma linha, um veredito pro caso especifico do Caio (forum Next.js 16, <5k MAU, builder nao-dev, monetizacao R$29,90/ano).

| Provider | Categoria | Status pro Caio | Por que |
|---|---|---|---|
| Supabase | BaaS all-in-one | OK | Combo imbativel DB+Auth+Storage+Realtime, free generoso |
| Vercel | Edge hosting | OK | Casa perfeita com Next.js 16, risco so em bandwidth viral |
| Neon | DB specialist | DEPOIS | Plano B quando Supabase passar R$800/mes |
| Cloudflare Pages | Edge hosting | DEPOIS | Bandwidth zero, migrar quando overage Vercel >R$400/mes |
| Cloudflare R2 | Storage | DEPOIS | Zero egress, migrar quando Storage bw Supabase >R$200/mes |
| Clerk | Auth specialist | DEPOIS | So se sair de Supabase Auth, antes de 10k MAU |
| Upstash Redis | Cache/KV | OK | Ja em uso, free tier suficiente |
| Sentry | Monitoring | OK | Ja em uso, free 5k errors/mes |
| Railway | PaaS container | EVITAR | Sem vantagem sobre Supabase+Vercel |
| Render | PaaS container | EVITAR | Sem vantagem sobre Supabase+Vercel |
| Fly.io | Edge VMs | EVITAR | Voce opera, nao vale |
| Netlify | Edge hosting | EVITAR | Um passo atras do Vercel em Next.js, sem ganho |
| Xata | DB com API propria | EVITAR | Lock-in alto em API nao-Postgres |
| Turso | SQLite edge | EVITAR | Migrar Postgres→SQLite = reescrever |
| PlanetScale | MySQL serverless | EVITAR | MySQL, sem free, trabalho alto |
| Firebase | BaaS Google | EVITAR | NoSQL, lock-in Google |
| AWS Amplify | BaaS AWS | EVITAR | Complexidade AWS sem payoff pro perfil |
| Hetzner self-host | VPS | EVITAR | Operacao devora economia sem SRE |
| Coolify self-host | PaaS self-host | EVITAR | Idem |
| DigitalOcean App | PaaS hibrido | EVITAR | Sem vantagem sobre Vercel |

### O que isso significa pro Caio
- **3 OK agora**: Supabase, Vercel, Upstash, Sentry (ja e sua stack).
- **4 DEPOIS**: Neon, Cloudflare Pages, R2, Clerk — cada um com gatilho de migracao definido em §5.
- **13 EVITAR**: nao perca tempo pesquisando. Nao servem ao perfil builder-nao-dev com forum Next.js 16.

---

## Conclusao Executiva — O que emergiu do comparativo

Tres insights que nao estavam claros na auditoria original e sao visiveis so com a panoramica:

1. **Supabase+Vercel nao e uma escolha "segura default" — e otima.** Depois de comparar 20 providers em 7 dimensoes, o combo atual esta no topo em 2 categorias (BaaS e Edge hosting Next.js). Nao existe stack melhor pra o seu perfil hoje. Migracao prematura seria downgrade de produtividade.

2. **O caminho de evolucao e vertical e previsivel**: Free → Pro → Split Cloudflare/Neon em cima de 50k MAU. Nao tem surpresa escondida, nao tem cliff de preco, nao tem lock-in catastrofico.

3. **Seu unico risco real e bandwidth em viralizada — nao preco mensal.** 90% das surpresas em contas Vercel/Supabase vem de spike, nao de crescimento gradual. A disciplina e: Pro ligado antes de qualquer push de marketing.

---

## Fontes

Mesmo conjunto da auditoria principal (`2026-04-22-capacidade-supabase-vercel.md`), mais:
- [Cloudflare R2 Pricing](https://www.cloudflare.com/developer-platform/products/r2/)
- [Clerk Pricing](https://clerk.com/pricing)
- [Hetzner Cloud Pricing](https://www.hetzner.com/cloud)
- [Xata Pricing](https://xata.io/pricing)
- [Turso Pricing](https://turso.tech/pricing)
- [Coolify](https://coolify.io/)
- [State of JavaScript — Hosting Survey 2025](https://stateofjs.com/)
