// Supabase Edge Function: curate-rss
// MISSION: sinapse.club e um HUB AI-first para negocios, marketing e
// empreendedorismo. Todo item publicado precisa mencionar IA E uma das
// frentes de aplicacao (marketing, ads, SEO/GEO, growth, automacao/n8n,
// ecommerce, infoproduto, copy, empreendedorismo).
//
// pg_cron: every hour

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── RSS Sources — AI applied to business & marketing ──────────────
const RSS_FEEDS = [
  // ── AI labs & product blogs (sempre com foco em aplicacao) ─────
  { url: "https://openai.com/blog/rss/", category: "llms-agentes" },
  { url: "https://www.anthropic.com/feed", category: "llms-agentes" },
  { url: "https://www.perplexity.ai/changelog.rss", category: "ferramentas-reviews" },
  { url: "https://www.producthunt.com/feed?category=ai", category: "ferramentas-reviews" },
  { url: "https://www.producthunt.com/feed?category=marketing", category: "ferramentas-reviews" },
  { url: "https://www.producthunt.com/feed?category=sales", category: "ferramentas-reviews" },

  // ── Automation / no-code (AI + workflows) ──────────────────────
  { url: "https://blog.n8n.io/rss/", category: "automacao-no-code" },
  { url: "https://zapier.com/blog/feeds/latest/", category: "automacao-no-code" },
  { url: "https://www.make.com/en/blog/feed", category: "automacao-no-code" },

  // ── Marketing / SEO / Growth / Ads ─────────────────────────────
  { url: "https://searchengineland.com/feed", category: "ai-para-seo" },
  { url: "https://www.searchenginejournal.com/feed/", category: "ai-para-seo" },
  { url: "https://moz.com/blog/feed", category: "ai-para-seo" },
  { url: "https://ahrefs.com/blog/feed/", category: "ai-para-seo" },
  { url: "https://backlinko.com/feed", category: "ai-para-seo" },
  { url: "https://neilpatel.com/blog/feed/", category: "ai-para-seo" },
  { url: "https://blog.hubspot.com/marketing/rss.xml", category: "ai-para-seo" },
  { url: "https://contentmarketinginstitute.com/feed/", category: "ai-para-seo" },
  { url: "https://copyblogger.com/feed/", category: "ai-copywriting" },

  // ── Business / strategy / startups ─────────────────────────────
  { url: "https://www.lennysnewsletter.com/feed", category: "negocios-estrategia" },
  { url: "https://www.oneusefulthing.org/feed", category: "negocios-estrategia" },
  { url: "https://hbr.org/topic/technology/rss", category: "negocios-estrategia" },
  { url: "https://www.inc.com/tag/artificial-intelligence.rss", category: "negocios-estrategia" },
  { url: "https://www.forbes.com/innovation/ai/feed/", category: "negocios-estrategia" },
  { url: "https://venturebeat.com/category/ai/feed/", category: "negocios-estrategia" },

  // ── US tech media filtrado por AI ──────────────────────────────
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "llms-agentes" },

  // ── BR tech media focado em IA ─────────────────────────────────
  { url: "https://canaltech.com.br/rss/inteligencia-artificial/", category: "llms-agentes" },
  { url: "https://exame.com/tecnologia/inteligencia-artificial/feed/", category: "negocios-estrategia" },

  // ── Reddit AI tools / apps (alto sinal de casos praticos) ──────
  { url: "https://www.reddit.com/r/ChatGPT/hot.rss", category: "ferramentas-reviews" },
  { url: "https://www.reddit.com/r/ClaudeAI/hot.rss", category: "ferramentas-reviews" },
  { url: "https://www.reddit.com/r/OpenAI/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/AItools/hot.rss", category: "ferramentas-reviews" },
  { url: "https://www.reddit.com/r/PromptEngineering/hot.rss", category: "llms-agentes" },
  { url: "https://www.reddit.com/r/n8n/hot.rss", category: "automacao-no-code" },
  { url: "https://www.reddit.com/r/automation/hot.rss", category: "automacao-no-code" },
  { url: "https://www.reddit.com/r/nocode/hot.rss", category: "automacao-no-code" },
  { url: "https://www.reddit.com/r/AIBusiness/hot.rss", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/AI_Agents/hot.rss", category: "llms-agentes" },

  // ── Reddit business / marketing com filtro AI na query ─────────
  { url: "https://www.reddit.com/r/marketing/search.rss?q=AI+OR+ChatGPT+OR+automation&sort=new&restrict_sr=on", category: "ai-para-seo" },
  { url: "https://www.reddit.com/r/SEO/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-para-seo" },
  { url: "https://www.reddit.com/r/PPC/search.rss?q=AI+OR+automation&sort=new&restrict_sr=on", category: "ai-para-ads" },
  { url: "https://www.reddit.com/r/FacebookAds/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-para-ads" },
  { url: "https://www.reddit.com/r/GoogleAds/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-para-ads" },
  { url: "https://www.reddit.com/r/TikTokMarketing/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-para-ads" },
  { url: "https://www.reddit.com/r/ecommerce/search.rss?q=AI+OR+ChatGPT+OR+automation&sort=new&restrict_sr=on", category: "ai-para-ecommerce" },
  { url: "https://www.reddit.com/r/shopify/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-para-ecommerce" },
  { url: "https://www.reddit.com/r/dropshipping/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-para-ecommerce" },
  { url: "https://www.reddit.com/r/copywriting/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-copywriting" },
  { url: "https://www.reddit.com/r/Entrepreneur/search.rss?q=AI+OR+ChatGPT+OR+automation&sort=new&restrict_sr=on", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/smallbusiness/search.rss?q=AI+OR+ChatGPT+OR+automation&sort=new&restrict_sr=on", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/SaaS/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/startups/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "negocios-estrategia" },
  { url: "https://www.reddit.com/r/digital_marketing/search.rss?q=AI+OR+ChatGPT&sort=new&restrict_sr=on", category: "ai-para-seo" },
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

// ─── Dual relevance gate ───────────────────────────────────────────
// Every published item must mention BOTH:
//   (a) at least one AI token, AND
//   (b) at least one business / marketing / automation token
// This is the core filter that keeps sinapse.club an AI-first HUB for
// negocios e marketing — pesquisa pura, arquitetura, papers e curiosidade
// tech geral sao cortados antes de entrar em curated_content.

const AI_TOKENS = [
  "ai ", "a.i.", "artificial intelligence", "inteligencia artificial", "ia ",
  "llm", "llms", "gpt", "chatgpt", "claude", "gemini", "llama", "mistral",
  "anthropic", "openai", "copilot", "cursor", "windsurf", "codex",
  "agent", "agents", "agente", "agentes", "prompt", "prompting",
  "n8n", "zapier", "make.com", "automation", "automacao", "automação",
  "rag", "retrieval augmented", "embedding", "fine-tuning", "finetuning",
  "generative ai", "generativa", "midjourney", "stable diffusion", "dall-e",
  "sora", "runway", "hugging face", "huggingface", "perplexity",
  "workflow ai", "mcp", "model context protocol",
];

const BUSINESS_TOKENS = [
  // Marketing & growth
  "marketing", "growth", "seo", "geo", "sem ", "social media", "influencer",
  "email marketing", "newsletter", "lead", "leads", "funnel", "funil",
  "conversion", "conversao", "conversão", "cac", "ltv", "churn",
  // Paid ads
  "ads", "anuncio", "anúncio", "trafego pago", "tráfego pago", "paid",
  "google ads", "meta ads", "facebook ads", "instagram ads", "tiktok ads",
  "linkedin ads", "youtube ads", "advertising", "campanha",
  // Copy & content
  "copy", "copywriting", "headline", "cta", "sales page", "vsl", "landing page",
  "content marketing", "conteudo", "conteúdo", "editorial",
  // Ecommerce & products
  "ecommerce", "e-commerce", "shopify", "woocommerce", "loja virtual",
  "dropshipping", "amazon", "mercado livre", "magalu", "checkout",
  // Infoproducts & courses
  "infoproduto", "infoprodutos", "hotmart", "kiwify", "eduzz", "braip",
  "curso online", "lancamento", "lançamento", "afiliado", "afiliados",
  // Business / entrepreneurship
  "startup", "saas", "b2b", "b2c", "empresa", "negocio", "negócio",
  "empreend", "entrepreneur", "ceo ", "founder", "small business",
  "revenue", "mrr", "arr", "roi", "pipeline", "crm", "vendas", "sales",
  // Ops / productivity in business context
  "workflow", "produtividade", "productivity", "operations", "operacoes",
];

function hasAny(text: string, tokens: string[]): boolean {
  return tokens.some((t) => text.includes(t));
}

function isRelevant(title: string, description: string): boolean {
  const text = ` ${title.toLowerCase()} ${description.toLowerCase()} `;
  return hasAny(text, AI_TOKENS) && hasAny(text, BUSINESS_TOKENS);
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
  // Order matters: Reddit + some RSS feeds ship doubly-escaped HTML inside
  // <description> CDATA blocks (e.g. &lt;table&gt;). If we decode entities
  // BEFORE stripping tags, the decoded '<table>' would re-enter the tag set
  // and need a second pass. Instead: strip real tags FIRST, then decode
  // entities, then strip any tags that emerged from decoding, and repeat
  // once more to catch triple-escaped payloads.
  let out = html.replace(/<[^>]*>/g, " ");
  // First entity decode pass
  out = out
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  // Strip any tags that appeared from decoding
  out = out.replace(/<[^>]*>/g, " ");
  // Strip HTML comments (e.g. <!-- SC_OFF -->)
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

          // Relevance gate — skip items that don't mention AI at all.
          // Prevents lottery/curiosity/space content from leaking in as "LLMs & Agentes".
          if (!isRelevant(item.title, item.description)) {
            totalSkipped++;
            continue;
          }

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
