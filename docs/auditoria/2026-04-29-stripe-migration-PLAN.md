# Plano de Migração: AbacatePay → Stripe (somente cartão)

**Data:** 2026-04-29
**Autor:** Vector (squad-product)
**Status:** PLANO — não executado
**Repo:** `sinapse-plataform`
**Branch alvo:** a criar (`caio/feat/stripe-migration` quando Fase 1 começar)

---

## Sumário Executivo (10 linhas)

1. Trocar AbacatePay (hosted checkout, V1, PIX+Card) por **Stripe Custom Checkout** (Payment Element + Elements branded), **somente cartão**.
2. Conta Stripe será do **Matheus** (PJ), modelo **Subscriptions** com `customer.subscription.*` (não Payment Intents avulsos) — alinha com renovação automática mensal/semestral/anual.
3. Trade-off aceito: perde ~30-50% conversão BR (sem PIX) em troca de **UX 100% branded** (B&W absoluto, sem logo Stripe nem domínio externo).
4. Schema do Supabase **já tem** `stripe_customer_id` e `stripe_subscription_id` (legado reciclado pelo AbacatePay) — **não precisa migration de schema**, só semântica volta a ser literal.
5. Arquitetura: `/checkout/[plano]` mantém URL, `<CheckoutForm>` substitui server-action `createCheckoutForVisitor` por chamada à nova API que cria Customer + Subscription + Setup/Payment Intent → Stripe Elements renderiza inline → confirmação via webhook `invoice.payment_succeeded`.
6. Webhook handler vira `/api/webhooks/stripe` com `stripe.webhooks.constructEvent` (assinatura nativa, mais robusta que HMAC manual atual).
7. Estratégia de cutover: **big-bang com feature flag** `PAYMENT_PROVIDER=abacatepay|stripe`. Usuários atuais continuam ativos até `current_period_end` (cobrança anual já paga não precisa migrar — quando renovar, vai pro Stripe).
8. **LGPD:** Stripe é processador internacional (US/IE) — exige SCCs (Standard Contractual Clauses), DPA assinado, atualização de `/privacidade` mencionando Stripe Inc. como sub-processador.
9. **Bloqueador externo crítico:** KYC Stripe BR leva 5-10 dias úteis. Sem isso não rola produção. Matheus precisa começar HOJE pra liberar Fase 5 em ~2 semanas.
10. **Estimativa total:** ~28-36h-agente (Fases 1-6) + ~5-10 dias úteis externos (KYC). Pronto pra divulgar em ~2-3 semanas corridas.

---

## 1. Stripe Brasil — Specifics

### 1.1. Setup da conta (responsabilidade do Matheus)

**Opção escolhida:** Stripe direto (não Stripe Atlas — Atlas é pra abrir LLC nos EUA, overkill pra negócio BR com PJ brasileira).

**Documentos necessários (PJ brasileira):**
- CNPJ ativo
- Contrato social atualizado
- RG/CPF dos sócios + selfie liveness (KYC do representante legal)
- Comprovante de endereço da empresa
- Conta bancária PJ no Brasil (BRL) pra recebimento
- Declaração de atividade econômica (CNAE compatível com infoproduto/SaaS)

**Timeline KYC:** 5-10 dias úteis (Stripe revisa manualmente contas BR). Pode pedir docs adicionais — não é incomum demorar 10-14 dias.

**Settlement:**
- Cartão de crédito: **D+30** no padrão BR (configurável pra D+14 sob solicitação após histórico)
- Cartão de débito: **D+1**
- Saque automático configurável (diário/semanal/mensal) pra conta PJ vinculada

### 1.2. Taxas (Brasil, abril 2026)

| Item | Taxa |
|---|---|
| Cartão de crédito doméstico | **3.99% + R$ 0.39** |
| Cartão de crédito internacional | 4.99% + R$ 0.39 |
| Cartão de débito | 2.99% + R$ 0.39 |
| Subscriptions (recorrência) | sem taxa adicional |
| Disputa/chargeback | R$ 75 (devolvido se ganhar) |
| Stripe Tax (impostos automáticos) | 0.5% por transação |

**Comparação direta com AbacatePay:**
- AbacatePay: 1.99% PIX, 3.49% cartão (sem fixo) → mais barato
- Stripe: ~14% mais caro em cartão, mas ganha branding + APIs maduras + Customer Portal + dunning automático

### 1.3. Bandeiras suportadas (BR)

| Bandeira | Suportada | Notas |
|---|---|---|
| Visa | Sim | |
| Mastercard | Sim | |
| Amex | Sim | aceitação ~70% no BR |
| Elo | Sim | desde 2023 |
| Hipercard | **Verificar** | suporte parcial — confirmar no dashboard antes de prometer |
| Diners | Não | sem suporte BR |

### 1.4. Stripe Tax — decisão

**Recomendação:** **NÃO usar Stripe Tax na Fase 1.** Justificativa:
- Cobra 0.5% extra por transação
- Infoproduto/assinatura no BR é tributado pelo regime do emissor (Simples/LP/LR), não pelo cobrador
- Caio/Matheus já têm contador → emissão de NFS-e fica no BackOffice da empresa (não no Stripe)
- Reavaliar quando expandir pra outros países

---

## 2. Arquitetura Proposta

### 2.1. Stack frontend

**Decisão:** **Stripe Payment Element** (mais novo, agnostic) sobre Card Element legado.
- Renderiza num iframe do Stripe (PCI compliance herdada — SAQ-A)
- Customizável via **Appearance API**: tokens CSS pra fundo, fonte, bordas
- Pode ser styled em B&W absoluto (`#0A0A0A` background, Inter, sem cantos arredondados, sem cores marca Stripe)
- Suporta apenas cartão se configurar `payment_method_types: ['card']`

**Pacotes:**
```
@stripe/stripe-js          # client-side loader
@stripe/react-stripe-js    # <Elements> provider + <PaymentElement>
stripe                     # SDK Node server-side
```

### 2.2. Modelo de cobrança

**Decisão:** **Subscriptions API** (não Payment Intents avulsos).

Razão: usuário compra acesso por período (mensal/semestral/anual) com renovação automática. Subscriptions API resolve:
- Cobrança recorrente automática
- Dunning (retry automático em falha de pagamento — 3 tentativas em 1, 3, 5 dias)
- Customer Portal nativo pra cancel/update card
- Webhooks de ciclo de vida (trial, active, past_due, canceled)
- Pro-rata em upgrades/downgrades de plano

**Mapeamento dos planos atuais → Stripe:**

| Plano atual | Stripe Product | Stripe Price |
|---|---|---|
| `mensal` (R$ 37,90) | `prod_sinapse_forum` | `price_xxx` recurring monthly, R$ 37.90 |
| `semestral` (R$ 203,40) | `prod_sinapse_forum` | `price_xxx` recurring every 6 months, R$ 203.40 |
| `anual` (R$ 358,80) | `prod_sinapse_forum` | `price_xxx` recurring yearly, R$ 358.80 |

Um Product, três Prices (não três Products). Permite upgrade/downgrade entre ciclos no futuro.

### 2.3. Fluxo de checkout (custom)

```
Visitor /checkout/[plano] (sem auth)
  ↓ submit form (name, email, consent)
Server Action: createSubscriptionIntent
  → cria Customer (email, name)
  → cria Subscription incomplete (trial=0, payment_behavior=default_incomplete)
  → retorna clientSecret do PaymentIntent inicial
  ↓
Frontend: <Elements stripe={...} options={{ clientSecret }}>
  → <PaymentElement /> renderiza form de cartão branded
  → user preenche cartão, clica "Pagar"
  → stripe.confirmPayment({ confirmParams: { return_url: /pagamento/processando } })
  ↓
Stripe processa, redireciona pra return_url
  ↓ paralelo
Webhook /api/webhooks/stripe recebe `invoice.payment_succeeded`
  → cria/atualiza usuário Supabase (signup-after-payment)
  → ativa subscription na tabela
  → manda magic link
  ↓
/welcome detecta sessão ativa OU mostra "verifique email"
```

### 2.4. Customer Portal

**Stripe Customer Portal** = página hospedada pelo Stripe pra usuário gerenciar:
- Trocar cartão
- Cancelar assinatura
- Ver histórico de invoices
- Atualizar dados de cobrança

**Decisão:** **usar Customer Portal** na Fase 3, customizado com logo SINAPSE + cores B&W.

Trade-off: é página externa (`billing.stripe.com/...`), mas pra ações de billing (não checkout) é aceitável — usuário já está logado, contexto é gestão.

URL: `/settings/billing` cria sessão Customer Portal e redireciona.

### 2.5. Webhook events necessários

| Event | Ação |
|---|---|
| `customer.subscription.created` | Provisiona user (signup-after-payment) + ativa plano |
| `invoice.payment_succeeded` | Renova `current_period_end`, mantém `status=active` |
| `invoice.payment_failed` | Marca `status=past_due`, notifica user (Stripe manda email automático) |
| `customer.subscription.updated` | Atualiza plano (upgrade/downgrade) |
| `customer.subscription.deleted` | Marca `status=canceled`, downgrade pra `role=free` quando `current_period_end` passar |
| `payment_method.attached` | (opcional) log de troca de cartão |

**Idempotência:** Stripe envia `event.id` único — armazenar em tabela `stripe_webhook_events` (id, processed_at) e dar early-return se já processado. Mais robusto que o approach atual (que checa por `stripe_subscription_id` na tabela subscriptions).

---

## 3. Componentes a Criar/Modificar

### 3.1. Frontend

| Path | Ação | Notas |
|---|---|---|
| `src/app/checkout/[plano]/page.tsx` | **Modificar** | Mantém estrutura split-pane, troca CheckoutForm por StripeCheckoutForm |
| `src/app/checkout/[plano]/checkout-form.tsx` | **Substituir** | Vira `stripe-checkout-form.tsx` com `<Elements>` + `<PaymentElement>` |
| `src/app/checkout/[plano]/actions.ts` | **Reescrever** | `createSubscriptionIntent` no lugar de `createCheckoutForVisitor` |
| `src/components/checkout/StripePaymentElement.tsx` | **Criar** | Wrapper com Appearance API customizada (B&W) |
| `src/app/pagamento/processando/page.tsx` | **Criar** | Polling de status pós-confirmPayment |
| `src/app/pagamento/falhou/page.tsx` | **Criar** | Tela de retry com mensagem do erro Stripe |
| `src/app/welcome/page.tsx` | **Manter** | Já existe, ajustar pra detectar Stripe metadata |
| `src/app/settings/billing/page.tsx` | **Modificar** | Adicionar botão "Gerenciar pagamento" → Customer Portal |
| `src/app/api/billing/portal/route.ts` | **Criar** | Cria sessão Customer Portal + redirect |

### 3.2. Backend

| Path | Ação |
|---|---|
| `src/lib/stripe.ts` | **Criar** (substitui `abacatepay.ts`) |
| `src/lib/stripe-plans.ts` | **Criar** — mapping `mensal/semestral/anual` → Stripe Price IDs |
| `src/app/api/checkout/route.ts` | **Reescrever** — cria Subscription pra usuário logado |
| `src/app/api/webhooks/stripe/route.ts` | **Criar** |
| `src/app/api/webhooks/abacatepay/route.ts` | **Manter por 30 dias** (fallback) — feature flag controla |
| `src/lib/abacatepay.ts` | **Manter por 30 dias**, depois deletar |

### 3.3. Branding do Stripe Elements (Appearance API)

```ts
const appearance: StripeElementsOptions['appearance'] = {
  theme: 'night',
  variables: {
    colorPrimary: '#FAFAFA',
    colorBackground: '#0A0A0A',
    colorText: '#FAFAFA',
    colorDanger: '#EF4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '0px',           // brandbook rule 06 (assimetria, sem rounded default)
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid #27272A',
      backgroundColor: '#0A0A0A',
      padding: '12px',
    },
    '.Input:focus': {
      borderColor: '#FAFAFA',
      boxShadow: 'none',
    },
    '.Label': {
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: '500',
    },
  },
};
```

**Limitações:** Appearance API não permite remover o footer "Powered by Stripe" — fica visível e é parte da política deles. Aceitável.

---

## 4. Backend Changes — Detalhes

### 4.1. `src/lib/stripe.ts` (novo)

```ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia', // pin pra evitar breaking change automático
  typescript: true,
});

export type PlanCycle = 'mensal' | 'semestral' | 'anual';

export const STRIPE_PRICES: Record<PlanCycle, { priceId: string; periodDays: number }> = {
  mensal: { priceId: process.env.STRIPE_PRICE_MENSAL!, periodDays: 30 },
  semestral: { priceId: process.env.STRIPE_PRICE_SEMESTRAL!, periodDays: 180 },
  anual: { priceId: process.env.STRIPE_PRICE_ANUAL!, periodDays: 365 },
};

export async function createSubscriptionForCheckout(input: {
  email: string;
  name: string;
  planCycle: PlanCycle;
  metadata: Record<string, string>;
}) {
  const customer = await stripe.customers.create({
    email: input.email,
    name: input.name,
    metadata: input.metadata,
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: STRIPE_PRICES[input.planCycle].priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
      payment_method_types: ['card'],
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: input.metadata,
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  return {
    subscriptionId: subscription.id,
    customerId: customer.id,
    clientSecret: paymentIntent.client_secret!,
  };
}
```

### 4.2. Schema Supabase — sem migration estrutural

A tabela `subscriptions` já tem:
- `stripe_customer_id` (TEXT) — usado por AbacatePay como `customerId`
- `stripe_subscription_id` (TEXT) — usado como `billingId`

Vai voltar a ser literal Stripe. **Nenhuma migration nova necessária.**

**Migration opcional (recomendada):** criar tabela `stripe_webhook_events` pra idempotência:

```sql
CREATE TABLE stripe_webhook_events (
  id TEXT PRIMARY KEY,             -- Stripe event.id (evt_xxx)
  type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL
);
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
-- Sem policy = só service_role acessa (correto, é server-only)
CREATE INDEX idx_stripe_webhook_events_processed_at
  ON stripe_webhook_events (processed_at DESC);
```

### 4.3. Webhook handler `/api/webhooks/stripe/route.ts` (esqueleto)

```ts
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  // Idempotência: skip se já processado
  const supabaseAdmin = getSupabaseAdmin();
  const { data: existing } = await supabaseAdmin
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle();
  if (existing) return Response.json({ received: true, idempotent: true });

  // Insert event ANTES de processar (lock optimista — se UNIQUE violar, outro replay processou)
  const { error: insertErr } = await supabaseAdmin
    .from('stripe_webhook_events')
    .insert({ id: event.id, type: event.type, payload: event });
  if (insertErr) return Response.json({ received: true, race: true });

  switch (event.type) {
    case 'customer.subscription.created':
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(supabaseAdmin, event);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(supabaseAdmin, event);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(supabaseAdmin, event);
      break;
  }

  return Response.json({ received: true });
}
```

**Diferenças vs handler AbacatePay atual:**
- Assinatura nativa (`constructEvent`) > HMAC manual
- Idempotência por `event.id` em tabela dedicada > check ad-hoc por `stripe_subscription_id`
- Sem URL secret (Stripe valida só via signature)
- Rate limiting permanece (já existe `rateLimiters.webhook`)

---

## 5. Migration Strategy

### 5.1. Decisão: Big-bang com feature flag

**Por quê não co-existência por usuário?**
- Plataforma tem ~poucos usuários pagantes hoje (soft launch). Não justifica complexidade.
- Cada provider tem seu próprio webhook, models, dunning — manter dois em prod simultaneamente é fonte de bug.

**Como funciona o flag:**

```ts
// src/lib/payment-provider.ts
export function getProvider(): 'stripe' | 'abacatepay' {
  const value = process.env.PAYMENT_PROVIDER ?? 'abacatepay';
  return value === 'stripe' ? 'stripe' : 'abacatepay';
}
```

- `/checkout/[plano]/actions.ts` lê o flag e roteia pro server action correto
- `/api/checkout/route.ts` idem (usuário logado)
- Webhooks: ambos endpoints ficam ativos. Stripe só recebe se Stripe.com tiver webhook configurado pro endpoint `/api/webhooks/stripe`. AbacatePay idem.
- **Cutover real:** `PAYMENT_PROVIDER=stripe` em prod (Vercel env var) + adicionar webhook no dashboard Stripe.

### 5.2. Usuários atuais (AbacatePay)

**Não precisam re-cadastrar nada.**
- Quem comprou anual: tem acesso até `current_period_end`. Quando passar, AbacatePay tenta renovar (via subscription deles). Se ainda existir webhook ativo do AbacatePay, renova lá.
- **Decisão simplificada:** após cutover, usuários AbacatePay rodam até final do ciclo atual. Quando subscription deles cancelar/expirar, sistema marca `role=free`. Eles re-assinam pelo fluxo Stripe.
- **Comunicação proativa (recomendada):** email pra base atual ~30 dias antes do fim do ciclo dizendo "sua assinatura vai renovar via novo sistema, atualize seu cartão em [link Customer Portal Stripe]".

### 5.3. Checklist de cutover

```
[ ] Stripe KYC aprovado (Matheus confirma)
[ ] Stripe Products + Prices criados (mensal/semestral/anual)
[ ] STRIPE_* env vars configuradas em Vercel (production)
[ ] Webhook endpoint adicionado no Stripe dashboard (apontando pra https://sinapse.club/api/webhooks/stripe)
[ ] STRIPE_WEBHOOK_SECRET capturado e configurado
[ ] Teste em staging com cartão de teste 4242... (E2E completo)
[ ] Smoke test em produção com cartão real R$ 37.90 (mensal) — refund manual depois
[ ] PAYMENT_PROVIDER=stripe em Vercel production
[ ] Monitor primeiras 24h: Sentry + Stripe dashboard + tabela subscriptions
[ ] Rollback plan: se algo quebrar, voltar PAYMENT_PROVIDER=abacatepay
```

---

## 6. LGPD / Compliance

### 6.1. Stripe como sub-processador internacional

- Stripe Inc. (US) e Stripe Payments Europe Ltd. (Irlanda) são processadores de dados pessoais (cartão, email, name, IP)
- LGPD Art. 33: transferência internacional precisa de **base legal** + **garantias**

### 6.2. Documentos necessários

| Documento | Onde | Status |
|---|---|---|
| **DPA (Data Processing Agreement)** com Stripe | `dashboard.stripe.com/legal/dpa` — assina online | Matheus assina após KYC |
| **SCCs (Standard Contractual Clauses)** | Anexo do DPA Stripe — já vem incluído na versão 2026 deles | Auto-assinado com DPA |
| **Atualização `/privacidade`** | Adicionar seção "Sub-processadores: Stripe Inc. (US/IE)" + finalidade (processar pagamento) + base legal (execução de contrato, Art. 7º V LGPD) | A escrever na Fase 1 |
| **Consent log** | Já existe (`consent_log`, `pre_signup_consent`). Adicionar `event_type=stripe_terms_acceptance` no checkout | Mudança trivial |
| **Política de retenção** | Documentar que dados de pagamento ficam no Stripe (PCI), nós só guardamos `stripe_customer_id` + email | A documentar em `/privacidade` |

### 6.3. Direitos do titular (Art. 18 LGPD)

- Exclusão: já temos endpoint `/api/account/delete`. Precisa adicionar chamada `stripe.customers.del(stripe_customer_id)` antes de deletar do Supabase
- Portabilidade: invoices ficam acessíveis via Customer Portal (PDF download)
- Retificação: Customer Portal permite editar dados

---

## 7. Variáveis de Ambiente

### 7.1. Novas vars

```bash
# Stripe (server-side, NUNCA prefixar com NEXT_PUBLIC_)
STRIPE_SECRET_KEY=sk_live_xxx                      # Matheus pega no dashboard
STRIPE_WEBHOOK_SECRET=whsec_xxx                    # Matheus configura webhook e captura

# Stripe (client-side, OK ser pública)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx     # idem

# Stripe Price IDs (server-side)
STRIPE_PRICE_MENSAL=price_xxx
STRIPE_PRICE_SEMESTRAL=price_xxx
STRIPE_PRICE_ANUAL=price_xxx

# Feature flag
PAYMENT_PROVIDER=abacatepay                        # mudar pra stripe no cutover
```

### 7.2. Coordenação Caio ↔ Matheus

**Caio não tem acesso ao painel Stripe.** Fluxo proposto:
1. Matheus cria conta Stripe + KYC
2. Matheus libera **Caio como Developer** no dashboard (`Settings → Team`) — permissão pra criar Products/Prices e ver logs, sem acesso a finanças
3. Matheus gera as keys e passa pro Caio via canal seguro (1Password compartilhado, ou env vars direto no Vercel via convite a member da org)
4. **Alternativa:** Matheus configura tudo direto no Vercel (Caio dá acesso ao projeto Vercel) — assim Caio nunca toca nas keys

### 7.3. Atualização `.env.example`

Adicionar bloco Stripe completo. Manter bloco AbacatePay por 30 dias com comentário `# DEPRECATED: removed YYYY-MM-DD`.

---

## 8. Fases & Estimativa

| Fase | Descrição | Estimativa | Bloqueador |
|---|---|---|---|
| **0** | Matheus cria conta Stripe BR + KYC + DPA assinado + libera dev access | 5-10 dias úteis (externo) | Matheus |
| **1** | Setup técnico: `lib/stripe.ts`, `STRIPE_*` env vars, Products + Prices criados, migration `stripe_webhook_events` | 4h | Fase 0 keys |
| **2** | Frontend: `<StripePaymentElement>` branded, `/checkout/[plano]` reescrito, telas `/pagamento/processando` e `/pagamento/falhou` | 8h | Fase 1 |
| **3** | Webhook handler `/api/webhooks/stripe` + idempotência + signup-after-payment (port da lógica AbacatePay) | 6h | Fase 1 |
| **4** | Customer Portal: `/api/billing/portal` + botão em `/settings/billing` | 2h | Fase 1 |
| **5** | Testes E2E em modo teste (cartões 4242, 4000000000000002 declined, 4000002500003155 3DS) + Cypress/Playwright | 4-6h | Fase 2-4 |
| **6** | Cutover prod: feature flag, smoke test com cartão real, monitoring 24h | 2h | Stripe KYC live aprovado |
| **7** | Atualização `/privacidade` + email pra base atual sobre nova cobrança | 2h | paralelo a Fase 6 |
| **8** | Decommission AbacatePay: remover lib + handler após 30 dias de Stripe estável | 2h | T+30 dias do cutover |

**Total agente:** ~28-32h (Fases 1-8) + 4-6h de buffer pra ajustes de design no Stripe Element.

**Total corrido:** ~2-3 semanas (gargalo é KYC Stripe).

---

## 9. Critério "Pronto pra Divulgar"

- [ ] Cartão em produção testado com transação real >R$ 1
- [ ] Webhook idempotente validado (replay de evento não duplica subscription)
- [ ] Customer Portal funcional (cancel + update card testado)
- [ ] LGPD: `/privacidade` atualizado com Stripe como sub-processador
- [ ] DPA + SCCs assinados (download arquivado no Drive da empresa)
- [ ] Sentry/logs sem erros nas primeiras 24h pós-cutover
- [ ] Métricas instrumentadas: conversão `/checkout/[plano]` → `payment_succeeded` (Plausible ou tabela de eventos)
- [ ] Rollback plan testado: setar `PAYMENT_PROVIDER=abacatepay` num staging volta o fluxo
- [ ] Email pra base atual enviado com instruções
- [ ] Pelo menos 3 transações reais bem-sucedidas (smoke + 2 first customers)

---

## 10. Riscos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| KYC Stripe demora >14 dias | Médio | Alto | Iniciar HOJE; manter AbacatePay rodando no flag |
| Conversão cai >50% sem PIX | Alto | Médio-Alto | Aceito (Caio decidiu). Reavaliar em 30 dias com dados |
| Webhook race condition (Stripe envia subscription.created e invoice.payment_succeeded simultâneos) | Médio | Médio | Idempotência via `stripe_webhook_events.id` UNIQUE |
| Stripe Hipercard incompatível | Baixo | Baixo | Confirmar pré-Fase 5; se não tiver, deixar claro no checkout "Visa/Master/Amex/Elo" |
| Usuário AbacatePay com renovação automática durante cutover | Médio | Baixo | Co-existência durante 30 dias resolve. AbacatePay cobra normalmente até cycle end |
| Disputa/chargeback alta no Stripe | Baixo | Alto | Stripe Radar (anti-fraude built-in, grátis). Monitorar dispute rate >0.75% |
| Custo +14% em taxas | Certo | Médio | Já precificado na decisão |

---

## 11. Out of Scope (Fase 1)

- Apple Pay / Google Pay (suportado pelo Payment Element, mas exige domain verification — Fase 2)
- Multi-currency (USD pra estrangeiros) — Fase 2
- Cupons de desconto — Stripe Coupons API, Fase 2
- Trial gratuito — Subscription trial_period_days, Fase 2 se Caio quiser testar
- Stripe Tax (NFS-e externo via contador continua)
- PIX no Stripe (existe via PaymentMethod `pix`, mas reabre a discussão — fora do escopo desta migração)

---

## 🚧 Bloqueadores que dependem do Matheus

1. **Criar conta Stripe BR e fazer KYC** — 5-10 dias úteis. Sem isso, nada produz.
2. **Assinar DPA + SCCs** no dashboard Stripe (necessário pra LGPD)
3. **Liberar dev access pro Caio** OU configurar env vars direto no Vercel
4. **Confirmar conta bancária PJ** pra recebimento (settlement BRL D+30)
5. **Decidir se quer Stripe Tax** (recomendação Vector: NÃO; manter NFS-e via contador atual)
6. **(Opcional) Fornecer logo + brand pra Customer Portal** — Matheus tem acesso ao Settings → Branding

---

## ❓ Perguntas que o Caio precisa responder antes da Fase 1

1. **Comunicação à base atual:** quer mandar email pra todo mundo do AbacatePay sobre mudança? Quando? (Recomendo ~7 dias antes do cutover.)
2. **Período de co-existência:** confirma 30 dias de fallback do AbacatePay ativo, ou prefere cutover mais rápido (15 dias)?
3. **Trial gratuito:** quer aproveitar a migração pra testar 7 dias trial, ou mantém "paga primeiro, acessa depois"? (Hoje é o segundo.)
4. **Cupons:** vai precisar pra lançamento? Se sim, entra em escopo da Fase 1 ou Fase 2?
5. **Apple Pay / Google Pay:** prioridade? Aumenta conversão mobile ~10-15%, mas exige domain verification (chato com Vercel).
6. **Hipercard:** pode prometer no checkout, ou só Visa/Master/Amex/Elo? Confirmação técnica vai pra Fase 1, mas decisão de copy precisa agora.
7. **Pricing fica idêntico** (R$ 37,90 / 203,40 / 358,80) ou aproveita pra testar pricing novo dado o aumento de custo (~14% em taxa)?
8. **Settings → Billing:** pode redirecionar pro Customer Portal externo do Stripe, ou quer overlay/embed? (Embed exige mais trabalho, vale Fase 2.)

---

## Próximo passo

Aguardar resposta do Caio nas 8 perguntas acima + confirmação do Matheus que vai começar Fase 0 (KYC). Com isso destravado, abrir story `STRIPE-1` no padrão do squad e começar Fase 1.

**Plano salvo em:** `docs/auditoria/2026-04-29-stripe-migration-PLAN.md`
