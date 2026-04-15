import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPlanBilling, getPlan } from "@/lib/abacatepay";

export const runtime = "nodejs";

function getBaseUrl(request: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { plan?: string } | null;
  const planId = body?.plan?.toLowerCase();
  const plan = planId ? getPlan(planId) : null;

  if (!plan) {
    return NextResponse.json(
      { error: "Plano inválido. Use mensal, semestral ou anual." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json(
      { error: "Você precisa estar logado para iniciar o checkout." },
      { status: 401 },
    );
  }

  const baseUrl = getBaseUrl(request);
  const displayName =
    (user.user_metadata?.full_name as string | undefined)
    ?? (user.user_metadata?.preferred_username as string | undefined)
    ?? user.email.split("@")[0];

  try {
    const billing = await createPlanBilling({
      plan,
      customer: {
        name: displayName,
        email: user.email,
      },
      returnUrl: `${baseUrl}/settings/billing?canceled=1`,
      completionUrl: `${baseUrl}/settings/billing?success=1&plan=${plan.id}`,
      metadata: {
        userId: user.id,
        plan: plan.id,
      },
    });

    return NextResponse.json({ url: billing.url, billingId: billing.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao iniciar checkout";
    console.error("[checkout] failed", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
