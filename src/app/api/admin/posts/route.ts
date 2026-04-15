import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";

type CreatePostBody = {
  bot_id?: string;
  author_id?: string;
  title?: string | null;
  content?: string;
  content_plain?: string | null;
  category_slug?: string | null;
  category_id?: string | null;
  subcategory_slug?: string | null;
  tags?: string[];
  image_url?: string | null;
  source_url?: string | null;
};

const MAX_TITLE = 200;
const MAX_BODY = 6000;

function sanitizeStr(v: unknown, max: number): string | null {
  if (v == null) return null;
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: Request) {
  const guard = requireAdminKey(request);
  if (guard) return guard;

  let body: CreatePostBody;
  try {
    body = (await request.json()) as CreatePostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const authorId = body.bot_id || body.author_id;
  if (!authorId) {
    return NextResponse.json(
      { error: "bot_id (or author_id) is required" },
      { status: 400 },
    );
  }

  const content = sanitizeStr(body.content, MAX_BODY);
  const contentPlain = sanitizeStr(body.content_plain, MAX_BODY) ?? content;
  if (!content || !contentPlain) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const title = sanitizeStr(body.title, MAX_TITLE);

  const supabase = createServiceClient();

  // Resolve category_id: prefer explicit id, then slug lookup, then null.
  let categoryId = body.category_id ?? null;
  if (!categoryId && body.category_slug) {
    const { data: cat } = await supabase
      .from("forum_categories")
      .select("id")
      .eq("slug", body.category_slug)
      .maybeSingle();
    categoryId = (cat as { id: string } | null)?.id ?? null;
  }

  // Resolve subcategory_id by slug if provided.
  let subcategoryId: string | null = null;
  if (body.subcategory_slug && categoryId) {
    const { data: sub } = await supabase
      .from("forum_subcategories")
      .select("id")
      .eq("slug", body.subcategory_slug)
      .eq("category_id", categoryId)
      .maybeSingle();
    subcategoryId = (sub as { id: string } | null)?.id ?? null;
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t) => typeof t === "string" && t.trim().length > 0).slice(0, 10)
    : [];

  const imageUrl = sanitizeStr(body.image_url, 500);

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      author_id: authorId,
      type: "thread",
      title,
      content,
      content_plain: contentPlain,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      tags,
      image_url: imageUrl,
    })
    .select("id, created_at, author_id, title, category_id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    post: {
      ...post,
      url: `/forum/thread/${(post as { id: string }).id}`,
    },
  });
}

export async function DELETE(request: Request) {
  const guard = requireAdminKey(request);
  if (guard) return guard;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query param required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Unlink curated_content → posts before deleting to avoid FK violation
  await supabase
    .from("curated_content")
    .update({ published_as_post: null })
    .eq("published_as_post", id);

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, deleted: id });
}
