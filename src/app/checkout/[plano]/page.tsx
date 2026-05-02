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
 * Builds anchor-pricing copy for CRO loss-aversion (research §02).
 *
 * - "Equivale a R$ X / mes" — strong anchor that reframes the larger total
 *   into the same mental scale as the monthly plan.
 * - "Economize R$ Y / ano vs mensal" — explicit total savings (loss aversion).
 *
 * Mensal returns nothing — pure ticket, no anchor.
 */
function buildAnchorCopy(planId: string): {
  baselineCents?: number;
  equivalentMonthlyCopy?: string;
  totalSavingsCopy?: string;
  savingsCopy?: string;
} {
  const monthly = PLANS.mensal.priceCents;
  if (planId === "semestral") {
    const baseline = monthly * 6;
    const perMonthCents = Math.round(PLANS.semestral.priceCents / 6);
    const totalSavedReais = (baseline - PLANS.semestral.priceCents) / 100;
    return {
      baselineCents: baseline,
      equivalentMonthlyCopy: `Equivale a ${formatBRL(perMonthCents)} / mes`,
      totalSavingsCopy: `Economize R$ ${totalSavedReais
        .toFixed(2)
        .replace(".", ",")} no semestre`,
    };
  }
  if (planId === "anual") {
    const baseline = monthly * 12;
    const perMonthCents = Math.round(PLANS.anual.priceCents / 12);
    const totalSavedReais = (baseline - PLANS.anual.priceCents) / 100;
    return {
      baselineCents: baseline,
      equivalentMonthlyCopy: `Equivale a ${formatBRL(perMonthCents)} / mes`,
      totalSavingsCopy: `Economize R$ ${totalSavedReais
        .toFixed(2)
        .replace(".", ",")} / ano`,
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

  const { baselineCents, equivalentMonthlyCopy, totalSavingsCopy, savingsCopy } =
    buildAnchorCopy(plan.id);

  const summaryProps = {
    planLabel: plan.label,
    planTagline: planTaglines[plan.id] ?? "",
    priceCents: plan.priceCents,
    pricePeriod: planPeriods[plan.id] ?? "",
    baselineCents,
    equivalentMonthlyCopy,
    totalSavingsCopy,
    savingsCopy,
    features: planFeatures,
    canceledNotice: Boolean(canceled),
  };

  return (
    <div className="relative min-h-dvh bg-background">
      {/* Grain layer — brandbook rule 03/11. Sutil, nao-interativo, fixo no viewport.
          Garante que o checkout nao pareca template generico mesmo sem grain global. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative z-10">
        {/* Mobile-only collapsible summary sits full-width at the top */}
        <OrderSummaryMobile {...summaryProps} />

        {/* Assimetria deliberada (rule 06): 4/8 desktop. Esquerda compacta com
            peso tipografico gigante; direita ampla pra form respirar. */}
        <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          {/* LEFT — sticky order summary (desktop only). Single hairline divider,
              no fill — pura hierarquia tipografica. */}
          <div className="hidden lg:block lg:border-r lg:border-border lg:px-12 lg:py-16 xl:px-16 xl:py-20">
            <OrderSummaryDesktop {...summaryProps} />
          </div>

          {/* RIGHT — payment form. Width fluid via CSS clamp; container padding
              tambem escala com viewport pra legibilidade em qualquer breakpoint. */}
          <div className="px-[clamp(1.25rem,5vw,4rem)] py-12 lg:py-20">
            <div
              className="mx-auto w-full space-y-10"
              style={{ maxWidth: "clamp(20rem, 38vw, 30rem)" }}
            >
              <div className="space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Pagamento
                </p>
                <h2 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-[30px]">
                  Crie sua conta e pague
                </h2>
              </div>

              {getPaymentProvider() === "stripe" ? (
                <StripeCheckoutForm
                  plano={plan.id}
                  planLabel={plan.label}
                  priceCents={plan.priceCents}
                  pricePeriod={planPeriods[plan.id] ?? ""}
                />
              ) : (
                <CheckoutForm
                  plano={plan.id}
                  planLabel={plan.label}
                  priceCents={plan.priceCents}
                  pricePeriod={planPeriods[plan.id] ?? ""}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
