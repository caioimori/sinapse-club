"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function SyncGithubButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github/sync", { method: "POST" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Falha ao sincronizar");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Falha ao sincronizar");
    } finally {
      setLoading(false);
    }
  }

  const busy = loading || isPending;

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleSync}
        disabled={busy}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted/50 transition-colors disabled:opacity-60"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
        {busy ? "Sincronizando..." : "Sincronizar"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
