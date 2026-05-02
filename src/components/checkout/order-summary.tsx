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
  /** Optional "equivalent monthly" copy emphasized as anchor (CRO) */
  equivalentMonthlyCopy?: string;
  /** Optional total-savings copy ("Economize R$ X / ano vs mensal") */
  totalSavingsCopy?: string;
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
  equivalentMonthlyCopy,
  totalSavingsCopy,
  features,
  canceledNotice,
  compact,
}: SummaryBodyProps) {
  const totalLabel = formatBRL(priceCents);
  const hasAnchor = Boolean(equivalentMonthlyCopy || totalSavingsCopy);

  return (
    <div className="space-y-12">
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

      {/* Plan name — Sora, hierarquia extrema (rule 05: 60-180px desktop) */}
      <div className="space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Plano
        </p>
        <h1
          className={
            compact
              ? "text-[clamp(3rem,12vw,4.5rem)] font-semibold leading-[0.9] tracking-[-0.02em]"
              : "text-[clamp(3.75rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.025em]"
          }
        >
          {planLabel}
        </h1>
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          {planTagline}
        </p>
      </div>

      {/* Price — JetBrains Mono, peso visual real (rule 05: 80-120px) */}
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Total
        </p>
        <div className="flex items-baseline gap-2.5">
          <span
            className={
              compact
                ? "font-mono text-[clamp(3.5rem,14vw,5rem)] font-medium leading-[0.85] tabular-nums tracking-[-0.04em]"
                : "font-mono text-[clamp(4.5rem,9vw,7.5rem)] font-medium leading-[0.85] tabular-nums tracking-[-0.04em]"
            }
          >
            {totalLabel}
          </span>
          <span className="text-[14px] text-muted-foreground">
            {pricePeriod}
          </span>
        </div>

        {/* Anchor pricing block (CRO loss-aversion) — only for semestral/anual */}
        {hasAnchor && (
          <div className="space-y-1.5 pt-2">
            {equivalentMonthlyCopy && (
              <p className="text-[14px] text-foreground">
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

        {/* Mensal: no anchor — just optional savings copy */}
        {!hasAnchor && savingsCopy && (
          <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {savingsCopy}
          </p>
        )}
      </div>

      {/* Features — investment moment (Hooked): "o que voce ganha" */}
      <ul className="space-y-3 border-t border-border pt-10">
        {features.map((feat) => (
          <li
            key={feat}
            className="text-[15px] leading-relaxed text-foreground/85"
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
    </div>
  );
}
