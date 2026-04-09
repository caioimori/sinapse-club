"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

interface NotificationsMarkReadProps {
  unreadIds: string[];
}

export function NotificationsMarkRead({ unreadIds }: NotificationsMarkReadProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const supabase = createClient();

  async function markAll() {
    if (done || isPending) return;
    await (supabase as any)
      .from("notifications")
      .update({ read: true })
      .in("id", unreadIds);
    setDone(true);
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={markAll}
      disabled={isPending || done}
      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      title="Marcar todas como lidas"
    >
      <Check className="h-4 w-4" />
      <span className="hidden sm:inline">Marcar como lidas</span>
    </button>
  );
}
