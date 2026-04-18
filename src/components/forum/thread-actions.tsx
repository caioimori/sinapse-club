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
  savesCount?: number;
  sharesCount?: number;
  isLiked: boolean;
  isSaved: boolean;
}

export function ThreadActions({
  threadId,
  currentUserId,
  likesCount,
  savesCount = 0,
  sharesCount = 0,
  isLiked: initialLiked,
  isSaved: initialSaved,
}: ThreadActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likesCount);
  const [saved, setSaved] = useState(initialSaved);
  const [saves, setSaves] = useState(savesCount);
  const [shares, setShares] = useState(sharesCount);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  async function handleLike() {
    if (!currentUserId) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((l) => (wasLiked ? Math.max(0, l - 1) : l + 1));

    try {
      if (!wasLiked) {
        const { error } = await (supabase as any).from("reactions").insert({
          user_id: currentUserId,
          target_type: "post",
          target_id: threadId,
          type: "like",
        });
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("reactions")
          .delete()
          .eq("user_id", currentUserId)
          .eq("target_type", "post")
          .eq("target_id", threadId)
          .eq("type", "like");
        if (error) throw error;
      }
    } catch {
      // Rollback on failure (e.g., bot account, RLS block)
      setLiked(wasLiked);
      setLikes((l) => (wasLiked ? l + 1 : Math.max(0, l - 1)));
    }
  }

  async function handleSave() {
    if (!currentUserId) return;
    const wasSaved = saved;
    setSaved(!wasSaved);
    setSaves((s) => (wasSaved ? Math.max(0, s - 1) : s + 1));

    try {
      if (!wasSaved) {
        const { error } = await (supabase as any).from("reactions").insert({
          user_id: currentUserId,
          target_type: "post",
          target_id: threadId,
          type: "save",
        });
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("reactions")
          .delete()
          .eq("user_id", currentUserId)
          .eq("target_type", "post")
          .eq("target_id", threadId)
          .eq("type", "save");
        if (error) throw error;
      }
    } catch {
      setSaved(wasSaved);
      setSaves((s) => (wasSaved ? s + 1 : Math.max(0, s - 1)));
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/forum/thread/${threadId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignora erro de clipboard (browser sem permissao)
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Persiste share (idempotente por unique constraint — duplicar nao conta 2x)
    if (currentUserId) {
      const prevShares = shares;
      setShares((s) => s + 1);
      const { error } = await (supabase as any).from("reactions").insert({
        user_id: currentUserId,
        target_type: "post",
        target_id: threadId,
        type: "share",
      });
      // Se duplicado (unique violation) nao incrementa
      if (error) {
        setShares(prevShares);
      }
    }
  }

  return (
    <div className="flex items-center gap-1" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 gap-1.5 text-xs text-muted-foreground px-2.5",
          liked && "text-[var(--accent-like)]"
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
        {saves > 0 ? <span className="tabular-nums">{saves}</span> : "Salvar"}
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
            {shares > 0 ? <span className="tabular-nums">{shares}</span> : "Compartilhar"}
          </>
        )}
      </Button>
    </div>
  );
}
