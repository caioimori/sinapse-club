"use client";

import { toast } from "sonner";

/**
 * Helper unificado pra exibir toast de paywall em qualquer acao bloqueada.
 * Mantem copy consistente: "Voce precisa assinar pra <acao>" + CTA pra /pricing.
 *
 * Uso:
 *   showPaywallToast("curtir")
 *   showPaywallToast("comentar")
 *   showPaywallToast("publicar um post")
 */
export function showPaywallToast(action: string) {
  toast(`Voce precisa assinar pra ${action}.`, {
    description: "Os planos comecam em R$ 29,90/mes.",
    action: {
      label: "Ver planos",
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.href = "/pricing?upgrade=pro&from=/forum";
        }
      },
    },
    duration: 5000,
  });
}

/**
 * Versao curta sem CTA — usar em fluxos onde o usuario ja viu o modal/CTA
 * recentemente e nao queremos repeticao agressiva.
 */
export function showPaywallToastShort(action: string) {
  toast(`Voce precisa assinar pra ${action}.`);
}
