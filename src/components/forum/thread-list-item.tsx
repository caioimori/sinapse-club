"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MessageSquare,
  Heart,
  Share,
  Repeat2,
  Pin,
  CheckCircle2,
  BarChart2,
  Link2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import type { ProfessionalCluster } from "@/types/database";

const URL_REGEX = /https?:\/\/[^\s<>"']+/g;

function renderTextWithLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-foreground underline hover:text-foreground/80 transition-colors"
      >
        {url}
      </a>
    );
    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export interface ThreadAuthor {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  professional_role?: {
    name: string;
    cluster: ProfessionalCluster;
  } | null;
}

export interface ThreadSubcategory {
  slug: string;
  name: string;
}

export interface ThreadData {
  id: string;
  title: string | null;
  content_plain?: string | null;
  image_url?: string | null;
  is_sticky: boolean;
  is_solved: boolean;
  replies_count: number;
  views_count: number;
  likes_count?: number;
  reposts_count?: number;
  is_reposted?: boolean;
  repost_of?: string | null;
  repost_author?: {
    username: string;
    display_name: string | null;
  } | null;
  tags: string[];
  created_at: string;
  last_reply_at: string | null;
  author: ThreadAuthor;
  subcategory?: ThreadSubcategory | null;
  category?: {
    slug: string;
    name: string;
    icon: string | null;
    color: string | null;
  } | null;
}

interface ThreadListItemProps {
  thread: ThreadData;
  showCategory?: boolean;
}

const PREVIEW_LENGTH = 600;

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return n > 0 ? String(n) : "";
}

export function ThreadListItem({ thread, showCategory = false }: ThreadListItemProps) {
  const router = useRouter();
  const supabase = createClient();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(thread.likes_count ?? 0);
  const [reposted, setReposted] = useState(thread.is_reposted ?? false);
  const [repostsCount, setRepostsCount] = useState(thread.reposts_count ?? 0);
  const [copied, setCopied] = useState(false);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(true);
  }, []);

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (liked) {
      setLiked(false);
      setLikesCount(c => Math.max(0, c - 1));
      await supabase.from("reactions").delete()
        .eq("user_id", user.id).eq("target_id", thread.id).eq("target_type", "post").eq("type", "like");
    } else {
      setLiked(true);
      setLikesCount(c => c + 1);
      await (supabase as any).from("reactions").insert({
        user_id: user.id,
        target_id: thread.id,
        target_type: "post",
        type: "like",
      });
    }
  }

  async function handleRepost(e: React.MouseEvent) {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (reposted) {
      setReposted(false);
      setRepostsCount(c => Math.max(0, c - 1));
      await (supabase as any)
        .from("posts")
        .delete()
        .eq("author_id", user.id)
        .eq("repost_of", thread.id)
        .eq("type", "thread");
    } else {
      setReposted(true);
      setRepostsCount(c => c + 1);
      await (supabase as any)
        .from("posts")
        .insert({
          author_id: user.id,
          type: "thread",
          repost_of: thread.id,
          content: "",
          content_plain: "",
          title: null,
          tags: [],
        });
    }
  }

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}/forum/thread/${thread.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const timeRef = thread.last_reply_at || thread.created_at;
  const timeAgo = formatDistanceToNow(new Date(timeRef), {
    addSuffix: true,
    locale: ptBR,
  });

  const authorName = thread.author.display_name || thread.author.username;
  const authorInitial = authorName[0]?.toUpperCase() || "?";

  const content = thread.content_plain || "";
  const hasExplicitTitle =
    thread.title &&
    content &&
    !content.startsWith(thread.title.substring(0, 50));

  const needsExpansion = content.length > PREVIEW_LENGTH;
  const displayContent =
    expanded || !needsExpansion ? content : content.substring(0, PREVIEW_LENGTH);

  return (
    <article
      onClick={() => router.push(`/forum/thread/${thread.id}`)}
      className="border-b border-[var(--border-subtle)] hover:bg-accent/30 transition-colors duration-150 cursor-pointer"
    >
      {thread.repost_of && (
        <div className="flex items-center gap-1.5 px-4 pt-2 text-xs text-muted-foreground">
          <Repeat2 className="h-3 w-3" />
          <span>{thread.repost_author?.display_name || thread.repost_author?.username || "Alguém"} repostou</span>
        </div>
      )}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Avatar */}
        <Link
          href={`/profile/${thread.author.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 mt-0.5"
        >
          <Avatar className="h-10 w-10">
            {thread.author.avatar_url ? (
              <AvatarImage src={thread.author.avatar_url} alt={authorName} />
            ) : null}
            <AvatarFallback>{authorInitial}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1.5 flex-wrap text-sm leading-snug">
            <Link
              href={`/profile/${thread.author.username}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-foreground hover:underline"
            >
              {authorName}
            </Link>
            {thread.author.professional_role && (
              <span onClick={(e) => e.stopPropagation()}>
                <CargoBadge
                  cluster={thread.author.professional_role.cluster}
                  roleName={thread.author.professional_role.name}
                  size="sm"
                />
              </span>
            )}
            <span className="text-muted-foreground">@{thread.author.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>

          {/* Status badges */}
          {(thread.is_sticky || thread.is_solved) && (
            <div className="mt-1 flex items-center gap-1.5">
              {thread.is_sticky && (
                <span className="inline-flex items-center gap-0.5 bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground rounded">
                  <Pin className="h-2.5 w-2.5" />
                  FIXADO
                </span>
              )}
              {thread.is_solved && (
                <span className="inline-flex items-center gap-0.5 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 rounded">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  RESOLVIDO
                </span>
              )}
            </div>
          )}

          {/* Title (only if explicitly set) */}
          {hasExplicitTitle && (
            <p className="mt-0.5 text-base font-semibold text-foreground leading-snug">
              {thread.title}
            </p>
          )}

          {/* Body */}
          {content && (
            <div className="mt-0.5">
              <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {renderTextWithLinks(displayContent)}
                {needsExpansion && !expanded && "…"}
              </p>
              {needsExpansion && !expanded && (
                <span
                  onClick={handleExpand}
                  className="mt-0.5 inline-block text-sm text-muted-foreground hover:underline cursor-pointer transition-colors"
                >
                  Mostrar mais
                </span>
              )}
            </div>
          )}

          {/* Image */}
          {thread.image_url && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[var(--border-subtle)] relative aspect-video">
              <Image
                src={thread.image_url}
                alt="Imagem do post"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}

          {/* Category badge */}
          {showCategory && thread.category && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: thread.category.color || "#71717A" }}
              />
              <span className="text-[11px] text-muted-foreground">
                {thread.category.icon && `${thread.category.icon} `}{thread.category.name}
              </span>
            </div>
          )}

          {/* Actions — Twitter style */}
          <div
            className="mt-3 flex items-center justify-between max-w-[340px] text-muted-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reply */}
            <button className="group flex items-center gap-1.5 text-[13px] hover:text-foreground transition-colors">
              <span className="flex items-center justify-center h-8 w-8 rounded-full group-hover:bg-foreground/8 transition-colors">
                <MessageSquare className="h-[18px] w-[18px]" />
              </span>
              {thread.replies_count > 0 && (
                <span>{formatCount(thread.replies_count)}</span>
              )}
            </button>

            {/* Repost */}
            <button
              onClick={handleRepost}
              className={cn("group flex items-center gap-1.5 text-[13px] transition-colors", reposted ? "text-emerald-500" : "hover:text-emerald-500")}
            >
              <span className={cn("flex items-center justify-center h-8 w-8 rounded-full transition-colors", reposted ? "bg-emerald-500/10" : "group-hover:bg-emerald-500/10")}>
                <Repeat2 className="h-[18px] w-[18px]" />
              </span>
              {repostsCount > 0 && <span>{formatCount(repostsCount)}</span>}
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={cn("group flex items-center gap-1.5 text-[13px] transition-colors", liked ? "text-rose-500" : "hover:text-rose-500")}
            >
              <span className={cn("flex items-center justify-center h-8 w-8 rounded-full transition-colors", liked ? "bg-rose-500/10" : "group-hover:bg-rose-500/10")}>
                <Heart className={cn("h-[18px] w-[18px]", liked && "fill-rose-500")} />
              </span>
              {likesCount > 0 && <span>{formatCount(likesCount)}</span>}
            </button>

            {/* Views */}
            <button className="group flex items-center gap-1.5 text-[13px] hover:text-foreground transition-colors">
              <span className="flex items-center justify-center h-8 w-8 rounded-full group-hover:bg-foreground/8 transition-colors">
                <BarChart2 className="h-[18px] w-[18px]" />
              </span>
              {thread.views_count > 0 && (
                <span>{formatCount(thread.views_count)}</span>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className={cn("group flex items-center gap-1.5 text-[13px] transition-colors", copied ? "text-foreground" : "hover:text-foreground")}
            >
              <span className="flex items-center justify-center h-8 w-8 rounded-full group-hover:bg-foreground/8 transition-colors">
                {copied ? <Link2 className="h-[18px] w-[18px]" /> : <Share className="h-[18px] w-[18px]" />}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
