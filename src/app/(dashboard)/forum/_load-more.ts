"use server";

import { createClient } from "@/lib/supabase/server";
import type { ThreadData } from "@/components/forum/thread-list-item";
import { PAGE_SIZE, THREAD_SELECT, mapRowToThreadData } from "./_thread-query";

export async function loadMoreForumThreads(params: {
  page: number;
  sort: string;
  tab?: string;
  categorySlug?: string;
}): Promise<ThreadData[]> {
  const { page, sort, tab, categorySlug } = params;
  if (page < 2) return []; // page 1 rendered on server-side initial load

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let followingIds: string[] = [];
  if (tab === "following" && user) {
    const { data } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);
    followingIds = (data ?? []).map((f: { following_id: string }) => f.following_id);
  }

  const offset = (page - 1) * PAGE_SIZE;

  let q = supabase
    .from("posts")
    .select(THREAD_SELECT)
    .eq("type", "thread")
    .range(offset, offset + PAGE_SIZE - 1);

  if (sort === "popular") {
    q = q.order("replies_count", { ascending: false }).order("created_at", { ascending: false });
  } else if (sort === "unanswered") {
    q = q.eq("replies_count", 0).order("created_at", { ascending: false });
  } else {
    q = q.order("created_at", { ascending: false });
  }

  if (tab === "following") {
    if (followingIds.length > 0) {
      q = q.in("author_id", followingIds);
    } else {
      q = q.eq("author_id", "00000000-0000-0000-0000-000000000000");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = (await q) as any;
  let rows = data ?? [];

  if (categorySlug) {
    const { data: catRow } = await supabase
      .from("forum_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    const catId = (catRow as { id: string } | null)?.id;
    if (catId) {
      rows = rows.filter((r: { category_id: string }) => r.category_id === catId);
    }
  }

  // Reposts for current user (if any) to mark re-posted state
  let userRepostIds = new Set<string>();
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: reposts } = (await (supabase as any)
      .from("posts")
      .select("repost_of")
      .eq("author_id", user.id)
      .eq("type", "thread")
      .not("repost_of", "is", null)
      .limit(200)) as { data: { repost_of: string }[] | null };
    userRepostIds = new Set((reposts ?? []).map((r) => r.repost_of));
  }

  return rows.map((r: Record<string, unknown>) => mapRowToThreadData(r, userRepostIds));
}
