"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { ThreadListItem, type ThreadData } from "@/components/forum/thread-list-item";
import type { ThreadSort } from "@/types/database";

interface ThreadListProps {
  threads: ThreadData[];
  showCategory?: boolean;
  emptyMessage?: string;
  defaultSort?: ThreadSort;
}

const SORT_OPTIONS: { value: ThreadSort; label: string }[] = [
  { value: "latest", label: "Recentes" },
  { value: "popular", label: "Popular" },
  { value: "unsolved", label: "Sem solucao" },
];

function sortThreads(threads: ThreadData[], sort: ThreadSort): ThreadData[] {
  const sorted = [...threads];

  // Sticky threads always come first
  const sticky = sorted.filter((t) => t.is_sticky);
  const nonSticky = sorted.filter((t) => !t.is_sticky);

  switch (sort) {
    case "popular":
      nonSticky.sort((a, b) => b.replies_count - a.replies_count);
      break;
    case "unsolved":
      // Show unsolved first, then by date
      nonSticky.sort((a, b) => {
        if (a.is_solved !== b.is_solved) return a.is_solved ? 1 : -1;
        const dateA = new Date(a.last_reply_at || a.created_at).getTime();
        const dateB = new Date(b.last_reply_at || b.created_at).getTime();
        return dateB - dateA;
      });
      break;
    case "latest":
    default:
      nonSticky.sort((a, b) => {
        const dateA = new Date(a.last_reply_at || a.created_at).getTime();
        const dateB = new Date(b.last_reply_at || b.created_at).getTime();
        return dateB - dateA;
      });
      break;
  }

  return [...sticky, ...nonSticky];
}

export function ThreadList({
  threads,
  showCategory = false,
  emptyMessage = "Nenhum thread ainda. Seja o primeiro a postar!",
  defaultSort = "latest",
}: ThreadListProps) {
  const [activeSort, setActiveSort] = useState<ThreadSort>(defaultSort);

  const sortedThreads = sortThreads(threads, activeSort);

  return (
    <div>
      {/* Sort controls */}
      {threads.length > 0 && (
        <div className="flex items-center gap-1 mb-2 px-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveSort(option.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeSort === option.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Thread list */}
      {sortedThreads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {sortedThreads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              thread={thread}
              showCategory={showCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
