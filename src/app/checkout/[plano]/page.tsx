import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/abacatepay";
import { CheckoutForm } from "./checkout-form";

export const dynamic = "force-dynamic";

const planFeatures = [
  "Acesso completo ao forum",
  "Curadoria diaria IA + negocios",
  "Ferramentas e marketplace",
  "Gamificacao, ranks e leaderboard",
  "7 dias de garantia incondicional",
];

function formatBRL(cents: number): string {
  return (cents / 100)
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace(/\s/g, " ");
}

function periodLabel(plano: string): string {
  if (plano === "mensal") return "por mes";
  if (plano === "semestral") return "a cada 6 meses";
  if (plano === "anual") return "por ano";
  return "";
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

  return (
    <div className="min-h-dvh bg-background py-12 px-4 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Plan summary */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Link
              href="/#precos"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← Trocar de plano
            </Link>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {plan.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              {plan.id === "mensal" &&
                "Cobrado todo mes. Cancele quando quiser."}
              {plan.id === "semestral" &&
                "Cobrado a cada 6 meses."}
              {plan.id === "anual" &&
                "Cobrado uma vez por ano. Maior economia."}
            </p>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {formatBRL(plan.priceCents)}
              </span>
              <span className="text-sm text-muted-foreground">
                {periodLabel(plan.id)}
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {planFeatures.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {canceled && (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Pagamento cancelado. Voce pode tentar novamente quando quiser.
            </div>
          )}
        </div>

        {/* Form */}
        <div className="lg:pt-12">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <CheckoutForm plano={plan.id} planLabel={plan.label} />
          </div>
        </div>
      </div>
    </div>
  );
}
