"use server";

import { createClient } from "@/lib/supabase/server";

const PLAN_PRICES: Record<string, { name: string; priceInCents: number }> = {
  pro: { name: "sinapse.club Pro", priceInCents: 9700 },
  premium: { name: "sinapse.club Premium", priceInCents: 19700 },
};

/**
 * Create an AbacatePay checkout session for a subscription plan.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckout(
  plan: "pro" | "premium"
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Voce precisa estar logado para assinar um plano." };
  }

  const planConfig = PLAN_PRICES[plan];
  if (!planConfig) {
    return { error: "Plano invalido." };
  }

  const apiKey = process.env.ABACATEPAY_API_KEY;
  if (!apiKey) {
    console.error("ABACATEPAY_API_KEY not configured");
    return { error: "Sistema de pagamento indisponivel. Tente novamente mais tarde." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL not configured");
    return { error: "Configuracao do servidor incompleta. Contate o suporte." };
  }
  const completionUrl = `${appUrl}/pricing?success=true`;
  const externalId = `PLAN-${plan}`;

  try {
    const response = await fetch("https://api.abacatepay.com/v1/billing/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frequency: "MONTHLY",
        methods: ["PIX"],
        products: [
          {
            externalId,
            name: planConfig.name,
            quantity: 1,
            price: planConfig.priceInCents,
          },
        ],
        returnUrl: completionUrl,
        completionUrl,
        customer: {
          email: user.email,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("AbacatePay checkout error:", response.status, errorBody);
      return { error: "Erro ao criar sessao de pagamento. Tente novamente." };
    }

    const result = await response.json();
    const checkoutUrl = result?.data?.url || result?.url;

    if (!checkoutUrl) {
      console.error("AbacatePay response missing URL:", JSON.stringify(result));
      return { error: "Resposta inesperada do sistema de pagamento." };
    }

    return { url: checkoutUrl };
  } catch (err) {
    console.error("AbacatePay checkout exception:", err);
    return { error: "Erro de conexao com o sistema de pagamento." };
  }
}

/**
 * Create an AbacatePay checkout session for a course purchase.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCourseCheckout(
  courseId: string,
  courseSlug: string,
  courseName: string,
  priceInCents: number
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Voce precisa estar logado para comprar um curso." };
  }

  const apiKey = process.env.ABACATEPAY_API_KEY;
  if (!apiKey) {
    console.error("ABACATEPAY_API_KEY not configured");
    return { error: "Sistema de pagamento indisponivel. Tente novamente mais tarde." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL not configured");
    return { error: "Configuracao do servidor incompleta. Contate o suporte." };
  }
  const completionUrl = `${appUrl}/courses/${courseSlug}?enrolled=true`;
  const externalId = `COURSE-${courseId}`;

  try {
    const response = await fetch("https://api.abacatepay.com/v1/billing/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: [
          {
            externalId,
            name: courseName,
            quantity: 1,
            price: priceInCents,
          },
        ],
        returnUrl: completionUrl,
        completionUrl,
        customer: {
          email: user.email,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("AbacatePay course checkout error:", response.status, errorBody);
      return { error: "Erro ao criar sessao de pagamento. Tente novamente." };
    }

    const result = await response.json();
    const checkoutUrl = result?.data?.url || result?.url;

    if (!checkoutUrl) {
      console.error("AbacatePay response missing URL:", JSON.stringify(result));
      return { error: "Resposta inesperada do sistema de pagamento." };
    }

    return { url: checkoutUrl };
  } catch (err) {
    console.error("AbacatePay course checkout exception:", err);
    return { error: "Erro de conexao com o sistema de pagamento." };
  }
}
