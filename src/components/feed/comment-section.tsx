"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, Reply } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

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
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(parentId: string | null = null) {
    if (!text.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase as any).from("comments").insert({
      post_id: postId,
      author_id: user.id,
      parent_id: parentId,
      content: text.trim(),
    });

    setText("");
    setReplyTo(null);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* New comment */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Escreva um comentario..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[80px] bg-muted border-0 resize-none"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-foreground border-0"
              onClick={() => handleSubmit(replyTo)}
              disabled={loading || !text.trim()}
            >
              {loading ? "Enviando..." : replyTo ? "Responder" : "Comentar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(id) => { setReplyTo(id); }}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  depth = 0,
}: {
  comment: Comment;
  onReply: (id: string) => void;
  depth?: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes_count);

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className={cn("space-y-2", depth > 0 && "ml-8 border-l-2 border-border pl-4")}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/80 text-xs font-medium text-white">
          {comment.author.display_name?.[0]?.toUpperCase() || comment.author.username[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.author.display_name || comment.author.username}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <p className="mt-1 text-sm text-foreground/90">{comment.content}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 gap-1 text-xs text-muted-foreground px-2", liked && "text-[var(--accent-like)]")}
              onClick={() => { setLiked(!liked); setLikes(l => liked ? l - 1 : l + 1); }}
            >
              <Heart className={cn("h-3 w-3", liked && "fill-current")} />
              {likes > 0 && likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground px-2"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="h-3 w-3" />
              Responder
            </Button>
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  );
}
