import { createClient } from "@/lib/supabase/server";
import { CategoryCard } from "@/components/forum/category-card";
import { ForumStats } from "@/components/forum/forum-stats";
import { ThreadList } from "@/components/forum/thread-list";
import { ThreadListItem, type ThreadData } from "@/components/forum/thread-list-item";
import { hasAccess } from "@/lib/access";
import type { Database, ProfessionalCluster } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

export default async function ForumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user role for category access filtering
  let userRole = "free";
  if (user) {
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = (profile as any)?.role ?? "free";
  }

  // Parallel fetches for categories, recent threads, and stats
  const [categoriesRes, threadsRes, membersRes, totalRepliesRes] =
    await Promise.all([
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
        .limit(8),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("type", "reply"),
    ]);

  const categories = (categoriesRes.data ?? []) as ForumCategory[];

  // Calculate total threads/replies from category stats
  const totalThreads = categories.reduce((sum, c) => sum + c.threads_count, 0);
  const totalReplies = totalRepliesRes.count ?? 0;
  const membersCount = membersRes.count ?? 0;

  // Fetch professional roles for thread authors
  const rawThreads = threadsRes.data ?? [];
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
  const recentThreads: ThreadData[] = rawThreads.map((t: Record<string, unknown>) => {
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

  // Separate sticky and non-sticky for the pinned section
  const stickyThreads = recentThreads.filter((t) => t.is_sticky);
  const regularThreads = recentThreads.filter((t) => !t.is_sticky);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Forum
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A comunidade de AI aplicada a negocios
        </p>
        <div className="mt-3">
          <ForumStats
            membersCount={membersCount}
            threadsCount={totalThreads}
            repliesCount={totalReplies}
          />
        </div>
      </div>

      {/* Category Grid */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Categorias
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              locked={!hasAccess(userRole, category.access)}
            />
          ))}
        </div>
      </section>

      {/* Pinned Threads */}
      {stickyThreads.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Fixados
          </h2>
          <div className="rounded-lg border border-border divide-y divide-border/50">
            {stickyThreads.map((thread) => (
              <ThreadListItem
                key={thread.id}
                thread={thread}
                showCategory
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Threads */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Threads Recentes
        </h2>
        <div className="rounded-lg border border-border">
          <ThreadList
            threads={regularThreads}
            showCategory
            emptyMessage="Nenhum thread ainda. Seja o primeiro a postar!"
          />
        </div>
      </section>
    </div>
  );
}
