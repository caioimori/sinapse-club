import type { SupabaseClient } from "@supabase/supabase-js";
import type { ThreadData } from "@/components/forum/thread-list-item";
import type { ProfessionalCluster } from "@/types/database";

export const THREAD_SELECT =
  "id, title, content_plain, image_url, repost_of, is_sticky, is_solved, replies_count, views_count, likes_count, shares_count, reposts_count, tags, created_at, last_reply_at, author_id, category_id, subcategory_id, profiles!author_id(username, display_name, avatar_url, reputation, role, professional_role_id, professional_role:professional_roles(name, cluster)), forum_categories!category_id(slug, name, icon, color), forum_subcategories!subcategory_id(slug, name)";

export const PAGE_SIZE = 20;

/**
 * Reposts store only `{ author_id, repost_of }` in the posts table — the
 * content, title, image, original author, etc. all live on the original
 * row. Without this hydration step, a repost would render as an empty card
 * with only the "X repostou" ribbon.
 *
 * Strategy: after the main fetch, batch-fetch all originals referenced by
 * `repost_of`, swap the visual fields (author, title, content, image, tags,
 * category) into the repost row, and preserve the repost's own id, created_at
 * and repost_author (who reposted).
 */
export async function hydrateReposts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  threads: ThreadData[],
): Promise<ThreadData[]> {
  const ids = Array.from(
    new Set(
      threads
        .map((t) => t.repost_of)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  );
  if (ids.length === 0) return threads;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = (await (supabase as any)
    .from("posts")
    .select(THREAD_SELECT)
    .in("id", ids)) as { data: Record<string, unknown>[] | null };

  const byId = new Map<string, ThreadData>();
  (data ?? []).forEach((row) => {
    const hydrated = mapRowToThreadData(row, new Set());
    byId.set(hydrated.id, hydrated);
  });

  return threads.map((t) => {
    if (!t.repost_of) return t;
    const original = byId.get(t.repost_of);
    if (!original) return t;
    return {
      ...original,
      id: t.id,
      repost_of: t.repost_of,
      created_at: t.created_at,
      // Who reposted = the author of the repost row (i.e. the current thread's
      // "author" before hydration).
      repost_author: {
        username: t.author.username,
        display_name: t.author.display_name,
      },
      is_reposted: t.is_reposted,
      reposts_count: original.reposts_count ?? 0,
    };
  });
}

export function mapRowToThreadData(
  t: Record<string, unknown>,
  userRepostIds: Set<string>,
): ThreadData {
  const profile = t.profiles as Record<string, unknown> | null;
  const cat = t.forum_categories as Record<string, unknown> | null;
  const sub = t.forum_subcategories as Record<string, unknown> | null;

  return {
    id: t.id as string,
    title: t.title as string | null,
    content_plain: t.content_plain as string | null,
    image_url: (t.image_url as string | null) ?? null,
    repost_of: t.repost_of as string | null,
    reposts_count: (t.reposts_count as number) ?? 0,
    is_reposted: userRepostIds.has(t.id as string),
    repost_author: t.repost_of
      ? {
          username: (profile?.username as string) ?? "anon",
          display_name: (profile?.display_name as string | null) ?? null,
        }
      : null,
    is_sticky: t.is_sticky as boolean,
    is_solved: t.is_solved as boolean,
    replies_count: t.replies_count as number,
    views_count: t.views_count as number,
    likes_count: (t.likes_count as number) ?? 0,
    shares_count: (t.shares_count as number) ?? 0,
    tags: (t.tags as string[]) ?? [],
    created_at: t.created_at as string,
    last_reply_at: t.last_reply_at as string | null,
    author: {
      username: (profile?.username as string) ?? "anon",
      display_name: (profile?.display_name as string | null) ?? null,
      avatar_url: (profile?.avatar_url as string | null) ?? null,
      reputation: (profile?.reputation as number) ?? 0,
      role: (profile?.role as string) ?? "free",
      professional_role:
        (profile?.professional_role as { name: string; cluster: ProfessionalCluster } | null) ?? null,
    },
    category: cat
      ? {
          slug: cat.slug as string,
          name: cat.name as string,
          icon: cat.icon as string | null,
          color: cat.color as string | null,
        }
      : null,
    subcategory: sub
      ? {
          slug: sub.slug as string,
          name: sub.name as string,
        }
      : null,
  };
}
