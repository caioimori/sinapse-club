# Plano de Correção — Paywall UX + Polimento Geral

**Data:** 2026-04-29
**Owner:** design-orqx (Nexus)
**Status:** PLAN — não executado
**Repo:** `sinapse-plataform`
**Decisão de PRs:** **1 PR único** (justificativa abaixo)

---

## Resumo Executivo (pra Caio)

Auditei os 6 problemas. Encontrei algumas surpresas:

1. **Forum hoje é gate TOTAL.** Hard paywall no middleware redireciona não-pagante direto pra `/pricing` antes mesmo de ver qualquer coisa do forum. O que você pediu ("não-pagante pode navegar e ver como funciona") é uma **mudança de produto**: sair de "Opção A gate total" (PR #40 mergeado) pra "Opção B preview limitado". Isso é meio dia de trabalho, não 30min, e mexe em arquitetura. Documentei abaixo as 2 opções pra você escolher.
2. **Cursor pointer:** o `Button` base do design system **não tem `cursor-pointer`**. Fix global em 1 linha resolve TUDO o que é `<Button>`. Sobra revisar `<Link>` e `role="button"`.
3. **PR #43 já está aberto** cobrindo parte de "remover PIX/parcelamento", mas só toca a LP de marketing. **Faltam: pricing logado, checkout, welcome.** Plano completa esses gaps.
4. **Mensagem redundante de pricing:** confirmado. `pricing/page.tsx` linhas 127-137 mostram "Essa funcionalidade requer um plano ativo" + os 3 cards já gritando "Recomendado / Assinar". Remoção limpa.
5. **Voltar pós-criação de conta:** preciso de 2 minutos com você pra confirmar EXATAMENTE qual tela. Suspeito é `/welcome` (sem botão de voltar visível, só links secundários). Listei como bloqueador parcial.
6. **Mensagens "tente novamente":** 14 ocorrências. As que aparecem em ações bloqueadas por paywall precisam virar "Você precisa assinar pra fazer isso". As outras (erro real de sistema) ficam.

**Tempo total estimado:** **6h-9h de trabalho de agente** (varia conforme decisão sobre forum preview).

**Por que 1 PR e não 6:** os 6 problemas são pequenos cirúrgicos exceto o #1. Misturar em 1 PR único permite review unificado, evita conflito entre PRs, e o título fica `fix(ux): paywall messaging + cursor + cleanup geral`. Se você preferir isolar #1 (forum preview), vira **2 PRs**: um pra forum preview (decisão de produto), um pra os outros 5 (cosmético/UX).

---

## Decisão Pendente (você precisa responder antes da execução)

### Decisão A — Forum não-pagante: gate TOTAL ou preview LIMITADO?

| Opção | Comportamento | Esforço |
|---|---|---|
| **A. Manter gate total atual** | Não-pagante: middleware redireciona `/forum → /pricing`. Nem vê. | 0h (já existe) |
| **B. Preview limitado** | Não-pagante vê listing das threads (título + autor + 1ª linha), mas: clicar abre modal "assine pra ler". Sem like/comentário/follow/criar post. | 4-6h |
| **C. Preview total read-only** | Não-pagante lê posts inteiros, mas zero interação. Ações = paywall toast. | 6-8h (mais complexo: rate limit, anti-scraping, SEO) |

**Minha recomendação:** **B**. Mostra suficiente pra "vender" o produto sem dar tudo de graça. C tem risco de scraping/SEO duplicado.

### Decisão B — Botão "voltar" pós-conta

Preciso que você confirme: **qual tela exatamente** estava com "voltar" quebrado?

Hipóteses (em ordem de probabilidade):
1. `/welcome` — só tem links discretos pra `/register` e `/login`, nenhum CTA de voltar pra escolher outro plano.
2. `/checkout/[plano]` — link "← Trocar de plano" aponta pra `/#precos` (anchor da LP marketing) — pode estar quebrando se o usuário veio do dashboard `/pricing`.
3. OAuth callback pós-sucesso — usuário fica órfão se cancelar Google/GitHub no popup.

Se você não confirmar, executo as 3 correções defensivas (todas baratas).

---

## Inventário (arquivos a tocar)

### Problema 1 — Forum não-pagante (depende da Decisão A)

**Cenário B (preview limitado, recomendado):**

| Arquivo | Mudança |
|---|---|
| `src/lib/supabase/middleware.ts` (89-153) | Remover `/forum` da lista `paidGatedRoutes`. Manter `/feed`, `/posts`, `/spaces`, `/courses`, etc. |
| `src/app/(dashboard)/forum/layout.tsx` | Detectar role free → injetar prop `previewMode={true}` no children. |
| `src/app/(dashboard)/forum/page.tsx` | Listing renderiza, mas threads em previewMode são wrapper que abre modal de paywall ao clicar (não Link). |
| `src/app/(dashboard)/forum/thread/[id]/page.tsx` | Bloquear render da página em previewMode, redirect pra `/pricing?from=thread`. |
| `src/components/forum/thread-list-item.tsx` | Aceitar `previewMode` prop; se true, link vira `<button onClick={openPaywallModal}>`. |
| `src/components/forum/thread-actions.tsx` | Botões like/comment/share em previewMode disparam toast paywall. |
| `src/components/forum/forum-composer.tsx` | Esconder em previewMode OU mostrar greyed-out com tooltip "assine pra postar". |
| `src/components/access/paywall-modal.tsx` (NOVO) | Modal com copy "Você precisa assinar pra interagir com o forum" + CTA `/pricing`. |
| `src/app/(dashboard)/forum/actions.ts` | Já bloqueia mutations via `requirePaidUser()`. **Confirmar todos os endpoints.** |
| `src/app/(dashboard)/profile/[username]/page.tsx` | Mesmo tratamento: free vê profile mas não pode follow. |

**Cenário A (manter atual):** zero arquivos. Pula esse problema.

### Problema 2 — Cursor pointer global

| Arquivo | Mudança |
|---|---|
| `src/components/ui/button-variants.ts` (linha 4) | Adicionar `cursor-pointer` na string base do `cva()`. **Resolve 90% dos casos** porque `<Button>` é universal. |
| `src/app/globals.css` | Adicionar regra `@layer base { button:not(:disabled), [role="button"]:not([aria-disabled="true"]), a[href] { cursor: pointer; } }` como safety net. |
| Auditoria: `src/components/forum/thread-list-item.tsx`, `src/components/feed/post-card.tsx`, qualquer `<div onClick>` | Verificar manualmente se há divs interativas sem `cursor-pointer` explícito. |

### Problema 3 — Mensagens de paywall explícitas

| Arquivo (linha) | Texto atual | Texto novo |
|---|---|---|
| `src/components/forum/compose-modal.tsx:195` | "Erro ao publicar. Tente novamente." | Manter (não é caso de paywall). Adicionar ANTES do action: check `previewMode` e mostrar "Assine um plano pra publicar." |
| `src/components/forum/forum-composer.tsx:171` | idem | idem |
| `src/components/forum/thread-create-form.tsx:229,237` | idem | Detectar erro `PaywallError` no catch e trocar mensagem. |
| `src/components/access/paywall-toast.tsx` (NOVO) | — | Helper `showPaywallToast()` → toast com CTA "Ver planos" → `/pricing`. |
| `src/lib/access/paywall.ts` | OK como está. | Exportar helper `formatPaywallMessage(action)` → "Você precisa assinar pra {action}." |

**Outras mensagens "tente novamente" (mantidas, são erros reais):** `error.tsx`, `account/delete`, `onboarding`, `pricing/actions.ts`, `settings-form.tsx`. Auditadas, OK.

### Problema 4 — Voltar pós-criação (defensivo, pendente confirmação)

| Arquivo | Mudança |
|---|---|
| `src/app/welcome/page.tsx` | Adicionar botão visível "← Voltar pra escolher outro plano" → `/pricing`, no topo. |
| `src/app/checkout/[plano]/page.tsx` (linha 77) | Trocar `href="/#precos"` → `href="/pricing"` (rota interna, não anchor da LP que pode falhar se usuário veio direto). |
| `src/app/(auth)/callback/page.tsx` | Garantir que erro de OAuth cancelado redireciona pra `/checkout/[plano]?canceled=oauth` ao invés de tela em branco. |

### Problema 5 — Remover menções a PIX/parcelamento internas

PR #43 já cobre LP marketing (`lp-cta-final.tsx`, `lp-faq.tsx`, `lp-pricing.tsx`). **Gaps deste plano:**

| Arquivo (linha) | Texto atual | Texto novo |
|---|---|---|
| `src/app/(dashboard)/pricing/page.tsx:58` | "R$ 203,40 a cada 6 meses · parcelável" | "R$ 203,40 a cada 6 meses" |
| `src/app/(dashboard)/pricing/page.tsx:69` | "R$ 358,80 por ano · parcelável" | "R$ 358,80 por ano" |
| `src/app/(dashboard)/pricing/page.tsx:224` | "Pagamento seguro via PIX pelo AbacatePay." | "Pagamento seguro via AbacatePay." |
| `src/app/checkout/[plano]/page.tsx:89` | "Cobrado a cada 6 meses. Parcelavel no cartao." | "Cobrado a cada 6 meses." |
| `src/app/checkout/[plano]/checkout-form.tsx:220` | "Pagamento seguro via PIX pelo AbacatePay. Sua conta..." | "Pagamento seguro via AbacatePay. Sua conta..." |
| `src/app/(dashboard)/pricing/actions.ts` | Verificar copy de erro (não vi PIX, ok). | — |

**LP de marketing (PR #43):** mantém "Pagamento via AbacatePay" sem detalhar método. Confirmado, OK.

### Problema 6 — Mensagem redundante na pricing

| Arquivo (linha) | Mudança |
|---|---|
| `src/app/(dashboard)/pricing/page.tsx:127-137` | **Remover** o bloco `{!success && (upgrade || reason) && (...)}`. Os 3 cards + headline `"Escolha o plano ideal para você"` já comunicam intenção. **Manter** apenas o caso `success=true` (confirmação pós-pagamento). |

---

## Diff Conceitual (resumo das mudanças)

### Forum gate (Cenário B — recomendado)
- Middleware deixa `/forum` passar pra free.
- Layout do forum injeta `previewMode` baseado em role.
- Components do forum recebem `previewMode` e:
  - Listing: render normal, threads viram botões que abrem modal de paywall.
  - Thread detail: redirect direto.
  - Actions (like/comment/follow/post): toast paywall.
- Servidor já bloqueia mutations via `requirePaidTier()`. Defesa em profundidade mantida.

### Button cursor
- 1 linha em `button-variants.ts`: adicionar `cursor-pointer` no cva base.
- 1 regra em `globals.css` como safety net pra interactives fora do design system.

### Paywall messaging
- Novo helper `paywall-toast.tsx` reutilizável.
- Catches em forms/actions detectam `PaywallError` e disparam toast unificado com CTA pra `/pricing`.

### Welcome/checkout backflow
- Botão "voltar" explícito no `/welcome`.
- Link "trocar plano" aponta pra rota interna `/pricing` ao invés de anchor da LP.

### PIX/parcelado removal
- 5 strings substituídas em 3 arquivos. Cosmético.

### Pricing redundância
- Remover bloco condicional de mensagem "essa funcionalidade requer plano". Cards falam por si.

---

## Ordem de Execução (dentro do PR único)

1. **Problema 2 (cursor pointer)** — 5min. Fix global, valida tudo de uma vez.
2. **Problema 6 (msg redundante)** — 5min. Remoção limpa.
3. **Problema 5 (PIX/parcel internos)** — 15min. Find-replace direto.
4. **Problema 3 (mensagens paywall)** — 1h. Novo helper + replace em 4 forms.
5. **Problema 4 (voltar pós-conta)** — 30min defensivo (sem confirmação).
6. **Problema 1 (forum preview, se Cenário B)** — 4-6h. Maior, último, isolável.

**Critério de cut-off:** se forum preview ultrapassar 6h, isolar em PR separado e mergear o resto antes.

---

## Critério de Aceitação (Given/When/Then)

### Problema 1 (Cenário B)
- **Given** sou usuário free logado, **When** acesso `/forum`, **Then** vejo listing das threads com título + autor + preview da 1ª linha.
- **Given** sou free, **When** clico numa thread, **Then** modal "Assine pra ler completo" aparece com CTA pra `/pricing`.
- **Given** sou free, **When** tento dar like/comentar/postar, **Then** toast aparece "Você precisa assinar pra [ação]" com CTA `/pricing`.
- **Given** sou pro/premium, **When** acesso forum, **Then** experiência idêntica à atual (zero regressão).

### Problema 2
- **Given** estou em qualquer página, **When** passo o mouse em qualquer botão, link ou elemento clicável, **Then** cursor é `pointer`.

### Problema 3
- **Given** sou free e tento ação bloqueada (post, like, follow), **When** dispara, **Then** mensagem é "Você precisa assinar pra [ação]" com link pra `/pricing`. **Nunca** "tente novamente" pra ação de paywall.

### Problema 4
- **Given** estou em `/welcome` ou `/checkout/[plano]`, **When** quero voltar, **Then** existe CTA visível que volta pra `/pricing` sem F5 nem navegação manual.

### Problema 5
- **Given** estou logado em qualquer página interna (forum, dashboard, pricing logado, checkout, welcome), **When** procuro menção a "PIX", "parcelado", "boleto", "12x", "cartão", **Then** **não encontro nenhuma**. Apenas "AbacatePay" sem detalhar método.

### Problema 6
- **Given** acesso `/pricing` sendo redirect de paywall (`?upgrade=pro&from=/forum`), **When** carrega, **Then** vejo só os 3 cards + headline. **Não vejo** mensagem extra "essa funcionalidade requer plano".

---

## Estimativa de Esforço

| Problema | Esforço (h de agente) | Risco |
|---|---:|---|
| 1. Forum preview (Cenário B) | 4-6h | Médio — testar fluxo free + pro + premium + admin |
| 1. Forum preview (Cenário A — não fazer) | 0h | — |
| 2. Cursor pointer | 0.25h | Baixo |
| 3. Mensagens paywall | 1h | Baixo |
| 4. Voltar pós-conta | 0.5h | Médio (depende de confirmação) |
| 5. PIX/parcel internos | 0.25h | Baixo |
| 6. Msg redundante | 0.1h | Baixo |
| **TOTAL Cenário A** | **~2h** | — |
| **TOTAL Cenário B** | **~6-9h** | Médio |

---

## Testes Manuais (passo a passo, pra você validar)

**Pré-requisito:** ter 2 contas: 1 free, 1 pro (ou premium).

### Validação 1 — Cursor
1. Abre `https://sinapse.club` em qualquer página
2. Passa mouse em qualquer botão preto, link, card clicável
3. Cursor vira mãozinha em **todos**

### Validação 2 — Forum free (Cenário B)
1. Loga com conta free
2. Vai em `/forum` — vê listing
3. Clica numa thread — modal "Assine pra ler" aparece
4. Tenta dar like — toast "Você precisa assinar pra curtir"
5. Tenta criar post — composer escondido ou toast paywall
6. Clica em "Ver planos" no toast → vai pra `/pricing`

### Validação 3 — Forum pro (regressão)
1. Loga com conta pro
2. Vai em `/forum` — tudo funciona igual antes
3. Posta, curte, comenta — sem fricção

### Validação 4 — Pricing limpo
1. Logado free, tenta ir em `/feed` (gated)
2. Redirect pra `/pricing?upgrade=pro&from=/feed`
3. Vê os 3 cards + headline. **Não vê** mensagem "essa funcionalidade requer plano" extra.

### Validação 5 — Sem PIX interno
1. Logado, navega `/pricing`, `/checkout/anual`, `/welcome`, qualquer página dashboard
2. `Ctrl+F` e busca "PIX", "parcel", "12x", "boleto"
3. **Zero ocorrências** em páginas internas. (LP marketing não conta — é landing, ok manter "AbacatePay".)

### Validação 6 — Voltar pós-conta
1. Vai pra `/welcome?plan=anual&email=teste@x.com` (sem logar)
2. Topo da página tem botão "← Voltar pra escolher outro plano" visível
3. Clica → vai pra `/pricing`

### Validação 7 — Mensagens paywall
1. Free logado, qualquer ação bloqueada
2. Mensagem **explícita** com a palavra "assinar" ou "plano"
3. **Não** vê "tente novamente" em ação de paywall

---

## Risco / Bloqueador

| Item | Status | Resolução |
|---|---|---|
| Decisão A (gate total vs preview) | **BLOQUEADOR** pra começar problema 1 | Você decide A/B/C |
| Decisão B (qual tela do "voltar") | Parcial — 3 fixes defensivos cobrem | Pode executar sem confirmação |
| Forum preview pode quebrar SEO/scraping | Risco médio (Cenário B mitiga, C agrava) | `noindex` em listing free, rate limit |
| Conflito com PR #43 (já aberto) | Baixo | PR #43 só toca LP marketing; este PR pega dashboard interno. Sem overlap real. |
| Conflito com PR #44 (legal WCAG) | Zero | Áreas diferentes |
| Mudança de paywall pode confundir usuário pagante existente | Baixo | Pro/premium não vê mudança nenhuma |

---

## Validação Visual (chrome-devtools MCP)

Antes do PR final, rodar via chrome-devtools (executor: agente, você só valida o resultado):

| Tela | Antes | Depois | Critério |
|---|---|---|---|
| `/forum` (free) | Redirect pra `/pricing` | Listing com paywall modal | Visual on-brand |
| `/forum/thread/[id]` (free) | Redirect | Redirect (mantido em B) ou paywall card (C) | Conforme decisão |
| `/pricing?upgrade=pro` | 2 mensagens | 3 cards limpos | Sem redundância |
| `/welcome` | Sem botão voltar | Botão voltar topo | Hierarquia visual ok |
| `/checkout/anual` | "Parcelavel no cartao" | "Cobrado a cada 6 meses" | Copy limpa |
| Hover em botões | Cursor padrão em alguns | Pointer em todos | Microinteração |

Screenshots antes/depois salvos em `docs/auditoria/screenshots/2026-04-29-fix-paywall-ux/`.

---

## DS Compliance

- Paywall modal e toast: `[rule 01]` B&W absoluto, `[rule 04]` Inter/Sora 1-2 pesos, `[rule 05]` evitar dead-zone 32-48px nos textos.
- Container: `max-w-screen-2xl` se criar nova seção.
- Grain SVG mantido nos overlays do modal.
- Cursor pointer não impacta DS (microinteração padrão).

---

## Próximo Passo

Você responde:
1. **Decisão A:** A, B ou C? (recomendo B)
2. **Decisão B:** confirma qual tela do "voltar" ou OK com fix defensivo das 3?
3. **PR único ou 2 PRs (separar problema 1)?** (recomendo 1 único se Cenário A; 2 se Cenário B)

Depois disso, agente executa direto sem mais perguntas. Estimativa de wall-time: **meio dia** (Cenário A) ou **1 dia** (Cenário B).
