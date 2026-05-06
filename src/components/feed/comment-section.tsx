"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, Reply, X as CloseIcon, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

type SupabaseAny = ReturnType<typeof createClient>;

const MIN_LEN = 3;
const MAX_LEN = 1000;

interface Comment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  parent_id: string | null;
  author: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
  likedCommentIds?: string[];
}

export function CommentSection({
  postId,
  comments,
  currentUserId,
  likedCommentIds = [],
}: CommentSectionProps) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; author: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const likedSet = new Set(likedCommentIds);

  const trimmed = text.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_LEN;
  const tooLong = trimmed.length > MAX_LEN;
  const canSubmit = trimmed.length >= MIN_LEN && !tooLong && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    const { error } = await (supabase as any).from("comments").insert({
      post_id: postId,
      author_id: user.id,
      parent_id: replyTo?.id ?? null,
      content: trimmed,
    });

    setLoading(false);
    if (error) {
      toast.error("Não foi possível publicar o comentário. Tente novamente.");
      return;
    }

    setText("");
    setReplyTo(null);
    toast.success(replyTo ? "Resposta publicada." : "Comentário publicado.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* New comment composer */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          {replyTo && (
            <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
              <span>Respondendo a <span className="font-medium text-foreground">@{replyTo.author}</span></span>
              <button
                onClick={() => setReplyTo(null)}
                className="rounded-full p-0.5 hover:bg-muted"
                aria-label="Cancelar resposta"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </div>
          )}
          <Textarea
            placeholder={replyTo ? `Responder @${replyTo.author}...` : "Escreva um comentário..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LEN + 50}
            className="min-h-[80px] bg-muted border-0 resize-none"
          />
          <div className="flex items-center justify-between gap-3">
            <span className={cn(
              "text-xs tabular-nums",
              tooShort && "text-destructive",
              tooLong && "text-destructive",
              !tooShort && !tooLong && "text-muted-foreground"
            )}>
              {tooShort ? `Mín. ${MIN_LEN} caracteres` : tooLong ? `${trimmed.length - MAX_LEN} excedido` : `${trimmed.length}/${MAX_LEN}`}
            </span>
            <Button
              size="sm"
              className="bg-foreground border-0"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {loading ? "Enviando..." : replyTo ? "Responder" : "Comentar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
          <MessageCircle className="h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">Seja o primeiro a comentar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(id, author) => setReplyTo({ id, author })}
              currentUserId={currentUserId}
              likedSet={likedSet}
              supabase={supabase}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  depth = 0,
  currentUserId,
  likedSet,
  supabase,
}: {
  comment: Comment;
  onReply: (id: string, author: string) => void;
  depth?: number;
  currentUserId?: string;
  likedSet: Set<string>;
  supabase: SupabaseAny;
}) {
  const [liked, setLiked] = useState(likedSet.has(comment.id));
  const [likes, setLikes] = useState(comment.likes_count);
  const [pending, setPending] = useState(false);
  const authorName = comment.author.display_name || comment.author.username;

  async function handleLike() {
    if (!currentUserId || pending) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((l) => (wasLiked ? Math.max(0, l - 1) : l + 1));
    setPending(true);

    try {
      if (!wasLiked) {
        const { error } = await (supabase as any).from("reactions").insert({
          user_id: currentUserId,
          target_type: "comment",
          target_id: comment.id,
          type: "like",
        });
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("reactions")
          .delete()
          .eq("user_id", currentUserId)
          .eq("target_type", "comment")
          .eq("target_id", comment.id)
          .eq("type", "like");
        if (error) throw error;
      }
    } catch {
      setLiked(wasLiked);
      setLikes((l) => (wasLiked ? l + 1 : Math.max(0, l - 1)));
      toast.error("Não foi possível registrar sua reação.");
    } finally {
      setPending(false);
    }
  }

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className={cn("space-y-2", depth > 0 && "ml-8 border-l-2 border-border pl-4")}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          {comment.author.avatar_url ? (
            <AvatarImage src={comment.author.avatar_url} alt={authorName} />
          ) : null}
          <AvatarFallback className="text-xs">
            {authorName[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{authorName}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 gap-1 text-xs text-muted-foreground px-2", liked && "text-[var(--accent-like)]")}
              onClick={handleLike}
              disabled={!currentUserId || pending}
            >
              <Heart className={cn("h-3 w-3", liked && "fill-current")} />
              {likes > 0 && likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground px-2"
              onClick={() => onReply(comment.id, comment.author.username)}
            >
              <Reply className="h-3 w-3" />
              Responder
            </Button>
          </div>
        </div>
      </div>

      {/* Nested replies — passa likedSet recursivo */}
      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          depth={depth + 1}
          currentUserId={currentUserId}
          likedSet={likedSet}
          supabase={supabase}
        />
      ))}
    </div>
  );
}
