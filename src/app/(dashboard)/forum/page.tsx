import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ForumComposer } from "@/components/forum/forum-composer";
import { ThreadList } from "@/components/forum/thread-list";
import { ThreadListItem, type ThreadData } from "@/components/forum/thread-list-item";
import type { Database, ProfessionalCluster } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

interface ForumPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

async function ForumFeed({ categorySlug }: { categorySlug?: string }) {
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

  // Fetch categories and threads in parallel
  const [categoriesRes, threadsRes] = await Promise.all([
    supabase
      .from("forum_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("posts")
      .select(
        "id, title, is_sticky, is_solved, replies_count, views_count, tags, created_at, last_reply_at, author_id, category_id, subcategory_id, profiles!author_id(username, display_name, avatar_url, professional_role_id), forum_categories!category_id(slug, name, icon, color), forum_subcategories!subcategory_id(slug, name)"
      )
      .eq("type", "thread")
      .order("is_sticky", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const categories = (categoriesRes.data ?? []) as ForumCategory[];

  // Filter by category if specified
  let rawThreads = threadsRes.data ?? [];
  if (categorySlug) {
    const selectedCategory = categories.find((c) => c.slug === categorySlug);
    if (selectedCategory) {
      rawThreads = rawThreads.filter((t: any) => t.category_id === selectedCategory.id);
    }
  }

  // Fetch professional roles for thread authors
  const roleIds = [
    ...new Set(
      rawThreads
        .map((t: Record<string, unknown>) => {
          const profile = t.profiles as Record<string, unknown> | null;
          return profile?.professional_role_id as string | null;
        })
        .filter(Boolean)
    ),
  ] as string[];

  let rolesMap: Record<string, { name: string; cluster: ProfessionalCluster }> = {};
  if (roleIds.length > 0) {
    const { data: roles } = await supabase
      .from("professional_roles")
      .select("id, name, cluster")
      .in("id", roleIds) as { data: { id: string; name: string; cluster: string }[] | null };
    if (roles) {
      rolesMap = Object.fromEntries(
        roles.map((r) => [r.id, { name: r.name, cluster: r.cluster as ProfessionalCluster }])
      );
    }
  }

  // Transform threads into ThreadData format
  const threads: ThreadData[] = rawThreads.map((t: Record<string, unknown>) => {
    const profile = t.profiles as Record<string, unknown> | null;
    const cat = t.forum_categories as Record<string, unknown> | null;
    const sub = t.forum_subcategories as Record<string, unknown> | null;
    const roleId = profile?.professional_role_id as string | null;

    return {
      id: t.id as string,
      title: t.title as string | null,
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
        professional_role: roleId ? rolesMap[roleId] ?? null : null,
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
    <div className="max-w-2xl mx-auto">
      {/* Composer */}
      <ForumComposer
        userAvatar={userProfile?.avatar_url}
        userName={userProfile?.display_name || userProfile?.username}
        categories={categories}
        userRole={userRole}
      />

      {/* Feed */}
      <div className="border-l border-r border-[var(--border-subtle)]">
        {threads.length === 0 ? (
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
  );
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const { categoria } = await searchParams;

  return (
    <Suspense fallback={<div className="h-96" />}>
      <ForumFeed categorySlug={categoria} />
    </Suspense>
  );
}
