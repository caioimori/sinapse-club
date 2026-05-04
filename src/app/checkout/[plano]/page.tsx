import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getPlan, type BillingCycle } from "@/lib/abacatepay";
import { StripeCheckoutForm } from "./stripe-checkout-form";
import {
  OrderSummaryDesktop,
  OrderSummaryMobile,
  type OrderSummaryProps,
} from "@/components/checkout/order-summary";

export const dynamic = "force-dynamic";

const planPeriods: Record<BillingCycle, string> = {
  mensal: "/ mês",
  semestral: "/ 6 meses",
  anual: "/ ano",
};

const planTaglines: Record<BillingCycle, string> = {
  mensal: "Cobrado todo mês. Cancele quando quiser.",
  semestral: "Cobrado uma vez a cada 6 meses. Mais economia.",
  anual: "Cobrado uma vez por ano. Maior economia.",
};

const PLAN_FEATURES: string[] = [
  "Acesso completo ao fórum",
  "Curadoria diária IA + negócios",
  "Ferramentas e marketplace",
  "Gamificação, ranks e leaderboard",
  "7 dias de garantia incondicional",
];

const MONTHLY_PRICE_CENTS = 3790;

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function shortPlanLabel(label: string): string {
  // "SINAPSE - Acesso anual" -> "Anual"
  const cleaned = label.replace(/^SINAPSE\s*-\s*Acesso\s+/i, "").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function buildSummaryProps(
  cycle: BillingCycle,
  priceCents: number,
  label: string,
): OrderSummaryProps {
  const base: OrderSummaryProps = {
    planLabel: shortPlanLabel(label),
    planTagline: planTaglines[cycle],
    priceCents,
    pricePeriod: planPeriods[cycle],
    features: PLAN_FEATURES,
  };

  if (cycle === "mensal") {
    return base;
  }

  // semestral / anual — anchor pricing for loss-aversion CRO
  const months = cycle === "semestral" ? 6 : 12;
  const baselineCents = MONTHLY_PRICE_CENTS * months;
  const monthlyEquivalentCents = Math.round(priceCents / months);
  const savingsCents = baselineCents - priceCents;
  const periodNoun = cycle === "semestral" ? "/ 6 meses" : "/ ano";

  return {
    ...base,
    baselineCents,
    equivalentMonthlyCopy: `Equivale a ${formatBRL(monthlyEquivalentCents)} / mês`,
    totalSavingsCopy: `Economize ${formatBRL(savingsCents)} ${periodNoun} vs mensal`,
  };
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
    title: `${plan.label} — sinapse.club`,
    description: "Pague e crie sua conta em seguida. Acesso imediato ao fórum.",
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ plano: string }>;
}) {
  const { plano } = await params;
  const plan = getPlan(plano.toLowerCase());

  if (!plan) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const defaultEmail = user?.email ?? undefined;
  const defaultName =
    (user?.user_metadata?.full_name as string | undefined)
    ?? (user?.user_metadata?.preferred_username as string | undefined)
    ?? (user?.email ? user.email.split("@")[0] : undefined);

  const summaryProps = buildSummaryProps(plan.id, plan.priceCents, plan.label);

  return (
    <main className="relative h-dvh overflow-hidden bg-background text-foreground">
      {/* Grain — brandbook rule 03/11 (sempre ativo, opacidade baixa) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative z-10 flex h-dvh flex-col">
        {/* Brand mark — top-left, persistente */}
        <div className="border-b border-border/60 px-[clamp(1.5rem,5vw,4rem)] py-3">
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-70"
            aria-label="sinapse.club"
          >
            <Image
              src="/brand/sinapse-club.svg"
              alt="sinapse.club"
              width={120}
              height={16}
              priority
              style={{ height: "auto" }}
              className="w-auto dark:invert"
            />
          </Link>
        </div>

        {/* Mobile order summary — accordion no topo, hidden em lg+ */}
        <OrderSummaryMobile {...summaryProps} />

        {/*
          Grid principal — assimétrico (rule 06).
          Desktop: sidebar esquerda peso visual ~5/12 (preço gigante) +
          form direita ~28rem fixo. Gap fluido 80-120px (rule 05/06).
          Mobile: stack vertical, accordion já renderizado acima.
        */}
        <div
          className="mx-auto grid w-full max-w-screen-2xl min-h-0 flex-1 grid-cols-1 px-[clamp(1.5rem,5vw,4rem)] py-6 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:py-8"
          style={{ columnGap: "clamp(2.5rem, 6vw, 6rem)" }}
        >
          {/* Form esquerda — flex column com testimonial fixado no bottom */}
          <div className="order-2 flex h-full w-full max-w-[30rem] flex-col justify-self-start lg:order-1">
            <div className="space-y-2">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-block h-px w-6 bg-foreground/40" aria-hidden="true" />
                Falta pouco
              </p>
              <h2 className="whitespace-nowrap font-display text-[clamp(3.0625rem,4vw,3.5rem)] font-light leading-[1] tracking-[-0.04em]">
                Acesso imediato.
              </h2>
              <p className="max-w-[24rem] text-[13px] leading-relaxed text-muted-foreground">
                Pague, crie sua conta e entre no fórum em segundos.
                Garantia de 7 dias — devolvemos 100% se não curtir.
              </p>
            </div>

            <div className="mt-5">
              <StripeCheckoutForm
                plano={plan.id}
                planLabel={plan.label}
                priceCents={plan.priceCents}
                pricePeriod={planPeriods[plan.id] ?? ""}
                defaultEmail={defaultEmail}
                defaultName={defaultName}
                isAuthenticated={Boolean(user)}
              />
            </div>

          </div>

          {/* Sidebar direita — flex col, trust row pinned bottom */}
          <div className="order-1 hidden lg:order-2 lg:flex lg:h-full lg:w-full lg:max-w-[30rem] lg:flex-col lg:justify-self-end">
            <OrderSummaryDesktop {...summaryProps} />
          </div>
        </div>
      </div>
    </main>
  );
}
