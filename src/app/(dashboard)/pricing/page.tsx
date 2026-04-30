import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, Zap, Crown, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CheckoutButton } from "./checkout-button";
import type { BillingCycle } from "@/lib/abacatepay";

/**
 * For anonymous visitors we route to /checkout/[plano] (signup-after-payment
 * flow). Logged-in users keep using the legacy CheckoutButton -> server
 * action -> AbacatePay path because they already have a session and a userId.
 */

export const metadata = {
  title: "Planos — sinapse.club",
};

const baseFeatures = [
  "Fórum completo — todas as categorias",
  "Curadoria diária de conteúdo IA + negócios",
  "Ferramentas AI da comunidade",
  "Marketplace de serviços",
  "Gamificação, ranks e leaderboard",
  "7 dias de garantia incondicional",
];

interface PlanCard {
  cycle: BillingCycle;
  label: string;
  tagline: string;
  monthlyPrice: number;
  billingNote: string;
  savings: string | null;
  popular: boolean;
  cta: string;
  icon: typeof Zap;
}

const plans: PlanCard[] = [
  {
    cycle: "mensal",
    label: "Mensal",
    tagline: "Para testar sem compromisso",
    monthlyPrice: 37.9,
    billingNote: "Cobrado todo mês · cancele quando quiser",
    savings: null,
    popular: false,
    cta: "Começar mensal",
    icon: Zap,
  },
  {
    cycle: "semestral",
    label: "Semestral",
    tagline: "O mais escolhido",
    monthlyPrice: 33.9,
    billingNote: "R$ 203,40 a cada 6 meses",
    savings: "Economize R$ 24",
    popular: true,
    cta: "Assinar semestral",
    icon: Crown,
  },
  {
    cycle: "anual",
    label: "Anual",
    tagline: "Maior economia do plano",
    monthlyPrice: 29.9,
    billingNote: "R$ 358,80 por ano",
    savings: "Economize R$ 96",
    popular: false,
    cta: "Assinar anual",
    icon: Sparkles,
  },
];

function formatBRL(value: number) {
  return value
    .toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
    .replace(/\s/g, " ");
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string; from?: string; reason?: string; success?: string }>;
}) {
  const { upgrade, from, reason, success } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentRole = "free";
  if (user) {
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    currentRole = (profile as any)?.role ?? "free";
  }

  const isPro = currentRole === "pro" || currentRole === "premium";

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="sr-only">sinapse</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/sinapse.svg" alt="sinapse" className="mx-auto h-8 w-auto" />
        <p className="text-lg text-muted-foreground">
          Escolha o plano ideal para você
        </p>

        {success && (
          <div className="mx-auto mt-4 max-w-md rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">
              Pagamento realizado com sucesso! Seu plano será atualizado em instantes.
            </p>
          </div>
        )}

        {!success && (upgrade || reason) && (
          <div className="mx-auto mt-4 max-w-md rounded-lg border border-border bg-muted/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {reason === "pro-required"
                ? "Essa funcionalidade requer um plano ativo."
                : upgrade
                  ? `Para acessar ${from || "essa área"}, você precisa de um plano ativo.`
                  : null}
            </p>
          </div>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 sm:grid-cols-3 mx-auto max-w-4xl">
        {plans.map((plan) => (
          <div
            key={plan.cycle}
            className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
              plan.popular
                ? "border-foreground shadow-md"
                : "border-border"
            }`}
            style={{ borderRadius: "var(--radius-card)" }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-foreground text-background px-3 py-1 text-xs">
                  Recomendado
                </Badge>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <plan.icon className="h-5 w-5" />
                <h2 className="text-lg font-semibold">{plan.label}</h2>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-3xl font-bold"
                  style={{ letterSpacing: "var(--tracking-tight)" }}
                >
                  {formatBRL(plan.monthlyPrice)}
                </span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              <p className="text-xs text-muted-foreground">{plan.billingNote}</p>
              {plan.savings && (
                <Badge variant="secondary" className="text-xs">
                  {plan.savings}
                </Badge>
              )}
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {baseFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {isPro ? (
                <Button variant="outline" className="w-full" disabled>
                  Plano ativo
                </Button>
              ) : user ? (
                <CheckoutButton
                  cycle={plan.cycle}
                  highlighted={plan.popular}
                  label={plan.cta}
                />
              ) : (
                <Link
                  href={`/checkout/${plan.cycle}`}
                  className={cn(
                    buttonVariants({
                      variant: plan.popular ? "default" : "outline",
                    }),
                    "w-full",
                    plan.popular &&
                      "bg-foreground text-background [a]:hover:bg-foreground/90",
                  )}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Pagamento seguro via PIX pelo AbacatePay.
        <br />
        Cancele a qualquer momento. Sem compromisso.
      </p>

      {from && (
        <div className="text-center">
          <Link
            href={from}
            className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
          >
            Voltar
          </Link>
        </div>
      )}
    </div>
  );
}
