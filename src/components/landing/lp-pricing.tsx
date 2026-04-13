"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BillingPeriod = "mensal" | "semestral" | "anual";

interface Plan {
  id: BillingPeriod;
  label: string;
  monthlyPrice: number;
  totalPrice: number;
  totalLabel: string;
  savings: string | null;
  popular: boolean;
}

const plans: Plan[] = [
  {
    id: "mensal",
    label: "Mensal",
    monthlyPrice: 27.9,
    totalPrice: 27.9,
    totalLabel: "cobrado mensalmente",
    savings: null,
    popular: false,
  },
  {
    id: "semestral",
    label: "Semestral",
    monthlyPrice: 24.9,
    totalPrice: 149.4,
    totalLabel: "cobrado a cada 6 meses",
    savings: "Economize R$ 18",
    popular: true,
  },
  {
    id: "anual",
    label: "Anual",
    monthlyPrice: 22.9,
    totalPrice: 274.8,
    totalLabel: "cobrado anualmente",
    savings: "Economize R$ 60",
    popular: false,
  },
];

const features = [
  "Acesso completo ao forum",
  "Todas as categorias e threads",
  "Networking verificado com membros",
  "Conteudo novo toda semana",
  "Gamificacao, ranks e leaderboard",
  "14 dias de garantia incondicional",
  "Cancele quando quiser",
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function LpPricing() {
  const [selected, setSelected] = useState<BillingPeriod>("semestral");
  const activePlan = plans.find((p) => p.id === selected) ?? plans[1];

  return (
    <section
      id="pricing"
      className="relative border-t border-border bg-card py-24 sm:py-32"
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Planos
          </p>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Um preco. Tres formas de comecar.
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            O mesmo acesso ao forum e a comunidade. Quanto maior seu compromisso,
            maior a sua economia.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border bg-background p-1 shadow-[var(--shadow-xs)]">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-medium transition-all",
                  selected === plan.id
                    ? "bg-foreground text-background shadow-[var(--shadow-sm)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {plan.label}
                {plan.popular && selected !== plan.id && (
                  <span className="absolute -top-2 -right-1 rounded-full bg-foreground px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-background">
                    Popular
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="mx-auto max-w-md">
          <div className="relative rounded-2xl border border-border bg-background p-8 shadow-[var(--shadow-md)] sm:p-10">
            {activePlan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                Mais escolhido
              </div>
            )}

            {activePlan.savings && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
                <span className="size-1.5 rounded-full bg-foreground" />
                {activePlan.savings}
              </div>
            )}

            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-6xl font-bold tracking-tight sm:text-7xl">
                {formatBRL(activePlan.monthlyPrice).replace("R$", "R$ ")}
              </span>
            </div>
            <p className="mb-1 text-sm text-muted-foreground">por mes</p>
            <p className="mb-8 text-xs text-muted-foreground">
              {activePlan.totalLabel}
              {activePlan.id !== "mensal" && (
                <>
                  {" "}
                  · {formatBRL(activePlan.totalPrice)} no total
                </>
              )}
            </p>

            <ul className="mb-8 space-y-3">
              {features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link href={`/register?plan=${activePlan.id}`} className="block">
              <Button
                size="lg"
                className="w-full bg-foreground text-background border-0 h-12 text-sm font-semibold"
              >
                Comecar plano {activePlan.label.toLowerCase()}
              </Button>
            </Link>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Pix · Cartao · Boleto · Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
