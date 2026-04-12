"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForumError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[forum error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-warn-soft)]">
        <AlertTriangle className="h-6 w-6 text-[var(--accent-warn)]" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Algo travou no fórum</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Não foi possível carregar esta parte. Já registramos o erro. Tenta de novo ou volta para o feed.
      </p>
      {error.digest && (
        <p className="text-[10px] text-muted-foreground/60">ID: {error.digest}</p>
      )}
      <div className="mt-2 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={reset}>
          Tentar novamente
        </Button>
        <Link
          href="/forum"
          className="inline-flex h-7 items-center rounded-[min(var(--radius-md),12px)] bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground hover:bg-primary/80"
        >
          Voltar para o feed
        </Link>
      </div>
    </div>
  );
}
