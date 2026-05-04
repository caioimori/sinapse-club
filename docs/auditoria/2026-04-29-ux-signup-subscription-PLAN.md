# Plano de Auditoria UX — Jornada de Conta + Assinatura

**Data:** 2026-04-29
**Owner:** design-orqx (Nexus)
**Status:** PLAN — não executado
**Escopo do produto:** sinapse.club (hard paywall, fluxo pay-first pós PR #42)

---

## Objetivo

Validar que a jornada `visitor → assinante ativo no /forum` é fluida, confiável e on-brand o suficiente pra liberar divulgação paga sem queimar tráfego em fricção evitável.

---

## Escopo

### IN
- Rotas: `/`, `/pricing`, `/checkout/[plano]`, `/welcome`, `/forum` (primeiro acesso)
- Atalhos OAuth (Google, GitHub) na tela de checkout
- Fluxo fallback `/register` (criação tradicional sem pagamento)
- Webhook AbacatePay → criação de conta → magic link
- Email transacional (magic link) — copy + deliverability + UX do clique
- Mobile (375px) + Desktop (1440px)
- DS Compliance (brandbook SINAPSE — B&W, grain, tipografia extrema, assimetria)

### OUT
- Auditoria de billing/cobrança recorrente (renovação, cancelamento, dunning) — fica pra ciclo 2
- Painel logado pós-onboarding (settings, profile, notifications)
- SEO técnico (já coberto em outras auditorias)
- A/B testing de pricing — só estrutural, não optimization
- Performance (Core Web Vitals) — auditoria separada

---

## Etapas Executáveis

### 1. Mapa de Jornadas (caminhos possíveis)
- **Método:** flowchart escrito + verificação no código (rotas, redirects, middlewares)
- **Ferramenta:** Read em `src/app/(public)/`, `src/app/(auth)/`, middleware.ts; Grep por `redirect(`, `signIn(`, `webhook`
- **Entrega:** seção `journeys.md` com 6 caminhos canônicos numerados:
  1. Anon → /pricing → /checkout → AbacatePay → email → magic link → /forum
  2. Anon → /pricing → /checkout → OAuth Google → AbacatePay → /forum
  3. Anon → /pricing → /checkout → OAuth GitHub → AbacatePay → /forum
  4. Anon → /register (fallback) → /pricing → /checkout → ...
  5. Returning user (já tem conta, não pagou) → /forum (bloqueado) → /pricing → /checkout
  6. Edge: pagou, não clicou no magic link, volta no dia seguinte
- **Output:** matriz de jornadas (estado inicial → ações → estado final → pontos de saída)

### 2. Walkthrough Real (chrome-devtools MCP)
- **Método:** simular cada uma das 6 jornadas em mobile + desktop, gravando screenshots em cada estado, console errors, network failures
- **Ferramenta:** chrome-devtools MCP (navigate, screenshot, evaluate, network)
- **Cenários edge a forçar:**
  - Email malformatado no checkout
  - Pagamento recusado no AbacatePay (cartão teste invalid)
  - Magic link clicado 2x (idempotência)
  - F5 no /welcome antes do webhook chegar
  - OAuth Google cancelado pelo usuário no popup
  - Usuário fecha aba durante AbacatePay e volta pelo histórico
  - Magic link expirado (>24h)
  - Pagamento PIX não confirmado em 30min
- **Output:** pasta `recordings/` com screenshots numerados + log de issues encontradas

### 3. Funil Quantitativo (instrumentação)
- **Método:** mapear eventos de telemetria existentes (PostHog/GA/Vercel Analytics?) e identificar gaps
- **Ferramenta:** Grep por `posthog.capture`, `gtag`, `track(` no codebase
- **Funil esperado (8 steps):**
  1. `pricing_viewed`
  2. `plan_selected` (mensal | semestral | anual)
  3. `checkout_started`
  4. `email_filled` OU `oauth_clicked`
  5. `abacatepay_redirect`
  6. `payment_confirmed` (webhook)
  7. `magic_link_clicked` OU `oauth_callback_success`
  8. `forum_first_view`
- **Output:** seção `funnel-instrumentation-gaps.md` com eventos faltantes + recomendação de implementação (delegar a @growth-orqx ou @developer)

### 4. Heurísticas Qualitativas (Nielsen + Baymard + LGPD)
- **Método:** checklist aplicado tela a tela
- **Frameworks:**
  - **Nielsen 10** — visibilidade de status, match com mundo real, controle do usuário, consistência, prevenção de erro, reconhecimento>memória, flexibilidade, estética minimalista, ajuda em erros, documentação
  - **Baymard Checkout (top 12 aplicáveis)** — clareza de preço final, transparência de cobrança recorrente, segurança visual (selos, https), formulário curto, validação inline, estados de loading, confirmação clara pós-pagamento
  - **LGPD UX** — consentimento explícito visível, link pra política antes do submit, copy clara sobre uso de dados (Art. 9), opt-in não pré-marcado
- **Mobile-first:** touch targets >=44px, sem hover-only, scroll natural, teclado numérico em campos de cartão (delegado ao AbacatePay)
- **Output:** `heuristics-matrix.csv` (Tela × Heurística × Severidade × Quote)

### 5. Auditoria de Copy
- **Método:** extrair toda copy das telas (headlines, CTAs, labels, error messages, empty states, email transacional) e avaliar
- **Critérios:**
  - Tom consistente com brandbook SINAPSE (direto, sem fofura, sem corporativês)
  - CTA com verbo de ação + benefício (não "Continuar" genérico)
  - Error messages humanos (não "Error 500" cru)
  - Email magic link: assunto + preheader + corpo + CTA + fallback link copy-pasteable
  - Microcopy de segurança ("seu pagamento é processado pela AbacatePay")
- **Ferramenta:** Read direto nos componentes + email templates
- **Output:** `copy-review.md` com sugestões linha-a-linha (delegar refinamento a @copy-orqx se gap for grande)

### 6. DS Compliance Gate
- **Método:** rodar pipeline de validação contra brandbook SINAPSE em cada tela do fluxo
- **Regras checadas (auto-grounded via design-system-grounding):**
  - `[rule 01]` Paleta B&W absoluta — sem cor de marca de terceiros vazando (AbacatePay tem azul próprio, ok no iframe deles, não no nosso wrapper)
  - `[rule 02]` Preto mínimo #0A0A0A
  - `[rule 03]` Grain SVG 5% ativo nas telas owned
  - `[rule 04]` Sora · Inter · JetBrains, max 2 pesos/tela
  - `[rule 05]` Tipografia 11-14px OU 60-180px (faixa 32-48px PROIBIDA — checar headlines do /pricing e /checkout)
  - `[rule 06]` Assimetria — nenhum hero centrado simétrico trivial
  - `[rule 11]` Grain · crosshair · frame presentes
  - Container: `max-w-screen-2xl` (não `max-w-7xl`)
- **Ferramenta:** Glob em `src/app/(public)/pricing/**`, `src/app/(public)/checkout/**`, screenshot via chrome-devtools, Grep por `max-w-7xl`, `text-3xl`, `text-4xl` (dead-zone)
- **Output:** `ds-compliance-report.md` com violações por tela + severidade

### 7. Síntese e Priorização
- **Método:** consolidar achados das etapas 2-6 em matriz única Impacto × Esforço
- **Eixos:**
  - Impacto: alto (bloqueia conversão), médio (atrita), baixo (cosmético)
  - Esforço: S (<1h), M (1-4h), L (>4h ou requer especialista)
- **Quadrantes priorizados:**
  - Alto/S → fix imediato antes de divulgar
  - Alto/M → fix antes de divulgar
  - Alto/L → decisão Caio (divulga sem ou adia?)
  - Médio/* → backlog ciclo 2
  - Baixo/* → ignora ou agenda
- **Output:** `2026-04-29-ux-signup-subscription-FINDINGS.md` com:
  - Resumo executivo (3 parágrafos, sem jargão)
  - Matriz priorizada (tabela)
  - Top 5 must-fix com screenshot + recomendação concreta
  - Decisão GO/NO-GO pra divulgação
  - Anexo: jornadas, funil, heurísticas, copy, DS

---

## Critério Pass/No-Pass pra Liberar Divulgação

**PASS (libera divulgação):**
- Zero issues Alto/* não resolvidos
- Funil instrumentado em pelo menos 6/8 steps
- DS Compliance: zero violações `[rule 01]`, `[rule 02]`, `[rule 05]` nas telas owned
- 6/6 jornadas canônicas completam sem erro de console nem 4xx/5xx
- Magic link entrega <60s em 3 testes consecutivos (Gmail + Outlook + ProtonMail)
- Mobile 375px sem overflow horizontal em nenhuma tela do fluxo
- LGPD: consentimento visível antes do submit em /checkout e /register

**NO-PASS (segura divulgação):**
- Qualquer Alto/* aberto
- Funil cego em >2 steps críticos
- DS quebra de regra 01/02/05
- Webhook race condition observada (F5 no /welcome quebra fluxo)
- Email transacional com problema de deliverability (SPF/DKIM/DMARC)

---

## Tempo Estimado

| Etapa | Tempo |
|---|---:|
| 1. Mapa de jornadas | 45min |
| 2. Walkthrough chrome-devtools (12 cenários × ~10min) | 2h |
| 3. Funil quantitativo (audit + gap doc) | 45min |
| 4. Heurísticas (5 telas × 22 critérios) | 1h30 |
| 5. Copy review | 1h |
| 6. DS Compliance gate | 1h |
| 7. Síntese e priorização | 1h |
| **Total** | **~8h** (1 dia de trabalho focado) |

---

## Ferramentas Necessárias

- chrome-devtools MCP (gravação + console + network)
- Read/Grep/Glob (análise de código)
- Acesso a 3 caixas de email pra teste de deliverability
- Cartão de teste do AbacatePay (sandbox) — verificar com Caio se já existe
- Navegação mobile real OU DevTools device emulator 375px

---

## Dependências e Bloqueadores Possíveis

- AbacatePay sandbox configurado? (se não, simulação só vai até `payment_redirect`)
- Telemetria já plugada? (afeta etapa 3 — pode virar recomendação ao invés de auditoria)
- Email transacional em prod ou staging? (deliverability só testa em prod)

---

## Próximo Passo

Caio decide quando rodar. Quando rodar, executor é design-orqx coordenando com:
- chrome-devtools MCP (walkthrough)
- @copy-orqx (se gap de copy for grande)
- @growth-orqx (se gap de telemetria for grande)
- @developer (pra fixes Alto/S identificados)

Plano fica vivo em `docs/auditoria/`. Findings vão pro mesmo diretório com sufixo `-FINDINGS.md`.
