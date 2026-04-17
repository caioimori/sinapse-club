"use server";

import { createClient } from "@/lib/supabase/server";

import { createPlanBilling, getPlan, type BillingCycle } from "@/lib/abacatepay";

export async function createCheckout(
  cycle: BillingCycle
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Voce precisa estar logado para assinar um plano." };
  }

  const plan = getPlan(cycle);
  if (!plan) {
    return { error: "Plano invalido." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL not configured");
    return { error: "Configuracao do servidor incompleta. Contate o suporte." };
  }

  const completionUrl = `${appUrl}/pricing?success=true`;

  try {
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    const billing = await createPlanBilling({
      plan,
      customer: {
        name: (profile as any)?.display_name || user.email?.split("@")[0] || "Usuario",
        email: user.email!,
      },
      returnUrl: completionUrl,
      completionUrl,
      metadata: { userId: user.id, cycle },
    });

    return { url: billing.url };
  } catch (err) {
    console.error("AbacatePay checkout exception:", err);
    return { error: "Erro ao criar sessao de pagamento. Tente novamente." };
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
