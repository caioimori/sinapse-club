"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-foreground/20">Erro</h1>
        <h2 className="text-xl font-semibold">Algo deu errado</h2>
        <p className="text-muted-foreground max-w-md">
          Ocorreu um erro inesperado. Tente novamente ou volte ao forum.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Tentar novamente
          </button>
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Voltar ao forum
          </Link>
        </div>
      </div>
    </div>
  );
}
