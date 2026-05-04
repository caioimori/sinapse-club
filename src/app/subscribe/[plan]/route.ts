import { NextRequest, NextResponse } from "next/server";
import { getPlan } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(request: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, "");
  return new URL(request.url).origin;
}

/**
 * Legacy route mantida apenas como redirect pra /checkout/[plano].
 *
 * Antes do desligamento do AbacatePay, esta rota criava billing direto
 * pro usuario logado. Agora, todos os usuarios (anon ou logado) passam
 * pelo fluxo unificado de checkout em /checkout/[plano] (Stripe).
 *
 * URLs antigas, OAuth callback (`?next=/subscribe/...`) e bookmarks
 * continuam funcionando via 303 redirect.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plan: string }> },
) {
  const { plan: rawPlan } = await params;
  const plan = getPlan(rawPlan?.toLowerCase());
  const baseUrl = getBaseUrl(request);

  if (!plan) {
    return NextResponse.redirect(new URL("/#precos", baseUrl));
  }

  return NextResponse.redirect(new URL(`/checkout/${plan.id}`, baseUrl), 303);
}
