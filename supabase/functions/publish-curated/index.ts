// Supabase Edge Function: publish-curated
// Publica conteúdo curado como posts no fórum, rotacionando entre 5 bot users
// pg_cron: a cada 30min (:15 e :45)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PUBLISH_BATCH = 3; // posts por run (3 runs/hora = ~70/dia)
const MIN_SCORE = 0.5;

// 5 bot users (sinapse-bot + 4 novos)
const BOT_USER_IDS = [
  "00000000-0000-0000-0000-000000000001", // sinapse-bot (existente)
  "00000000-0000-0000-0000-000000000002", // rafael_automacao
  "00000000-0000-0000-0000-000000000003", // ana_ianegocios
  "00000000-0000-0000-0000-000000000004", // lucas_growth_ai
  "00000000-0000-0000-0000-000000000005", // carla_dados
];

// Mapeia slug da categoria → category_id do forum
async function getCategoryMap(supabase: any): Promise<Map<string, string>> {
  const { data } = await supabase
    .from("forum_categories")
    .select("id, slug")
    .eq("is_active", true);
  const map = new Map<string, string>();
  (data || []).forEach((c: any) => map.set(c.slug, c.id));
  return map;
}

// Pega o próximo bot para rotacionar
async function getNextBotId(supabase: any): Promise<string> {
  // Conta posts de cada bot na última hora para balancear
  const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
  const counts: Record<string, number> = {};
  for (const id of BOT_USER_IDS) counts[id] = 0;

  const { data } = await supabase
    .from("posts")
    .select("author_id")
    .in("author_id", BOT_USER_IDS)
    .gte("created_at", oneHourAgo);

  (data || []).forEach((p: any) => {
    if (counts[p.author_id] !== undefined) counts[p.author_id]++;
  });

  // Escolhe o que menos postou
  return BOT_USER_IDS.reduce((a, b) => (counts[a] <= counts[b] ? a : b));
}

// Strip any HTML/entities that slipped through the curate pipeline.
// Defensive second pass — we already stripHtml in curate-rss, but older
// rows and third-party feeds can still have escaped or raw tags.
function sanitizePlain(text: string): string {
  let out = text.replace(/<[^>]*>/g, " ");
  out = out
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"').replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
    .replace(/&nbsp;/g, " ");
  out = out.replace(/<[^>]*>/g, " ");
  out = out.replace(/<!--[\s\S]*?-->/g, " ");
  return out.replace(/\s+/g, " ").trim();
}

// Escape for safe interpolation into server-generated HTML.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Formata o conteúdo para o fórum com link da fonte
function formatContent(rawText: string, sourceUrl: string, sourceAuthor?: string): { html: string; plain: string } {
  const plain = sanitizePlain(rawText).slice(0, 1000);
  const safePlain = escapeHtml(plain);
  const safeUrl = escapeHtml(sourceUrl);
  const safeAuthor = sourceAuthor ? escapeHtml(sourceAuthor) : "";
  const attribution = safeAuthor ? `— ${safeAuthor}` : "";
  const html = `<p>${safePlain}</p><p><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">🔗 Ver fonte original ${attribution}</a></p>`;
  return { html, plain };
}

// Escolhe um título mais limpo (remove sufixos de domínio, etc.)
function cleanTitle(title: string): string {
  return title
    .replace(/\s*[|\-–—]\s*(TechCrunch|The Verge|VentureBeat|Wired|Ars Technica|Forbes|MIT|HBR|Reddit|Canaltech|Olhar Digital|Exame|Startups).*$/i, "")
    .replace(/\s*::\s*.*$/, "")
    .trim()
    .slice(0, 200);
}

// ─── Main ───────────────────────────────────────────────────────────
Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Pega itens prontos para publicar
    // Publica: traduzidos OU conteúdo PT original (sem precisar de DeepL)
    const { data: items, error: fetchErr } = await supabase
      .from("curated_content")
      .select("*")
      .eq("is_published", false)
      .gte("relevance_score", MIN_SCORE)
      .or("translation_status.eq.translated,original_lang.eq.pt")
      .order("created_at", { ascending: true })
      .limit(PUBLISH_BATCH);

    if (fetchErr) throw fetchErr;
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ success: true, published: 0, message: "Fila vazia" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const categoryMap = await getCategoryMap(supabase);
    // Fallback: llms-agentes
    const defaultCategoryId = categoryMap.get("llms-agentes") ?? [...categoryMap.values()][0];

    let published = 0;

    for (const item of items) {
      const botUserId = await getNextBotId(supabase);
      const categoryId = categoryMap.get(item.category) ?? defaultCategoryId;
      const text = item.translated_text || item.original_text || item.title;
      const { html, plain } = formatContent(text, item.source_url, item.source_author);
      const title = cleanTitle(item.title || "Sem título");

      const { data: post, error: postErr } = await supabase
        .from("posts")
        .insert({
          author_id: botUserId,
          title,
          content: html,
          content_plain: plain,
          type: "thread",
          category_id: categoryId,
          tags: ["curado", item.category?.split("-")[0] ?? "ia"],
        })
        .select("id")
        .single();

      if (postErr) {
        console.error(`[ERROR] post ${item.id}:`, postErr.message);
        continue;
      }

      await supabase
        .from("curated_content")
        .update({
          is_published: true,
          published_as_post: post.id,
          published_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      published++;
    }

    return new Response(
      JSON.stringify({ success: true, published, total: items.length }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
