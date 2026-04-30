import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type BillingPeriod = "mensal" | "semestral" | "anual";

interface Plan {
  id: BillingPeriod;
  label: string;
  tagline: string;
  monthlyPrice: number;
  billingNote: string;
  savings: string | null;
  popular: boolean;
  cta: string;
  features: string[];
}

const baseFeatures = [
  "Acesso completo ao fórum 24/7",
  "Todas as categorias e threads",
  "Networking verificado com membros",
  "Conteúdo novo toda semana",
  "Gamificação, ranks e leaderboard",
  "7 dias de garantia incondicional",
];

const plans: Plan[] = [
  {
    id: "mensal",
    label: "Mensal",
    tagline: "Para testar sem compromisso",
    monthlyPrice: 37.9,
    billingNote: "Cobrado todo mês · cancele quando quiser",
    savings: null,
    popular: false,
    cta: "Começar mensal",
    features: baseFeatures,
  },
  {
    id: "semestral",
    label: "Semestral",
    tagline: "O mais escolhido",
    monthlyPrice: 33.9,
    billingNote: "R$ 203,40 a cada 6 meses",
    savings: "Economize R$ 24",
    popular: true,
    cta: "Assinar semestral",
    features: baseFeatures,
  },
  {
    id: "anual",
    label: "Anual",
    tagline: "Maior economia do plano",
    monthlyPrice: 29.9,
    billingNote: "R$ 358,80 por ano",
    savings: "Economize R$ 96",
    popular: false,
    cta: "Assinar anual",
    features: baseFeatures,
  },
];

function formatBRL(value: number) {
  return value
    .toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
    .replace("R$", "R$ ");
}

function PlanCard({ plan }: { plan: Plan }) {
  const isPopular = plan.popular;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-500 ease-out sm:p-7 lg:p-8",
        isPopular
          ? "border-foreground bg-foreground text-background shadow-[var(--shadow-lg)] hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]"
          : "border-border bg-background text-foreground hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[var(--shadow-md)]"
      )}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-background px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-[var(--shadow-md)]">
          <Sparkles className="size-3" />
          Mais escolhido
        </div>
      )}

      {/* Header: label + tagline */}
      <div className="mb-5">
        <h3
          className={cn(
            "text-base font-semibold tracking-tight sm:text-lg",
            isPopular ? "text-background" : "text-foreground"
          )}
        >
          {plan.label}
        </h3>
        <p
          className={cn(
            "mt-1 text-xs sm:text-sm",
            isPopular ? "text-background/70" : "text-muted-foreground"
          )}
        >
          {plan.tagline}
        </p>
      </div>

      {/* Price block */}
      <div className="mb-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight sm:text-5xl">
          {formatBRL(plan.monthlyPrice)}
        </span>
        <span
          className={cn(
            "text-sm",
            isPopular ? "text-background/70" : "text-muted-foreground"
          )}
        >
          /mês
        </span>
      </div>
      <p
        className={cn(
          "mb-5 text-xs leading-relaxed",
          isPopular ? "text-background/60" : "text-muted-foreground"
        )}
      >
        {plan.billingNote}
      </p>

      {/* Savings badge slot (reserved to keep alignment) */}
      <div className="mb-6 min-h-[28px]">
        {plan.savings ? (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              isPopular
                ? "bg-background/15 text-background"
                : "bg-muted text-foreground"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isPopular ? "bg-background" : "bg-foreground"
              )}
            />
            {plan.savings}
          </div>
        ) : null}
      </div>

      {/* Divider */}
      <div
        className={cn(
          "mb-6 h-px w-full",
          isPopular ? "bg-background/15" : "bg-border"
        )}
      />

      {/* Features */}
      <ul className="mb-8 space-y-3.5">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-3 text-sm leading-snug">
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0",
                isPopular ? "text-background" : "text-foreground"
              )}
            />
            <span
              className={cn(
                isPopular ? "text-background/90" : "text-foreground/90"
              )}
            >
              {feat}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA: pushed to bottom */}
      <Link
        href={`/subscribe/${plan.id}`}
        className={cn(
          buttonVariants({ size: "lg" }),
          "group/cta mt-auto flex h-12 w-full items-center justify-center gap-2 border-0 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
          isPopular
            ? "bg-background text-foreground [a]:hover:bg-background hover:shadow-[var(--shadow-lg)]"
            : "bg-foreground text-background [a]:hover:bg-foreground/90 hover:shadow-[var(--shadow-md)]"
        )}
      >
        <span className="transition-transform duration-300 group-hover/cta:-translate-x-1">
          {plan.cta}
        </span>
        <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover/cta:translate-x-0 group-hover/cta:opacity-100" />
      </Link>
    </div>
  );
}

export function LpPricing() {
  return (
    <section
      id="precos"
      className="relative border-t border-border bg-card py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-14 text-center sm:mb-16">
          <p className="mb-3 font-mono text-[13px] tracking-tight text-muted-foreground">
            {"//preços"}
          </p>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Escolha como você quer começar
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
            O mesmo acesso completo ao fórum. Quanto maior seu compromisso,
            maior a economia. Cancele quando quiser.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid items-stretch gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

      </div>
    </section>
  );
}
