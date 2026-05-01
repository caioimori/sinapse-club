import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlan, PLANS } from "@/lib/abacatepay";
import { getPaymentProvider } from "@/lib/payment-provider";
import {
  OrderSummaryDesktop,
  OrderSummaryMobile,
} from "@/components/checkout/order-summary";
import { CheckoutForm } from "./checkout-form";
import { StripeCheckoutForm } from "./stripe-checkout-form";

export const dynamic = "force-dynamic";

const planFeatures = [
  "Acesso completo ao forum",
  "Curadoria diaria IA + negocios",
  "Ferramentas e marketplace",
  "Gamificacao, ranks e leaderboard",
  "7 dias de garantia incondicional",
];

const planTaglines: Record<string, string> = {
  mensal: "Cobrado todo mes. Cancele quando quiser.",
  semestral: "Cobrado uma vez a cada 6 meses.",
  anual: "Cobrado uma vez por ano. Maior economia.",
};

const planPeriods: Record<string, string> = {
  mensal: "/ mes",
  semestral: "/ 6 meses",
  anual: "/ ano",
};

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Builds the savings copy by comparing the chosen plan against the monthly
 * baseline (mensal x 6 or x 12). Returns nothing for the monthly plan.
 */
function buildSavingsCopy(planId: string): {
  baselineCents?: number;
  savingsCopy?: string;
} {
  const monthly = PLANS.mensal.priceCents;
  if (planId === "semestral") {
    const baseline = monthly * 6;
    const perMonth = PLANS.semestral.priceCents / 6;
    const savedReais = (monthly - perMonth) / 100;
    return {
      baselineCents: baseline,
      savingsCopy: `Equivale a ${formatBRL(Math.round(perMonth))} / mes — economia de R$ ${savedReais
        .toFixed(2)
        .replace(".", ",")} / mes`,
    };
  }
  if (planId === "anual") {
    const baseline = monthly * 12;
    const perMonth = PLANS.anual.priceCents / 12;
    const savedReais = (monthly - perMonth) / 100;
    return {
      baselineCents: baseline,
      savingsCopy: `Equivale a ${formatBRL(Math.round(perMonth))} / mes — economia de R$ ${savedReais
        .toFixed(2)
        .replace(".", ",")} / mes`,
    };
  }
  return {};
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plano: string }>;
}) {
  const { plano } = await params;
  const plan = getPlan(plano.toLowerCase());
  if (!plan) return { title: "Checkout — sinapse.club" };
  return {
    title: `Checkout ${plan.label} — sinapse.club`,
    description: "Pague e crie sua conta em seguida. Acesso imediato ao forum.",
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ plano: string }>;
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { plano } = await params;
  const { canceled } = await searchParams;
  const plan = getPlan(plano.toLowerCase());

  if (!plan) {
    notFound();
  }

  // Already-logged-in visitors should use the legacy auto-checkout flow.
  // This avoids creating a duplicate user via the webhook path.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(`/subscribe/${plan.id}`);
  }

  const { baselineCents, savingsCopy } = buildSavingsCopy(plan.id);

  const summaryProps = {
    planLabel: plan.label,
    planTagline: planTaglines[plan.id] ?? "",
    priceCents: plan.priceCents,
    pricePeriod: planPeriods[plan.id] ?? "",
    baselineCents,
    savingsCopy,
    features: planFeatures,
    canceledNotice: Boolean(canceled),
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Mobile-only collapsible summary sits full-width at the top */}
      <OrderSummaryMobile {...summaryProps} />

      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* LEFT — sticky order summary (desktop only). Subtle right divider
            mirrors the standard "checkout sheet" pattern (Stripe / Lemon). */}
        <div className="hidden lg:block lg:border-r lg:border-border lg:bg-card/40 lg:px-8 lg:py-12 xl:px-16 xl:py-16">
          <OrderSummaryDesktop {...summaryProps} />
        </div>

        {/* RIGHT — payment form */}
        <div className="px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-20">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Pagamento
              </p>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]">
                Crie sua conta e pague
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Acesso liberado imediatamente apos a confirmacao do pagamento.
              </p>
            </div>

            {getPaymentProvider() === "stripe" ? (
              <StripeCheckoutForm
                plano={plan.id}
                planLabel={plan.label}
                priceCents={plan.priceCents}
              />
            ) : (
              <CheckoutForm plano={plan.id} planLabel={plan.label} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
