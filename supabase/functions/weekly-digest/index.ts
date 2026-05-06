// Supabase Edge Function: weekly-digest
//
// MISSION: gancho de retention day-2+ identificado como crítico na auditoria S2.
// Manda email semanal pra cada human cadastrado (não opt-out) com top threads
// da semana. Resolve causa-raiz #2 (day-2 retention ≈ 0%).
//
// Cron: domingo 21h UTC (= 18h BRT).
//
// LGPD compliance:
// - opt-out via flag profiles.email_digest_opt_out
// - link de unsubscribe em todo email (token HMAC)
// - audit trail em public.email_digest_log
// - dedupe por (user_id, week_start) — nunca envia 2x na mesma semana
//
// Requer envs:
// - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// - RESEND_API_KEY
// - DIGEST_UNSUBSCRIBE_SECRET (HMAC pra token)
// - APP_URL (default https://forum.sinapse.club)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const APP_URL = Deno.env.get("APP_URL") || "https://forum.sinapse.club";
const FROM_EMAIL = "SINAPSE.club <noreply@sinapse.club>";
const REPLY_TO = "contato@sinapse.club";

interface ThreadRow {
  id: string;
  title: string | null;
  content: string | null;
  replies_count: number;
  created_at: string;
  author: { username: string; display_name: string | null } | null;
  category: { name: string; icon: string | null } | null;
}

function getMondayOfThisWeekUTC(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = sun, 1 = mon
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

async function generateUnsubscribeToken(userId: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(userId));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function renderEmail(opts: {
  greeting: string;
  threads: ThreadRow[];
  unsubscribeUrl: string;
}): { html: string; text: string } {
  const { greeting, threads, unsubscribeUrl } = opts;

  const threadsHtml = threads
    .map((t) => {
      const title = escapeHtml(t.title || "(sem título)");
      const author = t.author?.display_name || t.author?.username || "alguém";
      const cat = t.category ? `${t.category.icon || ""} ${escapeHtml(t.category.name)}` : "";
      const preview = t.content ? escapeHtml(truncate(t.content, 180)) : "";
      const url = `${APP_URL}/forum/thread/${t.id}`;
      const replies = t.replies_count;
      return `
        <div style="border-top:1px solid #e5e5e0;padding:18px 0;">
          <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#737373;margin:0 0 6px;">
            ${cat} · por ${escapeHtml(author)} · ${replies} ${replies === 1 ? "resposta" : "respostas"}
          </p>
          <a href="${url}" style="color:#0a0a0a;text-decoration:none;">
            <h3 style="font-family:'Sora',-apple-system,sans-serif;font-size:18px;font-weight:600;line-height:1.3;margin:0 0 8px;color:#0a0a0a;">
              ${title}
            </h3>
          </a>
          ${preview ? `<p style="font-size:14px;line-height:1.5;color:#525252;margin:0 0 10px;">${preview}</p>` : ""}
          <a href="${url}" style="display:inline-block;font-size:12px;color:#0a0a0a;text-decoration:underline;">Ler no fórum →</a>
        </div>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SINAPSE.club — digest da semana</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f0;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#fff;padding:32px 28px;border:1px solid #e5e5e0;">
        <tr><td>
          <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#737373;margin:0 0 8px;">— sinapse.club</p>
          <h1 style="font-family:'Sora',-apple-system,sans-serif;font-size:28px;font-weight:300;letter-spacing:-0.02em;margin:0 0 6px;line-height:1.1;">
            ${escapeHtml(greeting)}
          </h1>
          <p style="font-size:14px;line-height:1.5;color:#525252;margin:0 0 24px;">
            O que rolou de mais relevante no fórum nesta semana — IA aplicada a negócios, marketing, ads e operação.
          </p>
          ${threadsHtml || "<p style='font-size:14px;color:#737373;'>Semana quieta. Volte quando tiver tempo — o fórum está sempre aberto.</p>"}
          <div style="border-top:1px solid #e5e5e0;padding-top:24px;margin-top:24px;text-align:center;">
            <a href="${APP_URL}/forum" style="display:inline-block;background:#0a0a0a;color:#f5f5f0;padding:12px 24px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.02em;">
              Abrir o fórum
            </a>
          </div>
        </td></tr>
      </table>
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;padding:16px 28px;">
        <tr><td style="text-align:center;">
          <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#a3a3a3;margin:0;">
            Não quer mais receber? <a href="${unsubscribeUrl}" style="color:#737373;text-decoration:underline;">Descadastrar</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = `SINAPSE.club — digest da semana\n\n${greeting}\n\nO que rolou no fórum:\n\n${threads
    .map((t) => `- ${t.title} (${t.replies_count} respostas)\n  ${APP_URL}/forum/thread/${t.id}`)
    .join("\n\n")}\n\nDescadastrar: ${unsubscribeUrl}`;

  return { html, text };
}

async function sendViaResend(opts: {
  apiKey: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        reply_to: REPLY_TO,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `${res.status}: ${errText}` };
    }
    const json = (await res.json()) as { id?: string };
    return { ok: true, messageId: json.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const unsubSecret = Deno.env.get("DIGEST_UNSUBSCRIBE_SECRET");

  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!resendKey) {
    return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!unsubSecret) {
    return new Response(JSON.stringify({ error: "Missing DIGEST_UNSUBSCRIBE_SECRET" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const weekStart = getMondayOfThisWeekUTC();
  const weekStartIso = weekStart.toISOString().slice(0, 10);

  // 1. Top threads da semana (qualquer profile_type, ordenado por engajamento)
  // deno-lint-ignore no-explicit-any
  const { data: threadsRaw } = await (supabase as any)
    .from("posts")
    .select(
      "id, title, content, replies_count, created_at, profiles!author_id(username, display_name), forum_categories!category_id(name, icon)",
    )
    .eq("type", "thread")
    .gte("created_at", weekStart.toISOString())
    .order("replies_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  const threads: ThreadRow[] = (threadsRaw || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    title: (r.title as string | null) ?? null,
    content: (r.content as string | null) ?? null,
    replies_count: (r.replies_count as number) ?? 0,
    created_at: r.created_at as string,
    author: r.profiles as { username: string; display_name: string | null } | null,
    category: r.forum_categories as { name: string; icon: string | null } | null,
  }));

  // 2. Lista de destinatários: humans confirmed + not opt-out + ainda não enviado essa semana
  // deno-lint-ignore no-explicit-any
  const { data: candidates } = await (supabase as any)
    .from("profiles")
    .select("id, username, display_name")
    .eq("profile_type", "human")
    .eq("email_digest_opt_out", false);

  const sent: string[] = [];
  const failed: { userId: string; error: string }[] = [];
  const skipped: string[] = [];

  for (const profile of candidates || []) {
    const userId = profile.id as string;

    // Dedupe — já enviou essa semana?
    // deno-lint-ignore no-explicit-any
    const { data: existing } = await (supabase as any)
      .from("email_digest_log")
      .select("id")
      .eq("user_id", userId)
      .eq("week_start", weekStartIso)
      .eq("status", "sent")
      .maybeSingle();

    if (existing) {
      skipped.push(userId);
      continue;
    }

    // Pega email do auth.users
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    const email = authUser?.user?.email;
    if (!email) {
      skipped.push(userId);
      continue;
    }

    const token = await generateUnsubscribeToken(userId, unsubSecret);
    const unsubscribeUrl = `${APP_URL}/unsubscribe?u=${encodeURIComponent(userId)}&t=${token}`;
    const greeting = `Oi, ${profile.display_name || profile.username}.`;

    const { html, text } = renderEmail({ greeting, threads, unsubscribeUrl });

    const result = await sendViaResend({
      apiKey: resendKey,
      to: email,
      subject: "O que rolou de IA + negócios essa semana",
      html,
      text,
    });

    // deno-lint-ignore no-explicit-any
    await (supabase as any).from("email_digest_log").insert({
      user_id: userId,
      week_start: weekStartIso,
      posts_included: threads.length,
      status: result.ok ? "sent" : "failed",
      resend_message_id: result.messageId || null,
    });

    if (result.ok) sent.push(userId);
    else failed.push({ userId, error: result.error || "unknown" });
  }

  return new Response(
    JSON.stringify({
      week_start: weekStartIso,
      candidates: (candidates || []).length,
      threads_in_digest: threads.length,
      sent: sent.length,
      skipped: skipped.length,
      failed: failed.length,
      errors: failed.slice(0, 5), // só primeiros 5 erros pra não inflar log
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
