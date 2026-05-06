"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

interface NoviceWelcomeBannerProps {
  username: string | null;
  hasPosted: boolean;
}

const STORAGE_KEY = "sinapse:novice-banner-dismissed";

export function NoviceWelcomeBanner({ username, hasPosted }: NoviceWelcomeBannerProps) {
  // SSR-safe: começa true (sem banner) e libera no cliente após checar localStorage
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (hasPosted) return;
    let cancelled = false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!cancelled && stored !== "1") setDismissed(false);
    } catch {
      if (!cancelled) setDismissed(false);
    }
    return () => {
      cancelled = true;
    };
  }, [hasPosted]);

  if (dismissed || hasPosted) return null;

  function handleDismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* localStorage indisponível: dismiss vira só desta sessão */
    }
    setDismissed(true);
  }

  function handleCompose() {
    window.dispatchEvent(new CustomEvent("open-compose-modal"));
  }

  const greeting = username ? `Bem-vindo, ${username}` : "Bem-vindo";

  return (
    <div
      className="relative border-b border-[var(--border-subtle)] bg-foreground/[0.02] px-4 py-4"
      role="region"
      aria-label="Boas-vindas pra novato"
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dispensar mensagem de boas-vindas"
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div className="flex items-start gap-3 pr-7">
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold">{greeting} 👋</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            A comunidade é pequena e quem chega cedo é fundador. O melhor jeito de começar:{" "}
            <span className="font-semibold text-foreground">faça uma pergunta sobre IA aplicada ao seu negócio</span>
            . As respostas chegam rápido aqui.
          </p>
          <button
            type="button"
            onClick={handleCompose}
            className="mt-1 inline-flex h-8 items-center rounded-full bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90"
          >
            Fazer minha primeira pergunta
          </button>
        </div>
      </div>
    </div>
  );
}
