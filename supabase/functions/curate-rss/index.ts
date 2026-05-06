// Supabase Edge Function: curate-rss
// MISSION: sinapse.club é um HUB AI-first para negócios, marketing e
// empreendedorismo, 100% em português brasileiro.
//
// MVP é PT-only nativo: zero tradução. Curamos APENAS conteúdo já em
// português, vindo de fontes brasileiras de qualidade.
//
// pg_cron: every hour
//
// Fontes em 2 tiers:
//  - tier 'ai':       fonte é foco em IA → aceita tudo (sem exigir token AI)
//  - tier 'business': fonte é business/marketing geral BR → exige menção AI
//                     (filtra ~5-15% mais relevantes)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Tier = "ai" | "business";
type Feed = { url: string; category: string; tier: Tier };

// ─── RSS Sources — 100% Brasil ─────────────────────────────────────
const RSS_FEEDS: Feed[] = [
  // ── Tier AI: fonte já é especializada em IA → aceita sem filtro ──
  { url: "https://canaltech.com.br/rss/inteligencia-artificial/", category: "llms-agentes", tier: "ai" },

  // ── Tier business: BR business/tech/marketing → exige menção a IA ──
  { url: "https://canaltech.com.br/rss/empreendedorismo/", category: "negocios-estrategia", tier: "business" },
  { url: "https://olhardigital.com.br/feed/", category: "ferramentas-reviews", tier: "business" },
  { url: "https://neofeed.com.br/feed/", category: "negocios-estrategia", tier: "business" },
  { url: "https://braziljournal.com/feed/", category: "negocios-estrategia", tier: "business" },
  { url: "https://tiinside.com.br/feed/", category: "ferramentas-reviews", tier: "business" },
  { url: "https://digitalks.com.br/feed/", category: "ai-para-seo", tier: "business" },
  { url: "https://www.adnews.com.br/feed/", category: "ai-para-ads", tier: "business" },
  { url: "https://www.meioemensagem.com.br/feed", category: "ai-para-ads", tier: "business" },
  { url: "https://www.b9.com.br/feed/", category: "negocios-estrategia", tier: "business" },
  { url: "https://abradi.com.br/feed/", category: "ai-para-seo", tier: "business" },
];

// ─── Keyword-based category refinement ─────────────────────────────
const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: string }> = [
  { keywords: ["ads", "tráfego pago", "facebook ads", "meta ads", "google ads", "anúncio", "campanha paga"], category: "ai-para-ads" },
  { keywords: ["ecommerce", "e-commerce", "loja virtual", "shopify", "woocommerce"], category: "ai-para-ecommerce" },
  { keywords: ["infoproduto", "hotmart", "kiwify", "curso online", "lançamento digital"], category: "ai-para-infoprodutos" },
  { keywords: ["afiliado", "programa de afiliados", "comissão"], category: "ai-para-afiliados" },
  { keywords: ["copywriting", "copy", "headline", "persuasão", "cta", "sales page", "vsl"], category: "ai-copywriting" },
  { keywords: ["seo", "content marketing", "search engine", "otimização", "ranking"], category: "ai-para-seo" },
  { keywords: ["n8n", "zapier", "make.com", "no-code", "automação", "automation", "workflow", "integração"], category: "automacao-no-code" },
  { keywords: ["stable diffusion", "midjourney", "dall-e", "image generation", "text-to-image", "generative art", "ai art", "sora"], category: "ai-generativa" },
  { keywords: ["career", "carreira", "job", "emprego", "skill", "learning", "course", "aprender"], category: "carreira-ai" },
  { keywords: ["llm", "gpt", "claude", "gemini", "llama", "mistral", "agent", "agente", "transformer", "openai", "anthropic", "codex"], category: "llms-agentes" },
  { keywords: ["tool", "ferramenta", "review", "produto", "software", "app", "saas", "platform"], category: "ferramentas-reviews" },
  { keywords: ["business", "empresa", "negócio", "strategy", "roi", "revenue", "startup", "empreend"], category: "negocios-estrategia" },
];

function detectCategory(title: string, description: string, defaultCategory: string): string {
  const text = `${title} ${description}`.toLowerCase();
  for (const { keywords, category } of CATEGORY_KEYWORDS) {
    if (keywords.some((k) => text.includes(k.toLowerCase()))) {
      return category;
    }
  }
  return defaultCategory;
}

// ─── AI relevance gate (only applied to 'business' tier feeds) ─────
// Tier 'ai' feeds bypass this — they're already AI-only by source.
//
// CUIDADO: o token genérico "ia " (com espaço) matcha qualquer palavra PT
// terminada em -ia (diretoria, agência, tecnologia, história, estratégia,
// categoria...). Por isso NÃO usamos "ia " solto — apenas com preposições
// claras na frente, ou casos com pontuação adjacente (" ia,", " ia.", etc).
const AI_TOKENS = [
  // Sigla IA explícita com pontuação adjacente
  " ia,", " ia.", " ia:", " ia;", " ia—", " ia-", " ia)", " ia/",
  // Sigla IA precedida de preposição (cobre uso natural em PT)
  " da ia", " de ia", " em ia", " usar ia", " essa ia", " esta ia",
  " para ia", " sobre ia", " com ia", " pela ia", " pelo ia", " usando ia",
  " como ia", " nas ias", " nos ias", " sua ia", " seu ia", " minha ia",
  " a ia ", " uma ia ", " na ia", " no ia",
  // Forma extensa
  "artificial intelligence", "inteligência artificial", "inteligencia artificial",
  "a.i.",
  // LLMs específicos
  "llm", "llms", "gpt-", "chatgpt", "claude", "gemini", "llama", "mistral",
  "anthropic", "openai", "copilot", "cursor.com", "windsurf", "codex",
  // Agents (com qualificação pra evitar "agente comercial/imobiliário")
  "ai agent", "agente ia", "agentes ia", "ai agents", "agentic",
  // Prompt
  "prompt engineer", "prompt engineering", "engenharia de prompt", "prompts ",
  // Automação no-code AI
  "n8n", "zapier", "make.com",
  // Conceitos técnicos AI
  "rag pipeline", "retrieval augmented", "embedding", "fine-tuning", "finetuning",
  "generative ai", "ia generativa", "ai generativa", "modelo de linguagem",
  // Image/video gen
  "midjourney", "stable diffusion", "dall-e", "dalle", "runway ml",
  "sora ai", "openai sora", " sora.", " sora,", " sora ", "hugging face", "huggingface",
  // Tooling
  "perplexity", "mcp server", "model context protocol",
];

function mentionsAi(title: string, description: string): boolean {
  const text = ` ${title.toLowerCase()} ${description.toLowerCase()} `;
  return AI_TOKENS.some((t) => text.includes(t));
}

// ─── Portuguese detector — defensive gate ──────────────────────────
// Mesmo cuidando das fontes, alguns feeds BR misturam posts EN.
// Este gate barra qualquer item que não pareça PT.
const PT_MARKERS = [
  " para ", " com ", " que ", " uma ", " como ", " mais ", " por ", " são ",
  " está ", " você ", " não ", " isso ", " essa ", " esse ", " quando ",
  " sobre ", " dos ", " das ", " também ", " já ", " nos ", " nas ", " pelo ",
  " pela ", " ser ", " dar ", " fazer ", " ter ", " mas ", " seu ", " sua ",
];

function looksPortuguese(text: string): boolean {
  const t = ` ${text.toLowerCase()} `;
  return PT_MARKERS.filter((w) => t.includes(w)).length >= 2;
}

// ─── RSS/Atom parser ────────────────────────────────────────────────
function parseItems(xml: string) {
  const items: Array<{ title: string; link: string; description: string; pubDate: string; author?: string }> = [];

  const rssRegex = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = rssRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]?.trim() ?? "";
    const link =
      block.match(/<link>(.*?)<\/link>/s)?.[1]?.trim() ||
      block.match(/<link[^>]*href="([^"]*)"[^>]*\/>/)?.[1]?.trim() || "";
    const description = block.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s)?.[1]?.trim() ?? "";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || block.match(/<published>(.*?)<\/published>/s)?.[1]?.trim() || "";
    const author = block.match(/<(?:dc:creator|author)>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/(?:dc:creator|author)>/s)?.[1]?.trim();
    if (title && link) items.push({ title, link, description: stripHtml(description).slice(0, 600), pubDate, author });
  }

  if (items.length === 0) {
    const atomRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    while ((m = atomRegex.exec(xml)) !== null) {
      const block = m[1];
      const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]?.trim() ?? "";
      const link =
        block.match(/<link[^>]*href="([^"]*)"[^>]*\/>/)?.[1]?.trim() ||
        block.match(/<link[^>]*href="([^"]*)"[^>]*>/)?.[1]?.trim() || "";
      const summary = block.match(/<(?:summary|content)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:summary|content)>/s)?.[1]?.trim() ?? "";
      const pubDate = block.match(/<(?:published|updated)>(.*?)<\/(?:published|updated)>/s)?.[1]?.trim() || "";
      const author = block.match(/<author>[\s\S]*?<name>(.*?)<\/name>/s)?.[1]?.trim();
      if (title && link) items.push({ title, link, description: stripHtml(summary).slice(0, 600), pubDate, author });
    }
  }

  return items;
}

function stripHtml(html: string): string {
  let out = html.replace(/<[^>]*>/g, " ");
  out = out
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  out = out.replace(/<[^>]*>/g, " ");
  out = out.replace(/<!--[\s\S]*?-->/g, " ");
  return out.replace(/\s+/g, " ").trim();
}

// ─── Main ───────────────────────────────────────────────────────────
Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let totalInserted = 0;
    let totalSkippedDup = 0;
    let totalSkippedRelevance = 0;
    let totalSkippedLang = 0;

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "sinapse-club-curator/3.0 (+https://forum.sinapse.club)" },
          signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) { console.error(`[SKIP] ${feed.url}: ${res.status}`); continue; }

        const xml = await res.text();
        const items = parseItems(xml);

        for (const item of items.slice(0, 8)) { // max 8 per feed per run
          // Dedup
          const { data: exists } = await supabase
            .from("curated_content")
            .select("id")
            .eq("source_url", item.link)
            .limit(1);
          if (exists && exists.length > 0) { totalSkippedDup++; continue; }

          const combined = `${item.title} ${item.description}`;

          // PT gate (defensive — sempre aplica)
          if (!looksPortuguese(combined)) {
            totalSkippedLang++;
            continue;
          }

          // AI relevance gate — só pra fontes business
          if (feed.tier === "business" && !mentionsAi(item.title, item.description)) {
            totalSkippedRelevance++;
            continue;
          }

          const category = detectCategory(item.title, item.description, feed.category);

          const { error } = await supabase.from("curated_content").insert({
            source: "rss",
            source_url: item.link,
            source_author: item.author || null,
            original_text: item.description || item.title,
            title: item.title,
            original_lang: "pt",
            translated_text: item.description || item.title,
            translation_status: "translated", // legacy field — sempre PT no MVP
            category,
            relevance_score: feed.tier === "ai" ? 0.85 : 0.75,
            is_published: false,
          });

          if (!error) totalInserted++;
        }
      } catch (err) {
        console.error(`[ERROR] ${feed.url}:`, (err as Error).message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inserted: totalInserted,
        skipped_dup: totalSkippedDup,
        skipped_relevance: totalSkippedRelevance,
        skipped_lang: totalSkippedLang,
        feeds: RSS_FEEDS.length,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
