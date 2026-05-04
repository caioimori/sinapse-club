"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import {
  CardNumberInput,
  CardExpiryInput,
  CardCvcInput,
  cardValidators,
} from "@/components/checkout/card-input";

export type CheckoutStage = "lead" | "card" | "loading" | "success" | "error";

export interface CheckoutFlowProps {
  plano: string;
  planLabel: string;
  priceCents: number;
  /** "/ mes", "/ 6 meses", "/ ano" */
  pricePeriod: string;
  defaultEmail?: string;
  defaultName?: string;
  isAuthenticated?: boolean;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function CheckoutFlow({
  plano,
  priceCents,
  pricePeriod,
  defaultEmail,
  defaultName,
  isAuthenticated = false,
}: CheckoutFlowProps) {
  const [stage, setStage] = useState<CheckoutStage>("lead");

  // Lead state
  const [name, setName] = useState(defaultName ?? "");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [consent, setConsent] = useState(isAuthenticated);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumberTouched, setCardNumberTouched] = useState(false);
  const [cardExpiryTouched, setCardExpiryTouched] = useState(false);
  const [cardCvcTouched, setCardCvcTouched] = useState(false);
  const [cardNameTouched, setCardNameTouched] = useState(false);

  // Lead validators
  const emailValid = isValidEmail(email);
  const nameValid = name.trim().length >= 2;
  const emailError = emailTouched && !emailValid && email.length > 0;
  const nameError = nameTouched && !nameValid && name.length > 0;

  // Card validators
  const cardNumberValid = cardValidators.isValidCardNumber(cardNumber);
  const cardExpiryValid = cardValidators.isValidExpiry(cardExpiry);
  const cardCvcValid = cardValidators.isValidCvc(cardCvc);
  const cardNameValid = cardName.trim().length >= 2;

  const priceLine = `${formatBRL(priceCents)} ${pricePeriod}`
    .replace(/\s+/g, " ")
    .trim();

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    if (!nameValid || !emailValid || !consent) return;
    setStage("card");
  }

  function handleCardSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCardNumberTouched(true);
    setCardExpiryTouched(true);
    setCardCvcTouched(true);
    setCardNameTouched(true);
    if (
      !cardNumberValid ||
      !cardExpiryValid ||
      !cardCvcValid ||
      !cardNameValid
    ) {
      return;
    }
    setStage("loading");
    // Mock processing — 80% success, 20% error
    window.setTimeout(() => {
      const ok = Math.random() < 0.8;
      setStage(ok ? "success" : "error");
    }, 2000);
  }

  // OAuth visual placeholders (no action — Stripe-less iteration)
  function noopOAuth(e: React.MouseEvent) {
    e.preventDefault();
  }

  const progressPct =
    stage === "lead" ? 50 : stage === "card" ? 100 : 100;

  return (
    <div className="space-y-5">
      {/* CRO — barra de progresso linear (reduz ansiedade, simples) */}
      {(stage === "lead" || stage === "card") && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>{stage === "lead" ? "Seus dados" : "Pagamento"}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-[3px] w-full bg-border">
            <div
              className="h-full bg-foreground transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {stage === "lead" && (
        <>
          {!isAuthenticated && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-none"
                onClick={noopOAuth}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-none"
                onClick={noopOAuth}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
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

          <form onSubmit={handleLeadSubmit} className="space-y-4" noValidate>
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
                  readOnly={isAuthenticated}
                  aria-invalid={nameError || undefined}
                  className="h-11 pr-10 text-[14px]"
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
                  readOnly={isAuthenticated}
                  aria-invalid={emailError || undefined}
                  className="h-11 pr-10 text-[14px]"
                />
                {emailTouched && emailValid && (
                  <Check
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60"
                    aria-hidden="true"
                  />
                )}
              </div>
              {emailError && (
                <p className="text-[12px] text-destructive">
                  Email não parece certo.
                </p>
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
                <label
                  htmlFor="consent"
                  className="text-[13px] leading-relaxed text-muted-foreground"
                >
                  Concordo com os{" "}
                  <Link
                    href="/termos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline"
                  >
                    Termos
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="/privacidade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline"
                  >
                    Privacidade
                  </Link>
                  .
                </label>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <Button
                type="submit"
                className="h-11 w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
              >
                Continuar pra pagamento
              </Button>
              <p className="font-mono text-center text-[11px] tracking-[0.04em] text-muted-foreground">
                {priceLine} · 7 dias pra desistir
              </p>
            </div>
          </form>

          {!isAuthenticated && (
            <p className="text-center text-[13px] text-muted-foreground">
              Já tem conta?{" "}
              <Link
                href={`/login?plan=${plano}`}
                className="text-foreground underline"
              >
                Fazer login
              </Link>
            </p>
          )}
        </>
      )}

      {stage === "card" && (
        <form onSubmit={handleCardSubmit} className="space-y-5" noValidate>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Dados do cartão
          </p>

          <CardNumberInput
            value={cardNumber}
            onChange={setCardNumber}
            touched={cardNumberTouched}
            onTouch={() => setCardNumberTouched(true)}
          />

          <div className="grid grid-cols-2 gap-4">
            <CardExpiryInput
              value={cardExpiry}
              onChange={setCardExpiry}
              touched={cardExpiryTouched}
              onTouch={() => setCardExpiryTouched(true)}
            />
            <CardCvcInput
              value={cardCvc}
              onChange={setCardCvc}
              touched={cardCvcTouched}
              onTouch={() => setCardCvcTouched(true)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc-name">Nome no cartão</Label>
            <Input
              id="cc-name"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onBlur={() => setCardNameTouched(true)}
              autoComplete="cc-name"
              required
              aria-invalid={
                (cardNameTouched && !cardNameValid && cardName.length > 0) ||
                undefined
              }
              className="h-12 text-[15px] uppercase tracking-[0.04em]"
            />
            {cardNameTouched && !cardNameValid && cardName.length > 0 && (
              <p className="text-[12px] text-destructive">
                Como está impresso no cartão.
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              className="h-12 w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
            >
              Liberar meu acesso agora
            </Button>
            <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
              Cobrança única de <span className="font-medium text-foreground">{priceLine}</span>.
              Não curtiu? Devolvemos 100% em 7 dias.
            </p>
          </div>

          {/* CRO — FAQ inline (objections handling, abaixo do CTA) */}
          <div className="space-y-3 border-t border-border/60 pt-5">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-[13px] text-foreground/85 transition-colors hover:text-foreground">
                <span>Como recebo o acesso?</span>
                <span className="font-mono text-[11px] text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                Assim que o pagamento confirma, mandamos um email com link pra criar sua senha. Acesso liberado em segundos.
              </p>
            </details>
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-[13px] text-foreground/85 transition-colors hover:text-foreground">
                <span>Posso cancelar quando quiser?</span>
                <span className="font-mono text-[11px] text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                Sim. Cancela direto na sua conta, sem ligar pra ninguém. Nos primeiros 7 dias, devolvemos 100% do valor.
              </p>
            </details>
          </div>

          <button
            type="button"
            onClick={() => setStage("lead")}
            className="w-full text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </button>
        </form>
      )}

      {stage === "loading" && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <Loader2
            className="h-6 w-6 animate-spin text-foreground/70"
            aria-hidden="true"
          />
          <p className="text-[15px] text-foreground">
            Processando seu pagamento...
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Não feche esta janela.
          </p>
        </div>
      )}

      {stage === "success" && (
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <Check
            className="h-8 w-8 text-foreground"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-light leading-[1] tracking-tight">
            Acesso liberado.
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Mandamos um email pra você entrar. Confira sua caixa.
          </p>
          <Link
            href="/forum"
            className="inline-flex h-12 w-full items-center justify-center bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Ir pro forum
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Pode demorar até 1 minuto.
          </p>
        </div>
      )}

      {stage === "error" && (
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] font-light leading-[1] tracking-tight">
            Cartão recusado.
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Tente outro cartão ou use um diferente.
          </p>
          <button
            type="button"
            onClick={() => setStage("card")}
            className="inline-flex h-12 w-full items-center justify-center bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Tentar de novo
          </button>
          <button
            type="button"
            onClick={() => setStage("lead")}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            ← Voltar pra dados
          </button>
        </div>
      )}

    </div>
  );
}
