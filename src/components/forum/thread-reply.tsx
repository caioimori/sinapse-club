"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, Reply, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { sanitizeHtml } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { ProfessionalCluster } from "@/types/database";

export interface ReplyAuthor {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  professional_role?: {
    name: string;
    cluster: ProfessionalCluster;
  } | null;
}

export interface ReplyData {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  parent_id: string | null;
  is_solution?: boolean;
  author: ReplyAuthor;
  replies?: ReplyData[];
}

interface ThreadReplyProps {
  reply: ReplyData;
  threadId: string;
  threadAuthorId: string;
  currentUserId?: string;
  isSolved: boolean;
  depth?: number;
  likedCommentIds?: string[];
}

export function ThreadReply({
  reply,
  threadId,
  threadAuthorId,
  currentUserId,
  isSolved,
  depth = 0,
  likedCommentIds = [],
}: ThreadReplyProps) {
  const [liked, setLiked] = useState(() => likedCommentIds.includes(reply.id));
  const [likes, setLikes] = useState(reply.likes_count);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [markingAsSolution, setMarkingAsSolution] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const timeAgo = formatDistanceToNow(new Date(reply.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const authorName = reply.author.display_name || reply.author.username;
  const authorInitial = authorName[0]?.toUpperCase() || "?";

  const canMarkAsSolution =
    currentUserId === threadAuthorId && !isSolved && depth === 0;

  async function handleLike() {
    if (!currentUserId) return;
    setLiked(!liked);
    setLikes((l) => (liked ? l - 1 : l + 1));

    if (!liked) {
      await (supabase as any).from("reactions").insert({
        user_id: currentUserId,
        target_type: "comment",
        target_id: reply.id,
        type: "like",
      });
    } else {
      await (supabase as any)
        .from("reactions")
        .delete()
        .eq("user_id", currentUserId)
        .eq("target_type", "comment")
        .eq("target_id", reply.id)
        .eq("type", "like");
    }
  }

  async function handleReplySubmit() {
    if (!replyText.trim()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    await (supabase as any).from("comments").insert({
      post_id: threadId,
      author_id: user.id,
      parent_id: reply.id,
      content: replyText.trim(),
    });

    setReplyText("");
    setShowReplyForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleMarkAsSolution() {
    setMarkingAsSolution(true);
    await (supabase as any)
      .from("posts")
      .update({ is_solved: true })
      .eq("id", threadId);
    setMarkingAsSolution(false);
    router.refresh();
  }

  return (
    <div
      className={cn(
        "space-y-3",
        depth > 0 && "ml-8 pl-4"
      )}
      style={depth > 0 ? { borderLeft: "2px solid var(--border-subtle)" } : undefined}
    >
      <div className="flex items-start gap-3">
        <Avatar size="default" className="mt-0.5 flex-shrink-0">
          {reply.author.avatar_url ? (
            <AvatarImage src={reply.author.avatar_url} alt={authorName} />
          ) : null}
          <AvatarFallback>{authorInitial}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Author info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">
              {authorName}
            </span>
            {reply.author.professional_role && (
              <CargoBadge
                cluster={reply.author.professional_role.cluster}
                roleName={reply.author.professional_role.name}
                size="sm"
              />
            )}
            {reply.author.level > 0 && (
              <span className="text-[10px] font-mono text-muted-foreground">
                Lv.{reply.author.level}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          {/* Solution badge */}
          {reply.is_solution && (
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Solução aceita
            </div>
          )}

          {/* Content */}
          <div
            className="mt-1.5 text-sm text-foreground/90 prose dark:prose-invert prose-sm max-w-none [&_a]:text-muted-foreground [&_a]:underline [&_pre]:bg-muted [&_pre]:border [&_pre]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(reply.content) }}
          />

          {/* Actions bar */}
          <div className="mt-2 flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-muted-foreground px-2",
                liked && "text-rose-500"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-3 w-3", liked && "fill-current")} />
              {likes > 0 && likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground px-2"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3 w-3" />
              Responder
            </Button>
            {canMarkAsSolution && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-emerald-600 dark:text-emerald-400 px-2 hover:bg-emerald-500/10"
                onClick={handleMarkAsSolution}
                disabled={markingAsSolution}
              >
                <CheckCircle2 className="h-3 w-3" />
                {markingAsSolution ? "..." : "Marcar como solução"}
              </Button>
            )}
          </div>

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-2 space-y-2">
              <Textarea
                placeholder={`Responder ${authorName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] bg-muted border-0 resize-none text-sm"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs bg-foreground border-0"
                  onClick={handleReplySubmit}
                  disabled={loading || !replyText.trim()}
                >
                  {loading ? "Enviando..." : "Responder"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {reply.replies?.map((nested) => (
        <ThreadReply
          key={nested.id}
          reply={nested}
          threadId={threadId}
          threadAuthorId={threadAuthorId}
          currentUserId={currentUserId}
          isSolved={isSolved}
          depth={depth + 1}
          likedCommentIds={likedCommentIds}
        />
      ))}
    </div>
  );
}
