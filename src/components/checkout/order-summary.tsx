"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

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
  features: string[];
  /** Optional canceled-payment notice */
  canceledNotice?: boolean;
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
  features,
  canceledNotice,
  compact,
}: SummaryBodyProps) {
  const totalLabel = formatBRL(priceCents);

  return (
    <div className="space-y-10">
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

      {/* Plan name — pure typography hierarchy */}
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Plano
        </p>
        <h1
          className={
            compact
              ? "text-[26px] font-semibold leading-[1.05] tracking-tight"
              : "text-[clamp(3.75rem,7vw,7.5rem)] font-semibold leading-[0.95] tracking-tight"
          }
        >
          {planLabel}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {planTagline}
        </p>
      </div>

      {/* Price — the visual anchor */}
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Total
        </p>
        <div className="flex items-baseline gap-3">
          <span
            className={
              compact
                ? "text-[56px] font-semibold leading-none tabular-nums tracking-tight"
                : "text-[clamp(3.5rem,6vw,6rem)] font-semibold leading-none tabular-nums tracking-tight"
            }
          >
            {totalLabel}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {pricePeriod}
          </span>
        </div>
        {baselineCents && baselineCents > priceCents && (
          <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
            <span className="line-through">{formatBRL(baselineCents)}</span>
            {savingsCopy ? <> · {savingsCopy}</> : null}
          </p>
        )}
        {!baselineCents && savingsCopy && (
          <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {savingsCopy}
          </p>
        )}
      </div>

      {/* Features — minimal list, no icons */}
      <ul className="space-y-2.5 border-t border-border pt-8">
        {features.map((feat) => (
          <li
            key={feat}
            className="text-[14px] leading-relaxed text-foreground/80"
          >
            {feat}
          </li>
        ))}
      </ul>

      {canceledNotice && (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Pagamento anterior cancelado. Sem cobranca.
        </p>
      )}

      {/* Single microcopy replaces 3-icon trust block */}
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        7 dias de garantia · cancele quando quiser
      </p>
    </div>
  );
}
