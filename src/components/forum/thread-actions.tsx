"use client";

import { useState } from "react";
import { Heart, Bookmark, Share2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ThreadActionsProps {
  threadId: string;
  currentUserId?: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export function ThreadActions({
  threadId,
  currentUserId,
  likesCount,
  isLiked: initialLiked,
  isSaved: initialSaved,
}: ThreadActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likesCount);
  const [saved, setSaved] = useState(initialSaved);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  async function handleLike() {
    if (!currentUserId) return;
    setLiked(!liked);
    setLikes((l) => (liked ? l - 1 : l + 1));

    if (!liked) {
      await (supabase as any).from("reactions").insert({
        user_id: currentUserId,
        target_type: "post",
        target_id: threadId,
        type: "like",
      });
    } else {
      await (supabase as any)
        .from("reactions")
        .delete()
        .eq("user_id", currentUserId)
        .eq("target_type", "post")
        .eq("target_id", threadId)
        .eq("type", "like");
    }
  }

  async function handleSave() {
    if (!currentUserId) return;
    setSaved(!saved);

    if (!saved) {
      await (supabase as any).from("reactions").insert({
        user_id: currentUserId,
        target_type: "post",
        target_id: threadId,
        type: "save",
      });
    } else {
      await (supabase as any)
        .from("reactions")
        .delete()
        .eq("user_id", currentUserId)
        .eq("target_type", "post")
        .eq("target_id", threadId)
        .eq("type", "save");
    }
  }

  function handleShare() {
    const url = `${window.location.origin}/forum/thread/${threadId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 gap-1.5 text-xs text-muted-foreground px-2.5",
          liked && "text-rose-500"
        )}
        onClick={handleLike}
      >
        <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
        {likes > 0 && <span className="tabular-nums">{likes}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 gap-1.5 text-xs text-muted-foreground px-2.5",
          saved && "text-foreground"
        )}
        onClick={handleSave}
      >
        <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
        Salvar
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-xs text-muted-foreground px-2.5"
        onClick={handleShare}
      >
        {copied ? (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Copiado!
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5" />
            Compartilhar
          </>
        )}
      </Button>
    </div>
  );
}
