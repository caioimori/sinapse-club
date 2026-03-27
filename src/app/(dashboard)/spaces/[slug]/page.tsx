import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("spaces").select("name").eq("slug", slug).single() as any;
  return { title: data?.name || "Space" };
}

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", slug)
    .single() as any;

  if (!space) notFound();

  // Check access
  let userRole = "free";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single() as any;
    userRole = profile?.role || "free";
  }

  const hasAccess = space.access === "free"
    || (space.access === "pro" && ["pro", "premium", "admin", "instructor"].includes(userRole))
    || (space.access === "premium" && ["premium", "admin", "instructor"].includes(userRole));

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{space.icon} {space.name}</h2>
        <p className="text-muted-foreground">Este space requer plano {space.access.toUpperCase()}</p>
        <Link href="/#pricing">
          <Button className="gradient-synapse border-0">Fazer upgrade</Button>
        </Link>
      </div>
    );
  }

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role),
      space:spaces!posts_space_id_fkey(name, slug, icon)
    `)
    .eq("space_id", space.id)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{space.icon} {space.name}</h1>
        {space.description && <p className="text-muted-foreground">{space.description}</p>}
      </div>

      <CreatePost spaceId={space.id} />

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              type={post.type}
              author={post.author}
              space={post.space}
              likes_count={post.likes_count}
              comments_count={post.comments_count}
              created_at={post.created_at}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
          <div className="mb-4 text-5xl">{space.icon}</div>
          <h3 className="mb-2 text-lg font-semibold">Nenhum post neste space</h3>
          <p className="text-sm text-muted-foreground">Seja o primeiro a compartilhar!</p>
        </div>
      )}
    </div>
  );
}
