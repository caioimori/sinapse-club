"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { createStripeSubscription } from "@/lib/stripe";

interface CheckoutInput {
  plano: string;
  email: string;
  name: string;
  consentTerms: boolean;
  consentPrivacy: boolean;
}

export type StripeCheckoutResult =
  | { ok: true; clientSecret: string; subscriptionId: string }
  | { ok: false; error: string };

export async function createStripeSubscriptionForVisitor(
  input: CheckoutInput,
): Promise<StripeCheckoutResult> {
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
