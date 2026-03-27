// Supabase Edge Function: curate-rss
// Fetches AI content from RSS feeds and stores in curated_content
// Triggered by pg_cron every 1 hour

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RSS_FEEDS = [
  { url: "https://blog.openai.com/rss/", source: "rss" as const, category: "llms-agents" },
  { url: "https://www.anthropic.com/feed", source: "rss" as const, category: "llms-agents" },
  { url: "https://blog.google/technology/ai/rss/", source: "rss" as const, category: "llms-agents" },
  { url: "https://ai.meta.com/blog/rss/", source: "rss" as const, category: "llms-agents" },
  { url: "https://huggingface.co/blog/feed.xml", source: "rss" as const, category: "coding-tools" },
  { url: "https://simonwillison.net/atom/everything/", source: "rss" as const, category: "coding-tools" },
];

// Simple RSS/Atom parser
function parseRSSItems(xml: string): Array<{ title: string; link: string; description: string; pubDate: string; author?: string }> {
  const items: Array<{ title: string; link: string; description: string; pubDate: string; author?: string }> = [];

  // Try RSS format
  const rssItemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = rssItemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]?.trim() || "";
    const link = item.match(/<link>(.*?)<\/link>/s)?.[1]?.trim()
      || item.match(/<link[^>]*href="([^"]*)"[^>]*\/>/)?.[1]?.trim() || "";
    const description = item.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s)?.[1]?.trim() || "";
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim()
      || item.match(/<published>(.*?)<\/published>/s)?.[1]?.trim() || "";
    const author = item.match(/<(?:dc:creator|author)>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/(?:dc:creator|author)>/s)?.[1]?.trim();

    if (title && link) {
      items.push({ title, link, description: stripHtml(description).slice(0, 500), pubDate, author });
    }
  }

  // Try Atom format if no RSS items found
  if (items.length === 0) {
    const atomEntryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    while ((match = atomEntryRegex.exec(xml)) !== null) {
      const entry = match[1];
      const title = entry.match(/<title[^>]*>(.*?)<\/title>/s)?.[1]?.trim() || "";
      const link = entry.match(/<link[^>]*href="([^"]*)"[^>]*\/>/)?.[1]?.trim()
        || entry.match(/<link[^>]*href="([^"]*)"[^>]*>/)?.[1]?.trim() || "";
      const summary = entry.match(/<(?:summary|content)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:summary|content)>/s)?.[1]?.trim() || "";
      const pubDate = entry.match(/<(?:published|updated)>(.*?)<\/(?:published|updated)>/s)?.[1]?.trim() || "";
      const author = entry.match(/<author>[\s\S]*?<name>(.*?)<\/name>/s)?.[1]?.trim();

      if (title && link) {
        items.push({ title, link, description: stripHtml(summary).slice(0, 500), pubDate, author });
      }
    }
  }

  return items;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let totalInserted = 0;

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "sinapse-club-bot/1.0" },
        });

        if (!res.ok) {
          console.error(`Failed to fetch ${feed.url}: ${res.status}`);
          continue;
        }

        const xml = await res.text();
        const items = parseRSSItems(xml);

        for (const item of items.slice(0, 10)) { // Max 10 per feed
          // Check if already exists (by source URL)
          const { data: existing } = await supabase
            .from("curated_content")
            .select("id")
            .eq("source_url", item.link)
            .limit(1);

          if (existing && existing.length > 0) continue;

          const { error } = await supabase.from("curated_content").insert({
            source: feed.source,
            source_url: item.link,
            source_author: item.author || null,
            original_text: item.description || item.title,
            title: item.title,
            original_lang: "en",
            category: feed.category,
            relevance_score: 0.7, // Default score for RSS
            translation_status: "pending",
            is_published: false,
          });

          if (!error) totalInserted++;
        }
      } catch (err) {
        console.error(`Error processing feed ${feed.url}:`, err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, inserted: totalInserted }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
