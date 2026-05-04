/**
 * Feature flag pra controlar qual processador de pagamento usar.
 *
 * Default: `stripe`. AbacatePay foi descontinuado da UI publica em
 * 2026-04-27 — todo checkout (anon ou logado) passa por Stripe.
 *
 * `PAYMENT_PROVIDER=abacatepay` pode ser setado em emergencia pra
 * reativar o fluxo legado (codigo mantido em src/lib/abacatepay.ts e
 * webhook em /api/webhooks/abacatepay).
 *
 * Server-side only (nao expor no client; client decide via prop do server).
 */
export type PaymentProvider = "stripe" | "abacatepay";

export function getPaymentProvider(): PaymentProvider {
  const value = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  return value === "abacatepay" ? "abacatepay" : "stripe";
}

export function isStripeEnabled(): boolean {
  return getPaymentProvider() === "stripe";
}
