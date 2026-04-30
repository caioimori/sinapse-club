"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, X, Smile, BarChart2, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ComposerEmojiPicker } from "@/components/forum/composer-emoji-picker";
import { ComposerPoll, type PollData } from "@/components/forum/composer-poll";
import { MarkdownContent } from "@/components/forum/markdown-content";
import { publishBurst } from "@/lib/celebration";
import type { Database } from "@/types/database";

const PAID_ROLES = new Set(["pro", "premium", "instructor", "admin"]);

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

const CHAR_LIMIT = 2000;

function nanoid(len = 12) {
  return Math.random().toString(36).slice(2, 2 + len);
}

interface ForumComposerProps {
  userAvatar?: string | null;
  userName?: string;
  userId?: string;
  categories?: ForumCategory[];
  userRole?: string;
}

export function ForumComposer({
  userAvatar,
  userName = "Você",
  userId,
  userRole,
}: ForumComposerProps) {
  const isPaid = userRole ? PAID_ROLES.has(userRole) : false;
  // Cenario B: free LOGADO ve banner de upgrade no lugar do composer.
  if (!isPaid) {
    return (
      <div className="border-b border-[var(--border-subtle)] px-4 py-4 bg-muted/20">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-background">
            <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Pra publicar no forum, voce precisa assinar.
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Veja como funciona explorando os posts abaixo. Quando quiser entrar na conversa, e so escolher um plano.
            </p>
            <Link
              href="/pricing?upgrade=pro&from=/forum"
              className="mt-2 inline-flex items-center rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <ForumComposerInner
      userAvatar={userAvatar}
      userName={userName}
      userId={userId}
    />
  );
}

function ForumComposerInner({
  userAvatar,
  userName = "Você",
  userId,
}: Omit<ForumComposerProps, "userRole">) {
  const router = useRouter();
  const supabase = createClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [composerTab, setComposerTab] = useState<'write' | 'preview'>('write');

  // Media
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Extras
  const [showEmoji, setShowEmoji] = useState(false);
  const [poll, setPoll] = useState<PollData | null>(null);

  function handleExpand() {
    setIsExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 80);
  }

  // Listen for open-composer event (legacy — still supported for inline scroll)
  useEffect(() => {
    window.addEventListener("open-composer", handleExpand);
    return () => window.removeEventListener("open-composer", handleExpand);
  }, []);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Collapse on outside click (only if empty)
  useEffect(() => {
    if (!isExpanded) return;
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!text.trim() && !title.trim() && !imageFile && !poll) handleCancel();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isExpanded, text, title, imageFile, poll]);

  function handleCancel() {
    setIsExpanded(false);
    setText(""); setTitle(""); setPublishError(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null); setImagePreview(null);
    setPoll(null); setShowEmoji(false);
  }

  // ── Image handling ───────────────────────────────────────────
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null); setImagePreview(null);
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

  // ── Emoji insert ─────────────────────────────────────────────
  function insertEmoji(emoji: string) {
    const el = textareaRef.current;
    if (!el) { setText((t) => t + emoji); return; }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    setText(text.slice(0, start) + emoji + text.slice(end));
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + emoji.length;
      el.focus();
    }, 0);
  }

  // ── Publish ──────────────────────────────────────────────────
  async function handlePublish() {
    if (!text.trim() || loading) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const uid = userId ?? user.id;
    const imageUrl = await uploadImage(uid);

    const pollPayload = poll && poll.options.filter((o) => o.trim()).length >= 2
      ? { options: poll.options.filter((o) => o.trim()), duration_days: poll.duration_days }
      : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
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
    if (error) {
      // Se for erro de RLS/paywall (RLS bloqueia free), mostra copy explicito.
      const msg = (error as { message?: string }).message ?? "";
      const isPaywall = /paywall|policy|permission|forbidden|tier/i.test(msg);
      if (isPaywall) {
        setPublishError("Voce precisa assinar pra publicar no forum.");
        toast.error("Voce precisa assinar pra publicar.", {
          action: {
            label: "Ver planos",
            onClick: () => { window.location.href = "/pricing?upgrade=pro&from=/forum"; },
          },
        });
      } else {
        setPublishError("Nao foi possivel publicar agora. Tente em alguns segundos.");
        toast.error("Nao foi possivel publicar seu post");
      }
      return;
    }
    handleCancel();
    toast.success("Post publicado!");
    publishBurst();
    router.refresh();
  }

  const canPublish = text.trim().length > 0 && !loading && !imageUploading;
  const charCount = text.length;
  const nearLimit = charCount > CHAR_LIMIT * 0.85;

  return (
    <div ref={containerRef} className="border-b border-[var(--border-subtle)]">
      <div className="px-4 py-3 flex gap-3 items-start">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
          <AvatarFallback className="text-xs">{userName?.[0]?.toUpperCase() || "?"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Collapsed */}
          {!isExpanded && (
            <div className="flex items-center gap-3 cursor-text" onClick={handleExpand}>
              <span className="flex-1 text-[15px] text-muted-foreground/60 leading-normal select-none">
                O que está acontecendo?
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleExpand(); }}
                className="px-4 py-1.5 rounded-full border border-foreground/20 text-sm font-semibold text-foreground/40 hover:border-foreground/40 hover:text-foreground/60 transition-colors flex-shrink-0"
              >
                Publicar
              </button>
            </div>
          )}

          {/* Expanded */}
          {isExpanded && (
            <div className="space-y-2" style={{ animation: "expandIn 180ms ease-out forwards" }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título (opcional)"
                maxLength={200}
                className="w-full bg-transparent text-[15px] font-semibold placeholder:text-muted-foreground/50 outline-none"
              />
              {/* Write / Preview tabs */}
              <div className="flex border-b border-[var(--border-subtle)] mb-2">
                <button
                  onClick={() => setComposerTab('write')}
                  className={`px-3 py-1.5 text-sm transition-colors ${composerTab === 'write' ? 'text-foreground border-b-2 border-foreground -mb-px' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Escrever
                </button>
                <button
                  onClick={() => setComposerTab('preview')}
                  className={`px-3 py-1.5 text-sm transition-colors ${composerTab === 'preview' ? 'text-foreground border-b-2 border-foreground -mb-px' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Preview
                </button>
              </div>
              {composerTab === 'write' ? (
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="O que está acontecendo? (suporta Markdown)"
                  maxLength={CHAR_LIMIT}
                  className="w-full bg-transparent text-[15px] placeholder:text-muted-foreground/50 resize-none outline-none leading-relaxed min-h-[80px]"
                  rows={3}
                />
              ) : (
                <div className="min-h-[80px] py-1">
                  {text.trim() ? (
                    <MarkdownContent content={text} />
                  ) : (
                    <p className="text-muted-foreground/50 text-[15px]">Nada para pré-visualizar</p>
                  )}
                </div>
              )}

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

              {/* Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] relative">
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  {/* Hidden file input */}
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
                    onClick={() => setPoll(poll ? null : { options: ["", ""], duration_days: 1 })}
                    className={`p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground ${poll ? "text-foreground bg-muted" : ""}`}
                  >
                    <BarChart2 className="h-[18px] w-[18px]" />
                  </button>
                </div>

                {/* Right: char count + cancel + publish */}
                <div className="flex items-center gap-2">
                  {nearLimit && (
                    <span className={`text-xs tabular-nums ${charCount >= CHAR_LIMIT ? "text-destructive" : "text-muted-foreground"}`}>
                      {CHAR_LIMIT - charCount}
                    </span>
                  )}
                  <button
                    onClick={handleCancel}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={!canPublish}
                    className="px-5 py-1.5 rounded-full bg-foreground text-background text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90 transition-all flex items-center gap-1.5"
                  >
                    {(loading || imageUploading) && <Loader2 className="h-3 w-3 animate-spin" />}
                    {imageUploading ? "Enviando…" : loading ? "Publicando…" : "Publicar"}
                  </button>
                </div>
              </div>

              {publishError && <p className="text-xs text-destructive">{publishError}</p>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
