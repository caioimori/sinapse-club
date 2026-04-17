import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPlanBilling, getPlan } from "@/lib/abacatepay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(request: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, "");
  return new URL(request.url).origin;
}

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.redirect(new URL(`/register?plan=${plan.id}`, baseUrl));
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined)
    ?? (user.user_metadata?.preferred_username as string | undefined)
    ?? user.email.split("@")[0];

  try {
    const billing = await createPlanBilling({
      plan,
      customer: { name: displayName, email: user.email },
      returnUrl: `${baseUrl}/settings/billing?canceled=1`,
      completionUrl: `${baseUrl}/settings/billing?success=1&plan=${plan.id}`,
      metadata: { userId: user.id, plan: plan.id },
    });
    return NextResponse.redirect(billing.url, { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "checkout_failed";
    console.error("[subscribe] failed", message);
    return NextResponse.redirect(
      new URL(`/settings/billing?error=${encodeURIComponent(message)}`, baseUrl),
    );
  }
}
