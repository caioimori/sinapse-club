"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Link as LinkIcon, Smile, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

interface ForumComposerProps {
  userAvatar?: string | null;
  userName?: string;
  categories?: ForumCategory[];
  userRole?: string;
}

export function ForumComposer({
  userAvatar,
  userName = "Você",
  userRole = "free",
}: ForumComposerProps) {
  const router = useRouter();
  const supabase = createClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  function handleExpand() {
    setIsExpanded(true);
    // Defer focus so transition is visible first
    setTimeout(() => textareaRef.current?.focus(), 80);
  }

  // Listen for open-composer event (dispatched by sidebar Post button)
  useEffect(() => {
    function onOpenComposer() {
      handleExpand();
    }
    window.addEventListener("open-composer", onOpenComposer);
    return () => window.removeEventListener("open-composer", onOpenComposer);
  }, []); // handleExpand is stable — no deps needed

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Collapse on outside click
  useEffect(() => {
    if (!isExpanded) return;
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!text.trim() && !title.trim()) {
          handleCancel();
        }
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isExpanded, text, title]);

  function handleCancel() {
    setIsExpanded(false);
    setText("");
    setTitle("");
    setPublishError(null);
  }

  async function handlePublish() {
    if (!text.trim() || loading) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await (supabase as any)
      .from("posts")
      .insert({
        author_id: user.id,
        title: title.trim() || text.substring(0, 100),
        content: text,
        content_plain: text,
        type: "thread",
        tags: [],
      })
      .select("id")
      .single();

    setLoading(false);
    if (error || !data) {
      setPublishError("Erro ao publicar. Tente novamente.");
      return;
    }
    setPublishError(null);

    handleCancel();
    router.refresh();
  }

  const canPublish = text.trim().length > 0 && !loading;
  const charCount = text.length;
  const charLimit = 2000;
  const nearLimit = charCount > charLimit * 0.85;

  return (
    <div
      ref={containerRef}
      className="border-b border-[var(--border-subtle)]"
    >
      <div className="px-4 py-3 flex gap-3 items-start">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
          <AvatarFallback className="text-xs">
            {userName?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Collapsed state */}
          {!isExpanded && (
            <div
              className="flex items-center gap-3 cursor-text"
              onClick={handleExpand}
            >
              <span className="flex-1 text-[15px] text-muted-foreground/60 leading-normal select-none">
                O que está acontecendo?
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpand();
                }}
                className="px-4 py-1.5 rounded-full border border-foreground/20 text-sm font-semibold text-foreground/40 hover:border-foreground/40 hover:text-foreground/60 transition-colors flex-shrink-0"
              >
                Publicar
              </button>
            </div>
          )}

          {/* Expanded state */}
          {isExpanded && (
            <div
              className="space-y-2"
              style={{
                animation: "expandIn 180ms ease-out forwards",
              }}
            >
              {/* Optional title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título (opcional)"
                maxLength={200}
                className="w-full bg-transparent text-[15px] font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none"
              />

              {/* Body textarea */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="O que está acontecendo?"
                maxLength={charLimit}
                className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 resize-none outline-none leading-relaxed min-h-[80px]"
                rows={3}
              />

              {/* Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                {/* Left: media icons */}
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <button className="p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground">
                    <ImageIcon className="h-[18px] w-[18px]" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground">
                    <LinkIcon className="h-[18px] w-[18px]" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-muted transition-colors hover:text-foreground">
                    <Smile className="h-[18px] w-[18px]" />
                  </button>
                </div>

                {/* Right: char count + cancel + publish */}
                <div className="flex items-center gap-2">
                  {nearLimit && (
                    <span
                      className={`text-xs tabular-nums ${
                        charCount >= charLimit
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {charLimit - charCount}
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
                    className="px-5 py-1.5 rounded-full bg-foreground text-background text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90 transition-all"
                  >
                    {loading ? "Publicando…" : "Publicar"}
                  </button>
                </div>
              </div>
              {publishError && (
                <p className="text-xs text-destructive mt-1">{publishError}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes expandIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
