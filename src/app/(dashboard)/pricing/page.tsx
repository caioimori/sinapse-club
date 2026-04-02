import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Zap, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./checkout-button";

export const metadata = {
  title: "Planos — sinapse.club",
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    description: "Comece a explorar a comunidade",
    icon: Zap,
    features: [
      { label: "Forum (categorias free)", included: true },
      { label: "3 threads por mes", included: true },
      { label: "Categorias PRO", included: false },
      { label: "Marketplace", included: false },
      { label: "Ferramentas AI", included: false },
      { label: "Beneficios parceiros", included: false },
      { label: "Cursos inclusos", included: false },
      { label: "Suporte prioritario", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 97",
    period: "/mes",
    description: "Para quem quer aproveitar tudo",
    icon: Crown,
    highlight: true,
    features: [
      { label: "Forum completo", included: true },
      { label: "Threads ilimitados", included: true },
      { label: "Todas as categorias", included: true },
      { label: "Marketplace", included: true },
      { label: "Ferramentas AI", included: true },
      { label: "Beneficios parceiros", included: true },
      { label: "Cursos inclusos", included: false },
      { label: "Suporte prioritario", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 197",
    period: "/mes",
    description: "Acesso total + cursos inclusos",
    icon: Sparkles,
    features: [
      { label: "Tudo do Pro", included: true },
      { label: "Threads ilimitados", included: true },
      { label: "Todas as categorias", included: true },
      { label: "Marketplace", included: true },
      { label: "Ferramentas AI", included: true },
      { label: "Beneficios parceiros", included: true },
      { label: "Cursos inclusos", included: true },
      { label: "Suporte prioritario", included: true },
    ],
  },
] as const;

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

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1
          className="text-3xl font-bold"
          style={{ letterSpacing: "var(--tracking-tight)" }}
        >
          sinapse.club
        </h1>
        <p className="text-lg text-muted-foreground">
          Escolha o plano ideal para voce
        </p>

        {/* Success message after checkout */}
        {success && (
          <div className="mx-auto mt-4 max-w-md rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">
              Pagamento realizado com sucesso! Seu plano sera atualizado em instantes.
            </p>
          </div>
        )}

        {/* Context message when redirected */}
        {!success && (upgrade || reason) && (
          <div className="mx-auto mt-4 max-w-md rounded-lg border border-border bg-muted/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {reason === "pro-required"
                ? "Essa funcionalidade requer um plano Pro ou superior."
                : upgrade
                  ? `Para acessar ${from || "essa area"}, voce precisa do plano ${upgrade === "premium" ? "Premium" : "Pro"} ou superior.`
                  : null}
            </p>
          </div>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 sm:grid-cols-3 mx-auto max-w-4xl">
        {PLANS.map((plan) => {
          const isCurrent = currentRole === plan.id;
          const isHighlighted = "highlight" in plan ? (plan as any).highlight : false;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                isHighlighted
                  ? "border-foreground shadow-md"
                  : "border-border"
              }`}
              style={{ borderRadius: "var(--radius-card)" }}
            >
              {/* Recommended badge */}
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-foreground text-background px-3 py-1 text-xs">
                    Recomendado
                  </Badge>
                </div>
              )}

              {/* Plan header */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <plan.icon className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl font-bold"
                    style={{ letterSpacing: "var(--tracking-tight)" }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    {feature.included ? (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                    )}
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground/60"
                      }
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6">
                {isCurrent ? (
                  <Button
                    variant="outline"
                    className="w-full cursor-default"
                    disabled
                  >
                    Plano atual
                  </Button>
                ) : plan.id === "free" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Gratuito
                  </Button>
                ) : (
                  <CheckoutButton
                    plan={plan.id as "pro" | "premium"}
                    highlighted={isHighlighted}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground">
        Pagamento seguro via PIX pelo AbacatePay.
        <br />
        Cancele a qualquer momento. Sem compromisso.
      </p>

      {/* Back link */}
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
