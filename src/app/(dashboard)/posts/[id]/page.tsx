import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/feed/post-card";
import { CommentSection } from "@/components/feed/comment-section";

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
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role),
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
  if (user) {
    const { data: reactions } = await supabase
      .from("reactions")
      .select("type")
      .eq("user_id", user.id)
      .eq("target_type", "post")
      .eq("target_id", id);
    isLiked = (reactions || []).some((r: any) => r.type === "like");
    isSaved = (reactions || []).some((r: any) => r.type === "save");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PostCard
        id={post.id}
        title={post.title}
        content={post.content}
        type={post.type}
        author={post.author}
        space={post.space}
        likes_count={post.likes_count}
        comments_count={post.comments_count}
        created_at={post.created_at}
        is_liked={isLiked}
        is_saved={isSaved}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Comentarios ({rootComments.length})</h2>
        <CommentSection postId={id} comments={rootComments} />
      </div>
    </div>
  );
}
