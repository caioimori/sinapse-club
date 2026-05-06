"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  X,
  Image as ImageIcon,
  Smile,
  ListChecks,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { ComposerEmojiPicker } from "@/components/forum/composer-emoji-picker";
import { ComposerPoll, type PollData } from "@/components/forum/composer-poll";
import { showPaywallToast } from "@/components/access/paywall-toast";

const PAID_ROLES = new Set(["pro", "premium", "instructor", "admin"]);

const CHAR_LIMIT = 2000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB — bate com bucket allowed_size
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DRAFT_KEY = "sinapse:compose:draft";

function nanoid(len = 12) {
  return Math.random().toString(36).slice(2, 2 + len);
}

export function ComposeModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Content
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  // Media
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Extras
  const [showEmoji, setShowEmoji] = useState(false);
  const [poll, setPoll] = useState<PollData | null>(null);

  // Submit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drag & drop
  const [isDragging, setIsDragging] = useState(false);

  // User
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState("Você");
  const [userId, setUserId] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => setMounted(true), []);

  const loadProfile = useCallback(async () => {
    if (profileLoaded) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("display_name, username, avatar_url, role")
      .eq("id", user.id)
      .single();
    if (profile) {
      setUserAvatar(profile.avatar_url ?? null);
      setUserName((profile.display_name || profile.username) ?? "Você");
    }
    setProfileLoaded(true);
  }, [profileLoaded, supabase]);

  const openModal = useCallback(async () => {
    // Cenario B: free nao pode abrir o modal de publicacao.
    // Bloqueia antes de abrir, mostra toast paywall.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = (profile?.role as string) ?? "free";
    if (!PAID_ROLES.has(role)) {
      showPaywallToast("publicar no forum");
      return;
    }
    setIsOpen(true);
    await loadProfile();
    setTimeout(() => textareaRef.current?.focus(), 80);
  }, [loadProfile, supabase]);

  useEffect(() => {
    window.addEventListener("open-compose-modal", openModal);
    return () => window.removeEventListener("open-compose-modal", openModal);
  }, [openModal]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Restaura draft ao abrir o modal (apenas se nada foi digitado ainda)
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    if (text || title) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { title?: string; text?: string };
      if (draft.title) setTitle(draft.title);
      if (draft.text) setText(draft.text);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Salva draft a cada change (apenas texto/título — imagem/poll não persistem)
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    if (!text && !title) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ text, title }));
      } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [text, title, isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    setText(""); setTitle(""); setError(null);
    setImageFile(null); setImagePreview(null);
    setPoll(null); setShowEmoji(false);
    // Limpa draft ao publicar/fechar limpo
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
    }
  }

  // ── Image handling ─────────────────────────────────────────────
  function pickImage(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Formato não suportado. Use JPG, PNG, WebP ou GIF.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      toast.error(`Imagem muito grande (${mb}MB). Máximo 5MB.`);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    pickImage(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) pickImage(file);
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  async function uploadImage(uid: string): Promise<{ url: string; path: string } | null> {
    if (!imageFile) return null;
    setImageUploading(true);
    const ext = imageFile.name.split(".").pop() ?? "jpg";
    const path = `${uid}/${nanoid()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("posts")
      .upload(path, imageFile, { contentType: imageFile.type, upsert: false });
    setImageUploading(false);
    if (error || !data) return null;
    const { data: { publicUrl } } = supabase.storage.from("posts").getPublicUrl(data.path);
    return { url: publicUrl, path: data.path };
  }

  // ── Emoji insert ───────────────────────────────────────────────
  function insertEmoji(emoji: string) {
    const el = textareaRef.current;
    if (!el) { setText((t) => t + emoji); return; }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);
    setText(next);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + emoji.length;
      el.focus();
    }, 0);
  }

  // ── Poll ───────────────────────────────────────────────────────
  function togglePoll() {
    if (poll) { setPoll(null); return; }
    setPoll({ options: ["", ""], duration_days: 1 });
  }

  // ── Publish ────────────────────────────────────────────────────
  async function handlePublish() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    const uid = userId ?? user.id;
    const uploaded = await uploadImage(uid);

    const pollPayload = poll && poll.options.filter((o) => o.trim()).length >= 2
      ? { options: poll.options.filter((o) => o.trim()), duration_days: poll.duration_days }
      : null;

    const { error: insertError } = await (supabase as any)
      .from("posts")
      .insert({
        author_id: uid,
        title: title.trim() || text.substring(0, 100),
        content: text,
        content_plain: text,
        type: "thread",
        tags: [],
        image_url: uploaded?.url ?? null,
        poll_options: pollPayload,
      });

    setLoading(false);
    if (insertError) {
      // Cleanup: imagem upada mas post não criado → apaga do Storage
      if (uploaded?.path) {
        try {
          await supabase.storage.from("posts").remove([uploaded.path]);
        } catch {
          // best effort — não bloqueia recovery
        }
      }
      const msg = (insertError as { message?: string }).message ?? "";
      const isPaywall = /paywall|policy|permission|forbidden|tier/i.test(msg);
      if (isPaywall) {
        setError("Você precisa assinar pra publicar no fórum.");
        showPaywallToast("publicar no fórum");
      } else {
        setError("Não foi possível publicar agora. Tente em alguns segundos.");
        toast.error("Não foi possível publicar.");
      }
      return;
    }
    toast.success("Publicado.");
    handleClose();
    router.refresh();
  }

  if (!mounted || !isOpen) return null;

  const charCount = text.length;
  const showCount = charCount > 0; // sempre que digitou algo
  const overLimit = charCount > CHAR_LIMIT;
  const nearLimit = charCount > CHAR_LIMIT * 0.85;
  const canPublish = text.trim().length > 0 && !overLimit && !loading && !imageUploading;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[8vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/60" onClick={handleClose} aria-hidden />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-[36rem] bg-background rounded-2xl shadow-2xl border overflow-hidden transition-colors ${
          isDragging ? "border-foreground/50 ring-2 ring-foreground/20" : "border-[var(--border-subtle)]"
        }`}
        style={{ animation: "modalIn 160ms ease-out forwards" }}
        role="dialog"
        aria-modal="true"
        aria-label="Criar publicação"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--border-subtle)]">
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 pt-4 pb-2 flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0 mt-0.5">
            {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
            <AvatarFallback className="text-sm">{userName?.[0]?.toUpperCase() || "?"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título (opcional)"
              maxLength={200}
              className="w-full bg-transparent text-[16px] font-semibold placeholder:text-muted-foreground/50 outline-none"
            />
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="O que está acontecendo?"
              maxLength={CHAR_LIMIT}
              className="w-full bg-transparent text-[16px] placeholder:text-muted-foreground/50 resize-none outline-none leading-relaxed min-h-[120px]"
              rows={4}
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] aspect-video">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="560px" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950/70 text-white hover:bg-neutral-950/90 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Poll */}
            {poll && (
              <ComposerPoll
                poll={poll}
                onChange={setPoll}
                onRemove={() => setPoll(null)}
              />
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-subtle)] relative">
          <div className="flex items-center gap-0.5 text-muted-foreground">
            {/* Hidden image input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageSelect}
            />

            {/* Image */}
            <button
              type="button"
              title="Adicionar imagem"
              disabled={!!imagePreview}
              onClick={() => imageInputRef.current?.click()}
              className="p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground disabled:opacity-30"
            >
              <ImageIcon className="h-[18px] w-[18px]" />
            </button>

            {/* Emoji */}
            <div className="relative">
              <button
                type="button"
                title="Emojis"
                onClick={() => setShowEmoji((v) => !v)}
                className={`p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground ${showEmoji ? "text-foreground bg-muted" : ""}`}
              >
                <Smile className="h-[18px] w-[18px]" />
              </button>
              {showEmoji && (
                <ComposerEmojiPicker
                  onSelect={insertEmoji}
                  onClose={() => setShowEmoji(false)}
                />
              )}
            </div>

            {/* Poll */}
            <button
              type="button"
              title="Enquete"
              onClick={togglePoll}
              className={`p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground cursor-pointer ${poll ? "text-foreground bg-muted" : ""}`}
            >
              <ListChecks className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* Right: char count + publish */}
          <div className="flex items-center gap-3">
            {showCount && (
              <span className={`text-xs tabular-nums ${overLimit ? "text-destructive" : nearLimit ? "text-amber-500" : "text-muted-foreground"}`}>
                {charCount}/{CHAR_LIMIT}
              </span>
            )}
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90 transition-all flex items-center gap-2"
            >
              {(loading || imageUploading) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {imageUploading ? "Enviando…" : loading ? "Publicando…" : "Publicar"}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 pb-3">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
