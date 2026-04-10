"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { updatePost, deletePost, reportContent, adminDeletePost } from "@/app/(dashboard)/forum/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isOwner = !!currentUserId && currentUserId === authorId;
  const isAdmin = currentUserRole === "admin";

  if (!currentUserId) return null;
  if (!isOwner && !isAdmin) return null;

  async function handleEditSave() {
    if (!editTitle.trim() || !editContent.trim()) return;
    setEditLoading(true);
    try {
      await updatePost(threadId, editTitle.trim(), editContent.trim());
      setIsEditing(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Excluir esta publicação?")) return;
    try {
      if (isAdmin && !isOwner) {
        await adminDeletePost(threadId);
      } else {
        await deletePost(threadId);
      }
      router.push("/forum");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleReport() {
    try {
      await reportContent(threadId, undefined);
      alert("Conteúdo reportado.");
    } catch (e) {
      console.error(e);
    }
    setShowMenu(false);
  }

  if (isEditing) {
    return (
      <div className="absolute inset-0 z-20 bg-card rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Editar publicação</h3>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Título"
          className="w-full bg-muted rounded px-3 py-2 text-sm outline-none border border-border"
        />
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="min-h-[120px] bg-muted border-0 resize-none text-sm"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            className="h-7 text-xs bg-foreground border-0"
            onClick={handleEditSave}
            disabled={editLoading}
          >
            {editLoading ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setIsEditing(false);
              setEditTitle(title);
              setEditContent(content);
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-6 bg-zinc-900 border border-zinc-800 rounded-lg py-1 z-10 min-w-36 shadow-xl">
          {isOwner && (
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-800 text-zinc-300"
            >
              Editar
            </button>
          )}
          {(isOwner || isAdmin) && (
            <button
              onClick={() => {
                handleDelete();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-800 text-red-400"
            >
              {isAdmin && !isOwner ? "Excluir (Admin)" : "Excluir"}
            </button>
          )}
          {!isOwner && currentUserId && (
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
  );
}
