"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichEditor } from "./rich-editor";

interface CreatePostProps {
  spaceId: string;
}

export function CreatePost({ spaceId }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [plain, setPlain] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
      title: title.trim() || null,
      content: html,
      content_plain: plain,
      type: "post",
    });

    if (!error) {
      setTitle("");
      setHtml("");
      setPlain("");
      setExpanded(false);
      router.refresh();
    }

    setLoading(false);
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full rounded-xl border border-border bg-card p-4 text-left text-sm text-muted-foreground hover:border-sinapse-purple-600/50 transition-colors"
      >
        Escreva algo...
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <Input
        placeholder="Titulo (opcional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-0 bg-transparent text-lg font-semibold placeholder:text-muted-foreground/50 px-0 focus-visible:ring-0"
      />
      <RichEditor
        onChange={(h, t) => { setHtml(h); setPlain(t); }}
        placeholder="Compartilhe algo com a comunidade..."
      />
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
          Cancelar
        </Button>
        <Button
          size="sm"
          className="gradient-synapse border-0 gap-2"
          onClick={handleSubmit}
          disabled={loading || !plain.trim()}
        >
          <Send className="h-4 w-4" />
          {loading ? "Publicando..." : "Publicar"}
        </Button>
      </div>
    </div>
  );
}
