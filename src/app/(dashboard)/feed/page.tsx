import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import type { Database } from "@/types/database";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export const metadata = {
  title: "Feed",
};

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get the default space (ai-news)
  const { data: defaultSpace } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", "ai-news")
    .single() as any;

  // Fetch posts with author info
  const { data: posts } = await (supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role),
      space:spaces!posts_space_id_fkey(name, slug, icon)
    `)
    .order("created_at", { ascending: false })
    .limit(50) as any);

  // Get user reactions for these posts
  let userReactions: { target_id: string; type: string }[] = [];
  if (user && posts?.length) {
    const postIds = posts.map((p: any) => p.id);
    const { data } = await supabase
      .from("reactions")
      .select("target_id, type")
      .eq("user_id", user.id)
      .eq("target_type", "post")
      .in("target_id", postIds);
    userReactions = (data as { target_id: string; type: string }[]) || [];
  }

  const likedIds = new Set(userReactions.filter((r) => r.type === "like").map((r) => r.target_id));
  const savedIds = new Set(userReactions.filter((r) => r.type === "save").map((r) => r.target_id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI News</h1>
        <p className="text-muted-foreground">Conteudo curado das maiores fontes de AI do mundo</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge variant="default" className="bg-sinapse-purple-600 cursor-pointer">Todos</Badge>
        <Badge variant="outline" className="cursor-pointer">LLMs</Badge>
        <Badge variant="outline" className="cursor-pointer">Tools</Badge>
        <Badge variant="outline" className="cursor-pointer">Research</Badge>
        <Badge variant="outline" className="cursor-pointer">Carreira</Badge>
      </div>

      {/* Create post */}
      {defaultSpace && <CreatePost spaceId={defaultSpace.id} />}

      {/* Posts feed */}
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
              is_liked={likedIds.has(post.id)}
              is_saved={savedIds.has(post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
          <div className="mb-4 text-5xl">📰</div>
          <h3 className="mb-2 text-lg font-semibold">Nenhum post ainda</h3>
          <p className="text-sm text-muted-foreground">
            Seja o primeiro a compartilhar algo com a comunidade!
          </p>
        </div>
      )}
    </div>
  );
}
