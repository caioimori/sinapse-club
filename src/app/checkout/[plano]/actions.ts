"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createPlanBilling, getPlan } from "@/lib/abacatepay";
import { createStripeSubscription } from "@/lib/stripe";
import { getPaymentProvider } from "@/lib/payment-provider";

interface CheckoutInput {
  plano: string;
  email: string;
  name: string;
  consentTerms: boolean;
  consentPrivacy: boolean;
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export type StripeCheckoutResult =
  | { ok: true; clientSecret: string; subscriptionId: string }
  | { ok: false; error: string };

function getBaseUrl(host: string | null, proto: string | null): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (host) return `${proto ?? "https"}://${host}`;
  return "https://sinapse.club";
}

/**
 * Creates an AbacatePay billing for an unauthenticated visitor.
 *
 * Account creation is deferred to the webhook handler, which will look up
 * `customer.email` and create a Supabase user via `auth.admin.createUser`
 * if no match is found.
 *
 * LGPD consent is persisted to a pre-signup table when the user has not yet
 * been created (best-effort — fall back to logging at webhook time if the
 * table is unavailable).
 */
export async function createCheckoutForVisitor(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const plan = getPlan(input.plano.toLowerCase());
  if (!plan) {
    return { ok: false, error: "Plano invalido." };
  }

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Email invalido." };
  }
  if (name.length < 2) {
    return { ok: false, error: "Informe seu nome." };
  }
  if (!input.consentTerms || !input.consentPrivacy) {
    return {
      ok: false,
      error: "E necessario aceitar os Termos e a Politica de Privacidade.",
    };
  }

  const headerStore = await headers();
  const baseUrl = getBaseUrl(
    headerStore.get("x-forwarded-host") ?? headerStore.get("host"),
    headerStore.get("x-forwarded-proto"),
  );
  const userAgent = headerStore.get("user-agent");
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? headerStore.get("x-real-ip")
    ?? null;

  // Best-effort pre-signup consent log. If table doesn't exist (no migration
  // applied yet) we silently swallow — webhook will record consent
  // retroactively when the user is created.
  try {
    const supabase = await createClient();
    type AnonInsert = (table: string) => {
      insert: (rows: Record<string, unknown>[]) => Promise<{ error: unknown }>;
    };
    const inserter = (
      supabase as unknown as { from: AnonInsert }
    ).from;
    await inserter("pre_signup_consent").insert([
      {
        email,
        event_type: "checkout_terms",
        document_version: "v1",
        ip,
        user_agent: userAgent,
      },
      {
        email,
        event_type: "checkout_privacy",
        document_version: "v1",
        ip,
        user_agent: userAgent,
      },
    ]);
  } catch {
    // best-effort, ignore
  }

  try {
    const billing = await createPlanBilling({
      plan,
      customer: { name, email },
      returnUrl: `${baseUrl}/checkout/${plan.id}?canceled=1`,
      completionUrl: `${baseUrl}/welcome?plan=${plan.id}&email=${encodeURIComponent(email)}`,
      metadata: {
        plan: plan.id,
        source: "signup-after-payment",
        // No userId yet — webhook will create the user on `billing.paid`.
        signupName: name,
      },
    });

    return { ok: true, url: billing.url };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao iniciar checkout.";
    console.error("[checkout-anon] failed", message);
    return { ok: false, error: message };
  }
}

/**
 * STRIPE-2.1: cria Subscription Stripe + retorna clientSecret pro
 * Payment Element renderizar inline. Usuario confirma cartao client-side
 * via stripe.confirmPayment; webhook ativa o plano + cria conta.
 *
 * So executa quando PAYMENT_PROVIDER=stripe. Caso contrario, retorna erro
 * (front-end nao deveria chamar — page.tsx ja branqueia o componente).
 */
export async function createStripeSubscriptionForVisitor(
  input: CheckoutInput,
): Promise<StripeCheckoutResult> {
  if (getPaymentProvider() !== "stripe") {
    return { ok: false, error: "Stripe nao esta habilitado." };
  }

  const plan = getPlan(input.plano.toLowerCase());
  if (!plan) {
    return { ok: false, error: "Plano invalido." };
  }

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Email invalido." };
  }
  if (name.length < 2) {
    return { ok: false, error: "Informe seu nome." };
  }
  if (!input.consentTerms || !input.consentPrivacy) {
    return {
      ok: false,
      error: "E necessario aceitar os Termos e a Politica de Privacidade.",
    };
  }

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent");
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? headerStore.get("x-real-ip")
    ?? null;

  // Pre-signup consent (best-effort, igual ao fluxo AbacatePay)
  try {
    const supabase = await createClient();
    type AnonInsert = (table: string) => {
      insert: (rows: Record<string, unknown>[]) => Promise<{ error: unknown }>;
    };
    const inserter = (supabase as unknown as { from: AnonInsert }).from;
    await inserter("pre_signup_consent").insert([
      { email, event_type: "checkout_terms", document_version: "v1", ip, user_agent: userAgent },
      { email, event_type: "checkout_privacy", document_version: "v1", ip, user_agent: userAgent },
      { email, event_type: "stripe_terms_acceptance", document_version: "v1", ip, user_agent: userAgent },
    ]);
  } catch {
    // best-effort
  }

  try {
    const result = await createStripeSubscription({
      planCycle: plan.id,
      customer: { email, name },
      metadata: {
        plan: plan.id,
        source: "signup-after-payment-stripe",
        signupName: name,
      },
    });
    return {
      ok: true,
      clientSecret: result.clientSecret,
      subscriptionId: result.subscriptionId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao iniciar checkout Stripe.";
    console.error("[checkout-stripe-anon] failed", message);
    return { ok: false, error: message };
  }
}
