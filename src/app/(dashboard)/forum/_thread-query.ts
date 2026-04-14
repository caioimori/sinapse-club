import type { ThreadData } from "@/components/forum/thread-list-item";
import type { ProfessionalCluster } from "@/types/database";

export const THREAD_SELECT =
  "id, title, content_plain, image_url, repost_of, is_sticky, is_solved, replies_count, views_count, reposts_count, tags, created_at, last_reply_at, author_id, category_id, subcategory_id, profiles!author_id(username, display_name, avatar_url, reputation, role, professional_role_id, professional_role:professional_roles(name, cluster)), forum_categories!category_id(slug, name, icon, color), forum_subcategories!subcategory_id(slug, name)";

export const PAGE_SIZE = 20;

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
