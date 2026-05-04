# Onboarding Stripe — sinapse.club

**Quem precisa fazer:** Soier (responsavel pela conta Stripe BR PJ)
**Pre-requisito:** KYC Stripe BR aprovado (5-10 dias uteis)
**Tempo total:** ~30 minutos apos KYC liberado

---

## 1. Criar Products e Prices no Stripe Dashboard

Login: https://dashboard.stripe.com → Products → Add product

### Produto unico: "SINAPSE Forum"

Crie **1 Product** com 3 Prices recurring:

| Price | Valor | Recurrence |
|---|---|---|
| Mensal | R$ 37,90 | Every 1 month |
| Semestral | R$ 203,40 | Every 6 months |
| Anual | R$ 358,80 | Every 1 year |

Em cada Price:
- **Currency:** BRL
- **Type:** Recurring
- **Billing period:** ajustar conforme tabela acima
- **Tax behavior:** Inclusive (preco ja contem impostos — Stripe Tax desativado)
- **Description:** opcional

Apos criar, copie o `price_xxx` ID de cada um (aba Pricing > clicar no Price > copiar ID no canto superior direito).

---

## 2. Criar Webhook Endpoint

Dashboard → Developers → Webhooks → Add endpoint

- **Endpoint URL:** `https://sinapse.club/api/webhooks/stripe`
  (Em staging/preview, usar a URL do deploy correspondente)
- **Description:** "sinapse.club production webhook"
- **Events to send:** selecionar:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.paid`
  - `invoice.payment_failed`

Apos criar, clique no endpoint → "Reveal signing secret" → copie o `whsec_xxx`.

---

## 3. Configurar 7 Env Vars no Vercel

Vercel Dashboard → Project sinapse-club → Settings → Environment Variables

Adicionar pra **Production** e **Preview**:

| Var | Valor | Onde pegar |
|---|---|---|
| `PAYMENT_PROVIDER` | `stripe` | Literal — ativa fluxo Stripe |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` (prod) / `sk_test_xxx` (preview) | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` / `pk_test_xxx` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | Stripe Dashboard → Webhooks → endpoint criado → Signing secret |
| `STRIPE_PRICE_MENSAL` | `price_xxx` | Stripe Dashboard → Products → Mensal price |
| `STRIPE_PRICE_SEMESTRAL` | `price_xxx` | Stripe Dashboard → Products → Semestral price |
| `STRIPE_PRICE_ANUAL` | `price_xxx` | Stripe Dashboard → Products → Anual price |

Apos salvar, fazer redeploy pra propagar (Vercel → Deployments → Redeploy).

---

## 4. Customer Portal (configurar uma vez)

Dashboard → Settings → Billing → Customer portal → Activate

Configuracoes:
- **Branding:** carregar logo SINAPSE (preto sobre fundo claro ou branco sobre escuro)
- **Cores:** primaria `#FAFAFA`, fundo `#0A0A0A`
- **Funcionalidades habilitadas:**
  - [x] Customer can update payment method
  - [x] Customer can cancel subscriptions
  - [x] Customer can view invoice history
  - [ ] Customer can switch plans (Fase 2 — exige Products config adicional)
- **Cancelation policy:** `at_period_end` (mantem acesso ate fim do ciclo pago)

Salvar.

---

## 5. DPA + SCCs (LGPD)

Dashboard → Settings → Legal → Data Processing Agreement → Sign DPA

O DPA Stripe v2026 ja inclui SCCs (Standard Contractual Clauses) anexadas.
Apos assinar, baixar PDF e arquivar no Drive da empresa (`Documentos Legais/Stripe DPA 2026.pdf`).

---

## 6. Testar antes do cutover (staging)

1. Em Vercel preview, configurar as 7 env vars com valores `_test_`
2. Acessar `/checkout/mensal` no preview
3. Cartao 4242 4242 4242 4242, qualquer CVV/data futura
4. Confirmar:
   - Webhook chega (Stripe Dashboard → Webhooks → eventos)
   - User criado no Supabase
   - Magic link enviado
   - Acesso ativo em `/forum`

---

## 7. Cutover Production

Apos staging OK:
1. Trocar env vars no Vercel **Production** pra valores `_live_` + `PAYMENT_PROVIDER=stripe`
2. Redeploy
3. Smoke test com cartao real R$ 37,90 (mensal)
4. Refund manual no Dashboard → Payments
5. Monitorar Sentry e Stripe Dashboard primeiras 24h

---

## Recursos de recovery — ativar pra subir conversao (CRITICO)

Apos criar a conta e ANTES de divulgar, ativar esses 3 toggles no dashboard Stripe. Sao gratis e recuperam 10-25% dos pagamentos que iam falhar.

### 1. Smart Retries (recupera cartao recusado)
- **Caminho:** Settings -> Billing -> Subscriptions and emails -> Smart retries
- **Acao:** ativar
- **O que faz:** Stripe tenta o cartao novamente em horarios otimizados quando ha falha temporaria (saldo, limite). Recupera 10-15% sem cliente fazer nada.
- **Custo:** zero. Embutido no plano.

### 2. Card Updater (atualiza cartao expirado/trocado)
- **Caminho:** Settings -> Billing -> Card updater
- **Acao:** ativar
- **O que faz:** quando bandeira do cartao avisa que cliente trocou de cartao (expirou, perdeu, foi roubado), Stripe atualiza automatico sem o cliente precisar fazer nada.
- **Custo:** ~$0.25 por atualizacao bem-sucedida. Vale sempre a pena.

### 3. Recovery Emails (recupera carrinho abandonado)
- **Caminho:** Settings -> Billing -> Subscriptions and emails -> Customer emails
- **Acao:** ativar todos os toggles relevantes:
  - "Send emails about expiring credit cards"
  - "Send emails when card payments fail"
  - "Send finalization emails"
- **O que faz:** Stripe manda email automatico em ingles quando algo falha. (Versao em portugues + branding nosso vem na Sprint 2 via Resend + webhook custom.)

---

## Rollback

Se algo quebrar pos-cutover:
1. Vercel → env `PAYMENT_PROVIDER=abacatepay` → Redeploy
2. Fluxo legado AbacatePay volta automaticamente
3. Webhook Stripe continua ativo recebendo eventos (idempotente, nao quebra)
4. Subscriptions Stripe ja criadas continuam ativas (nao destrutivo)

---

## Suporte

- **Documentacao Stripe:** https://docs.stripe.com
- **Suporte Stripe:** https://support.stripe.com (chat 24/7)
- **Issues internas:** abrir issue no GitHub do `sinapse-plataform`
