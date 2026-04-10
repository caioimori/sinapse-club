"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, Reply, CheckCircle2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { UserRankBadge } from "@/components/user-rank-badge";
import { sanitizeHtml } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { ProfessionalCluster } from "@/types/database";
import { updateReply, deleteReply, reportContent, adminDeleteReply } from "@/app/(dashboard)/forum/actions";

export interface ReplyAuthor {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  reputation?: number;
  role?: string;
  professional_role?: {
    name: string;
    cluster: ProfessionalCluster;
  } | null;
}

export interface ReplyData {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  parent_id: string | null;
  is_solution?: boolean;
  author: ReplyAuthor;
  replies?: ReplyData[];
}

interface ThreadReplyProps {
  reply: ReplyData;
  threadId: string;
  threadAuthorId: string;
  currentUserId?: string;
  currentUserRole?: string;
  isSolved: boolean;
  depth?: number;
  likedCommentIds?: string[];
}

export function ThreadReply({
  reply,
  threadId,
  threadAuthorId,
  currentUserId,
  currentUserRole,
  isSolved,
  depth = 0,
  likedCommentIds = [],
}: ThreadReplyProps) {
  const [liked, setLiked] = useState(() => likedCommentIds.includes(reply.id));
  const [likes, setLikes] = useState(reply.likes_count);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [markingAsSolution, setMarkingAsSolution] = useState(false);
  // Edit/Delete/Report menu state
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [editLoading, setEditLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const isOwner = !!currentUserId && currentUserId === reply.author.id;
  const isAdmin = currentUserRole === 'admin';

  const timeAgo = formatDistanceToNow(new Date(reply.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const authorName = reply.author.display_name || reply.author.username;
  const authorInitial = authorName[0]?.toUpperCase() || "?";

  const canMarkAsSolution =
    currentUserId === threadAuthorId && !isSolved && depth === 0;

  async function handleLike() {
    if (!currentUserId) return;
    setLiked(!liked);
    setLikes((l) => (liked ? l - 1 : l + 1));

    if (!liked) {
      await (supabase as any).from("reactions").insert({
        user_id: currentUserId,
        target_type: "comment",
        target_id: reply.id,
        type: "like",
      });
    } else {
      await (supabase as any)
        .from("reactions")
        .delete()
        .eq("user_id", currentUserId)
        .eq("target_type", "comment")
        .eq("target_id", reply.id)
        .eq("type", "like");
    }
  }

  async function handleReplySubmit() {
    if (!replyText.trim()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    await (supabase as any).from("comments").insert({
      post_id: threadId,
      author_id: user.id,
      parent_id: reply.id,
      content: replyText.trim(),
    });

    setReplyText("");
    setShowReplyForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleMarkAsSolution() {
    setMarkingAsSolution(true);
    await (supabase as any)
      .from("posts")
      .update({ is_solved: true })
      .eq("id", threadId);
    setMarkingAsSolution(false);
    router.refresh();
  }

  async function handleEditSave() {
    if (!editText.trim()) return;
    setEditLoading(true);
    try {
      await updateReply(reply.id, editText.trim());
      setIsEditing(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Excluir resposta?')) return;
    try {
      if (isAdmin && !isOwner) {
        await adminDeleteReply(reply.id);
      } else {
        await deleteReply(reply.id);
      }
      setDeleted(true);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleReport() {
    try {
      await reportContent(undefined, reply.id);
      alert('Conteúdo reportado.');
    } catch (e) {
      console.error(e);
    }
    setShowMenu(false);
  }

  if (deleted) return null;

  return (
    <div
      className={cn(
        "space-y-3",
        depth > 0 && "ml-8 pl-4"
      )}
      style={depth > 0 ? { borderLeft: "2px solid var(--border-subtle)" } : undefined}
    >
      <div className="flex items-start gap-3">
        <Avatar size="default" className="mt-0.5 flex-shrink-0">
          {reply.author.avatar_url ? (
            <AvatarImage src={reply.author.avatar_url} alt={authorName} />
          ) : null}
          <AvatarFallback>{authorInitial}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Author info row with kebab menu */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-sm font-medium text-foreground">
                {authorName}
              </span>
              {reply.author.professional_role && (
                <CargoBadge
                  cluster={reply.author.professional_role.cluster}
                  roleName={reply.author.professional_role.name}
                  size="sm"
                />
              )}
              <UserRankBadge
                reputation={reply.author.reputation ?? 0}
                role={reply.author.role ?? "free"}
                showRep={false}
              />
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            {/* Kebab menu — show for owner or admin */}
            {(isOwner || isAdmin || !!currentUserId) && (
              <div className="relative flex-shrink-0" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-6 bg-zinc-900 border border-zinc-800 rounded-lg py-1 z-10 min-w-32 shadow-xl">
                    {isOwner && (
                      <button
                        onClick={() => { setIsEditing(true); setShowMenu(false); }}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-800 text-zinc-300"
                      >
                        Editar
                      </button>
                    )}
                    {(isOwner || isAdmin) && (
                      <button
                        onClick={() => { handleDelete(); setShowMenu(false); }}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-800 text-red-400"
                      >
                        {isAdmin && !isOwner ? 'Excluir (Admin)' : 'Excluir'}
                      </button>
                    )}
                    {currentUserId && !isOwner && (
                      <button
                        onClick={handleReport}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-800 text-zinc-400"
                      >
                        Reportar
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Solution badge */}
          {reply.is_solution && (
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Solução aceita
            </div>
          )}

          {/* Content or Edit form */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[80px] bg-muted border-0 resize-none text-sm"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs bg-foreground border-0"
                  onClick={handleEditSave}
                  disabled={editLoading || !editText.trim()}
                >
                  {editLoading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => { setIsEditing(false); setEditText(reply.content); }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="mt-1.5 text-sm text-foreground/90 prose dark:prose-invert prose-sm max-w-none [&_a]:text-muted-foreground [&_a]:underline [&_pre]:bg-muted [&_pre]:border [&_pre]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(reply.content) }}
            />
          )}

          {/* Actions bar */}
          <div className="mt-2 flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs text-muted-foreground px-2",
                liked && "text-rose-500"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-3 w-3", liked && "fill-current")} />
              {likes > 0 && likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground px-2"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3 w-3" />
              Responder
            </Button>
            {canMarkAsSolution && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-emerald-600 dark:text-emerald-400 px-2 hover:bg-emerald-500/10"
                onClick={handleMarkAsSolution}
                disabled={markingAsSolution}
              >
                <CheckCircle2 className="h-3 w-3" />
                {markingAsSolution ? "..." : "Marcar como solução"}
              </Button>
            )}
          </div>

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-2 space-y-2">
              <Textarea
                placeholder={`Responder ${authorName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] bg-muted border-0 resize-none text-sm"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs bg-foreground border-0"
                  onClick={handleReplySubmit}
                  disabled={loading || !replyText.trim()}
                >
                  {loading ? "Enviando..." : "Responder"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {reply.replies?.map((nested) => (
        <ThreadReply
          key={nested.id}
          reply={nested}
          threadId={threadId}
          threadAuthorId={threadAuthorId}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          isSolved={isSolved}
          depth={depth + 1}
          likedCommentIds={likedCommentIds}
        />
      ))}
    </div>
  );
}
