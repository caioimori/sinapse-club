const ABACATEPAY_BASE_URL = "https://api.abacatepay.com";

export type BillingCycle = "mensal" | "semestral" | "anual";

export interface Plan {
  id: BillingCycle;
  label: string;
  priceCents: number;
  periodDays: number;
  externalId: string;
}

// NOTE: AbacatePay caches product metadata (name, etc.) by `externalId` forever
// — once a product is created with a given externalId, later billings with the
// same id reuse the cached product. We version the ids (`-v2`) so we can
// regenerate a clean product if the name or description changes.
// Names use ASCII hyphens only; em-dashes render as � in the checkout UI.

export const PLANS: Record<BillingCycle, Plan> = {
  mensal: {
    id: "mensal",
    label: "SINAPSE - Acesso mensal",
    priceCents: 2790,
    periodDays: 30,
    externalId: "sinapse-forum-mensal-v2",
  },
  semestral: {
    id: "semestral",
    label: "SINAPSE - Acesso semestral",
    priceCents: 14940,
    periodDays: 180,
    externalId: "sinapse-forum-semestral-v2",
  },
  anual: {
    id: "anual",
    label: "SINAPSE - Acesso anual",
    priceCents: 27480,
    periodDays: 365,
    externalId: "sinapse-forum-anual-v2",
  },
};

export function getPlan(cycle: string): Plan | null {
  if (cycle === "mensal" || cycle === "semestral" || cycle === "anual") {
    return PLANS[cycle];
  }
  return null;
}

export function parseExternalIdToCycle(externalId: string): BillingCycle | null {
  const match = externalId.match(/^sinapse-forum-(mensal|semestral|anual)(?:-v\d+)?$/);
  return match ? (match[1] as BillingCycle) : null;
}

interface CreateBillingInput {
  plan: Plan;
  customer: {
    name: string;
    email: string;
    cellphone?: string;
    taxId?: string;
  };
  returnUrl: string;
  completionUrl: string;
  metadata?: Record<string, string>;
}

interface AbacatePayBillingResponse {
  id: string;
  url: string;
  status: string;
  devMode: boolean;
}

interface AbacatePayEnvelope<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

function getApiKey(): string {
  const key = process.env.ABACATEPAY_API_KEY?.trim();
  if (!key) {
    throw new Error("ABACATEPAY_API_KEY is not set");
  }
  return key;
}

export async function createPlanBilling(
  input: CreateBillingInput,
): Promise<AbacatePayBillingResponse> {
  const { plan, customer, returnUrl, completionUrl, metadata } = input;

  const body = {
    frequency: "ONE_TIME" as const,
    methods: ["PIX", "CARD"] as const,
    products: [
      {
        externalId: plan.externalId,
        name: plan.label,
        quantity: 1,
        price: plan.priceCents,
      },
    ],
    returnUrl,
    completionUrl,
    customer: {
      name: customer.name,
      email: customer.email,
      // v1 API rejects the request if these are undefined. Empty strings let
      // AbacatePay collect the data on the checkout page.
      cellphone: customer.cellphone ?? "",
      taxId: customer.taxId ?? "",
    },
    ...(metadata ? { metadata } : {}),
  };

  const response = await fetch(`${ABACATEPAY_BASE_URL}/v1/billing/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as AbacatePayEnvelope<AbacatePayBillingResponse>;

  if (!response.ok || !payload.success || !payload.data) {
    const message = payload.error ?? `AbacatePay billing/create failed (${response.status})`;
    throw new Error(message);
  }

  return payload.data;
}
