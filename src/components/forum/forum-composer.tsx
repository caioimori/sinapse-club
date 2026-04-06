"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Image as ImageIcon, Link as LinkIcon, Send, ChevronDown } from "lucide-react";
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
      tags: [],
    };

    const { data, error } = await supabase
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
    <div className="border-b border-[var(--border-subtle)] bg-background/50 backdrop-blur-xs sticky top-0 z-40">
      <div className="px-4 py-3">
        {/* Composer Header */}
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
            <AvatarFallback>{userName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Input Area */}
          <div className="flex-1">
            {/* Text Input */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="O que você está pensando?"
              className="w-full bg-transparent text-xl placeholder-muted-foreground resize-none outline-none"
              rows={isExpanded ? 4 : 1}
            />

            {/* Expanded State */}
            {isExpanded && (
              <div className="mt-4 space-y-3">
                {/* Category Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm"
                  >
                    {selectedCategoryData ? (
                      <>
                        <span>{selectedCategoryData.icon}</span>
                        <span>{selectedCategoryData.name}</span>
                      </>
                    ) : (
                      <>
                        <span>🏷</span>
                        <span>Selecionar tema</span>
                      </>
                    )}
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {showCategoryPicker && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowCategoryPicker(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                            selectedCategory === category.id ? "bg-muted" : ""
                          }`}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setText("");
                        setSelectedCategory("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePublish}
                      disabled={!text.trim() || !selectedCategory || loading}
                      className="bg-foreground text-background hover:bg-foreground/90"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {loading ? "Publicando..." : "Publicar"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsed State Footer */}
        {!isExpanded && (
          <div className="flex gap-2 ml-16 mt-2 text-muted-foreground">
            <button className="p-2 rounded-full hover:bg-muted transition-colors hover:text-foreground">
              <ImageIcon className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors hover:text-foreground">
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
