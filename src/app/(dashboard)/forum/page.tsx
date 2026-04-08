import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ForumComposer } from "@/components/forum/forum-composer";
import { ForumTabs } from "@/components/forum/forum-tabs";
import { ThreadList } from "@/components/forum/thread-list";
import { ThreadListItem, type ThreadData } from "@/components/forum/thread-list-item";
import { TrendingUsers } from "@/components/forum/trending-users";
import { StickySidebar } from "@/components/forum/sticky-sidebar";
import { ThemesBar } from "@/components/forum/themes-bar";
import type { Database, ProfessionalCluster } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

interface ForumPageProps {
  searchParams: Promise<{ categoria?: string; tab?: string }>;
}

async function ForumFeed({ categorySlug, tab }: { categorySlug?: string; tab?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userRole = "free";
  let userProfile: any = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    userProfile = profile;
    userRole = (profile as any)?.role ?? "free";
  }

  // Fetch who the current user follows (for "Seguindo" tab)
  let followingIds: string[] = [];
  if (tab === "following" && user) {
    const { data: followsData } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);
    followingIds = (followsData ?? []).map((f: any) => f.following_id);
  }

  // Fetch trending users (top 5 by engagement this week)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: trendingData } = await supabase
    .from("posts")
    .select(
      "author_id, profiles!author_id(id, username, display_name, avatar_url)",
      { count: "exact" }
    )
    .gte("created_at", oneWeekAgo.toISOString())
    .eq("type", "thread")
    .limit(100) as any;

  // Group by author and count posts
  const authorEngagement: Record<string, { count: number; profile: any }> = {};
  if (trendingData) {
    trendingData.forEach((post: any) => {
      const authorId = post.author_id;
      const profile = post.profiles;
      if (!authorEngagement[authorId]) {
        authorEngagement[authorId] = { count: 0, profile };
      }
      authorEngagement[authorId].count += 1;
    });
  }

  const trendingUsers = Object.entries(authorEngagement)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)
    .map(([authorId, data]) => ({
      id: authorId,
      username: data.profile.username,
      display_name: data.profile.display_name,
      avatar_url: data.profile.avatar_url,
      engagement_score: data.count,
    }));

  // Build threads query — filter by followed authors when on "Seguindo" tab
  let threadsQuery = supabase
    .from("posts")
    .select(
      "id, title, content_plain, repost_of, is_sticky, is_solved, replies_count, views_count, reposts_count, tags, created_at, last_reply_at, author_id, category_id, subcategory_id, profiles!author_id(username, display_name, avatar_url, professional_role_id, professional_role:professional_roles(name, cluster)), forum_categories!category_id(slug, name, icon, color), forum_subcategories!subcategory_id(slug, name)"
    )
    .eq("type", "thread")
    .order("is_sticky", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (tab === "following") {
    if (followingIds.length > 0) {
      threadsQuery = threadsQuery.in("author_id", followingIds);
    } else {
      // User follows nobody — guarantee empty result
      threadsQuery = threadsQuery.eq("author_id", "00000000-0000-0000-0000-000000000000");
    }
  }

  // Fetch categories, threads, trending topics, suggested users, and user reposts all in parallel
  const [categoriesRes, threadsRes, trendingTopicsRes, suggestionsRes, userRepostsRes] = await Promise.all([
    supabase
      .from("forum_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    threadsQuery,
    supabase
      .from("posts")
      .select(
        "id, title, replies_count, forum_categories!category_id(icon, name, color)"
      )
      .eq("type", "thread")
      .gte("created_at", oneWeekAgo.toISOString())
      .order("replies_count", { ascending: false })
      .limit(8),
    // Suggested users: active profiles excluding current user, ordered by level
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, headline")
      .neq("id", user?.id ?? "00000000-0000-0000-0000-000000000000")
      .neq("username", "sinapse-bot")
      .order("level", { ascending: false })
      .limit(6),
    // User reposts — fetched upfront (no thread IDs needed) for O(1) set lookup
    user
      ? (supabase as any)
          .from("posts")
          .select("repost_of")
          .eq("author_id", user.id)
          .eq("type", "thread")
          .not("repost_of", "is", null)
          .limit(200)
      : Promise.resolve({ data: [] }),
  ]);

  const categories = (categoriesRes.data ?? []) as ForumCategory[];

  // Build suggestions
  const suggestions = (suggestionsRes.data ?? []).map((p: any) => ({
    id: p.id as string,
    username: p.username as string,
    display_name: p.display_name as string | null,
    avatar_url: p.avatar_url as string | null,
    headline: p.headline as string | null,
  }));

  // Build trending topics
  const trendingTopics = (trendingTopicsRes.data ?? []).map((t: any) => {
    const cat = t.forum_categories as any;
    return {
      id: t.id as string,
      title: t.title as string | null,
      replies_count: t.replies_count as number,
      category: cat
        ? { icon: cat.icon as string | null, name: cat.name as string, color: cat.color as string | null }
        : null,
    };
  });

  // Build repost set from parallel fetch (no sequential query needed)
  const userRepostIds = new Set<string>(
    ((userRepostsRes as any).data ?? []).map((r: any) => r.repost_of as string)
  );

  // Filter by category if specified
  const threads_data = threadsRes.data ?? [];
  let rawThreads = threads_data;
  if (categorySlug) {
    const selectedCategory = categories.find((c) => c.slug === categorySlug);
    if (selectedCategory) {
      rawThreads = rawThreads.filter((t: any) => t.category_id === selectedCategory.id);
    }
  }

  // Transform threads into ThreadData format — professional_role comes from the joined select
  const threads: ThreadData[] = rawThreads.map((t: Record<string, unknown>) => {
    const profile = t.profiles as Record<string, unknown> | null;
    const cat = t.forum_categories as Record<string, unknown> | null;
    const sub = t.forum_subcategories as Record<string, unknown> | null;

    return {
      id: t.id as string,
      title: t.title as string | null,
      content_plain: t.content_plain as string | null,
      repost_of: t.repost_of as string | null,
      reposts_count: (t.reposts_count as number) ?? 0,
      is_reposted: userRepostIds.has(t.id as string),
      repost_author: t.repost_of
        ? { username: (profile?.username as string) ?? "anon", display_name: (profile?.display_name as string | null) ?? null }
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
        professional_role: (profile?.professional_role as { name: string; cluster: ProfessionalCluster } | null) ?? null,
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
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-5 w-full">
      {/* Main feed — border lateral cobre composer + lista */}
      <div className="min-w-0 border-l border-r border-[var(--border-subtle)]">
        {/* Sticky: apenas as tabs */}
        <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-[var(--border-subtle)]">
          <ForumTabs />
        </div>

        {/* Themes bar — horizontal chip row, scrolls away */}
        <ThemesBar
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            color: c.color,
            icon: c.icon,
          }))}
          activeCategory={categorySlug}
        />

        {/* Composer — scroll away como no Twitter */}
        <ForumComposer
          userAvatar={userProfile?.avatar_url}
          userName={userProfile?.display_name || userProfile?.username}
          categories={categories}
          userRole={userRole}
        />

        {/* Feed */}
        <div>
          {threads.length === 0 && tab === "following" ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 gap-3">
              <p className="font-semibold text-foreground">Ainda não segue ninguém</p>
              <p className="text-sm text-muted-foreground">Siga pessoas para ver o conteúdo delas aqui</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-muted-foreground">Nenhuma publicação ainda. Seja o primeiro!</p>
            </div>
          ) : (
            <div>
              {threads.map((thread) => (
                <ThreadListItem
                  key={thread.id}
                  thread={thread}
                  showCategory={!categorySlug}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar — smart sticky: scrolls with feed until content end, then pins */}
      <div className="hidden lg:block">
        <StickySidebar topbarHeight={56}>
          <TrendingUsers users={trendingUsers} topics={trendingTopics} suggestions={suggestions} />
        </StickySidebar>
      </div>
    </div>
  );
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const { categoria, tab } = await searchParams;

  return (
    <Suspense fallback={<div className="h-96" />}>
      <ForumFeed categorySlug={categoria} tab={tab} />
    </Suspense>
  );
}
