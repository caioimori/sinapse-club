# STRIPE-2.1 — Custom Checkout com Stripe (Payment Element branded SINAPSE)

**Status:** Ready
**Epic:** Migracao AbacatePay -> Stripe (somente cartao)
**Owner:** Caio (solo)
**Branch:** `caio/feat/stripe-custom-checkout`
**Plano de referencia:** `docs/auditoria/2026-04-29-stripe-migration-PLAN.md`

---

## Goal

Implementar checkout proprio (`/checkout/[plano]`) com Stripe Payment Element renderizado inline, branded SINAPSE (B&W absoluto, brandbook 12 regras), substituindo o redirect AbacatePay. Manter AbacatePay como fallback via feature flag `PAYMENT_PROVIDER`.

## Acceptance Criteria

### AC1 — Feature flag controlando provider
**Given** a env var `PAYMENT_PROVIDER` pode ser `stripe` ou `abacatepay` (default: `abacatepay`)
**When** `PAYMENT_PROVIDER=stripe`
**Then** `/checkout/[plano]` renderiza `<StripeCheckoutForm>` com Payment Element branded
**And** webhook ativo e `/api/webhooks/stripe`
**Given** `PAYMENT_PROVIDER=abacatepay` (ou nao setado)
**Then** fluxo legado AbacatePay continua intocado

### AC2 — Server action cria Customer + Subscription
**Given** visitor preenche nome+email+consent em `/checkout/[plano]`
**When** submit
**Then** server action `createStripeSubscriptionForVisitor` cria:
- `stripe.customers.create({ email, name })`
- `stripe.subscriptions.create({ customer, price, payment_behavior: 'default_incomplete', payment_settings: { payment_method_types: ['card'] }, expand: ['latest_invoice.payment_intent'] })`
**And** retorna `{ ok: true, clientSecret, subscriptionId }`
**And** consent eh logado em `pre_signup_consent` (best-effort)

### AC3 — Payment Element branded B&W renderiza inline
**Given** clientSecret retornado da server action
**When** componente `<StripeCheckoutForm>` monta
**Then** renderiza `<Elements stripe={stripePromise} options={{ clientSecret, appearance }}>`
**And** Appearance API aplica:
- `theme: 'night'`
- `colorBackground: #0A0A0A`, `colorText: #FAFAFA`, `colorPrimary: #FAFAFA`
- `borderRadius: '0px'`
- `fontFamily: Inter`
- Labels em uppercase + letterSpacing 0.05em
**And** payment_method_types restrito a `['card']`
**And** botao "Pagar R$ X,XX" abaixo do Element

### AC4 — confirmPayment com return_url
**When** user submeta cartao
**Then** chama `stripe.confirmPayment({ confirmParams: { return_url: ${baseUrl}/welcome?plan=${plan} } })`
**And** em sucesso, browser redireciona pra `/welcome` com sessao ja ativa via webhook
**And** em falha, redireciona pra `/pagamento/falhou?error=...`

### AC5 — Webhook handler `/api/webhooks/stripe`
**Given** Stripe envia evento com header `stripe-signature`
**When** handler recebe POST
**Then** valida via `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)` (rejeita 400 se invalido)
**And** registra evento em `stripe_webhook_events` (PK = `event.id`) com INSERT — se UNIQUE conflict, retorna 200 idempotent
**And** processa eventos:
- `customer.subscription.created` / `invoice.payment_succeeded` -> ativa plano + cria user (signup-after-payment) + magic link
- `invoice.payment_failed` -> marca status=past_due
- `customer.subscription.deleted` -> downgrade pra free
**And** rate limit `rateLimiters.webhook` aplicado

### AC6 — Migration `stripe_webhook_events`
**Given** novo arquivo `supabase/migrations/YYYYMMDD_stripe_webhook_events.sql`
**Then** cria tabela com colunas `id TEXT PK`, `type TEXT`, `processed_at TIMESTAMPTZ`, `payload JSONB`
**And** RLS enabled (sem policy = service_role only)
**And** indice em `processed_at DESC`

### AC7 — Pagina /pagamento/falhou
**Given** rota `/pagamento/falhou`
**When** acessada
**Then** mostra mensagem branded com erro do Stripe + botao "Tentar novamente" -> volta /checkout/[plano]
**And** suporta query param `?error=...` pra exibir motivo

### AC8 — Customer Portal redirect
**Given** rota `/api/billing/portal`
**When** user logado faz GET
**Then** cria `stripe.billingPortal.sessions.create({ customer, return_url })`
**And** redireciona 302 pro `session.url`

### AC9 — LGPD: Stripe sub-processador
**Given** `/privacidade` ja lista subprocessadores
**When** plano flagado pra Stripe
**Then** linha "Stripe Inc." adicionada com:
- Pais: EUA / Irlanda
- Salvaguarda: SCCs (DPA Stripe v2026)
- Finalidade: Processamento de pagamentos com cartao

### AC10 — Build/lint/typecheck OK
- `npm run build` passa
- `npm run lint` passa
- TypeScript sem erros

## Scope

### IN
- `src/lib/stripe.ts` (SDK wrapper + Subscriptions helpers)
- `src/lib/payment-provider.ts` (feature flag)
- `src/app/checkout/[plano]/page.tsx` (route flag-aware)
- `src/app/checkout/[plano]/stripe-checkout-form.tsx` (novo, Payment Element)
- `src/app/checkout/[plano]/actions.ts` (adicionar `createStripeSubscriptionForVisitor`)
- `src/app/api/webhooks/stripe/route.ts` (novo)
- `src/app/api/billing/portal/route.ts` (novo)
- `src/app/pagamento/falhou/page.tsx` (novo)
- `supabase/migrations/20260427000001_stripe_webhook_events.sql`
- `.env.example` atualizado
- `src/app/(marketing)/privacidade/page.tsx` (adicionar Stripe)
- `docs/onboarding-stripe.md` (novo)
- `docs/design/checkout-cro-design.md` (novo)
- Install: `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`

### OUT
- Migracao real de usuarios atuais AbacatePay (Fase 8 do plano)
- Apple Pay / Google Pay (Fase 2 futura)
- Cupons de desconto (Fase 2)
- Trial gratuito (decisao do Caio)
- Stripe Tax (decisao: nao usar)
- E2E Cypress/Playwright (smoke manual com 4242)

## Dependencies

- Matheus precisa fornecer 7 env vars (KYC Stripe BR aprovado)
- `pre_signup_consent` table ja existe (migration `20260427000000`)
- `subscriptions` table ja tem `stripe_customer_id`/`stripe_subscription_id`

## Complexity

**STANDARD** (score ~12). Multi-file, integra externo (Stripe), novo webhook handler, mas reutiliza padroes existentes (rate-limit, supabase admin, signup-after-payment).

## Test Plan

1. Local com `PAYMENT_PROVIDER=stripe` + keys de teste Stripe
2. Cartao 4242 4242 4242 4242 (success) -> webhook chega -> user criado -> redireciona /welcome
3. Cartao 4000 0000 0000 0002 (declined) -> redireciona /pagamento/falhou
4. Cartao 4000 0025 0000 3155 (3DS) -> 3DS challenge -> success
5. Replay webhook -> idempotency (segundo POST do mesmo event.id retorna 200 sem reprocessar)
6. Toggle flag pra `abacatepay` -> fluxo legado funciona
7. `/api/billing/portal` (logado) -> redireciona pro Stripe Portal

## Notes

- Pricing dos planos vem do Stripe (price ID), nao do `abacatepay.ts` (manter PLANS la pra labels e periodDays apenas).
- Webhook handler Stripe e SEPARADO do AbacatePay — ambos coexistem em prod por 30 dias (Fase 8 deleta AbacatePay).
- Caio testa local; Soier configura env vars no Vercel + webhook no Stripe dashboard pos-merge.
