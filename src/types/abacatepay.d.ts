declare module "@abacatepay/sdk" {
  interface BillingProduct {
    externalId: string;
    name: string;
    quantity: number;
    price: number;
  }

  interface BillingCustomer {
    name: string;
    email: string;
    cellphone?: string;
    taxId?: string;
  }

  interface CreateBillingOptions {
    frequency: "ONE_TIME" | "MONTHLY" | "YEARLY";
    methods: string[];
    products: BillingProduct[];
    returnUrl: string;
    completionUrl: string;
    customer: BillingCustomer;
  }

  interface BillingResponse {
    id: string;
    url: string;
    amount: number;
    status: string;
    devMode: boolean;
    methods: string[];
    frequency: string;
    customer: {
      id: string;
      metadata: Record<string, string>;
    };
    createdAt: string;
    updatedAt: string;
  }

  interface AbacatePayClient {
    billing: {
      create(options: CreateBillingOptions): Promise<BillingResponse>;
      list(): Promise<BillingResponse[]>;
    };
  }

  function AbacatePay(apiKey: string): AbacatePayClient;
  export default AbacatePay;
}
