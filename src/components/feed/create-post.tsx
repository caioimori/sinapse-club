"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image, Smile, BarChart3, MapPin, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RichEditor } from "./rich-editor";
import { cn } from "@/lib/utils";

interface CreatePostProps {
  spaceId: string;
  avatarUrl?: string | null;
  displayName?: string | null;
  username?: string;
  replyTo?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

export function CreatePost({
  spaceId,
  avatarUrl,
  displayName,
  username,
  replyTo,
  placeholder = "O que esta acontecendo?",
  onSuccess,
}: CreatePostProps) {
  const [html, setHtml] = useState("");
  const [plain, setPlain] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    if (!plain.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await (supabase as any).from("posts").insert({
      author_id: user.id,
      space_id: spaceId,
      content: html,
      content_plain: plain,
      type: replyTo ? "reply" : "post",
      reply_to: replyTo || null,
    });

    if (!error) {
      setHtml("");
      setPlain("");
      setFocused(false);
      onSuccess?.();
      router.refresh();
    }

    setLoading(false);
  }

  const initial = displayName?.[0]?.toUpperCase() || username?.[0]?.toUpperCase() || "?";

  return (
    <div className={cn(
      "flex gap-3 px-4 py-3 border-b border-border transition-colors",
      focused && "bg-card/30"
    )}>
      {/* Avatar */}
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sinapse-purple-600 text-sm font-medium text-white shrink-0">
          {initial}
        </div>
      )}

      {/* Compose area */}
      <div className="flex-1 min-w-0">
        {!focused ? (
          <button
            onClick={() => setFocused(true)}
            className="w-full text-left py-3 text-lg text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            {placeholder}
          </button>
        ) : (
          <>
            <RichEditor
              onChange={(h, t) => { setHtml(h); setPlain(t); }}
              placeholder={placeholder}
              className="border-0 bg-transparent [&>div:first-child]:border-0 [&>div:first-child]:hidden"
            />

            {/* Divider */}
            <div className="my-3 border-t border-border" />

            {/* Bottom bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5 -ml-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-sinapse-cyan-400 hover:bg-sinapse-cyan-400/10">
                  <Image className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-sinapse-cyan-400 hover:bg-sinapse-cyan-400/10">
                  <BarChart3 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-sinapse-cyan-400 hover:bg-sinapse-cyan-400/10">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-sinapse-cyan-400 hover:bg-sinapse-cyan-400/10">
                  <MapPin className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="sm"
                className="rounded-full gradient-synapse border-0 px-5 font-semibold"
                onClick={handleSubmit}
                disabled={loading || !plain.trim()}
              >
                {loading ? "..." : replyTo ? "Responder" : "Postar"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
