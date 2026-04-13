"use client";

import { useState } from "react";
import { GitFork } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Direct GitHub OAuth trigger for the profile page.
 * Calls `linkIdentity` inline instead of routing through /settings so the
 * user experiences one click → GitHub authorize page → back to profile.
 */
export function ConnectGitHubButton({ nextPath = "/profile" }: { nextPath?: string }) {
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error: linkError } = await supabase.auth.linkIdentity({
      provider: "github",
      options: {
        redirectTo,
        scopes: "read:user user:email public_repo",
      },
    });
    if (linkError) {
      setError(linkError.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleConnect}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted/50 transition-colors disabled:opacity-60"
      >
        <GitFork className="h-4 w-4" />
        {loading ? "Abrindo GitHub..." : "Conectar GitHub"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
