/**
 * Feature flag pra controlar qual processador de pagamento usar.
 *
 * Defaults pra `abacatepay` por seguranca — Stripe so ativa quando
 * Soier configurar `PAYMENT_PROVIDER=stripe` em prod (Vercel env var)
 * apos KYC aprovado e webhook configurado no dashboard.
 *
 * Server-side only (nao expor no client; client decide via prop do server).
 */
export type PaymentProvider = "stripe" | "abacatepay";

export function getPaymentProvider(): PaymentProvider {
  const value = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  return value === "stripe" ? "stripe" : "abacatepay";
}

export function isStripeEnabled(): boolean {
  return getPaymentProvider() === "stripe";
}
