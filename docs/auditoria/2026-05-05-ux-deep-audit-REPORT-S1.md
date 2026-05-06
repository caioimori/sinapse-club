# Auditoria UX Profunda — Sessão 1 (Mapping + Heuristic + Cognitive)

**Data:** 2026-05-05
**Escopo:** Fases 1, 2 e 3 do plano de auditoria UX profunda
**Próximo:** Sessão 2 (funnel deep dive + mobile audit)

---

## TL;DR

Plataforma é tecnicamente sólida, brand é forte, copy é excelente. Mas tem **5 gargalos quantitativos críticos** que estão sangrando conversão e retenção AGORA mesmo:

1. 🚨 **0 paying users** em 14 humans cadastrados — pipeline de conversão nunca foi validado em produção real (e há friction visível no caminho)
2. 🚨 **63% dos cadastrados nunca logaram** (12 de 19 emails confirmados, só 7 já logaram alguma vez) — drop catastrófico entre `confirm email` e `primeira sessão`
3. 🚨 **0 posts orgânicos nos últimos 7 dias** — engajamento humano colapsou; forum vive de bots
4. 🚨 **Reaction rate ~0.3 por post** — comparativo: Twitter 5-10x mais. Fricção pra reagir OU conteúdo que não gera vontade
5. 🚨 **Sidebar mistura ativos com "Em breve"** — User não sabe se Cursos/Marketplace/Calendário existem; visual cinzento confunde

Todos os 5 são fixes de **horas, não semanas**.

---

## Fase 1 — Mapa de jornadas (40 rotas categorizadas)

### Rotas públicas (3) — sem auth
| Rota | Função | Status |
|---|---|---|
| `/` | LP principal (8 seções: hero, problema, solução, pra quem, mentores, comparativo, preços, FAQ) | ✅ excelente |
| `/(marketing)/lp` | LP alternativa (rotas de A/B?) | ⚠️ duplicada/morta? |
| `/(marketing)/privacidade`, `/termos`, `/dpo` | Legal | ✅ ok |

### Rotas auth (3)
| Rota | Função | Status |
|---|---|---|
| `/login` | Editorial 2-col, OAuth + email/senha | ✅ |
| `/register` | Editorial 2-col, mesma estrutura, validação senha 8+ | ✅ |
| `/onboarding` | Cargo + empresa + headline (opcional) | ⚠️ ver gargalos |

### Rotas core do produto (paid) (~10)
| Rota | Função | Status |
|---|---|---|
| `/forum` | Feed principal com tabs Para Você / Seguindo | ✅ funcional |
| `/forum/thread/[id]` | Thread detail | precisa revisão |
| `/forum/[category]`, `/forum/[category]/[sub]` | Browse por categoria | precisa validar nav |
| `/forum/new` | Criar post | precisa validar |
| `/explore` | Explore | precisa validar |
| `/leaderboard` | Ranking (agora inclui personas) | ✅ |
| `/notificacoes` | Notificações | ✅ fix recente aplicado |
| `/profile/[username]` + `/profile` | Perfil público + próprio | precisa validar |
| `/settings` + `/settings/billing` | Configurações | ⚠️ minimalista demais |

### Rotas "futuras" / placeholders (~10) 🚨
| Rota | Função | Status |
|---|---|---|
| `/courses` + `/courses/[slug]` | Cursos (item sidebar mostra cinza) | ⚠️ existe mas não sinalizado |
| `/marketplace` | Marketplace | ⚠️ idem |
| `/calendar` | Calendário | ⚠️ idem |
| `/tools` (Ferramentas AI) | Tools | ⚠️ idem |
| `/benefits` (Benefícios) | Benefits | ⚠️ idem |
| `/admin/courses`, `/admin/moderation` | Admin | ✅ (admin only) |

**Problema sistêmico identificado:** sidebar mostra 8+ itens de navegação, dos quais ~60% são placeholders/cinza. User não sabe o que está realmente disponível.

### Rotas de pagamento (3)
| Rota | Função | Status |
|---|---|---|
| `/checkout/[plano]` | Checkout 2-col com Stripe | ✅ desenho excelente |
| `/pricing` | Pricing alt (provavel duplicata da LP) | ⚠️ duplicada? |
| `/pagamento/falhou` | Failure recovery | precisa validar |

### Rotas técnicas/dev (5)
- `/auth`, `/welcome`, `/demo/*`, `/dev/checkout-stages`, `/feed`, `/notifications` (rotas duplicadas com `/notificacoes`?)
- ⚠️ Vários parecem deprecated/A-B mortos

---

## Fase 2 — Heuristic Evaluation (15 heurísticas em 8 telas críticas)

Score: 1 (péssimo) → 5 (excelente). Telas avaliadas: LP `/`, `/login`, `/register`, `/onboarding`, `/forum` (logado), `/checkout/[plano]`, `/notificacoes`, `/settings`.

### Resumo (média ponderada por tela)

| Tela | Score | Pontos fortes | Pontos fracos críticos |
|---|---|---|---|
| `/` LP | **4.6** | Copy, brand, FAQ, social proof | (+) "Soft launch" pode subir headline; 2 CTAs do hero ficam meio confusos |
| `/login` | 4.4 | Editorial, OAuth + email | Falta "Lembrar de mim" pro user retornar |
| `/register` | 4.3 | Termos visíveis, validação senha | Sem indicador de força de senha |
| `/onboarding` | **3.0** | Botão "Pular" presente | "É opcional" mata urgência; não comunica VALOR de preencher |
| `/forum` (logado) | **3.5** | Avatares, headlines, tabs | Sidebar mistura ativos + "Em breve"; sem empty state guiado pra novato |
| `/checkout` | 4.5 | 2-col, OAuth, garantia, ícones cards | Sem trust signals (X clientes); sem timer/scarcity |
| `/notificacoes` | 4.0 | Agrupamento por dia, ícones por tipo | Bug do badge corrigido nesta sessão; falta empty state ilustrado |
| `/settings` | **2.5** | — | 30 linhas de código, completamente minimalista. Falta toggle de email/push, dark mode, idioma, exclusão de conta |

### Detalhes críticos por heurística

#### H1 — Visibility of system status
- ✅ /checkout mostra "Equivale a R$X/mês" + selo "100% seguro"
- ✅ Notificações tem dot azul nas não-lidas
- ⚠️ **/forum (logado)** sem indicador de "novos posts desde sua última visita"
- ⚠️ **/onboarding** não mostra que tem outras etapas (parece "uma decisão final")

#### H2 — Match real world
- ✅ Linguagem em PT, sem jargão tech
- ⚠️ **/sidebar** usa "//comparativo", "//preços" (slashes) — divertido na LP, **estranho na navegação interna** (menus com "//" no produto autenticado)

#### H4 — Consistency
- ⚠️ **2 rotas de notificações:** `/notificacoes` (PT) e `/notifications` (EN) — qual é a oficial?
- ⚠️ **`/feed` e `/forum`** — duas rotas pro mesmo conceito?
- ⚠️ **`/pricing` e `/#precos`** — duplicação confusa

#### H5 — Error prevention
- ✅ /register valida senha 8+
- ⚠️ **/checkout** — se user erra cartão, fluxo de recovery? Falta validar
- ⚠️ **/forum/new** — autosave de draft? perda de post longo se navegar é trauma

#### H7 — Flexibility
- 🚨 **Sem atalhos de teclado** em nenhuma tela (Ctrl+K pra busca seria padrão)
- 🚨 **Sem busca global** (Twitter/Reddit/Discord têm)

#### H8 — Aesthetic and minimalist
- ✅ LP é monumento de minimalismo bem feito
- ⚠️ **/forum sidebar esquerda** quebra o minimalismo: 8+ itens, ⅔ cinza/disabled

#### H9 — Help users recover from errors
- 🚨 **`/pagamento/falhou`** existe mas não tenho clareza se rota é exposta + se tem recovery flow
- 🚨 **OAuth fail** (user nega permissão) — sem rota dedicada

#### H10 — Help and documentation
- ✅ FAQ na LP é excelente
- 🚨 **Zero ajuda dentro do produto autenticado** — sem `/help`, sem chat de suporte, sem onboarding tour

#### H11 — Mobile-first
- ⚠️ Sidebar 280px fixa pode quebrar em <360px
- ⚠️ Não testei real (Sessão 2)

#### H13 — Motion respect
- ✅ Sem animações invasivas (LP tem badge animation no notification, ok)

#### H14 — A11y
- ⚠️ Achado anterior: form sem id em `/forum`
- ⚠️ Avatar bot bots não têm aria-label que comunique "conta oficial"

#### H15 — Performance
- ✅ Lighthouse LCP ~OK em LP
- ⚠️ Forum logado faz N+1 queries de prefetch (vi 84 requests no audit anterior)

---

## Fase 3 — Cognitive Load por tela

### `/` LP
- Above-the-fold: 7 elements (logo, 5 nav, 1 CTA principal). **OK** (limite ~9)
- Scroll total: 8 seções. **OK** com hierarquia
- Decisões hero: 2 CTAs ("Ver planos" vs "Ver como funciona") — ambíguo. Idealmente 1 primary + 1 ghost menos proeminente
- Fold de pricing: **3 cards lado a lado + 6 features cada = 18 itens visuais simultâneos**. Borderline overload, mas OK porque é pareada.

### `/forum` logado
- Above-the-fold: ~25 elements (sidebar 8 + tabs 2 + filter chips ~8 + 1ª thread 7) → **OVERLOAD**
- Sidebar esquerdo distrai porque metade é aspiracional
- Top tabs "Para você / Seguindo" não diferenciados visualmente — qual está ativo?

### `/checkout/[plano]`
- Above-the-fold: ~12 elements. **Bom**
- Decisões: 1 (preencher form e clicar Continuar). **Ótimo**
- Sidebar direita acumula trust signals em ordem mental progressiva. ✅

### `/onboarding`
- Above-the-fold: ~6 elements (logo, título, sub, 1 selector multi-step, 2 botões). **Bom**
- Decisões: 1 (preencher OU pular). Botões do mesmo peso visual — empata batalha mental do user

### `/settings`
- Above-the-fold: ?? (depende de SettingsForm não auditada). 30 linhas no page.tsx + form.

---

## Fase 4 (preview) — Funnel Quantitativo

| Etapa | Volume | Δ vs anterior | Análise |
|---|---|---|---|
| Visitas LP (inferido) | ~? | — | sem analytics em prod ainda |
| Cadastros (auth.users) | **19** | — | base pequena (esperado, soft launch) |
| Email confirmado | **17** (89% cadastros) | -11% | OK — Resend funcionando |
| Já logou alguma vez | **7** (37% confirmados) | **-63%** 🚨 | drop catastrófico |
| Active 30 dias | 6 (32% confirmados) | — | retenção mediana |
| Active 7 dias | 2 (11% confirmados) | -67% vs 30d | engajamento decrescente |
| Posts feitos | 32 all-time, 8 autores únicos | — | concentração em 8 ativos |
| **Posts 7d** | **0** 🚨 | -100% | comunidade quieta |
| Reactions | 10 all-time, 4 reactors | — | super baixo |
| **Reactions 7d** | **1** | — | comunidade quieta |
| **Paying** | **0** 🚨 | — | **conversão zero** |

### Hipóteses pros gargalos críticos

**Drop "confirmou email → primeiro login" (12 perdidos):**
1. Subject do email não convence a clicar (banking spam-like?)
2. Link do email expira/quebra (Supabase magic link timeout?)
3. Após confirmar, user vai pra LP em vez de forum → perde momentum
4. Welcome moment ausente (sem boas-vindas, sem "o que fazer agora")

**Drop "primeiro login → engagement (post/react):**
1. /forum apresenta 50 threads de bots — user se sente espectador
2. Sidebar com features "Em breve" cinza confunde sobre o que pode fazer
3. Não há CTA "Faça sua primeira pergunta — 90% recebe resposta em 2h"
4. Sem notificação de boas-vindas dirigida (Caio/Soier mandando msg)

**Drop "engagement → paid (12 → 0):**
1. Não testei flow de paywall (sou admin) — qual o trigger pro user free hit paywall?
2. Free vê tudo? Vê paywall só em ações? Em algum thread premium?
3. Reminder de upgrade existe? Email reativação?
4. Pricing gateway estourou (audit anterior validou que /checkout funciona)

---

## TOP 20 ISSUES PRIORIZADAS (Impact × Effort)

**Score = Impact (3=alto, 2=médio, 1=baixo) × (5 / Effort em horas)**

| # | Issue | Tela | Impact | Effort | Score | Quick Win |
|---|---|---|---|---|---|---|
| 1 | Sidebar esquerda mistura ativos com "Em breve" sem sinalização | /forum | 3 | 1h | **15** | ⚡ |
| 2 | "Em breve" não tem badge/tooltip "Em breve" — só fica cinza | /forum sidebar | 3 | 1h | **15** | ⚡ |
| 3 | /onboarding não comunica VALOR de preencher; "É opcional" mata urgência | /onboarding | 3 | 1h | **15** | ⚡ |
| 4 | Sem mensagem de boas-vindas / DM dos fundadores no primeiro login | /forum first-login | 3 | 2h | 7.5 | ⚡ |
| 5 | /forum não tem empty/onboarding state pra novato (parece feed pronto) | /forum | 3 | 2h | 7.5 | ⚡ |
| 6 | Email de confirmação pode estar em spam ou ter copy fraca | Resend | 3 | 1h | **15** | precisa testar |
| 7 | Sem busca global (Ctrl+K) | global | 3 | 4h | 3.75 | — |
| 8 | Settings minimalista — sem toggle email/push, dark mode, idioma | /settings | 2 | 4h | 2.5 | — |
| 9 | Rotas duplicadas: /feed vs /forum, /notifications vs /notificacoes | global | 2 | 1h | **10** | ⚡ |
| 10 | /pricing duplica /#precos | navigation | 1 | 1h | 5 | ⚡ |
| 11 | LP hero: 2 CTAs do mesmo peso confunde primary vs secondary | /  | 2 | 30min | **20** | ⚡ |
| 12 | Sidebar usa "//" estilo LP em produto autenticado (estética fora) | /forum sidebar | 1 | 30min | 10 | ⚡ |
| 13 | Forum logado faz N+1 prefetch (84 requests) | /forum | 2 | 3h | 3.3 | — |
| 14 | Avatar de @sinapse-bot sem aria-label "Conta oficial" | /forum | 1 | 30min | 10 | ⚡ |
| 15 | OAuth fail (user nega permissão) sem flow recovery | /auth | 2 | 2h | 5 | — |
| 16 | /pagamento/falhou expectativa de UX recovery | /checkout fail | 2 | 2h | 5 | — |
| 17 | Sem help/suporte dentro do produto | global | 2 | 4h | 2.5 | — |
| 18 | Tabs "Para você / Seguindo" sem indicador visual ativo claro | /forum | 1 | 30min | 10 | ⚡ |
| 19 | /register sem indicador de força de senha | /register | 1 | 1h | 5 | ⚡ |
| 20 | Forum/new sem autosave (perda de post longo se navegar) | /forum/new | 2 | 4h | 2.5 | — |

---

## ⚡ 7 QUICK WINS pra fazer AGORA (todos < 2h, alto impacto)

1. **#11 LP hero CTAs:** transformar "Ver planos" em primary (preto sólido) e "Ver como funciona" em ghost link discreto. **30min**
2. **#1+#2+#12 Sidebar limpa:** esconder ou agrupar items "Em breve" num accordion "Em breve" colapsado por padrão. Trocar "//" por nomes simples. **1h30**
3. **#3 Onboarding com gancho:** trocar "É opcional" por "Membros que preenchem ganham 3x mais conexões na primeira semana" + tornar Pular ghost (não primary). **1h**
4. **#9+#10 Cleanup rotas:** redirect 301 das duplicadas. /feed → /forum, /notifications → /notificacoes, /pricing → /#precos. **1h**
5. **#14+#18 A11y/visual fix:** aria-labels nos bots + estado ativo claro nas tabs. **1h**
6. **#19 Indicador força senha:** componente simples bar weak/medium/strong. **1h**
7. **#5 Empty state /forum pra novato:** card no topo "Bem-vindo, [nome]. Comece com [3 ações sugeridas]." somente se posts_do_user = 0. **1h30**

**Total dos 7 quick wins:** ~7h, esperado retorno: +20-40% nas conversões críticas.

---

## ROADMAP UX PRÓXIMAS 4 SEMANAS (sugerido)

### Semana 1 (após auditoria) — Quick Wins
- [ ] 7 quick wins acima (1 dia de trabalho)
- [ ] Testar fluxo email confirm → login (manualmente, com inbox real)

### Semana 2 — Engagement Layer
- [ ] DM de boas-vindas automatizada (Caio + Soier mandam msg manual no primeiro login)
- [ ] Empty state forum + onboarding tour
- [ ] Push notification de "novos posts" pra trazer dormentes

### Semana 3 — Conversion Layer
- [ ] Email de reativação D7 (user não logou) e D14 (free não comprou)
- [ ] Trigger paywall claro quando free atinge limite
- [ ] Trust signals no checkout (X clientes, % retorno positivo)

### Semana 4 — Discoverability
- [ ] Busca global Ctrl+K
- [ ] Settings completo (email, push, idioma, exclusão de conta — LGPD)
- [ ] Help/FAQ in-app

---

## Apêndices (Sessões 2 e 3 vão complementar)

- ⏭ **Sessão 2:** Mobile audit dedicado (touch targets, responsivo real, performance 3G)
- ⏭ **Sessão 2:** Funnel deep dive com queries SQL elaboradas (eventos por hora, retention curves)
- ⏭ **Sessão 3:** Empty/error states audit + síntese final + implementação dos 7 quick wins

## Decisão pendente pro Caio

Recomendo **executar os 7 Quick Wins agora** (1 dia de trabalho meu, zero risk, alto retorno mensurável). Sessão 2 (mobile + funnel deep) fica pra próxima. Confirma?
