import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/feed/post-card";
import { CommentSection } from "@/components/feed/comment-section";
import { CreatePost } from "@/components/feed/create-post";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("title").eq("id", id).single() as any;
  return { title: data?.title || "Post" };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url, role),
      space:spaces!posts_space_id_fkey(name, slug, icon)
    `)
    .eq("id", id)
    .single() as any;

  if (!post) notFound();

  // Get comments with authors
  const { data: rawComments } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles!comments_author_id_fkey(username, display_name, avatar_url)
    `)
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  // Build comment tree
  const commentsMap = new Map<string, any>();
  const rootComments: any[] = [];
  (rawComments || []).forEach((c: any) => {
    commentsMap.set(c.id, { ...c, replies: [] });
  });
  commentsMap.forEach((c) => {
    if (c.parent_id && commentsMap.has(c.parent_id)) {
      commentsMap.get(c.parent_id)!.replies.push(c);
    } else {
      rootComments.push(c);
    }
  });

  // User reactions
  let isLiked = false;
  let isSaved = false;
  let isFollowingAuthor = false;
  if (user) {
    const { data: reactions } = await supabase
      .from("reactions")
      .select("type")
      .eq("user_id", user.id)
      .eq("target_type", "post")
      .eq("target_id", id);
    isLiked = (reactions || []).some((r: any) => r.type === "like");
    isSaved = (reactions || []).some((r: any) => r.type === "save");

    // Check if following the post author
    if (post.author?.id) {
      const { data: followData } = await (supabase as any)
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", post.author.id)
        .maybeSingle();
      isFollowingAuthor = !!followData;
    }
  }

  // Get user profile for reply composer
  let profile: any = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, display_name, username")
      .eq("id", user.id)
      .single() as any;
    profile = data;
  }

  return (
    <div className="-mx-4 -my-6 max-w-2xl mx-auto border-x border-border min-h-[calc(100dvh-3.5rem)]">
      {/* Post */}
      <PostCard
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
        is_liked={isLiked}
        is_saved={isSaved}
        source={post.source}
        source_url={post.source_url}
        original_text={post.original_text}
        translated_text={post.translated_text}
        showSource
        currentUserId={user?.id}
        isFollowingAuthor={isFollowingAuthor}
      />

      {/* Reply composer */}
      {post.space && (
        <CreatePost
          spaceId={post.space_id}
          avatarUrl={profile?.avatar_url}
          displayName={profile?.display_name}
          username={profile?.username}
          replyTo={id}
          placeholder="Poste sua resposta"
        />
      )}

      {/* Comments */}
      <div className="px-4 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-muted-foreground">
          {rootComments.length} {rootComments.length === 1 ? "comentario" : "comentarios"}
        </h2>
      </div>
      <div className="px-4 py-4">
        <CommentSection postId={id} comments={rootComments} />
      </div>
    </div>
  );
}
