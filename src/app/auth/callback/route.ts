import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Mirror the verified GitHub identity into `profiles.github_username` so
 * server components can fetch repos without a second round-trip. Silently
 * no-ops when the user has no GitHub identity or the update fails.
 */
async function syncGithubUsernameFromIdentity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data: userData } = await supabase.auth.getUser();
  const githubIdentity = userData?.user?.identities?.find((i) => i.provider === "github");
  if (!githubIdentity) return;

  const data = githubIdentity.identity_data as
    | { user_name?: string; preferred_username?: string }
    | undefined;
  const username = data?.user_name ?? data?.preferred_username;
  if (!username) return;

  await (supabase as unknown as {
    from: (t: string) => {
      update: (v: Record<string, unknown>) => {
        eq: (k: string, v: string) => Promise<unknown>;
      };
    };
  })
    .from("profiles")
    .update({
      github_username: username,
      github_url: `https://github.com/${username}`,
    })
    .eq("id", userId);
}

type EmailOtpType = "signup" | "email_change" | "recovery" | "invite" | "magiclink" | "email";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next") ?? "/forum";
  // Only allow same-origin relative paths: must start with "/" but NOT "//"
  const next = /^\/(?!\/)[A-Za-z0-9/_\-?=&%.]*$/.test(rawNext) ? rawNext : "/forum";

  // Caminho 1 — PKCE (OAuth + same-device email). Cookie code_verifier necessário.
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await syncGithubUsernameFromIdentity(supabase, userData.user.id);
      }
      const target = otpType === "signup"
        ? `${next}${next.includes("?") ? "&" : "?"}welcome=1`
        : next;
      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  // Caminho 2 — token_hash (cross-device). Funciona quando usuário abre o
  // email num browser/device diferente do que cadastrou. Resolve o drop de
  // 80% no email signup identificado na auditoria UX S2.
  if (tokenHash && otpType) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });
    if (!error) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await syncGithubUsernameFromIdentity(supabase, userData.user.id);
      }
      const welcomeFlag = otpType === "signup" ? "?welcome=1" : "";
      const sep = next.includes("?") ? "&" : welcomeFlag.replace("?", "&");
      return NextResponse.redirect(`${origin}${next}${welcomeFlag ? sep + "welcome=1" : ""}`);
    }
  }

  // Auth error — se usuario veio do checkout (next=/subscribe/<plano>),
  // volta pra tela de checkout daquele plano em vez de mandar pro login,
  // pra nao deixar visitante orfao se cancelar OAuth no popup.
  const subscribeMatch = next.match(/^\/subscribe\/([a-z]+)/i);
  if (subscribeMatch) {
    const plano = subscribeMatch[1];
    return NextResponse.redirect(
      `${origin}/checkout/${plano}?canceled=oauth`,
    );
  }
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
