import { createClient } from "@/lib/supabase/server";
import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users } from "lucide-react";

export const metadata = {
  title: "Feed",
};

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user profile for composer
  let profile: any = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single() as any;
    profile = data;
  }

  // Get the default space
  const { data: defaultSpace } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", "ai-news")
    .single() as any;

  // Fetch all posts (timeline style)
  const { data: posts } = await (supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role),
      space:spaces!posts_space_id_fkey(name, slug, icon)
    `)
    .order("created_at", { ascending: false })
    .limit(50) as any);

  // Get user reactions
  let likedIds = new Set<string>();
  let savedIds = new Set<string>();
  if (user && posts?.length) {
    const postIds = posts.map((p: any) => p.id);
    const { data } = await (supabase as any)
      .from("reactions")
      .select("target_id, type")
      .eq("user_id", user.id)
      .eq("target_type", "post")
      .in("target_id", postIds);
    (data || []).forEach((r: any) => {
      if (r.type === "like") likedIds.add(r.target_id);
      if (r.type === "save") savedIds.add(r.target_id);
    });
  }

  return (
    <div className="-mx-4 -my-6 max-w-2xl mx-auto border-x border-border min-h-[calc(100dvh-3.5rem)]">
      {/* Header tabs (Twitter-style: For You / Following) */}
      <Tabs defaultValue="foryou" className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl">
        <TabsList className="w-full justify-center rounded-none border-b border-border bg-transparent h-auto p-0">
          <TabsTrigger
            value="foryou"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-sinapse-purple-600 data-[state=active]:bg-transparent py-3.5 font-semibold"
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Para voce
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-sinapse-purple-600 data-[state=active]:bg-transparent py-3.5 font-semibold"
          >
            <Users className="h-4 w-4 mr-1.5" /> Seguindo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="foryou" className="mt-0">
          {/* Twitter-style composer */}
          {defaultSpace && (
            <CreatePost
              spaceId={defaultSpace.id}
              avatarUrl={profile?.avatar_url}
              displayName={profile?.display_name}
              username={profile?.username}
            />
          )}

          {/* Timeline */}
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
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
                reposts_count={post.reposts_count}
                replies_count={post.replies_count}
                created_at={post.created_at}
                is_liked={likedIds.has(post.id)}
                is_saved={savedIds.has(post.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="mb-4 text-5xl">📰</div>
              <h3 className="mb-2 text-lg font-semibold">Seu feed esta vazio</h3>
              <p className="text-sm text-muted-foreground text-center">
                Comece postando algo ou siga pessoas para ver conteudo aqui.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-0">
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="mb-4 text-5xl">👥</div>
            <h3 className="mb-2 text-lg font-semibold">Siga pessoas</h3>
            <p className="text-sm text-muted-foreground text-center">
              Quando voce seguir alguem, os posts dessa pessoa aparecerão aqui.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
