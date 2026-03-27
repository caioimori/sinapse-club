"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, MessageCircle, Bookmark, Share2, Globe, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface PostAuthor {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
}

interface PostCardProps {
  id: string;
  title: string | null;
  content: string;
  type: string;
  author: PostAuthor;
  space: { name: string; slug: string; icon: string | null };
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_liked?: boolean;
  is_saved?: boolean;
  // curated-specific
  source?: string | null;
  source_url?: string | null;
  original_text?: string | null;
  translated_text?: string | null;
}

const sourceIcons: Record<string, string> = {
  x: "𝕏",
  reddit: "🤖",
  rss: "📄",
  docs: "📄",
  youtube: "🎥",
  newsletter: "📧",
};

export function PostCard({
  id,
  title,
  content,
  type,
  author,
  space,
  likes_count,
  comments_count,
  created_at,
  is_liked = false,
  is_saved = false,
  source,
  source_url,
  original_text,
  translated_text,
}: PostCardProps) {
  const [liked, setLiked] = useState(is_liked);
  const [saved, setSaved] = useState(is_saved);
  const [likes, setLikes] = useState(likes_count);
  const [showOriginal, setShowOriginal] = useState(false);
  const supabase = createClient();

  async function toggleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      await (supabase as any).from("reactions").insert({
        user_id: (await supabase.auth.getUser()).data.user!.id,
        target_type: "post",
        target_id: id,
        type: "like",
      });
    } else {
      await (supabase as any)
        .from("reactions")
        .delete()
        .match({ target_type: "post", target_id: id, type: "like" });
    }
  }

  async function toggleSave() {
    const newSaved = !saved;
    setSaved(newSaved);

    if (newSaved) {
      await (supabase as any).from("reactions").insert({
        user_id: (await supabase.auth.getUser()).data.user!.id,
        target_type: "post",
        target_id: id,
        type: "save",
      });
    } else {
      await (supabase as any)
        .from("reactions")
        .delete()
        .match({ target_type: "post", target_id: id, type: "save" });
    }
  }

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const displayContent = type === "curated" && showOriginal && original_text
    ? original_text
    : type === "curated" && translated_text
      ? translated_text
      : content;

  return (
    <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sinapse-purple-600 text-sm font-medium text-white">
            {author.avatar_url ? (
              <img src={author.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              author.display_name?.[0]?.toUpperCase() || author.username[0].toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{author.display_name || author.username}</span>
              <span className="text-xs text-muted-foreground">@{author.username}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {space.icon} {space.name}
              </Badge>
              {type === "curated" && source && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  {sourceIcons[source] || "📰"} {source.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      {title && (
        <Link href={`/posts/${id}`}>
          <h3 className="mb-2 text-lg font-semibold hover:text-sinapse-purple-400 transition-colors">
            {title}
          </h3>
        </Link>
      )}

      {/* Content */}
      <div
        className="prose prose-invert prose-sm max-w-none mb-4 line-clamp-6"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />

      {/* Translation toggle */}
      {type === "curated" && translated_text && original_text && (
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="mb-3 flex items-center gap-1.5 text-xs text-sinapse-cyan-400 hover:underline"
        >
          <Globe className="h-3 w-3" />
          {showOriginal ? "Ver tradução (PT-BR)" : "Ver original (EN)"}
        </button>
      )}

      {/* Source link */}
      {source_url && (
        <a
          href={source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-sinapse-cyan-400"
        >
          ↗ Fonte original
        </a>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 border-t border-border pt-3 -mx-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5 text-muted-foreground", liked && "text-rose-500")}
          onClick={toggleLike}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          <span className="text-xs">{likes}</span>
        </Button>
        <Link href={`/posts/${id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments_count}</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5 text-muted-foreground", saved && "text-sinapse-cyan-400")}
          onClick={toggleSave}
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground ml-auto">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
