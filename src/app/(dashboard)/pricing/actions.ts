"use server";

import { getPlan, type BillingCycle } from "@/lib/plans";

/**
 * Pricing → Checkout. Apenas resolve a URL canônica `/checkout/[plano]`
 * (checkout autoral SINAPSE com Stripe Payment Element). Não cria
 * billing externo aqui.
 *
 * Antes desse refactor (2026-05-04), criava billing direto no AbacatePay
 * e redirecionava pra checkout hospedado. AbacatePay foi descontinuado.
 * Stripe é o único processador, embedded no nosso domínio.
 */
export async function createCheckout(
  cycle: BillingCycle,
): Promise<{ url: string } | { error: string }> {
  const plan = getPlan(cycle);
  if (!plan) {
    return { error: "Plano invalido." };
  }
  return { url: `/checkout/${plan.id}` };
}
