# Plano de Execução — Checkout Próprio sinapse.club (AbacatePay como processador)

**Data:** 2026-04-29
**Autor:** product-orqx (Vector)
**Status:** PLANO — não executar até decisão do Caio
**Repo:** `sinapse-plataform`
**Stack alvo:** Next.js 16 + Tailwind + Supabase + AbacatePay V1/V2 API

---

## 1. Sumário Executivo

Investigamos a documentação oficial da AbacatePay (`docs.abacatepay.com/llms.txt` + endpoints específicos) e descobrimos a **restrição estrutural** que define o plano:

> **AbacatePay NÃO oferece API direta para cartão de crédito.** O endpoint "transparente" (`POST https://api.abacatepay.com/v2/transparents/create`) aceita APENAS `method: "PIX"` ou `method: "BOLETO"`. Cartão só existe via `/v1/billing/create` (checkout hosted que estamos usando hoje), ou dentro do BOLETO híbrido.

Consequência: dá pra fazer **PIX 100% white-label** (UI nossa, brandbook SINAPSE puro). Cartão obriga **híbrido** — três opções honestas, nenhuma "100% nossa UI sem trade-off". O plano abaixo propõe **PIX-first nativo + cartão via redirect branded** como MVP, com upgrade futuro pra cartão tokenizado se a AbacatePay liberar (ou se migrarmos pra outro PSP).

---

## 2. O Que a API da AbacatePay Permite (verdade documentada)

### 2.1 PIX Transparente — VIÁVEL 100% white-label

| Item | Detalhe |
|---|---|
| Endpoint | `POST https://api.abacatepay.com/v2/transparents/create` |
| Método | `"PIX"` ou `"BOLETO"` (não aceita CARD) |
| Response | `{ id, amount, status, brCode, brCodeBase64, ... }` |
| Fluxo | Server cria charge → recebe QR code base64 → renderizamos no nosso layout |
| Confirmação | Webhook `billing.paid` (ou polling em `/transparents/check`) |
| Webhook security | Query param `webhookSecret` + header `X-Webhook-Signature` (HMAC-SHA256, comparar com `timingSafeEqual`) |

Conclusão: PIX é puro **dado** (string + base64). Renderizamos como QR + copia-cola usando Sora/Inter, B&W, grain. Zero iframe, zero redirect.

### 2.2 Cartão de Crédito — NÃO TEM API DIRETA

A documentação lista cartão apenas em:
- `/v1/billing/create` (hosted checkout — o que usamos hoje, redirect)
- `/pages/payment/installments` (configuração de parcelas dentro do hosted)

**Não existe** endpoint tipo `POST /cards/charge` com `card_number`, `cvv`, `holder` recebendo dados crus. Não existe SDK de tokenização client-side documentado (tipo Stripe Elements ou Pagar.me Checkout.js).

Implicação prática:
1. **Coletar cartão direto no nosso formulário ≠ legal/viável.** Exigiria certificação PCI-DSS Level 1 (>R$ 50k/ano + auditoria + escopo de infra brutal). Inviável pra Sinapse hoje.
2. **Não existe iframe/Hosted Fields oficial da AbacatePay** (verificado na doc — só hosted checkout completo).
3. Única forma legal de processar cartão hoje: redirect pro hosted checkout deles.

### 2.3 Boleto

`method: "BOLETO"` no transparente retorna PDF/linha digitável + PIX alternativo. White-label OK, mas baixíssima conversão pra produto digital de R$ 29-37/mês. **Fora do MVP.**

---

## 3. Decisão Arquitetural (3 caminhos honestos)

| Opção | PIX | Cartão | UI 100% nossa? | Esforço | Risco |
|---|---|---|---|---|---|
| **A — PIX nativo + cartão redirect branded** | Nativo nosso | Hosted AbacatePay (com `returnUrl` e visual o mais parecido possível) | PIX sim, cartão não | **Baixo** (~12-16h) | Baixo |
| **B — PIX nativo + cartão "loading branded" + redirect curto** | Nativo nosso | Tela nossa de "preparando pagamento seguro" + redirect rápido + retorno branded | PIX sim, cartão parcial | **Médio** (~20h) | Baixo |
| **C — Migrar PSP (Pagar.me/Stripe BR/Asaas)** | Nativo | Tokenização client-side (Stripe Elements style) | Sim ambos | **Alto** (~60h+) | Alto (revalidar webhooks, testes, docs LGPD, contrato novo) |

**Recomendação:** **Opção A como MVP** (lança em 1-2 dias). Opção C entra no roadmap só se métricas pós-launch mostrarem que cartão redirect derruba conversão >15%.

Justificativa: 70%+ dos checkouts no Brasil pra produtos digitais R$ <50 são PIX. Investir 60h pra otimizar cartão antes de validar é over-engineering.

---

## 4. Arquitetura Proposta (Opção A — MVP)

### 4.1 Fluxo PIX (white-label)

```
[/checkout/[plano]] → form coleta nome+email+CPF (opcional)
       ↓ Server Action `createPixPayment()`
[POST /v2/transparents/create method:PIX]
       ↓ retorna { id, brCode, brCodeBase64, expiresAt }
[/checkout/[plano]/pix?id=xxx] → renderiza QR + copia-cola + timer
       ↓ Supabase Realtime channel OR polling (5s) em GET /v2/transparents/check
[status === "PAID"] → redirect /welcome?plan=...
       ↓ webhook (independente, idempotente) cria user via auth.admin.createUser
```

### 4.2 Fluxo Cartão (redirect branded)

```
[/checkout/[plano]] → escolhe "Cartão"
       ↓ Server Action `createCardCheckout()` (mantém createPlanBilling existente)
[/checkout/[plano]/cartao] → tela nossa: "Te levando ao pagamento seguro..."
       ↓ window.location = billing.url (AbacatePay hosted)
[AbacatePay hosted UI — fora do nosso domínio]
       ↓ completionUrl
[/welcome?plan=...] → tela nossa branded
```

### 4.3 Componentes novos (DS Compliance — brandbook 12 regras)

| Componente | Responsabilidade | DS notes |
|---|---|---|
| `PaymentMethodToggle` | Switch PIX / Cartão | Sora 14px, B&W, traço fino animado entre opções |
| `PixQrDisplay` | QR + copia-cola + botão copy | QR em frame com crosshair, fundo grain, instrução em Inter 12px uppercase |
| `PaymentStatusTimer` | Countdown 15min + status badge | JetBrains pra timer, status em capslock, transição reversível |
| `PaymentSuccessScreen` | Pós-pagamento branded | Headline 120px assimétrico, "PAGO" gigante, próximo passo claro |
| `CardRedirectInterstitial` | Tela "te levando ao pagamento" | 2-3s, spinner reversível (não infinito), texto educativo |

**Validação visual obrigatória:** rodar regras 01-12 do brandbook antes de mergear. Sem `max-w-7xl`, sem headline 32-48px, com camada grain SVG.

---

## 5. Páginas / Arquivos a Criar/Modificar

### Novos
- `src/app/checkout/[plano]/pix/page.tsx` — tela PIX (server component + client polling)
- `src/app/checkout/[plano]/pix/pix-display.tsx` — client component QR + status
- `src/app/checkout/[plano]/cartao/page.tsx` — interstitial pré-redirect
- `src/components/checkout/payment-method-toggle.tsx`
- `src/components/checkout/payment-status-timer.tsx`
- `src/lib/abacatepay-transparent.ts` — wrapper `createPixPayment`, `checkPixStatus`
- `src/app/welcome/page.tsx` — refazer pra ficar branded SINAPSE (ou auditar o atual)

### Modificados
- `src/app/checkout/[plano]/page.tsx` — adicionar toggle PIX/Cartão
- `src/app/checkout/[plano]/checkout-form.tsx` — submit divergente por método
- `src/app/checkout/[plano]/actions.ts` — `createCheckoutForVisitor` ramifica em `createPixPayment` ou `createCardCheckout`
- `src/app/api/webhooks/abacatepay/route.ts` — garantir tratamento de evento `billing.paid` vindo de `/transparents/create` (pode ter shape diferente do `/v1/billing/create`); validar HMAC-SHA256 timingSafeEqual
- `src/lib/abacatepay.ts` — manter para fluxo cartão; isolar PIX no novo arquivo

### Schema Supabase
- Tabela `pending_payments` (id_charge, email, plan, method, status, expires_at, created_at) pra polling/realtime
- RLS: visitor consegue SELECT só pelo id_charge na URL (anon key + filter); webhook UPDATE via service_role

---

## 6. Migração e Rollout

### Feature flag
`process.env.NEXT_PUBLIC_CUSTOM_CHECKOUT_ENABLED` = `"true" | "false"`
- Default `false` no início — fluxo atual continua intocado
- `true` em produção apenas após smoke test em dev + 1 PIX real testado

### Rollback
- Flag pra `false` reverte instantaneamente pro `createPlanBilling` atual
- Webhook handler aceita BOTH formatos (legacy `/v1` e novo `/v2 transparents`)
- Nenhuma migration destrutiva — só adiciona tabela `pending_payments`

### Convivência
- Usuários no meio do fluxo PIX (ID gerado) continuam mesmo se a flag desligar — polling do status segue funcionando enquanto charge não expirar (15min)

---

## 7. Webhook Idempotency (crítico)

- Validar `X-Webhook-Signature` com HMAC-SHA256 + `timingSafeEqual` (já parcialmente feito no handler atual — auditar)
- Validar `webhookSecret` na query string
- Persistir `event_id` em tabela `webhook_events_processed` (PK = event_id) — INSERT com ON CONFLICT DO NOTHING. Se conflito, retornar 200 OK sem reprocessar.
- Evento `billing.paid` cria user (se não existe) + concede acesso. Re-entrega ⇒ no-op.

---

## 8. Timeline e Esforço (horas-agente)

### Fase 1 — MVP PIX (~10-12h)
1. Wrapper `abacatepay-transparent.ts` + types (1h)
2. Tabela `pending_payments` + migration + RLS (1h)
3. Server action `createPixPayment` + branching no form (2h)
4. Página `/checkout/[plano]/pix` + componente `PixQrDisplay` (3h)
5. Polling/Realtime status (1.5h)
6. Webhook handler — aceitar shape `/v2/transparents` + idempotency table (1.5h)
7. Tela `welcome` branded (1h)

### Fase 2 — Cartão branded redirect (~4h)
8. Interstitial `/checkout/[plano]/cartao` (1.5h)
9. Toggle PIX/Cartão no form (1h)
10. Refinar tela welcome pra cobrir ambos os caminhos (1.5h)

### Fase 3 — Polish DS (~4h)
11. Aplicar brandbook regras 01-12 em todos os novos componentes (2h)
12. Animações reversíveis (Framer Motion, respeitar `prefers-reduced-motion`) (1h)
13. QA visual + ajustes (1h)

### Fase 4 — Validação (~2h)
14. Smoke test em dev mode AbacatePay (1h)
15. 1 transação PIX real R$ 1 + 1 cartão real (1h)

**Total MVP: ~20-22h-agente.** Pode ir pra prod em 2 sessões focadas.

### Dependências externas
- AbacatePay devMode habilitado pra testes (já tem)
- Confirmar nome do evento webhook em `/v2/transparents` (pode ser `pix.paid` em vez de `billing.paid` — verificar com 1 cobrança devMode)
- Decisão Caio sobre Opção A vs B vs C (ver §10)

---

## 9. Critério "Pronto pra Divulgar"

- [ ] PIX flow 100% nossa UI funciona em prod (1 transação real)
- [ ] Cartão flow tem interstitial branded e tela de retorno branded
- [ ] Webhook idempotente confirmado (testar entrega dupla)
- [ ] DS Gate: brandbook 12 regras passa em validação visual
- [ ] LGPD: consent table grava antes do redirect/QR
- [ ] Métricas baseline: dashboard simples mostrando taxa PIX vs Cartão (Supabase view)
- [ ] Feature flag testada (liga/desliga sem quebrar)
- [ ] Rollback plan documentado e testado

**Não-bloqueante pra divulgar:** cartão direto white-label (Opção C). Entra em roadmap se métrica de cartão derrubar conversão.

---

## 10. PERGUNTA CRÍTICA PRO CAIO

**A AbacatePay não tem API direta de cartão. As três opções honestas são:**

1. **Opção A (recomendada, ~20h):** PIX 100% white-label nosso + Cartão via redirect AbacatePay com tela branded antes/depois. Lança em 2 sessões.
2. **Opção B (~28h):** Igual A, mas com interstitial mais elaborado e tela de retorno mais teatral pra disfarçar o redirect.
3. **Opção C (~60-80h):** Trocar de PSP (Pagar.me / Stripe BR / Asaas) pra ter cartão tokenizado client-side 100% white-label. Requer revalidação completa de webhook, contratos, LGPD, e provavelmente tarifas diferentes.

**Você topa Opção A — cartão via redirect branded — sabendo que o cartão ainda passa por uma URL `pay.abacatepay.com` por ~20 segundos? Ou prefere Opção C (trocar de PSP) pra ter tudo white-label desde o lançamento?**

(Não existe "PIX e cartão 100% nossa UI mantendo AbacatePay" — essa combinação é fisicamente impossível dado o que a API deles expõe hoje.)

---

## 11. Pós-MVP — Roadmap Futuro

- Métricas: heatmap de abandono por método (Cartão tem queda? quanto?)
- Se Cartão queda >15% vs PIX → reabrir Opção C
- Recovery email pra PIX expirado (gerar novo charge automático)
- Apple Pay / Google Pay (depende do PSP)
- One-click checkout pra returning users
