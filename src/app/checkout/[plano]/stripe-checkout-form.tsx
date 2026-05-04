"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import { createStripeSubscriptionForVisitor } from "./actions";

interface StripeCheckoutFormProps {
  plano: string;
  planLabel: string;
  priceCents: number;
  /** "/ mes", "/ 6 meses", "/ ano" — used in the CTA microcopy */
  pricePeriod: string;
  /** Pre-fill do email vindo da sessao Supabase (user logado). */
  defaultEmail?: string;
  /** Pre-fill do nome (full_name | preferred_username | local-part do email). */
  defaultName?: string;
  /** Quando true, esconde OAuth e trava email/nome em read-only. */
  isAuthenticated?: boolean;
}

const stripePromise = (() => {
  const key =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      : undefined;
  if (!key) return null;
  return loadStripe(key);
})();

const appearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#FAFAFA",
    colorBackground: "#0A0A0A",
    colorText: "#FAFAFA",
    colorTextSecondary: "#A1A1AA",
    colorDanger: "#EF4444",
    colorSuccess: "#22C55E",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeBase: "15px",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #27272A",
      backgroundColor: "#0A0A0A",
      padding: "14px 14px",
      boxShadow: "none",
      transition: "border-color 150ms ease",
    },
    ".Input:focus": {
      borderColor: "#FAFAFA",
      boxShadow: "none",
      outline: "none",
    },
    ".Input--invalid": {
      borderColor: "#EF4444",
    },
    ".Label": {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      fontWeight: "500",
      marginBottom: "8px",
      color: "#A1A1AA",
    },
    ".Tab": {
      border: "1px solid #27272A",
      backgroundColor: "transparent",
      borderRadius: "0px",
    },
    ".Tab--selected": {
      borderColor: "#FAFAFA",
      backgroundColor: "#0A0A0A",
    },
    ".Error": {
      fontSize: "12px",
      color: "#EF4444",
      marginTop: "4px",
    },
  },
};

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function StripeCheckoutForm({
  plano,
  planLabel,
  priceCents,
  pricePeriod,
  defaultEmail,
  defaultName,
  isAuthenticated = false,
}: StripeCheckoutFormProps) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [name, setName] = useState(defaultName ?? "");
  // User logado ja aceitou termos no signup — pre-marca consent.
  const [consent, setConsent] = useState(isAuthenticated);

  // Inline validation — only show errors after the field was touched (CRO §02)
  const [emailTouched, setEmailTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const emailValid = isValidEmail(email);
  const nameValid = name.trim().length >= 2;
  const emailError = emailTouched && !emailValid && email.length > 0;
  const nameError = nameTouched && !nameValid && name.length > 0;

  function buildOAuthRedirect(): string {
    const base = `${window.location.origin}/auth/callback`;
    const next = encodeURIComponent(`/subscribe/${plano}`);
    return `${base}?next=${next}`;
  }

  async function handleGoogle() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: buildOAuthRedirect() },
    });
    if (oauthError) setError(oauthError.message);
  }

  async function handleGithub() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: buildOAuthRedirect(), scopes: "read:user user:email" },
    });
    if (oauthError) setError(oauthError.message);
  }

  function handleStartPayment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Force-touch all fields on submit so missing-field errors render
    setEmailTouched(true);
    setNameTouched(true);
    if (!emailValid || !nameValid || !consent) return;

    startTransition(async () => {
      const result = await createStripeSubscriptionForVisitor({
        plano,
        email,
        name,
        consentTerms: consent,
        consentPrivacy: consent,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setClientSecret(result.clientSecret);
    });
  }

  const elementsOptions = useMemo<StripeElementsOptions | null>(() => {
    if (!clientSecret) return null;
    return { clientSecret, appearance };
  }, [clientSecret]);

  if (!stripePromise) {
    return (
      <div className="rounded-none border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        Pagamento indisponivel: chave publica do Stripe nao configurada. Avise o suporte.
      </div>
    );
  }

  const stage1Cta = "Continuar";
  const priceLine = `${formatBRL(priceCents)} ${pricePeriod}`.replace(/\s+/g, " ").trim();

  return (
    <div className="space-y-8">
      {/* OAuth shortcut — escondido quando user ja esta logado */}
      {!isAuthenticated && (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-none"
          onClick={handleGoogle}
          disabled={isPending}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar com Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-none"
          onClick={handleGithub}
          disabled={isPending}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Continuar com GitHub
        </Button>
      </div>
      )}

      {!isAuthenticated && (
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          ou
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      )}

      {/* Stage 1: collect name/email/consent. Stage 2: render Payment Element. */}
      {!clientSecret && (
        <form onSubmit={handleStartPayment} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setNameTouched(true)}
                autoComplete="name"
                required
                minLength={2}
                disabled={isPending}
                readOnly={isAuthenticated}
                aria-invalid={nameError || undefined}
                className="h-12 pr-10 text-[15px]"
              />
              {nameTouched && nameValid && (
                <Check
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60"
                  aria-hidden="true"
                />
              )}
            </div>
            {nameError && (
              <p className="text-[12px] text-destructive">Falta o nome.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                autoComplete="email"
                inputMode="email"
                required
                disabled={isPending}
                readOnly={isAuthenticated}
                aria-invalid={emailError || undefined}
                className="h-12 pr-10 text-[15px]"
              />
              {emailTouched && emailValid && (
                <Check
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60"
                  aria-hidden="true"
                />
              )}
            </div>
            {emailError && (
              <p className="text-[12px] text-destructive">Email não parece certo.</p>
            )}
          </div>

          {!isAuthenticated && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-1 h-4 w-4 border-border accent-foreground"
              />
              <label htmlFor="consent" className="text-[13px] leading-relaxed text-muted-foreground">
                Concordo com os{" "}
                <Link href="/termos" target="_blank" rel="noopener noreferrer" className="text-foreground underline">
                  Termos
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-foreground underline">
                  Privacidade
                </Link>
                .
              </label>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}

          <div className="space-y-2.5 pt-2">
            <Button
              type="submit"
              className="h-12 w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
              disabled={isPending}
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processando...</>
              ) : (
                stage1Cta
              )}
            </Button>
            <p className="font-mono text-center text-[11px] tracking-[0.04em] text-muted-foreground">
              {priceLine} · 7 dias de garantia
            </p>
          </div>
        </form>
      )}

      {clientSecret && elementsOptions && (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <StripePaymentInner
            planLabel={planLabel}
            plano={plano}
            priceCents={priceCents}
            pricePeriod={pricePeriod}
            onReset={() => {
              setClientSecret(null);
              setError(null);
            }}
          />
        </Elements>
      )}

      {!isAuthenticated && (
        <p className="text-center text-[13px] text-muted-foreground">
          Ja tem conta?{" "}
          <Link href={`/login?plan=${plano}`} className="text-foreground underline">
            Fazer login
          </Link>
        </p>
      )}
    </div>
  );
}

function StripePaymentInner({
  planLabel,
  plano,
  priceCents,
  pricePeriod,
  onReset,
}: {
  planLabel: string;
  plano: string;
  priceCents: number;
  pricePeriod: string;
  onReset: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setPaymentError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/welcome?plan=${plano}`,
      },
    });

    if (confirmError) {
      const rawMsg = confirmError.message ?? "Cartão recusado. Tente outro.";
      // Yampi-style microcopy: erros diretos e acionáveis
      const msg = confirmError.code === "card_declined"
        ? "Cartão recusado. Tente outro ou outro cartão."
        : confirmError.code === "expired_card"
        ? "Cartão expirado."
        : confirmError.code === "incorrect_cvc"
        ? "CVV não confere. Confira atrás do cartão."
        : confirmError.code === "insufficient_funds"
        ? "Saldo insuficiente. Tente outro cartão."
        : rawMsg;
      setPaymentError(msg);
      setSubmitting(false);

      // Erros tipo `card_error` ou `validation_error` ficam inline.
      // Erros fatais (network, server) jogam pra /pagamento/falhou.
      if (confirmError.type !== "card_error" && confirmError.type !== "validation_error") {
        window.location.href = `/pagamento/falhou?error=${encodeURIComponent(msg)}`;
      }
    }
    // Se sucesso, Stripe redireciona automatico pro return_url.
  }

  const finalPriceLine = `${(priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ${pricePeriod}`.replace(/\s+/g, " ").trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Cartao · {planLabel}
      </p>
      <PaymentElement
        options={{
          layout: { type: "tabs", defaultCollapsed: false },
          paymentMethodOrder: ["card"],
        }}
      />
      {paymentError && (
        <p className="text-sm text-destructive" role="alert">{paymentError}</p>
      )}

      <div className="space-y-2.5 pt-2">
        <Button
          type="submit"
          className="h-12 w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
          disabled={!stripe || submitting}
        >
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processando...</>
          ) : (
            "Assinar agora"
          )}
        </Button>
        <p className="font-mono text-center text-[11px] tracking-[0.04em] text-muted-foreground">
          {finalPriceLine} · 7 dias de garantia
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={submitting}
        className="w-full text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
      >
        Voltar
      </button>
    </form>
  );
}
