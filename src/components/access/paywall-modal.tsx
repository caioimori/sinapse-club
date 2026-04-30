"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Lock } from "lucide-react";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /**
   * Contexto opcional pra rastrear de onde veio (vai no query string do CTA).
   * Ex: "/forum/thread/123"
   */
  fromPath?: string;
}

/**
 * Modal universal de paywall pra ser usado quando o nao-pagante tenta
 * acessar conteudo/acao bloqueada (ex: clicar pra abrir thread, tentar
 * comentar, etc).
 *
 * Design: B&W, grain herdado do background, sem cores hardcoded.
 */
export function PaywallModal({
  open,
  onClose,
  title = "Esse conteudo e pra quem assina",
  description = "Assine um plano pra ler posts completos, comentar e participar do forum.",
  fromPath,
}: PaywallModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const pricingHref = fromPath
    ? `/pricing?upgrade=pro&from=${encodeURIComponent(fromPath)}`
    : "/pricing?upgrade=pro&from=/forum";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Fechar"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-background p-6 shadow-2xl"
        style={{ animation: "paywallModalIn 180ms ease-out forwards" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-muted/40">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2
          id="paywall-title"
          className="text-center text-lg font-semibold text-foreground"
        >
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 space-y-2">
          <Link
            href={pricingHref}
            className="flex w-full items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
          >
            Ver planos
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-full border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Continuar explorando
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          7 dias de garantia. Cancele quando quiser.
        </p>
      </div>

      <style>{`
        @keyframes paywallModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body,
  );
}
