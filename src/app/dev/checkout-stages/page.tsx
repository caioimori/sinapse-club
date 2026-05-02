import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  OrderSummaryDesktop,
  OrderSummaryMobile,
} from "@/components/checkout/order-summary";
import { ResendLink } from "@/app/welcome/resend-link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout stages — preview (dev only)",
};

/**
 * Dev-only preview of every checkout stage in vertical sequence.
 * Gated by NODE_ENV — returns 404 in production builds.
 */
export default function CheckoutStagesPreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const summaryProps = {
    planLabel: "Anual",
    planTagline: "Cobrado uma vez por ano. Maior economia.",
    priceCents: 35880,
    pricePeriod: "/ ano",
    baselineCents: 71880,
    savingsCopy: "Equivale a R$ 29,90 / mes",
    features: [
      "Acesso completo ao forum",
      "Curadoria diaria IA + negocios",
      "Ferramentas e marketplace",
      "Gamificacao, ranks e leaderboard",
      "7 dias de garantia incondicional",
    ],
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-background px-[clamp(1.25rem,5vw,4rem)] py-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Dev preview · checkout stages
        </p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">
          Todas as 5 etapas em sequencia
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Este preview e gated por NODE_ENV — volta 404 em producao.
        </p>
      </header>

      {/* Stage 1 */}
      <Stage
        label="Etapa 1"
        title="Identidade + plano"
        spec="Form coleta nome, email, consentimento. Order summary fixo (sticky desktop / accordion mobile). Plano + preco em tipografia gigante. CTA paga via AbacatePay."
        href="/checkout/anual"
      >
        <FakeCheckoutShell summaryProps={summaryProps}>
          <Stage1Form />
        </FakeCheckoutShell>
      </Stage>

      {/* Stage 2 */}
      <Stage
        label="Etapa 2"
        title="Pagamento (Stripe inline ou redirect AbacatePay)"
        spec="Stripe: Payment Element renderizado inline no mesmo layout. AbacatePay: redirect externo (nao ha tela intermediaria nossa). Microcopy minima: 'Cartao · {plano}'."
        href="/checkout/anual"
      >
        <FakeCheckoutShell summaryProps={summaryProps}>
          <Stage2Form />
        </FakeCheckoutShell>
      </Stage>

      {/* Stage 3 */}
      <Stage
        label="Etapa 3"
        title="Processando"
        spec="Estado transiente (200-2000ms) entre confirmacao Stripe e redirect pro /welcome. UI: spinner + 'Processando' uppercase mono. Sem cards, sem narrativa."
      >
        <FakeCheckoutShell summaryProps={summaryProps}>
          <Stage3Processing />
        </FakeCheckoutShell>
      </Stage>

      {/* Stage 4 */}
      <Stage
        label="Etapa 4"
        title="/welcome — sucesso"
        spec="Tipografia gigante 'Bem-vindo.' + microcopy explicando link magico no email. Reenvio inline. Sem decoracoes (sem ring, sem icone enorme)."
        href="/welcome?plan=anual&email=teste@sinapse.club"
      >
        <FakeWelcome />
      </Stage>

      {/* Stage 5 */}
      <Stage
        label="Etapa 5"
        title="/pagamento/falhou — erro"
        spec="Mesma escala tipografica de /welcome. Lista de causas em mono microcopy. CTA 'Tentar novamente' + suporte por email."
        href="/pagamento/falhou?plan=anual&error=Cartao%20recusado"
      >
        <FakeFailed />
      </Stage>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Layout helpers                                                            */
/* ──────────────────────────────────────────────────────────────────────── */

function Stage({
  label,
  title,
  spec,
  href,
  children,
}: {
  label: string;
  title: string;
  spec: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <div className="border-b border-border bg-muted/20 px-[clamp(1.25rem,5vw,4rem)] py-6">
        <div className="flex items-baseline justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
            <h2 className="text-[22px] font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          {href && (
            <Link
              href={href}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Abrir tela real →
            </Link>
          )}
        </div>
        <p
          className="mt-3 text-[13px] leading-relaxed text-muted-foreground"
          style={{ maxWidth: "clamp(20rem, 60vw, 42rem)" }}
        >
          {spec}
        </p>
      </div>
      <div className="bg-background">{children}</div>
    </section>
  );
}

interface SummaryShellProps {
  summaryProps: React.ComponentProps<typeof OrderSummaryDesktop>;
  children: React.ReactNode;
}

function FakeCheckoutShell({ summaryProps, children }: SummaryShellProps) {
  return (
    <>
      <OrderSummaryMobile {...summaryProps} />
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="hidden lg:block lg:border-r lg:border-border lg:px-12 lg:py-16 xl:px-20 xl:py-20">
          <OrderSummaryDesktop {...summaryProps} />
        </div>
        <div className="px-[clamp(1.25rem,5vw,4rem)] py-12 lg:py-20">
          <div
            className="mx-auto w-full space-y-10"
            style={{ maxWidth: "clamp(20rem, 40vw, 32rem)" }}
          >
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Pagamento
              </p>
              <h2 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-[30px]">
                Crie sua conta e pague
              </h2>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Stage mocks (no logic, no submit handlers)                                */
/* ──────────────────────────────────────────────────────────────────────── */

function Stage1Form() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Button variant="outline" className="w-full rounded-none" disabled>
          Continuar com Google
        </Button>
        <Button variant="outline" className="w-full rounded-none" disabled>
          Continuar com GitHub
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          ou
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="dev-name">Nome</Label>
          <Input id="dev-name" defaultValue="Caio Imori" disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dev-email">Email</Label>
          <Input id="dev-email" type="email" defaultValue="caio@sinapse.club" disabled />
        </div>
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            disabled
            checked
            readOnly
            className="mt-1 h-4 w-4 border-border accent-foreground"
          />
          <span className="text-[13px] leading-relaxed text-muted-foreground">
            Concordo com os Termos e Privacidade.
          </span>
        </div>
        <Button
          className="h-12 w-full rounded-none bg-foreground text-background"
          disabled
        >
          Pagar — Anual
        </Button>
        <p className="font-mono text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Stripe · 7 dias de garantia
        </p>
      </div>
    </div>
  );
}

function Stage2Form() {
  return (
    <div className="space-y-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Cartao · Anual
      </p>
      <div className="space-y-3 border border-border bg-background p-5">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Numero do cartao
          </p>
          <div className="h-10 border border-border bg-background" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Validade
            </p>
            <div className="h-10 border border-border bg-background" />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              CVV
            </p>
            <div className="h-10 border border-border bg-background" />
          </div>
        </div>
        <p className="pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Wireframe — Stripe Payment Element renderiza aqui.
        </p>
      </div>
      <Button
        className="h-12 w-full rounded-none bg-foreground text-background uppercase tracking-wider"
        disabled
      >
        Pagar R$ 358,80
      </Button>
      <button className="w-full text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Trocar dados
      </button>
    </div>
  );
}

function Stage3Processing() {
  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <Loader2 className="h-6 w-6 animate-spin text-foreground" />
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Processando pagamento
      </p>
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Aguarde — confirmando com a operadora. Nao feche essa janela.
      </p>
    </div>
  );
}

function FakeWelcome() {
  return (
    <div className="relative">
      <div className="absolute left-6 top-6">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Trocar plano
        </span>
      </div>
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 px-[clamp(1.25rem,5vw,4rem)] py-24 lg:grid-cols-12 lg:gap-16">
        <div
          className="space-y-10 lg:col-span-7 lg:col-start-2"
          style={{ maxWidth: "clamp(20rem, 60vw, 44rem)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Pagamento confirmado
          </p>
          <h1 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.95] tracking-tight">
            Bem-vindo.
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Plano <span className="text-foreground">anual</span> ativo. Enviamos
            um link de acesso para{" "}
            <span className="text-foreground">caio@sinapse.club</span>. Clique
            nele pra entrar.
          </p>
          <div className="space-y-3 border-t border-border pt-8">
            <ResendLink email="caio@sinapse.club" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Nao chegou? Verifique spam ou promocoes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FakeFailed() {
  return (
    <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 px-[clamp(1.25rem,5vw,4rem)] py-24 lg:grid-cols-12 lg:gap-16">
      <div
        className="space-y-10 lg:col-span-7 lg:col-start-2"
        style={{ maxWidth: "clamp(20rem, 60vw, 44rem)" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Status · transacao
        </p>
        <h1 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.95] tracking-tight">
          Pagamento
          <br />
          nao completou.
        </h1>
        <p className="border-l-2 border-destructive pl-4 text-[15px] leading-relaxed text-foreground/80">
          Cartao recusado pela operadora.
        </p>
        <div className="space-y-3 border-t border-border pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            O que pode ter acontecido
          </p>
          <ul className="space-y-1.5 text-[14px] leading-relaxed text-foreground/80">
            <li>Cartao recusado pela operadora</li>
            <li>Limite insuficiente ou bloqueio pra compras online</li>
            <li>Dados incorretos (numero, validade ou CVV)</li>
            <li>Antifraude do banco bloqueou a transacao</li>
          </ul>
        </div>
        <div className="space-y-3 pt-2">
          <span className="flex h-12 w-full items-center justify-center bg-foreground text-sm font-medium uppercase tracking-wider text-background">
            Tentar novamente
          </span>
        </div>
      </div>
    </div>
  );
}
