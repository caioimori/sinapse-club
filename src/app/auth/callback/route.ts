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

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/forum";
  // Only allow same-origin relative paths: must start with "/" but NOT "//"
  const next = /^\/(?!\/)[A-Za-z0-9/_\-?=&%.]*$/.test(rawNext) ? rawNext : "/forum";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await syncGithubUsernameFromIdentity(supabase, userData.user.id);
      }
      return NextResponse.redirect(`${origin}${next}`);
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
