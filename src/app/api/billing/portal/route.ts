import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createBillingPortalSession } from "@/lib/stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin-config";
import type { Database } from "@/types/database";

export const runtime = "nodejs";

/**
 * Cria Customer Portal session no Stripe e redireciona o usuario logado.
 * Portal hospedado pelo Stripe (billing.stripe.com) — aceitavel pra acoes
 * de gestao (trocar cartao, cancelar, ver invoices). Branding configurado
 * no dashboard Stripe (Settings > Branding) pelo Soier.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  // Buscar stripe_customer_id da subscription do usuario.
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  const admin = createAdminClient<Database>(url, serviceRoleKey);

  type SubLookup = {
    from: (t: "subscriptions") => {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{
            data: { stripe_customer_id: string | null } | null;
          }>;
        };
      };
    };
  };

  const { data: sub } = await (admin as unknown as SubLookup)
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Subscription nao encontrada. Faca uma assinatura primeiro." },
      { status: 404 },
    );
  }

  // stripe_customer_id pode ser de AbacatePay (legacy) — Stripe so aceita
  // ids que comecam com `cus_`. Validar antes pra dar mensagem util.
  if (!sub.stripe_customer_id.startsWith("cus_")) {
    return NextResponse.json(
      {
        error:
          "Sua assinatura foi criada no sistema antigo. Aguarde a renovacao automatica pro novo sistema ou entre em contato.",
      },
      { status: 409 },
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
    ?? new URL(request.url).origin;

  try {
    const { url: portalUrl } = await createBillingPortalSession(
      sub.stripe_customer_id,
      `${baseUrl}/settings/billing`,
    );
    return NextResponse.redirect(portalUrl, 302);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao abrir portal.";
    console.error("[billing-portal] failed", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
