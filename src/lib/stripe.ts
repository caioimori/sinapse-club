import "server-only";
import Stripe from "stripe";
import type { BillingCycle } from "@/lib/plans";

/**
 * Stripe SDK singleton.
 *
 * `apiVersion` pinned to evitar breaking changes automaticos da Stripe.
 * Atualizar manualmente apos testes quando subirmos versao.
 */
let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeSingleton) return stripeSingleton;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Configure it in .env (local) or Vercel env vars (prod).",
    );
  }
  stripeSingleton = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
    appInfo: {
      name: "sinapse.club",
      version: "1.0.0",
    },
  });
  return stripeSingleton;
}

export type StripePlanCycle = BillingCycle;

interface StripePlanConfig {
  priceId: string;
  periodDays: number;
}

/**
 * Mapping plano -> Stripe Price ID. Os Price IDs sao configurados no
 * dashboard Stripe pelo Soier apos KYC aprovado. Localmente, ficam como
 * placeholder no .env.example (`price_PLACEHOLDER_*`) e Caio testa com
 * Stripe test mode (Soier libera os Price IDs de teste).
 */
export function getStripePlans(): Record<StripePlanCycle, StripePlanConfig> {
  return {
    mensal: {
      priceId: process.env.STRIPE_PRICE_MENSAL?.trim() ?? "",
      periodDays: 30,
    },
    semestral: {
      priceId: process.env.STRIPE_PRICE_SEMESTRAL?.trim() ?? "",
      periodDays: 180,
    },
    anual: {
      priceId: process.env.STRIPE_PRICE_ANUAL?.trim() ?? "",
      periodDays: 365,
    },
  };
}

interface CreateSubscriptionInput {
  planCycle: StripePlanCycle;
  customer: {
    email: string;
    name: string;
  };
  metadata: Record<string, string>;
}

interface CreateSubscriptionResult {
  subscriptionId: string;
  customerId: string;
  clientSecret: string;
}

/**
 * Cria Customer + Subscription incomplete + retorna clientSecret do
 * PaymentIntent inicial pra renderizar no Payment Element.
 *
 * `payment_behavior: 'default_incomplete'` faz Stripe NAO cobrar
 * automaticamente — espera confirmacao client-side via stripe.confirmPayment.
 *
 * `save_default_payment_method: 'on_subscription'` salva o cartao usado
 * na subscription pra renovacao automatica.
 */
export async function createStripeSubscription(
  input: CreateSubscriptionInput,
): Promise<CreateSubscriptionResult> {
  const stripe = getStripe();
  const plans = getStripePlans();
  const planConfig = plans[input.planCycle];

  if (!planConfig.priceId) {
    throw new Error(
      `Stripe Price ID nao configurado para plano '${input.planCycle}'. Configure STRIPE_PRICE_${input.planCycle.toUpperCase()} no env.`,
    );
  }

  const customer = await stripe.customers.create({
    email: input.customer.email,
    name: input.customer.name,
    metadata: input.metadata,
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: planConfig.priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription",
      payment_method_types: ["card"],
    },
    // API 2026-04-22 (dahlia): confirmation_secret substitui payment_intent
    // como expand-path. Inclui client_secret pra renderizar no Payment Element.
    expand: ["latest_invoice.confirmation_secret"],
    metadata: input.metadata,
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice | null;
  const clientSecret = invoice?.confirmation_secret?.client_secret ?? null;

  if (!clientSecret) {
    throw new Error(
      "Stripe nao retornou client_secret. Verifique configuracao do Price (deve ser recurring) e a API version.",
    );
  }

  return {
    subscriptionId: subscription.id,
    customerId: customer.id,
    clientSecret,
  };
}

/**
 * Cria Customer Portal session pra usuario gerenciar billing.
 * Retorna URL pra redirect 302.
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<{ url: string }> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return { url: session.url };
}

/**
 * Mapeia Stripe Price ID -> plano local (mensal/semestral/anual).
 * Usado pelo webhook handler pra detectar qual plano o usuario assinou.
 */
export function getPlanCycleFromPriceId(priceId: string): StripePlanCycle | null {
  const plans = getStripePlans();
  for (const [cycle, config] of Object.entries(plans)) {
    if (config.priceId && config.priceId === priceId) {
      return cycle as StripePlanCycle;
    }
  }
  return null;
}
