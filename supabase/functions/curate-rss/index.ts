// Supabase Edge Function: curate-rss
// Fetches AI content from 40+ RSS feeds → curated_content
// pg_cron: every hour

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── 40+ RSS Sources — all categories can feed all ─────────────────
const RSS_FEEDS = [
  // ── AI Labs (breaking news + product updates) ──────────────────
  { url: "https://openai.com/blog/rss/", category: "llms-agentes" },
  { url: "https://www.anthropic.com/feed", category: "llms-agentes" },
  { url: "https://blog.google/technology/ai/rss/", category: "llms-agentes" },
  { url: "https://ai.meta.com/blog/rss/", category: "llms-agentes" },
  { url: "https://mistral.ai/feed/", category: "llms-agentes" },
  { url: "https://www.deepmind.com/blog/feed/basic", category: "llms-agentes" },
  { url: "https://stability.ai/blog/rss.xml", category: "ai-generativa" },
  { url: "https://huggingface.co/blog/feed.xml", category: "ferramentas-reviews" },
  { url: "https://cohere.com/blog/rss", category: "llms-agentes" },
  { url: "https://www.perplexity.ai/changelog.rss", category: "ferramentas-reviews" },

  // ── US Tech Media ──────────────────────────────────────────────
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "llms-agentes" },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", category: "llms-agentes" },
  { url: "https://venturebeat.com/category/ai/feed/", category: "negocios-estrategia" },
  { url: "https://arstechnica.com/tag/artificial-intelligence/feed/", category: "llms-agentes" },
  { url: "https://www.wired.com/feed/tag/artificial-intelligence/latest/rss", category: "llms-agentes" },
  { url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/", category: "llms-agentes" },
  { url: "https://thedecoder.com/feed/", category: "llms-agentes" },
  { url: "https://www.zdnet.com/topic/artificial-intelligence/rss.xml", category: "ferramentas-reviews" },
  { url: "https://www.businessinsider.com/category/ai/rss", category: "negocios-estrategia" },
  { url: "https://www.axios.com/technology/artificial-intelligence/rss", category: "llms-agentes" },

  // ── Business & Entrepreneurship ────────────────────────────────
  { url: "https://hbr.org/topic/technology/rss", category: "negocios-estrategia" },
  { url: "https://www.fastcompany.com/technology/rss", category: "negocios-estrategia" },
  { url: "https://www.inc.com/tag/artificial-intelligence.rss", category: "negocios-estrategia" },
  { url: "https://www.forbes.com/innovation/ai/feed/", category: "negocios-estrategia" },
  { url: "https://sifted.eu/sector/deeptech/feed/", category: "negocios-estrategia" },

  // ── Marketing & Growth ─────────────────────────────────────────
  { url: "https://contentmarketinginstitute.com/feed/", category: "ai-para-seo" },
  { url: "https://moz.com/blog/feed", category: "ai-para-seo" },
  { url: "https://searchengineland.com/feed", category: "ai-para-seo" },
  { url: "https://www.searchenginejournal.com/feed/", category: "ai-para-seo" },
  { url: "https://copyblogger.com/feed/", category: "ai-copywriting" },

  // ── Automation & No-Code ───────────────────────────────────────
  { url: "https://blog.n8n.io/rss/", category: "automacao-no-code" },
  { url: "https://zapier.com/blog/feeds/latest/", category: "automacao-no-code" },
  { url: "https://www.make.com/en/blog/feed", category: "automacao-no-code" },

  // ── Practitioners & Research ───────────────────────────────────
  { url: "https://simonwillison.net/atom/everything/", category: "ferramentas-reviews" },
  { url: "https://lilianweng.github.io/index.xml", category: "llms-agentes" },
  { url: "https://www.oneusefulthing.org/feed", category: "negocios-estrategia" },
  { url: "https://www.lennysnewsletter.com/feed", category: "negocios-estrategia" },
  { url: "https://www.producthunt.com/feed?category=ai", category: "ferramentas-reviews" },

  // ── Brazilian Sources (PT already, no translation needed) ──────
  { url: "https://canaltech.com.br/rss/inteligencia-artificial/", category: "llms-agentes" },
  { url: "https://olhardigital.com.br/feed/", category: "llms-agentes" },
  { url: "https://www.tecmundo.com.br/rss/inteligencia-artificial.xml", category: "llms-agentes" },
  { url: "https://exame.com/tecnologia/inteligencia-artificial/feed/", category: "negocios-estrategia" },
  { url: "https://startups.com.br/feed/", category: "negocios-estrategia" },

  // ── Reddit (free RSS, no API key) ─────────────────────────────
  { url: "https://www.reddit.com/r/artificial/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/MachineLearning/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/LocalLLaMA/hot.rss", category: "ferramentas-reviews" },
  { url: "https://www.reddit.com/r/ChatGPT/hot.rss", category: "ferramentas-reviews" },
  { url: "https://www.reddit.com/r/OpenAI/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/ClaudeAI/hot.rss", category: "ferramentas-reviews" },
  { url: "https://www.reddit.com/r/singularity/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/Futurology/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/automation/hot.rss", category: "automacao-no-code" },
  { url: "https://www.reddit.com/r/n8n/hot.rss", category: "automacao-no-code" },
  { url: "https://www.reddit.com/r/AItools/hot.rss", category: "ferramentas-reviews" },
  { url: "https://www.reddit.com/r/StableDiffusion/hot.rss", category: "ai-generativa" },
  { url: "https://www.reddit.com/r/midjourney/hot.rss", category: "ai-generativa" },
  { url: "https://www.reddit.com/r/Entrepreneur/search.rss?q=AI+artificial+intelligence&sort=new", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/startups/search.rss?q=AI&sort=new", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/marketing/search.rss?q=AI&sort=new", category: "ai-para-seo" },
  { url: "https://www.reddit.com/r/SaaS/search.rss?q=AI&sort=new", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/datascience/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/PromptEngineering/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/learnmachinelearning/hot.rss", category: "carreira-ai" },

  // ── AI in Business specific ────────────────────────────────────
  { url: "https://www.reddit.com/r/AIBusiness/hot.rss", category: "negocios-estrategia" },
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
  { keywords: ["stable diffusion", "midjourney", "dall-e", "image generation", "text-to-image", "generative art", "ai art"], category: "ai-generativa" },
  { keywords: ["career", "carreira", "job", "emprego", "skill", "learning", "course", "aprender"], category: "carreira-ai" },
  { keywords: ["llm", "gpt", "claude", "gemini", "llama", "mistral", "agent", "agente", "transformer", "openai", "anthropic"], category: "llms-agentes" },
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

function detectLang(text: string): string {
  const ptWords = ["para", "com", "que", "uma", "como", "mais", "por", "são", "está", "você", "não"];
  const ptCount = ptWords.filter((w) => text.toLowerCase().includes(` ${w} `)).length;
  return ptCount >= 2 ? "pt" : "en";
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
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

// ─── Main ───────────────────────────────────────────────────────────
Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let totalInserted = 0;
    let totalSkipped = 0;

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "sinapse-club-curator/2.0 (+https://forum.sinapse.club)" },
          signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) { console.error(`[SKIP] ${feed.url}: ${res.status}`); continue; }

        const xml = await res.text();
        const items = parseItems(xml);

        for (const item of items.slice(0, 8)) { // max 8 per feed per run
          // Skip dedup
          const { data: exists } = await supabase
            .from("curated_content")
            .select("id")
            .eq("source_url", item.link)
            .limit(1);
          if (exists && exists.length > 0) { totalSkipped++; continue; }

          const lang = detectLang(`${item.title} ${item.description}`);
          const category = detectCategory(item.title, item.description, feed.category);

          const { error } = await supabase.from("curated_content").insert({
            source: "rss",
            source_url: item.link,
            source_author: item.author || null,
            original_text: item.description || item.title,
            title: item.title,
            original_lang: lang,
            // If already PT, mark as translated so publish picks it up
            translated_text: lang === "pt" ? (item.description || item.title) : null,
            translation_status: lang === "pt" ? "translated" : "pending",
            category,
            relevance_score: 0.75,
            is_published: false,
          });

          if (!error) totalInserted++;
        }
      } catch (err) {
        console.error(`[ERROR] ${feed.url}:`, (err as Error).message);
      }
    }

    return new Response(
      JSON.stringify({ success: true, inserted: totalInserted, skipped: totalSkipped, feeds: RSS_FEEDS.length }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
