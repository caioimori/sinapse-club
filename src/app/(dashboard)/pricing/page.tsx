import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, Zap, Crown, Sparkles, CheckCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CheckoutButton } from "./checkout-button";
import type { BillingCycle } from "@/lib/plans";

/**
 * For anonymous visitors we route to /checkout/[plano] (signup-after-payment
 * flow). Logged-in users keep using the legacy CheckoutButton -> server
 * action -> Stripe path because they already have a session and a userId.
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
];

const semestralExtras = [
  "Badge de membro 6 meses no perfil",
  "Acesso antecipado a features novas (beta)",
];

const anualExtras = [
  "Badge de fundador permanente",
  "Acesso antecipado a features novas (beta)",
  "Encontro mensal com Caio (Q&A 1h)",
  "Prioridade no suporte direto",
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
  extras: string[];
  extrasLabel: string | null;
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
    extras: [],
    extrasLabel: null,
  },
  {
    cycle: "semestral",
    label: "Semestral",
    tagline: "Compromisso médio, vantagem real",
    monthlyPrice: 33.9,
    billingNote: "R$ 203,40 a cada 6 meses",
    savings: "Economize R$ 24",
    popular: true,
    cta: "Assinar semestral",
    icon: Crown,
    extras: semestralExtras,
    extrasLabel: "+ vantagens do semestral",
  },
  {
    cycle: "anual",
    label: "Anual",
    tagline: "Maior compromisso, todas as vantagens",
    monthlyPrice: 29.9,
    billingNote: "R$ 358,80 por ano",
    savings: "Economize R$ 96",
    popular: false,
    cta: "Quero ser fundador",
    icon: Sparkles,
    extras: anualExtras,
    extrasLabel: "+ vantagens de fundador",
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
  const { from, success } = await searchParams;
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

  // Social proof: contagem real de humans cadastrados
  const { count: memberCount } = await (supabase as any)
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("profile_type", "human");

  const memberLabel = (memberCount ?? 0) > 0
    ? `${memberCount} fundadores já entraram este mês`
    : "Vagas de fundador abertas";

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="sr-only">sinapse</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/sinapse.svg" alt="sinapse" className="mx-auto h-8 w-auto" />
        <p className="text-lg text-muted-foreground">
          Escolha o plano que combina com seu compromisso
        </p>

        {/* Social proof */}
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
          · {memberLabel} ·
        </p>

        {success && (
          <div
            className="mx-auto mt-4 rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 flex items-center gap-2"
            style={{ maxWidth: "min(28rem, 90vw)" }}
          >
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">
              Pagamento realizado com sucesso! Seu plano será atualizado em instantes.
            </p>
          </div>
        )}
      </div>

      {/* Garantia destacada — risk reversal */}
      <div
        className="mx-auto flex items-center gap-3 rounded-lg border border-foreground/15 bg-muted/30 px-5 py-3"
        style={{ maxWidth: "min(42rem, 92vw)" }}
      >
        <ShieldCheck className="h-5 w-5 flex-shrink-0 text-foreground" aria-hidden="true" />
        <p className="text-sm leading-snug">
          <span className="font-semibold">7 dias de garantia incondicional.</span>{" "}
          <span className="text-muted-foreground">
            Não gostou? Reembolso 100% — sem perguntas, sem fricção.
          </span>
        </p>
      </div>

      {/* Plan cards */}
      <div
        className="grid gap-6 sm:grid-cols-3 mx-auto"
        style={{ maxWidth: "min(64rem, 95vw)" }}
      >
        {plans.map((plan) => (
          <div
            key={plan.cycle}
            className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
              plan.popular
                ? "border-foreground shadow-lg ring-1 ring-foreground/20"
                : "border-border hover:border-foreground/40"
            }`}
            style={{ borderRadius: "var(--radius-card)" }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-foreground text-background px-3 py-1 text-xs font-semibold">
                  Mais escolhido
                </Badge>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <plan.icon className="h-5 w-5" aria-hidden="true" />
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

            <ul className="mt-6 flex-1 space-y-2.5">
              {baseFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}

              {plan.extras.length > 0 && (
                <>
                  <li className="pt-2 mt-2 border-t border-border/60">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70">
                      {plan.extrasLabel}
                    </p>
                  </li>
                  {plan.extras.map((extra) => (
                    <li key={extra} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-foreground" aria-hidden="true" />
                      <span className="font-medium">{extra}</span>
                    </li>
                  ))}
                </>
              )}
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
                      "bg-foreground text-background [a]:hover:bg-foreground/90 font-semibold",
                  )}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trust line */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          Pagamento seguro via Stripe · Cartão BR e internacional
        </p>
        <p className="text-xs text-muted-foreground">
          Cancele direto pelo painel — não precisa pedir, não precisa explicar.
        </p>
      </div>

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
