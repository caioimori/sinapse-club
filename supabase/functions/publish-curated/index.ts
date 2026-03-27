// Supabase Edge Function: publish-curated
// Publishes translated curated content as posts in the forum feed
// Triggered by pg_cron every 30 minutes

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PUBLISH_BATCH = 5; // Max items to publish per run
const MIN_RELEVANCE_SCORE = 0.5;

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get translated but unpublished items with good relevance
    const { data: items, error: fetchError } = await supabase
      .from("curated_content")
      .select("*")
      .eq("translation_status", "translated")
      .eq("is_published", false)
      .gte("relevance_score", MIN_RELEVANCE_SCORE)
      .order("relevance_score", { ascending: false })
      .limit(PUBLISH_BATCH);

    if (fetchError) throw fetchError;
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ success: true, published: 0, message: "No items to publish" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Get or create the bot user for curated posts
    // First check if system user exists
    let botUserId: string | null = null;
    const { data: botProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", "sinapse-bot")
      .single();

    if (botProfile) {
      botUserId = botProfile.id;
    }

    // If no bot user, we can't publish (need admin to create one)
    if (!botUserId) {
      return new Response(
        JSON.stringify({ error: "sinapse-bot user not found. Create a user with username 'sinapse-bot' first." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Map category → space
    const { data: spaces } = await supabase
      .from("spaces")
      .select("id, slug");

    const spaceMap = new Map<string, string>();
    (spaces || []).forEach((s: any) => spaceMap.set(s.slug, s.id));

    // Default to ai-news space
    const defaultSpaceId = spaceMap.get("ai-news");
    if (!defaultSpaceId) {
      return new Response(
        JSON.stringify({ error: "ai-news space not found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let published = 0;

    for (const item of items) {
      const spaceId = spaceMap.get(item.category || "") || defaultSpaceId;

      // Build rich content with source attribution
      const content = `<p>${item.translated_text || item.original_text}</p>`;

      // Create post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          author_id: botUserId,
          space_id: spaceId,
          title: item.title,
          content: content,
          content_plain: item.translated_text || item.original_text,
          type: "curated",
        })
        .select("id")
        .single();

      if (postError) {
        console.error(`Failed to publish item ${item.id}:`, postError);
        continue;
      }

      // Mark as published
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
