"use client";

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
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import type { ProfessionalCluster } from "@/types/database";

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
  is_sticky: boolean;
  is_solved: boolean;
  replies_count: number;
  views_count: number;
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

export function ThreadListItem({ thread, showCategory = false }: ThreadListItemProps) {
  const timeRef = thread.last_reply_at || thread.created_at;
  const timeAgo = formatDistanceToNow(new Date(timeRef), {
    addSuffix: true,
    locale: ptBR,
  });

  const authorName = thread.author.display_name || thread.author.username;
  const authorInitial = authorName[0]?.toUpperCase() || "?";

  return (
    <div className="group border-b border-[var(--border-subtle)] transition-colors duration-200 hover:bg-[var(--surface-default)]">
      <Link
        href={`/forum/thread/${thread.id}`}
        className="flex items-start gap-3 px-4 py-3"
      >
        {/* Avatar */}
        <Avatar size="default" className="mt-0.5 flex-shrink-0 h-12 w-12">
          {thread.author.avatar_url ? (
            <AvatarImage
              src={thread.author.avatar_url}
              alt={authorName}
            />
          ) : null}
          <AvatarFallback>{authorInitial}</AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: Author info */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-bold text-foreground hover:underline">{authorName}</span>
            {thread.author.professional_role && (
              <CargoBadge
                cluster={thread.author.professional_role.cluster}
                roleName={thread.author.professional_role.name}
                size="sm"
              />
            )}
            <span className="text-muted-foreground">@{thread.author.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>

          {/* Badges */}
          {(thread.is_sticky || thread.is_solved) && (
            <div className="mt-1 flex items-center gap-1.5">
              {thread.is_sticky && (
                <span
                  className="inline-flex items-center gap-0.5 bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  style={{ borderRadius: "var(--radius-badge)" }}
                >
                  <Pin className="h-2.5 w-2.5" />
                  FIXADO
                </span>
              )}
              {thread.is_solved && (
                <span
                  className="inline-flex items-center gap-0.5 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                  style={{ borderRadius: "var(--radius-badge)" }}
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  RESOLVIDO
                </span>
              )}
            </div>
          )}

          {/* Thread title */}
          <h3 className="mt-2 text-base text-foreground font-medium leading-normal">
            {thread.title || "Sem titulo"}
          </h3>

          {/* Category badge */}
          {showCategory && thread.category && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-[var(--border-subtle)]">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: thread.category.color || "#71717A" }}
              />
              <span className="text-xs text-muted-foreground">{thread.category.name}</span>
            </div>
          )}

          {/* Tags */}
          {thread.tags.length > 0 && (
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              {thread.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {thread.tags.length > 3 && (
                <span className="text-[11px] text-muted-foreground">
                  +{thread.tags.length - 3} mais
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex justify-between max-w-xs text-muted-foreground">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="group/action flex items-center gap-2 text-xs hover:text-blue-500 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="group-hover/action:opacity-100 opacity-0 text-xs">{thread.replies_count}</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="group/action flex items-center gap-2 text-xs hover:text-green-500 transition-colors"
            >
              <Repeat2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="group/action flex items-center gap-2 text-xs hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="group/action flex items-center gap-2 text-xs hover:text-blue-500 transition-colors"
            >
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
