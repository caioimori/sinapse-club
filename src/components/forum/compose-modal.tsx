"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  X,
  Image as ImageIcon,
  Smile,
  BarChart2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { ComposerEmojiPicker } from "@/components/forum/composer-emoji-picker";
import { ComposerPoll, type PollData } from "@/components/forum/composer-poll";

const CHAR_LIMIT = 2000;

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
      .select("display_name, username, avatar_url")
      .eq("id", user.id)
      .single();
    if (profile) {
      setUserAvatar(profile.avatar_url ?? null);
      setUserName((profile.display_name || profile.username) ?? "Você");
    }
    setProfileLoaded(true);
  }, [profileLoaded, supabase]);

  const openModal = useCallback(async () => {
    setIsOpen(true);
    await loadProfile();
    setTimeout(() => textareaRef.current?.focus(), 80);
  }, [loadProfile]);

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
  }

  // ── Image handling ─────────────────────────────────────────────
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  async function uploadImage(uid: string): Promise<string | null> {
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
    return publicUrl;
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
    if (!user) { setLoading(false); return; }

    const uid = userId ?? user.id;
    const imageUrl = await uploadImage(uid);

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
        image_url: imageUrl,
        poll_options: pollPayload,
      });

    setLoading(false);
    if (insertError) { setError("Erro ao publicar. Tente novamente."); return; }
    handleClose();
    router.refresh();
  }

  if (!mounted || !isOpen) return null;

  const charCount = text.length;
  const nearLimit = charCount > CHAR_LIMIT * 0.85;
  const canPublish = text.trim().length > 0 && !loading && !imageUploading;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[8vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-xl bg-background rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden"
        style={{ animation: "modalIn 160ms ease-out forwards" }}
        role="dialog"
        aria-modal="true"
        aria-label="Criar publicação"
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
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
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
              className={`p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground ${poll ? "text-foreground bg-muted" : ""}`}
            >
              <BarChart2 className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* Right: char count + publish */}
          <div className="flex items-center gap-3">
            {nearLimit && (
              <span className={`text-sm tabular-nums ${charCount >= CHAR_LIMIT ? "text-destructive" : "text-muted-foreground"}`}>
                {CHAR_LIMIT - charCount}
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
