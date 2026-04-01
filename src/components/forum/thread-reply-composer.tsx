"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface ThreadReplyComposerProps {
  threadId: string;
}

export function ThreadReplyComposer({ threadId }: ThreadReplyComposerProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    await (supabase as any).from("comments").insert({
      post_id: threadId,
      author_id: user.id,
      content: text.trim(),
    });

    setText("");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Escreva sua resposta..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[100px] bg-muted border-0 resize-none"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          className="bg-foreground border-0 px-5"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
        >
          {loading ? "Enviando..." : "Responder"}
        </Button>
      </div>
    </div>
  );
}
