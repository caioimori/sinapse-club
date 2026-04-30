"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ThreadListItem, type ThreadData } from "./thread-list-item";
import { loadMoreForumThreads } from "@/app/(dashboard)/forum/_load-more";

interface InfiniteThreadFeedProps {
  initialThreads: ThreadData[];
  sort: string;
  tab?: string;
  categorySlug?: string;
  showCategory: boolean;
  pageSize: number;
  previewMode?: boolean;
}

export function InfiniteThreadFeed({
  initialThreads,
  sort,
  tab,
  categorySlug,
  showCategory,
  pageSize,
  previewMode = false,
}: InfiniteThreadFeedProps) {
  const [threads, setThreads] = useState<ThreadData[]>(initialThreads);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(initialThreads.length < pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const seen = useRef<Set<string>>(new Set(initialThreads.map((t) => t.id)));

  const fetchMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    try {
      const next = await loadMoreForumThreads({
        page: page + 1,
        sort,
        tab,
        categorySlug,
      });
      const fresh = next.filter((t) => !seen.current.has(t.id));
      fresh.forEach((t) => seen.current.add(t.id));
      setThreads((prev) => [...prev, ...fresh]);
      setPage((p) => p + 1);
      if (next.length < pageSize) setDone(true);
    } finally {
      setLoading(false);
    }
  }, [loading, done, page, sort, tab, categorySlug, pageSize]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || done) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchMore();
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchMore, done]);

  return (
    <div>
      {threads.map((thread) => (
        <ThreadListItem
          key={thread.id}
          thread={thread}
          showCategory={showCategory}
          previewMode={previewMode}
        />
      ))}
      <div ref={sentinelRef} className="h-10" aria-hidden />
      {loading && (
        <div className="flex justify-center py-6 text-xs text-muted-foreground">Carregando...</div>
      )}
      {done && threads.length > 0 && (
        <div className="flex justify-center py-6 text-xs text-muted-foreground">
          Voce chegou ao fim do feed.
        </div>
      )}
    </div>
  );
}
