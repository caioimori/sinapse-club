"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Link as LinkIcon, Smile, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

interface ForumComposerProps {
  userAvatar?: string | null;
  userName?: string;
  categories: ForumCategory[];
  userRole?: string;
}

export function ForumComposer({
  userAvatar,
  userName = "Você",
  categories,
  userRole = "free",
}: ForumComposerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  async function handlePublish() {
    if (!text.trim() || !selectedCategory) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const payload = {
      author_id: user.id,
      category_id: selectedCategory,
      subcategory_id: null,
      title: title.trim() || text.substring(0, 100),
      content: text,
      content_plain: text,
      type: "thread" as const,
      tags: [] as string[],
    };

    const { data, error } = await (supabase as any)
      .from("posts")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setText("");
    setTitle("");
    setSelectedCategory("");
    setIsExpanded(false);
    router.refresh();
  }

  return (
    <div className="border-b border-[var(--border-subtle)] sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="px-4 py-3">
        {/* Main composer */}
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
            <AvatarFallback>{userName?.[0]?.toUpperCase() || "?"}</AvatarFallback>
          </Avatar>

          {/* Input Area */}
          <div className="flex-1">
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full text-left px-4 py-3 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors text-base"
              >
                O que está acontecendo!?
              </button>
            ) : (
              <div className="space-y-4">
                {/* Title input (optional) */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título (opcional)"
                  className="w-full bg-transparent text-lg font-semibold text-foreground placeholder-muted-foreground outline-none"
                />

                {/* Text area */}
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="O que está acontecendo!?"
                  className="w-full bg-transparent text-xl text-foreground placeholder-muted-foreground resize-none outline-none leading-normal"
                  rows={4}
                />

                {/* Category selector */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-subtle)] hover:bg-muted transition-colors text-sm font-medium"
                  >
                    {selectedCategoryData ? (
                      <>
                        <span className="text-lg">{selectedCategoryData.icon}</span>
                        <span>{selectedCategoryData.name}</span>
                      </>
                    ) : (
                      <>
                        <span>🏷️</span>
                        <span>Tema</span>
                      </>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>

                  {showCategoryPicker && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-[var(--border-subtle)] rounded-2xl shadow-xl z-50 overflow-hidden">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowCategoryPicker(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors flex items-center gap-3 border-b border-[var(--border-subtle)] last:border-b-0 ${
                            selectedCategory === category.id ? "bg-muted" : ""
                          }`}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{category.name}</div>
                            {category.description && (
                              <div className="text-xs text-muted-foreground">{category.description}</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-full transition-colors">
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-full transition-colors">
                      <LinkIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-full transition-colors">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setText("");
                        setTitle("");
                        setSelectedCategory("");
                      }}
                      className="text-foreground hover:bg-muted"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePublish}
                      disabled={!text.trim() || !selectedCategory || loading}
                      className="px-6 bg-blue-500 text-white hover:bg-blue-600 font-bold rounded-full"
                    >
                      {loading ? "Publicando..." : "Publicar"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
