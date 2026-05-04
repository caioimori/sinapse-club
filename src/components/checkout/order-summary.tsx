"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderSummaryProps {
  planLabel: string;
  planTagline: string;
  priceCents: number;
  /** "/ mes", "/ 6 meses", "/ ano" — short, lowercased */
  pricePeriod: string;
  /** Optional baseline shown crossed-out before the actual price */
  baselineCents?: number;
  /** Optional savings copy below the total */
  savingsCopy?: string;
  /** Optional "equivalent monthly" copy emphasized as anchor (CRO) */
  equivalentMonthlyCopy?: string;
  /** Optional total-savings copy ("Economize R$ X / ano vs mensal") */
  totalSavingsCopy?: string;
  features: string[];
  /** Optional canceled-payment notice */
  canceledNotice?: boolean;
  /** CRO — social proof, ex: "1.247 membros ativos" (passar dado real) */
  socialProof?: string;
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Mobile order summary — collapsible accordion that pins to the top of the
 * checkout page on small screens. Hidden on lg+ (desktop uses the sidebar).
 */
export function OrderSummaryMobile(props: OrderSummaryProps) {
  const [open, setOpen] = useState(false);
  const totalLabel = formatBRL(props.priceCents);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left transition-colors hover:bg-muted/30"
        aria-expanded={open}
        aria-controls="order-summary-mobile-body"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {open ? "Ocultar" : "Ver pedido"}
          </span>
        </div>
        <span className="font-mono text-sm tabular-nums">{totalLabel}</span>
      </button>

      {open && (
        <div
          id="order-summary-mobile-body"
          className="border-b border-border px-4 py-8"
        >
          <SummaryBody {...props} compact />
        </div>
      )}
    </div>
  );
}

/**
 * Desktop order summary — sticky sidebar. Hidden on mobile (mobile uses the
 * accordion above).
 */
export function OrderSummaryDesktop(props: OrderSummaryProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-12">
        <SummaryBody {...props} />
      </div>
    </aside>
  );
}

interface SummaryBodyProps extends OrderSummaryProps {
  compact?: boolean;
}

function SummaryBody({
  planLabel,
  planTagline,
  priceCents,
  pricePeriod,
  baselineCents,
  savingsCopy,
  equivalentMonthlyCopy,
  totalSavingsCopy,
  features,
  canceledNotice,
  socialProof,
  compact,
}: SummaryBodyProps) {
  const totalLabel = formatBRL(priceCents);
  const hasAnchor = Boolean(equivalentMonthlyCopy || totalSavingsCopy);

  return (
    <div className={cn("flex flex-col gap-3", !compact && "lg:h-full")}>
      {/* Breadcrumb — desktop only */}
      {!compact && (
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Trocar plano
        </Link>
      )}

      {/* CARD 1 — Plan + Price (consolidado, peso moderado) */}
      <div className="border border-border/70 bg-background/40 p-5">
        {/* Plan as label, no longer hero */}
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Plano
          </p>
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-foreground">
            {planLabel}
          </p>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          {planTagline}
        </p>

        <div className="mt-7 border-t border-border/60 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Total
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={
                compact
                  ? "font-mono text-[clamp(2.25rem,7vw,3rem)] font-medium leading-[0.95] tabular-nums tracking-[-0.03em]"
                  : "font-mono text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-[0.95] tabular-nums tracking-[-0.03em]"
              }
            >
              {totalLabel}
            </span>
            <span className="text-[13px] text-muted-foreground">
              {pricePeriod}
            </span>
          </div>

          {/* Anchor pricing block (CRO) — semestral/anual */}
          {hasAnchor && (
            <div className="mt-3 space-y-1.5">
              {equivalentMonthlyCopy && (
                <p className="text-[13px] text-foreground">
                  {equivalentMonthlyCopy}
                </p>
              )}
              {totalSavingsCopy && (
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {totalSavingsCopy}
                </p>
              )}
              {baselineCents && baselineCents > priceCents && (
                <p className="font-mono text-[11px] tabular-nums text-muted-foreground/70">
                  <span className="line-through">{formatBRL(baselineCents)}</span>
                  <span className="ml-1.5">vs mensal</span>
                </p>
              )}
            </div>
          )}

          {!hasAnchor && savingsCopy && (
            <p className="mt-3 font-mono text-[11px] tabular-nums text-muted-foreground">
              {savingsCopy}
            </p>
          )}

          {/* CRO — Garantia badge (risk reversal proeminente) */}
          <div className="mt-5 flex items-start gap-3 border border-foreground/15 bg-foreground/[0.02] p-3">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-[13px] font-medium leading-tight text-foreground">
                7 dias de garantia incondicional
              </p>
              <p className="text-[12px] leading-snug text-muted-foreground">
                Não curtiu, devolvemos 100% — sem perguntas, sem letra miúda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2 — Features ("o que voce leva") */}
      <div className="border border-border/70 bg-background/40 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          O que está incluso
        </p>
        <ul className="mt-3 space-y-2">
          {features.map((feat) => (
            <li
              key={feat}
              className="flex gap-2.5 text-[14px] leading-relaxed text-foreground/85"
            >
              <span aria-hidden="true" className="mt-2 inline-block h-px w-3 shrink-0 bg-foreground/40" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CRO — Social proof (opcional, passar dado real via prop) */}
      {socialProof && (
        <p className={cn(
          "text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
          !compact && "lg:mt-auto"
        )}>
          {socialProof}
        </p>
      )}

      {/* CRO — Trust row (pagamento seguro + bandeiras reais) */}
      <div className={cn(
        "space-y-3 border-t border-border/60 pt-4",
        !compact && !socialProof && "lg:mt-auto"
      )}>
        <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <Lock className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
          Pagamento 100% seguro
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <CardBrandVisa />
          <CardBrandMastercard />
          <CardBrandElo />
          <CardBrandAmex />
          <CardBrandPix />
        </div>
      </div>

      {canceledNotice && (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Pagamento anterior cancelado. Sem cobranca.
        </p>
      )}
    </div>
  );
}

/* ---------------------- Card brand SVGs --------------------------- */
/* Logos oficiais em wordmark — reconheciveis, escala h-6 (24px).
 *
 * NOTA BRANDBOOK: bandeiras de cartão usam suas cores oficiais (Visa azul-marinho,
 * Mastercard vermelho/laranja, Pix turquesa, etc.) — exceção consciente à rule 01
 * (paleta B&W absoluta). Justificativa: trust signal de pagamento é função
 * (reconhecimento instantâneo) > estética. Padrão de indústria em checkout. */

const brandWrap =
  "inline-flex h-6 items-center justify-center rounded-sm border border-border/60 bg-background px-2";

function CardBrandVisa() {
  return (
    <span className={brandWrap} role="img" aria-label="Visa">
      <svg viewBox="0 0 48 16" className="h-3.5 w-auto" aria-hidden="true">
        <text
          x="0"
          y="13"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="14"
          fill="#1A1F71"
          letterSpacing="0.5"
        >
          VISA
        </text>
      </svg>
    </span>
  );
}

function CardBrandMastercard() {
  return (
    <span className={brandWrap} role="img" aria-label="Mastercard">
      <svg viewBox="0 0 32 20" className="h-4 w-auto" aria-hidden="true">
        <circle cx="12" cy="10" r="7" fill="#EB001B" />
        <circle cx="20" cy="10" r="7" fill="#F79E1B" />
        <path
          d="M16 4.7a7 7 0 0 0 0 10.6 7 7 0 0 0 0-10.6Z"
          fill="#FF5F00"
        />
      </svg>
    </span>
  );
}

function CardBrandElo() {
  return (
    <span className={brandWrap} role="img" aria-label="Elo">
      <svg viewBox="0 0 36 16" className="h-3.5 w-auto" aria-hidden="true">
        <text
          x="0"
          y="13"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="13"
          fill="#000"
          letterSpacing="-0.5"
        >
          elo
        </text>
        <circle cx="22" cy="6" r="2" fill="#FFCB05" />
        <circle cx="27" cy="6" r="2" fill="#EF4123" />
        <circle cx="32" cy="6" r="2" fill="#00A4E0" />
      </svg>
    </span>
  );
}

function CardBrandAmex() {
  return (
    <span className={brandWrap} role="img" aria-label="American Express">
      <svg viewBox="0 0 40 16" className="h-3.5 w-auto" aria-hidden="true">
        <rect width="40" height="16" fill="#2E77BC" />
        <text
          x="20"
          y="11"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="7"
          fill="#FFF"
          letterSpacing="0.3"
        >
          AMEX
        </text>
      </svg>
    </span>
  );
}

function CardBrandPix() {
  return (
    <span className={brandWrap} role="img" aria-label="Pix">
      <svg viewBox="0 0 32 32" className="h-4 w-auto" aria-hidden="true">
        <path
          d="M9.6 22.4 6.4 19.2a4.5 4.5 0 0 1 0-6.4l3.2-3.2L13 13l-3.2 3.2a.5.5 0 0 0 0 .8l3.2 3.2-3.4 2.2Z"
          fill="#32BCAD"
        />
        <path
          d="M22.4 22.4 19.2 19.2 22.4 16a.5.5 0 0 0 0-.8L19.2 12l3.2-3.2 3.2 3.2a4.5 4.5 0 0 1 0 6.4l-3.2 3.2Z"
          fill="#32BCAD"
        />
        <path
          d="M16 8.6 12.8 5.4a4.5 4.5 0 0 1 6.4 0L16 8.6Z"
          fill="#32BCAD"
        />
        <path
          d="M16 23.4 19.2 26.6a4.5 4.5 0 0 1-6.4 0L16 23.4Z"
          fill="#32BCAD"
        />
      </svg>
    </span>
  );
}
