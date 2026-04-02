import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubcategoryCard } from "@/components/forum/subcategory-card";
import { ThreadList } from "@/components/forum/thread-list";
import { hasAccess } from "@/lib/access";
import type { ThreadData } from "@/components/forum/thread-list-item";
import type { Database, ProfessionalCluster } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];
type ForumSubcategory = Database["public"]["Tables"]["forum_subcategories"]["Row"];

export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const supabase = await createClient();

  // Fetch category
  const { data: category } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (!category) {
    notFound();
  }

  const typedCategory = category as ForumCategory;

  // Check if user has access to this category's tier
  const { data: { user } } = await supabase.auth.getUser();
  let userRole = "free";
  if (user) {
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = (profile as any)?.role ?? "free";
  }

  if (!hasAccess(userRole, typedCategory.access)) {
    redirect(`/pricing?upgrade=${typedCategory.access}&from=/forum/${categorySlug}`);
  }

  // Fetch subcategories and threads in parallel
  const [subcategoriesRes, threadsRes] = await Promise.all([
    supabase
      .from("forum_subcategories")
      .select("*")
      .eq("category_id", typedCategory.id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("posts")
      .select(
        "id, title, is_sticky, is_solved, replies_count, views_count, tags, created_at, last_reply_at, author_id, subcategory_id, profiles!author_id(username, display_name, avatar_url, professional_role_id), forum_subcategories!subcategory_id(slug, name)"
      )
      .eq("category_id", typedCategory.id)
      .eq("type", "thread")
      .order("is_sticky", { ascending: false })
      .order("last_reply_at", { ascending: false, nullsFirst: false }),
  ]);

  const subcategories = (subcategoriesRes.data ?? []) as ForumSubcategory[];

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

  // Transform threads into ThreadData
  const threads: ThreadData[] = rawThreads.map((t: Record<string, unknown>) => {
    const profile = t.profiles as Record<string, unknown> | null;
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
      subcategory: sub
        ? {
            slug: sub.slug as string,
            name: sub.name as string,
          }
        : null,
    };
  });

  // Count total subcategories
  const subcategoriesCount = subcategories.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">
            {typedCategory.icon || "💬"}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {typedCategory.name}
              </h1>
              {typedCategory.access === "pro" && (
                <span className="inline-flex items-center rounded-full border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  PRO
                </span>
              )}
            </div>
            {typedCategory.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {typedCategory.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="tabular-nums font-medium text-foreground">
            {typedCategory.threads_count}
          </span>{" "}
          threads
          <span className="text-border">|</span>
          <span className="tabular-nums font-medium text-foreground">
            {typedCategory.posts_count}
          </span>{" "}
          posts
          {subcategoriesCount > 0 && (
            <>
              <span className="text-border">|</span>
              <span className="tabular-nums font-medium text-foreground">
                {subcategoriesCount}
              </span>{" "}
              subcategorias
            </>
          )}
        </div>
      </div>

      {/* Subcategories Grid */}
      {subcategories.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Subcategorias
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((sub) => (
              <SubcategoryCard
                key={sub.id}
                subcategory={sub}
                categorySlug={categorySlug}
              />
            ))}
          </div>
        </section>
      )}

      {/* Thread List */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Threads
        </h2>
        <div className="rounded-lg border border-border">
          <ThreadList
            threads={threads}
            emptyMessage={`Nenhum thread em ${typedCategory.name} ainda. Seja o primeiro a postar!`}
          />
        </div>
      </section>
    </div>
  );
}
