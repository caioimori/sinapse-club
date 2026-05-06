"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { updatePost, deletePost, reportContent, adminDeletePost } from "@/app/(dashboard)/forum/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TITLE_MAX = 200;
const CONTENT_MAX = 5000;

interface ThreadHeaderMenuProps {
  threadId: string;
  authorId: string;
  title: string;
  content: string;
  currentUserId?: string;
  currentUserRole?: string;
}

export function ThreadHeaderMenu({
  threadId,
  authorId,
  title,
  content,
  currentUserId,
  currentUserRole,
}: ThreadHeaderMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isOwner = !!currentUserId && currentUserId === authorId;
  const isAdmin = currentUserRole === "admin";

  // ── Click outside fecha o menu ─────────────────────────────────
  useEffect(() => {
    if (!showMenu) return;
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [showMenu]);

  // ── Esc fecha o edit modal ─────────────────────────────────────
  useEffect(() => {
    if (!isEditing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cancelEdit();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Sem usuário logado → menu não existe
  if (!currentUserId) return null;
  // Owner OU admin OU qualquer user logado (que não seja owner) podem ver alguma ação
  // (owner: editar/excluir; admin: excluir; outros logados: reportar)

  function cancelEdit() {
    setIsEditing(false);
    setEditTitle(title);
    setEditContent(content);
  }

  async function handleEditSave() {
    const tt = editTitle.trim();
    const cc = editContent.trim();
    if (!tt || !cc) {
      toast.error("Título e conteúdo são obrigatórios.");
      return;
    }
    if (tt.length > TITLE_MAX || cc.length > CONTENT_MAX) {
      toast.error("Texto excedeu o tamanho máximo.");
      return;
    }
    setEditLoading(true);
    try {
      await updatePost(threadId, tt, cc);
      setIsEditing(false);
      toast.success("Publicação atualizada.");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar. Tente novamente.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      if (isAdmin && !isOwner) {
        await adminDeletePost(threadId);
      } else {
        await deletePost(threadId);
      }
      toast.success("Publicação excluída.");
      router.push("/forum");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível excluir. Tente novamente.");
      setDeleting(false);
    }
  }

  async function handleReport() {
    setShowMenu(false);
    try {
      await reportContent(threadId, undefined);
      toast.success("Conteúdo reportado. Nossa equipe vai revisar.");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível reportar agora.");
    }
  }

  if (isEditing) {
    const titleOver = editTitle.length > TITLE_MAX;
    const contentOver = editContent.length > CONTENT_MAX;
    return (
      <div className="absolute inset-0 z-20 bg-card rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Editar publicação</h3>
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Título"
            maxLength={TITLE_MAX + 50}
            className="w-full bg-muted rounded px-3 py-2 text-sm outline-none border border-border"
          />
          {titleOver && (
            <p className="text-xs text-destructive mt-1">Título: {editTitle.length}/{TITLE_MAX}</p>
          )}
        </div>
        <div>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={CONTENT_MAX + 200}
            className="min-h-[120px] bg-muted border-0 resize-none text-sm"
          />
          {contentOver && (
            <p className="text-xs text-destructive mt-1">Conteúdo: {editContent.length}/{CONTENT_MAX}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="h-7 text-xs bg-foreground border-0"
            onClick={handleEditSave}
            disabled={editLoading || titleOver || contentOver}
          >
            {editLoading ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={cancelEdit}
            disabled={editLoading}
          >
            Cancelar (Esc)
          </Button>
        </div>
      </div>
    );
  }

  // Define quais botões aparecem no menu
  const showEdit = isOwner;
  const showDelete = isOwner || isAdmin;
  const showReport = !isOwner; // qualquer user logado que não seja owner pode reportar
  const hasAnyAction = showEdit || showDelete || showReport;

  if (!hasAnyAction) return null;

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Mais ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-6 bg-zinc-900 border border-zinc-800 rounded-lg py-1 z-10 min-w-36 shadow-xl">
            {showEdit && (
              <button
                onClick={() => { setIsEditing(true); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-800 text-zinc-300"
              >
                Editar
              </button>
            )}
            {showDelete && (
              <button
                onClick={() => { setShowDeleteDialog(true); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-800 text-red-400"
              >
                {isAdmin && !isOwner ? "Excluir (Admin)" : "Excluir"}
              </button>
            )}
            {showReport && (
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

      <Dialog open={showDeleteDialog} onOpenChange={(o) => !deleting && setShowDeleteDialog(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir publicação?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. A publicação e todos os comentários serão removidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
