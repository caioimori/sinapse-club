import AbacatePay from "@abacatepay/sdk";

export const abacatepay = AbacatePay(process.env.ABACATEPAY_API_KEY!);

export type BillingFrequency = "ONE_TIME" | "MONTHLY" | "YEARLY";

export interface CreateBillingParams {
  frequency: BillingFrequency;
  productName: string;
  productId: string;
  priceCents: number;
  customerName: string;
  customerEmail: string;
  customerTaxId?: string;
  returnUrl: string;
  completionUrl: string;
  metadata?: Record<string, string>;
}

export async function createBilling({
  frequency,
  productName,
  productId,
  priceCents,
  customerName,
  customerEmail,
  customerTaxId,
  returnUrl,
  completionUrl,
}: CreateBillingParams) {
  const billing = await abacatepay.billing.create({
    frequency,
    methods: ["PIX"],
    products: [
      {
        externalId: productId,
        name: productName,
        quantity: 1,
        price: priceCents,
      },
    ],
    returnUrl,
    completionUrl,
    customer: {
      name: customerName,
      email: customerEmail,
      ...(customerTaxId ? { taxId: customerTaxId } : {}),
    },
  } as any);

  return billing;
}
