import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MessageSquare,
  Eye,
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
    <Link
      href={`/forum/thread/${thread.id}`}
      className="group flex items-start gap-3 border-b border-[var(--border-subtle)] px-3 py-3 transition-colors duration-200 hover:bg-[var(--surface-default)]"
    >
      {/* Avatar */}
      <Avatar size="default" className="mt-0.5 flex-shrink-0">
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
        {/* Title row */}
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
          <h3
            className="font-semibold text-sm text-foreground group-hover:text-foreground/80 truncate"
            style={{ letterSpacing: "var(--tracking-heading)" }}
          >
            {thread.title || "Sem titulo"}
          </h3>
        </div>

        {/* Meta row */}
        <div className="mt-1 flex items-center gap-1.5 flex-wrap text-xs" style={{ color: "var(--text-secondary)" }}>
          <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
            {authorName}
          </span>
          {thread.author.professional_role && (
            <CargoBadge
              cluster={thread.author.professional_role.cluster}
              roleName={thread.author.professional_role.name}
              size="sm"
            />
          )}
          <span style={{ color: "var(--text-tertiary)" }}>·</span>
          <span style={{ color: "var(--text-tertiary)" }}>{timeAgo}</span>

          {/* Subcategory */}
          {thread.subcategory && (
            <>
              <span style={{ color: "var(--text-tertiary)" }}>·</span>
              <span style={{ color: "var(--text-tertiary)" }}>{thread.subcategory.name}</span>
            </>
          )}

          {/* Category (on home page) */}
          {showCategory && thread.category && (
            <>
              <span style={{ color: "var(--text-tertiary)" }}>·</span>
              <span className="inline-flex items-center gap-1">
                <span
                  className="h-1.5 w-1.5 rounded-full inline-block"
                  style={{ backgroundColor: thread.category.color || "#71717A" }}
                />
                <span style={{ color: "var(--text-tertiary)" }}>{thread.category.name}</span>
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {thread.tags.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1 flex-wrap">
            {thread.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-muted px-2 py-0 text-[10px] font-medium text-muted-foreground"
                style={{ borderRadius: "var(--radius-badge)" }}
              >
                {tag}
              </span>
            ))}
            {thread.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{thread.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats (right side) */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs pt-0.5" style={{ color: "var(--text-tertiary)" }}>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          <span className="tabular-nums">{thread.replies_count}</span>
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span className="tabular-nums">{thread.views_count}</span>
        </span>
      </div>
    </Link>
  );
}
