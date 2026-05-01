"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, Lock, RefreshCw, ShieldCheck } from "lucide-react";

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

const trustItems = [
  { icon: Lock, label: "Pagamento seguro" },
  { icon: RefreshCw, label: "Cancele quando quiser" },
  { icon: ShieldCheck, label: "7 dias de garantia" },
];

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
        className="flex w-full items-center justify-between border-b border-border bg-card px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
        aria-expanded={open}
        aria-controls="order-summary-mobile-body"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {open ? "Ocultar resumo" : "Ver resumo do pedido"}
          </span>
        </div>
        <span className="font-mono text-sm tabular-nums text-foreground">
          {totalLabel}
        </span>
      </button>

      {open && (
        <div
          id="order-summary-mobile-body"
          className="border-b border-border bg-card px-4 py-6"
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
      <div className="sticky top-8">
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
    <div className="space-y-6">
      {/* Breadcrumb — desktop only */}
      {!compact && (
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Trocar de plano
        </Link>
      )}

      {/* Plan title block */}
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Resumo do pedido
        </p>
        <h1
          className={
            compact
              ? "text-[22px] font-semibold leading-tight tracking-tight"
              : "text-[clamp(1.75rem,3vw,3rem)] font-semibold leading-[1.05] tracking-tight"
          }
        >
          {planLabel}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{planTagline}</p>
      </div>

      <div className="h-px w-full bg-border" />

      {/* Features — line by line */}
      <ul className="space-y-3">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-3 text-[13px] leading-relaxed">
            <Check
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-foreground/85">{feat}</span>
          </li>
        ))}
      </ul>

      <div className="h-px w-full bg-border" />

      {/* Subtotal block */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-mono tabular-nums text-foreground/85">
            {totalLabel}
          </span>
        </div>

        {baselineCents && baselineCents > priceCents && (
          <div className="flex items-baseline justify-between text-xs text-muted-foreground">
            <span>Valor cheio (mensal x periodo)</span>
            <span className="font-mono tabular-nums line-through">
              {formatBRL(baselineCents)}
            </span>
          </div>
        )}
      </div>

      {/* Double divider sets the total apart */}
      <div className="space-y-1">
        <div className="h-px w-full bg-border" />
        <div className="h-px w-full bg-border" />
      </div>

      {/* Total — prominent */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium uppercase tracking-wider text-foreground">
            Total
          </span>
          <div className="text-right">
            <span className="font-mono text-2xl font-semibold tabular-nums text-foreground sm:text-[28px]">
              {totalLabel}
            </span>
            <span className="ml-1.5 font-mono text-xs text-muted-foreground">
              {pricePeriod}
            </span>
          </div>
        </div>
        {savingsCopy && (
          <p className="text-right text-xs text-muted-foreground">{savingsCopy}</p>
        )}
      </div>

      {canceledNotice && (
        <div className="border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
          Pagamento cancelado. Voce pode tentar novamente quando quiser.
        </div>
      )}

      {/* Trust block */}
      <div className="space-y-2 border-t border-border pt-5">
        {trustItems.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 text-xs text-muted-foreground"
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
