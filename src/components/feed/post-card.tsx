"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Globe,
  MoreHorizontal,
  Bookmark,
  ExternalLink,
  UserPlus,
  UserMinus,
  Trash2,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { UserRankBadge } from "@/components/user-rank-badge";

interface PostAuthor {
  id?: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  reputation?: number;
}

interface QuotedPost {
  id: string;
  title: string | null;
  content: string;
  author: PostAuthor;
  created_at: string;
}

export interface PostCardProps {
  id: string;
  title: string | null;
  content: string;
  type: string;
  author: PostAuthor;
  space?: { name: string; slug: string; icon: string | null };
  likes_count: number;
  comments_count: number;
  reposts_count?: number;
  replies_count?: number;
  created_at: string;
  is_liked?: boolean;
  is_saved?: boolean;
  is_reposted?: boolean;
  // curated-specific
  source?: string | null;
  source_url?: string | null;
  original_text?: string | null;
  translated_text?: string | null;
  // repost/quote
  repost_of?: QuotedPost | null;
  quote_of?: QuotedPost | null;
  // reply context
  reply_to_author?: string | null;
  // display options
  compact?: boolean;
  showSource?: boolean;
  // follow system
  currentUserId?: string;
  isFollowingAuthor?: boolean;
}

const sourceIcons: Record<string, { icon: string; label: string; color: string }> = {
  x: { icon: "\ud835\udd4f", label: "X", color: "text-white" },
  reddit: { icon: "\u2191", label: "Reddit", color: "text-orange-400" },
  rss: { icon: "\u25c9", label: "Blog", color: "text-muted-foreground" },
  docs: { icon: "\u25c9", label: "Docs", color: "text-blue-400" },
  youtube: { icon: "\u25b6", label: "YouTube", color: "text-red-400" },
  newsletter: { icon: "\u2709", label: "Newsletter", color: "text-purple-400" },
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
  reposts_count = 0,
  replies_count = 0,
  created_at,
  is_liked = false,
  is_saved = false,
  is_reposted = false,
  source,
  source_url,
  original_text,
  translated_text,
  repost_of,
  quote_of,
  reply_to_author,
  compact = false,
  showSource = false,
  currentUserId,
  isFollowingAuthor = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(is_liked);
  const [saved, setSaved] = useState(is_saved);
  const [reposted, setReposted] = useState(is_reposted);
  const [likes, setLikes] = useState(likes_count);
  const [reposts, setReposts] = useState(reposts_count);
  const [showOriginal, setShowOriginal] = useState(false);
  const [followingAuthor, setFollowingAuthor] = useState(isFollowingAuthor);
  const supabase = createClient();
  const router = useRouter();

  const isOwnPost = currentUserId && author.id === currentUserId;

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: false,
    locale: ptBR,
  });

  async function toggleLike() {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (!liked) {
      await (supabase as any).from("reactions").insert({ user_id: user.id, target_type: "post", target_id: id, type: "like" });
    } else {
      await (supabase as any).from("reactions").delete().match({ target_type: "post", target_id: id, type: "like", user_id: user.id });
    }
  }

  async function toggleRepost() {
    setReposted(!reposted);
    setReposts((prev) => (reposted ? prev - 1 : prev + 1));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (!reposted) {
      const { data: space } = await (supabase as any).from("spaces").select("id").eq("slug", "ai-news").single();
      if (space) {
        await (supabase as any).from("posts").insert({
          author_id: user.id,
          space_id: space.id,
          content: "",
          type: "repost",
          repost_of: id,
        });
      }
    }
  }

  async function toggleSave() {
    setSaved(!saved);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (!saved) {
      await (supabase as any).from("reactions").insert({ user_id: user.id, target_type: "post", target_id: id, type: "save" });
    } else {
      await (supabase as any).from("reactions").delete().match({ target_type: "post", target_id: id, type: "save", user_id: user.id });
    }
  }

  async function toggleFollowAuthor() {
    if (!author.id) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (followingAuthor) {
      await (supabase as any).from("follows").delete().match({ follower_id: user.id, following_id: author.id });
      setFollowingAuthor(false);
    } else {
      await (supabase as any).from("follows").insert({ follower_id: user.id, following_id: author.id });
      setFollowingAuthor(true);
    }
  }

  async function deletePost() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase as any).from("posts").delete().eq("id", id).eq("author_id", user.id);
    router.refresh();
  }

  async function handleShare() {
    const url = `${window.location.origin}/posts/${id}`;
    if (navigator.share) {
      navigator.share({ title: title || "Post", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  const displayContent = type === "curated" && showOriginal && original_text
    ? original_text
    : type === "curated" && translated_text
      ? translated_text
      : content;

  // Pure repost (no content, just sharing)
  if (type === "repost" && repost_of) {
    return (
      <div className="border-b border-border">
        <div className="flex items-center gap-2 px-4 pt-3 text-xs text-muted-foreground">
          <Repeat2 className="h-3.5 w-3.5" />
          <Link href={`/profile/${author.username}`} className="hover:underline font-medium">
            {author.display_name || author.username}
          </Link>
          <span>repostou</span>
        </div>
        <PostCard {...(repost_of as any)} compact />
      </div>
    );
  }

  return (
    <article className={cn(
      "flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-card/50",
      compact && "border-b-0"
    )}>
      {/* Avatar (left column — Twitter style) */}
      <Link href={`/profile/${author.username}`} className="shrink-0">
        {author.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={author.username}
            className="h-10 w-10 rounded-full object-cover hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-medium text-white hover:opacity-80 transition-opacity">
            {author.display_name?.[0]?.toUpperCase() || author.username[0].toUpperCase()}
          </div>
        )}
      </Link>

      {/* Content (right column) */}
      <div className="flex-1 min-w-0">
        {/* Header line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            <Link href={`/profile/${author.username}`} className="truncate font-semibold text-sm hover:underline">
              {author.display_name || author.username}
            </Link>
            {author.role !== "free" && (
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-border text-muted-foreground">
                {author.role === "admin" ? "ADMIN" : author.role === "instructor" ? "INST" : "PRO"}
              </Badge>
            )}
            <UserRankBadge reputation={author.reputation ?? 0} role={author.role} showRep={false} />
            <span className="text-sm text-muted-foreground truncate">@{author.username}</span>
            <span className="text-muted-foreground">&middot;</span>
            <Link href={`/posts/${id}`} className="text-sm text-muted-foreground hover:underline whitespace-nowrap">
              {timeAgo}
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex h-8 w-8 -mr-2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {!isOwnPost && author.id && (
                <DropdownMenuItem onClick={toggleFollowAuthor}>
                  {followingAuthor ? (
                    <><UserMinus className="h-4 w-4 mr-2" /> Deixar de seguir @{author.username}</>
                  ) : (
                    <><UserPlus className="h-4 w-4 mr-2" /> Seguir @{author.username}</>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" /> Copiar link
              </DropdownMenuItem>
              {!isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-muted-foreground">
                    <Flag className="h-4 w-4 mr-2" /> Denunciar
                  </DropdownMenuItem>
                </>
              )}
              {isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={deletePost} className="text-red-500 focus:text-red-500">
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir post
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reply context */}
        {reply_to_author && (
          <p className="text-sm text-muted-foreground mb-1">
            Respondendo a <Link href={`/profile/${reply_to_author}`} className="text-muted-foreground hover:underline">@{reply_to_author}</Link>
          </p>
        )}

        {/* Source badge — hidden in feed, visible only in post detail page via showSource prop */}
        {type === "curated" && source && showSource && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn("text-xs font-mono", sourceIcons[source]?.color)}>
              {sourceIcons[source]?.icon}
            </span>
            <span className="text-xs text-muted-foreground">
              via {sourceIcons[source]?.label || source}
            </span>
            {source_url && (
              <a href={source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* Title */}
        {title && (
          <Link href={`/posts/${id}`}>
            <h3 className="font-semibold mb-1 hover:underline">{title}</h3>
          </Link>
        )}

        {/* Content */}
        <div
          className={cn(
            "prose dark:prose-invert prose-sm max-w-none",
            "[&_a]:text-muted-foreground [&_code]:text-muted-foreground [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded",
            !compact && "line-clamp-[12]"
          )}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayContent) }}
        />

        {/* Translation toggle */}
        {type === "curated" && translated_text && original_text && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:underline"
          >
            <Globe className="h-3 w-3" />
            {showOriginal ? "Ver traducao (PT-BR)" : "Ver original (EN)"}
          </button>
        )}

        {/* Quoted post */}
        {quote_of && (
          <Link href={`/posts/${quote_of.id}`} className="mt-3 block rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-1 mb-1">
              <div className="h-5 w-5 rounded-full bg-foreground/80 flex items-center justify-center text-[10px] text-white">
                {quote_of.author.display_name?.[0] || quote_of.author.username[0]}
              </div>
              <span className="text-xs font-medium">{quote_of.author.display_name || quote_of.author.username}</span>
              <span className="text-xs text-muted-foreground">@{quote_of.author.username}</span>
            </div>
            {quote_of.title && <p className="text-sm font-medium mb-0.5">{quote_of.title}</p>}
            <div className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: sanitizeHtml(quote_of.content) }} />
          </Link>
        )}

        {/* Action bar (Twitter-style, spread across) */}
        <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
          {/* Reply */}
          <Link href={`/posts/${id}`}>
            <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-muted-foreground transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-foreground/5">
                <MessageCircle className="h-[18px] w-[18px]" />
              </div>
              {(comments_count + replies_count) > 0 && (
                <span className="text-xs">{comments_count + replies_count}</span>
              )}
            </button>
          </Link>

          {/* Repost */}
          <button
            className={cn(
              "group flex items-center gap-1.5 transition-colors",
              reposted ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={toggleRepost}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-foreground/5">
              <Repeat2 className="h-[18px] w-[18px]" />
            </div>
            {reposts > 0 && <span className="text-xs">{reposts}</span>}
          </button>

          {/* Like */}
          <button
            className={cn(
              "group flex items-center gap-1.5 transition-colors",
              liked ? "text-[var(--accent-like)]" : "text-muted-foreground hover:text-[var(--accent-like)]"
            )}
            onClick={toggleLike}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-[var(--accent-like-soft)]">
              <Heart className={cn("h-[18px] w-[18px]", liked && "fill-current")} />
            </div>
            {likes > 0 && <span className="text-xs">{likes}</span>}
          </button>

          {/* Bookmark + Share */}
          <div className="flex items-center">
            <button
              className={cn(
                "group flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                saved ? "text-muted-foreground" : "text-muted-foreground hover:text-muted-foreground"
              )}
              onClick={toggleSave}
            >
              <Bookmark className={cn("h-[18px] w-[18px]", saved && "fill-current")} />
            </button>
            <button
              className="group flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-muted-foreground transition-colors"
              onClick={handleShare}
            >
              <Share className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
