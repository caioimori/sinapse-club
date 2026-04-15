import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLANS, type BillingCycle } from "@/lib/abacatepay";

export const dynamic = "force-dynamic";

type SubscriptionRow = {
  plan: string | null;
  status: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
};

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type SearchParams = { success?: string; canceled?: string; plan?: string };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings/billing");
  }

  const { data: subscription } = await (
    supabase as unknown as {
      from: (t: string) => {
        select: (c: string) => {
          eq: (k: string, v: string) => {
            maybeSingle: () => Promise<{ data: SubscriptionRow | null }>;
          };
        };
      };
    }
  )
    .from("subscriptions")
    .select("plan, status, current_period_start, current_period_end, canceled_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const activePlan = subscription?.plan as BillingCycle | "pro" | "premium" | null;
  const planDef =
    activePlan === "mensal" || activePlan === "semestral" || activePlan === "anual"
      ? PLANS[activePlan]
      : null;

  const isActive = subscription?.status === "active" && !subscription?.canceled_at;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/settings"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Ajustes
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Assinatura
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie seu plano de acesso ao sinapse.club.
        </p>
      </div>

      {params.success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Pagamento confirmado! O acesso pode levar alguns segundos pra liberar.
        </div>
      )}

      {params.canceled && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Checkout cancelado. Você pode escolher um plano a qualquer momento.
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Plano atual</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-900"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isActive ? "Ativo" : "Sem plano ativo"}
          </span>
        </div>

        {isActive && planDef ? (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Plano</dt>
              <dd className="font-medium">{planDef.label}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Valor</dt>
              <dd className="font-medium">{formatBRL(planDef.priceCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Início do período</dt>
              <dd>{formatDate(subscription?.current_period_start ?? null)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Acesso válido até</dt>
              <dd>{formatDate(subscription?.current_period_end ?? null)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Você ainda não tem um plano ativo.{" "}
            <Link href="/#pricing" className="font-medium text-foreground underline">
              Ver planos
            </Link>
            .
          </p>
        )}
      </div>

      {isActive && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Renovação automática não ativada. Você receberá um aviso antes do
          vencimento para escolher se quer continuar.
        </p>
      )}
    </div>
  );
}
