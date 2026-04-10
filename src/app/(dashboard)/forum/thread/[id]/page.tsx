import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThreadDetail } from "@/components/forum/thread-detail";
import type { ThreadDetailData, ThreadDetailAuthor } from "@/components/forum/thread-detail";
import { ThreadReply } from "@/components/forum/thread-reply";
import type { ReplyData, ReplyAuthor } from "@/components/forum/thread-reply";
import { ThreadReplyComposer } from "@/components/forum/thread-reply-composer";
import { ThreadActions } from "@/components/forum/thread-actions";
import { ThreadHeaderMenu } from "@/components/forum/thread-header-menu";
import type { ProfessionalCluster } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = (await supabase
    .from("posts")
    .select("title")
    .eq("id", id)
    .single()) as any;
  return { title: data?.title || "Thread" };
}

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch current user's role for moderation
  let currentUserRole: string | undefined;
  if (user) {
    const { data: profileData } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    currentUserRole = profileData?.role ?? undefined;
  }

  // Fetch thread and comments in parallel — professional_roles embedded in joins
  const [threadRes, commentsRes] = await Promise.all([
    (supabase
      .from("posts")
      .select(
        "*, profiles!author_id(id, username, display_name, avatar_url, reputation, role, professional_role_id, professional_role:professional_roles(name, cluster), headline, company), forum_categories!category_id(slug, name, icon, color), forum_subcategories!subcategory_id(slug, name)"
      )
      .eq("id", id)
      .eq("type", "thread")
      .single()) as any,
    (supabase
      .from("comments")
      .select(
        "*, profiles!author_id(id, username, display_name, avatar_url, reputation, role, professional_role_id, professional_role:professional_roles(name, cluster))"
      )
      .eq("post_id", id)
      .order("created_at", { ascending: true })) as any,
  ]);

  const thread = threadRes.data;
  const rawComments = commentsRes.data;

  if (!thread) notFound();

  // Increment view count (fire and forget — non-blocking)
  void (supabase as any).rpc("increment_post_views", { post_id: id });

  // Build thread author object — professional_role comes from the join
  const threadProfile = thread.profiles as any;
  const threadAuthor: ThreadDetailAuthor = {
    id: threadProfile?.id ?? "",
    username: threadProfile?.username ?? "anon",
    display_name: threadProfile?.display_name ?? null,
    avatar_url: threadProfile?.avatar_url ?? null,
    reputation: threadProfile?.reputation ?? 0,
    role: threadProfile?.role ?? "free",
    headline: threadProfile?.headline ?? null,
    company: threadProfile?.company ?? null,
    professional_role: (threadProfile?.professional_role as { name: string; cluster: ProfessionalCluster } | null) ?? null,
  };

  // Build category / subcategory
  const cat = thread.forum_categories as any;
  const sub = thread.forum_subcategories as any;

  const threadData: ThreadDetailData = {
    id: thread.id,
    title: thread.title,
    content: thread.content,
    is_sticky: thread.is_sticky,
    is_solved: thread.is_solved,
    is_locked: thread.is_locked,
    likes_count: thread.likes_count,
    replies_count: thread.replies_count,
    views_count: thread.views_count,
    tags: thread.tags ?? [],
    created_at: thread.created_at,
    author: threadAuthor,
    category: cat
      ? {
          slug: cat.slug,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
        }
      : null,
    subcategory: sub
      ? {
          slug: sub.slug,
          name: sub.name,
        }
      : null,
  };

  // Build comment tree
  const commentsMap = new Map<string, any>();
  const rootComments: any[] = [];
  (rawComments || []).forEach((c: any) => {
    const profile = c.profiles as any;
    const replyAuthor: ReplyAuthor = {
      id: profile?.id ?? "",
      username: profile?.username ?? "anon",
      display_name: profile?.display_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      reputation: profile?.reputation ?? 0,
      role: profile?.role ?? "free",
      professional_role: (profile?.professional_role as { name: string; cluster: ProfessionalCluster } | null) ?? null,
    };

    const replyData: ReplyData = {
      id: c.id,
      content: c.content,
      likes_count: c.likes_count,
      created_at: c.created_at,
      parent_id: c.parent_id,
      author: replyAuthor,
      replies: [],
    };

    commentsMap.set(c.id, replyData);
  });

  commentsMap.forEach((c) => {
    if (c.parent_id && commentsMap.has(c.parent_id)) {
      commentsMap.get(c.parent_id)!.replies.push(c);
    } else {
      rootComments.push(c);
    }
  });

  // Fetch thread reactions and comment reactions in parallel
  const commentIds = (rawComments ?? []).map((c: any) => c.id as string);
  const [postReactionsRes, commentReactionsRes] = await Promise.all([
    user
      ? supabase.from("reactions").select("type").eq("user_id", user.id).eq("target_type", "post").eq("target_id", id)
      : Promise.resolve({ data: [] as { type: string }[] }),
    user && commentIds.length > 0
      ? supabase.from("reactions").select("target_id").eq("user_id", user.id).eq("target_type", "comment").eq("type", "like").in("target_id", commentIds)
      : Promise.resolve({ data: [] as { target_id: string }[] }),
  ]);

  const postReactions = (postReactionsRes as any).data ?? [];
  const isLiked = postReactions.some((r: any) => r.type === "like");
  const isSaved = postReactions.some((r: any) => r.type === "save");
  const likedCommentIds = ((commentReactionsRes as any).data ?? []).map((r: any) => r.target_id as string);

  // Breadcrumb data
  const categorySlug = threadData.category?.slug;
  const categoryName = threadData.category?.name;

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <MessageSquare className="h-4 w-4 flex-shrink-0" />
        <Link
          href="/forum"
          className="hover:text-foreground transition-colors"
        >
          Forum
        </Link>
        {categorySlug && categoryName && (
          <>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link
              href={`/forum/${categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium text-foreground truncate max-w-[200px]">
          {threadData.title || "Thread"}
        </span>
      </nav>

      {/* Thread content */}
      <div className="rounded-lg border border-border bg-card p-5 relative">
        <ThreadDetail thread={threadData} />
        {/* Edit/Delete/Report for thread */}
        <div className="absolute top-4 right-4">
          <ThreadHeaderMenu
            threadId={threadData.id}
            authorId={threadData.author.id}
            title={threadData.title ?? ""}
            content={threadData.content}
            currentUserId={user?.id}
            currentUserRole={currentUserRole}
          />
        </div>
      </div>

      {/* Actions bar */}
      <div className="py-2">
        <ThreadActions
          threadId={threadData.id}
          currentUserId={user?.id}
          likesCount={threadData.likes_count}
          isLiked={isLiked}
          isSaved={isSaved}
        />
      </div>

      {/* Replies section */}
      <div className="space-y-4">
        <div className="border-t border-border pt-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {rootComments.length}{" "}
            {rootComments.length === 1 ? "resposta" : "respostas"}
          </h2>
        </div>

        {rootComments.length > 0 && (
          <div className="space-y-4">
            {rootComments.map((reply: ReplyData) => (
              <ThreadReply
                key={reply.id}
                reply={reply}
                threadId={threadData.id}
                threadAuthorId={threadAuthor.id}
                currentUserId={user?.id}
                currentUserRole={currentUserRole}
                isSolved={threadData.is_solved}
                likedCommentIds={likedCommentIds}
              />
            ))}
          </div>
        )}

        {/* Reply composer */}
        {!thread.is_locked && (
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Sua resposta
            </h3>
            <ThreadReplyComposer threadId={threadData.id} />
          </div>
        )}
      </div>
    </div>
  );
}
