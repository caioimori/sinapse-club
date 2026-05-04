/**
 * Catálogo canônico dos planos SINAPSE.
 *
 * Single source of truth pra labels, preços e ciclos.
 * Stripe Price IDs ficam em src/lib/stripe.ts (mapeados via env vars).
 *
 * Antigamente esse arquivo era src/lib/abacatepay.ts — AbacatePay
 * foi descontinuado em 2026-05-04. Stripe é o único processador.
 */

export type BillingCycle = "mensal" | "semestral" | "anual";

export interface Plan {
  id: BillingCycle;
  label: string;
  priceCents: number;
  periodDays: number;
}

export const PLANS: Record<BillingCycle, Plan> = {
  mensal: {
    id: "mensal",
    label: "SINAPSE - Acesso mensal",
    priceCents: 3790,
    periodDays: 30,
  },
  semestral: {
    id: "semestral",
    label: "SINAPSE - Acesso semestral",
    priceCents: 20340,
    periodDays: 180,
  },
  anual: {
    id: "anual",
    label: "SINAPSE - Acesso anual",
    priceCents: 35880,
    periodDays: 365,
  },
};

export function getPlan(cycle: string | undefined | null): Plan | null {
  if (cycle === "mensal" || cycle === "semestral" || cycle === "anual") {
    return PLANS[cycle];
  }
  return null;
}
