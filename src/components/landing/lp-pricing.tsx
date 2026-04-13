import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BillingPeriod = "mensal" | "semestral" | "anual";

interface Plan {
  id: BillingPeriod;
  label: string;
  tagline: string;
  monthlyPrice: number;
  totalPrice: number;
  billingNote: string;
  savings: string | null;
  popular: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    id: "mensal",
    label: "Mensal",
    tagline: "Sem compromisso",
    monthlyPrice: 27.9,
    totalPrice: 27.9,
    billingNote: "Cobrado todo mês",
    savings: null,
    popular: false,
    cta: "Começar mensal",
  },
  {
    id: "semestral",
    label: "Semestral",
    tagline: "Equilíbrio perfeito",
    monthlyPrice: 24.9,
    totalPrice: 149.4,
    billingNote: "R$ 149,40 a cada 6 meses · parcelável",
    savings: "Economize R$ 18",
    popular: false,
    cta: "Assinar semestral",
  },
  {
    id: "anual",
    label: "Anual",
    tagline: "Maior economia",
    monthlyPrice: 22.9,
    totalPrice: 274.8,
    billingNote: "R$ 274,80 por ano · parcelável",
    savings: "Economize R$ 60",
    popular: true,
    cta: "Assinar anual",
  },
];

const sharedFeatures = [
  "Acesso completo ao fórum 24/7",
  "Todas as categorias e threads",
  "Networking verificado com membros",
  "Conteúdo novo toda semana",
  "Gamificação, ranks e leaderboard",
  "14 dias de garantia incondicional",
  "Cancele quando quiser, sem multa",
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
        "relative flex flex-col rounded-2xl border p-7 transition-all sm:p-8",
        isPopular
          ? "border-foreground bg-foreground text-background shadow-[var(--shadow-lg)] sm:scale-[1.03] sm:p-9"
          : "border-border bg-background text-foreground hover:border-foreground/30"
      )}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground shadow-[var(--shadow-md)]">
          <Sparkles className="size-3" />
          Recomendado
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3
          className={cn(
            "text-lg font-semibold tracking-tight",
            isPopular ? "text-background" : "text-foreground"
          )}
        >
          {plan.label}
        </h3>
        <p
          className={cn(
            "mt-1 text-xs",
            isPopular ? "text-background/60" : "text-muted-foreground"
          )}
        >
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-2 flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-5xl font-bold tracking-tight",
            isPopular && "sm:text-6xl"
          )}
        >
          {formatBRL(plan.monthlyPrice)}
        </span>
        <span
          className={cn(
            "text-sm",
            isPopular ? "text-background/60" : "text-muted-foreground"
          )}
        >
          /mês
        </span>
      </div>

      {/* Billing note */}
      <p
        className={cn(
          "mb-4 text-xs leading-relaxed",
          isPopular ? "text-background/70" : "text-muted-foreground"
        )}
      >
        {plan.billingNote}
      </p>

      {/* Savings */}
      {plan.savings ? (
        <div
          className={cn(
            "mb-6 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
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
      ) : (
        <div className="mb-6 h-7" aria-hidden />
      )}

      {/* CTA */}
      <Link href={`/register?plan=${plan.id}`} className="mt-auto block">
        <Button
          size="lg"
          className={cn(
            "h-12 w-full text-sm font-semibold border-0",
            isPopular
              ? "bg-background text-foreground hover:bg-background/90"
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {plan.cta}
        </Button>
      </Link>
    </div>
  );
}

export function LpPricing() {
  return (
    <section
      id="pricing"
      className="relative border-t border-border bg-card py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Planos
          </p>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Escolha como você quer começar
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            O mesmo acesso completo. Quanto maior seu compromisso, maior a
            economia. Cancele quando quiser.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mb-14 grid items-stretch gap-6 sm:gap-5 md:grid-cols-3 md:gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Shared features */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background p-7 sm:p-9">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Todos os planos incluem
          </p>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {sharedFeatures.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-border pt-5 text-center text-xs text-muted-foreground">
            Pix · Cartão de crédito (até 12x) · Boleto · Cancele quando quiser
          </div>
        </div>
      </div>
    </section>
  );
}
