import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Pin,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { UserRankBadge } from "@/components/user-rank-badge";
import type { ProfessionalCluster } from "@/types/database";
import { sanitizeHtml } from "@/lib/sanitize";

export interface ThreadDetailAuthor {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  reputation?: number;
  role?: string;
  headline: string | null;
  company: string | null;
  professional_role?: {
    name: string;
    cluster: ProfessionalCluster;
  } | null;
}

export interface ThreadDetailCategory {
  slug: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface ThreadDetailSubcategory {
  slug: string;
  name: string;
}

export interface ThreadDetailData {
  id: string;
  title: string | null;
  content: string;
  image_url: string | null;
  is_sticky: boolean;
  is_solved: boolean;
  is_locked: boolean;
  likes_count: number;
  replies_count: number;
  views_count: number;
  tags: string[];
  created_at: string;
  author: ThreadDetailAuthor;
  category: ThreadDetailCategory | null;
  subcategory: ThreadDetailSubcategory | null;
}

interface ThreadDetailProps {
  thread: ThreadDetailData;
}

export function ThreadDetail({ thread }: ThreadDetailProps) {
  const timeAgo = formatDistanceToNow(new Date(thread.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const authorName =
    thread.author.display_name || thread.author.username;
  const authorInitial = authorName[0]?.toUpperCase() || "?";

  return (
    <article
      className="space-y-4 p-5"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur) var(--glass-saturate)",
        WebkitBackdropFilter: "var(--glass-blur) var(--glass-saturate)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      {/* Author header */}
      <div className="flex items-start gap-3">
        <Avatar size="lg" className="mt-0.5 flex-shrink-0 ring-1 ring-border">
          {thread.author.avatar_url ? (
            <AvatarImage
              src={thread.author.avatar_url}
              alt={authorName}
            />
          ) : null}
          <AvatarFallback>{authorInitial}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
              {authorName}
            </span>
            {thread.author.professional_role && (
              <CargoBadge
                cluster={thread.author.professional_role.cluster}
                roleName={thread.author.professional_role.name}
                size="sm"
              />
            )}
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {timeAgo}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
            {thread.author.headline && (
              <span>{thread.author.headline}</span>
            )}
            {thread.author.headline && <span>·</span>}
            <UserRankBadge
              reputation={thread.author.reputation ?? 0}
              role={thread.author.role ?? "free"}
              showRep
            />
          </div>
        </div>
      </div>

      {/* Title with badges */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {thread.is_sticky && (
            <span
              className="inline-flex items-center gap-0.5 bg-muted px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
              style={{ borderRadius: "var(--radius-badge)" }}
            >
              <Pin className="h-2.5 w-2.5" />
              FIXADO
            </span>
          )}
          {thread.is_solved && (
            <span
              className="inline-flex items-center gap-0.5 border border-emerald-500/30 px-1.5 py-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
              style={{ borderRadius: "var(--radius-badge)" }}
            >
              <CheckCircle2 className="h-2.5 w-2.5" />
              RESOLVIDO
            </span>
          )}
        </div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ letterSpacing: "var(--tracking-heading)" }}
        >
          {thread.title || "Sem titulo"}
        </h1>
      </div>

      {/* Body (rendered HTML) */}
      <div
        className="prose dark:prose-invert prose-sm max-w-none text-foreground/90 [&_a]:text-muted-foreground [&_a]:underline [&_pre]:bg-muted [&_pre]:border [&_pre]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_blockquote]:border-border"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(thread.content) }}
      />

      {/* Image (Twitter-style: natural aspect, rounded, no crop) */}
      {thread.image_url && (
        <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thread.image_url}
            alt="Imagem do post"
            className="w-full max-h-[680px] object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Tags */}
      {thread.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {thread.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              style={{ borderRadius: "var(--radius-badge)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats bar */}
      <div
        className="flex items-center gap-3 pt-3 text-xs"
        style={{
          color: "var(--text-tertiary)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <span className="tabular-nums">
          {thread.replies_count}{" "}
          {thread.replies_count === 1 ? "resposta" : "respostas"}
        </span>
        <span className="flex items-center gap-1 tabular-nums">
          <Eye className="h-3 w-3" />
          {thread.views_count}
        </span>
      </div>
    </article>
  );
}
