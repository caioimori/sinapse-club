import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ThreadList } from "@/components/forum/thread-list";
import type { ThreadData } from "@/components/forum/thread-list-item";
import type { Database, ProfessionalCluster } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];
type ForumSubcategory = Database["public"]["Tables"]["forum_subcategories"]["Row"];

export default async function ForumSubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; sub: string }>;
}) {
  const { category: categorySlug, sub: subSlug } = await params;
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

  // Fetch subcategory
  const { data: subcategory } = await supabase
    .from("forum_subcategories")
    .select("*")
    .eq("category_id", typedCategory.id)
    .eq("slug", subSlug)
    .single();

  if (!subcategory) {
    notFound();
  }

  const typedSubcategory = subcategory as ForumSubcategory;

  // Fetch threads for this subcategory
  const { data: rawThreads } = await supabase
    .from("posts")
    .select(
      "id, title, is_sticky, is_solved, replies_count, views_count, tags, created_at, last_reply_at, author_id, profiles!author_id(username, display_name, avatar_url, professional_role_id)"
    )
    .eq("subcategory_id", typedSubcategory.id)
    .eq("type", "thread")
    .order("is_sticky", { ascending: false })
    .order("last_reply_at", { ascending: false, nullsFirst: false });

  const threadsData = rawThreads ?? [];

  // Fetch professional roles for thread authors
  const roleIds = [
    ...new Set(
      threadsData
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
  const threads: ThreadData[] = threadsData.map((t: Record<string, unknown>) => {
    const profile = t.profiles as Record<string, unknown> | null;
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
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <Link
              href={`/forum/${categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {typedCategory.icon && (
                <span className="mr-1">{typedCategory.icon}</span>
              )}
              {typedCategory.name}
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">
              {typedSubcategory.name}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {typedSubcategory.name}
          </h1>

          {typedSubcategory.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {typedSubcategory.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="tabular-nums font-medium text-foreground">
              {typedSubcategory.threads_count}
            </span>
            threads
          </div>
        </div>

        {/* New Thread CTA */}
        <Link href={`/forum/new?category=${categorySlug}&sub=${subSlug}`}>
          <Button size="sm" className="gap-1.5 flex-shrink-0">
            <Plus className="h-3.5 w-3.5" />
            Novo Thread
          </Button>
        </Link>
      </div>

      {/* Thread List */}
      <div className="rounded-lg border border-border">
        <ThreadList
          threads={threads}
          emptyMessage={`Nenhum thread em ${typedSubcategory.name} ainda. Seja o primeiro a postar!`}
        />
      </div>
    </div>
  );
}
