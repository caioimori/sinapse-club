import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";

/**
 * LGPD Art. 18, II — "portabilidade dos dados a outro fornecedor de serviço".
 * Returns a single JSON document containing ALL data controlled by sinapse.club
 * that relates to the authenticated user. The user can download and import
 * into any other tool (or keep as record).
 *
 * Includes:
 *  - profile (auth + public profile)
 *  - posts authored (including reposts)
 *  - comments authored
 *  - reactions (likes / saves)
 *  - follows (given + received)
 *  - notifications received
 *  - consent history
 *
 * Excludes:
 *  - other users' content (privacy)
 *  - internal audit logs (separate request)
 *  - raw embeddings / ML features (not portable data)
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Rate limit: 3 exports per hour (prevents abuse / scraping via self-export).
  const rl = await checkRateLimit(rateLimiters.api, `export:${user.id}`);
  if (rl && !rl.success) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em alguns minutos." },
      { status: 429 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [
    profileRes,
    postsRes,
    commentsRes,
    reactionsRes,
    followingRes,
    followersRes,
    notificationsRes,
    consentRes,
  ] = await Promise.all([
    db.from("profiles").select("*").eq("id", user.id).single(),
    db.from("posts").select("*").eq("author_id", user.id),
    db.from("comments").select("*").eq("author_id", user.id),
    db.from("reactions").select("*").eq("user_id", user.id),
    db.from("follows").select("*").eq("follower_id", user.id),
    db.from("follows").select("*").eq("following_id", user.id),
    db.from("notifications").select("*").eq("user_id", user.id),
    db.from("consent_log").select("*").eq("user_id", user.id).maybeSingle
      ? db.from("consent_log").select("*").eq("user_id", user.id)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const payload = {
    format: "sinapse.club user export v1",
    exported_at: new Date().toISOString(),
    subject: {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
    },
    profile: profileRes?.data ?? null,
    posts: postsRes?.data ?? [],
    comments: commentsRes?.data ?? [],
    reactions: reactionsRes?.data ?? [],
    follows: {
      following: followingRes?.data ?? [],
      followers: followersRes?.data ?? [],
    },
    notifications: notificationsRes?.data ?? [],
    consent_history: consentRes?.data ?? [],
    _notice:
      "Este arquivo contém todos os seus dados pessoais tratados por sinapse.club. " +
      "Em caso de dúvidas ou solicitações LGPD adicionais, contate dpo@sinapse.club.",
  };

  const filename = `sinapse-export-${user.id}-${Date.now()}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
