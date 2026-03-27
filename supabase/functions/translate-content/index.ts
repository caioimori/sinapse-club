// Supabase Edge Function: translate-content
// Translates pending curated content from EN to PT-BR using DeepL
// Triggered by pg_cron every 15 minutes

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const BATCH_SIZE = 10;

async function translateText(text: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        auth_key: apiKey,
        text: text,
        source_lang: "EN",
        target_lang: "PT-BR",
      }),
    });

    if (!res.ok) {
      console.error(`DeepL API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.translations?.[0]?.text || null;
  } catch (err) {
    console.error("Translation error:", err);
    return null;
  }
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const deeplKey = Deno.env.get("DEEPL_API_KEY");
    if (!deeplKey) {
      return new Response(
        JSON.stringify({ error: "DEEPL_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get pending items
    const { data: pendingItems, error: fetchError } = await supabase
      .from("curated_content")
      .select("id, title, original_text")
      .eq("translation_status", "pending")
      .eq("original_lang", "en")
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) throw fetchError;
    if (!pendingItems || pendingItems.length === 0) {
      return new Response(
        JSON.stringify({ success: true, translated: 0, message: "No pending items" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    let translated = 0;
    let failed = 0;

    for (const item of pendingItems) {
      // Translate title + content together for context
      const textToTranslate = [item.title, item.original_text]
        .filter(Boolean)
        .join("\n\n---\n\n");

      const translatedText = await translateText(textToTranslate, deeplKey);

      if (translatedText) {
        await supabase
          .from("curated_content")
          .update({
            translated_text: translatedText,
            translated_lang: "pt-BR",
            translation_status: "translated",
            translated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
        translated++;
      } else {
        await supabase
          .from("curated_content")
          .update({ translation_status: "failed" })
          .eq("id", item.id);
        failed++;
      }

      // Rate limit: 100ms between requests
      await new Promise((r) => setTimeout(r, 100));
    }

    return new Response(
      JSON.stringify({ success: true, translated, failed, total: pendingItems.length }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
