"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExploreSearchProps {
  initialQuery?: string;
}

export function ExploreSearch({ initialQuery = "" }: ExploreSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateQuery(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set("q", value.trim());
        } else {
          params.delete("q");
        }
        router.replace(`/explore?${params.toString()}`);
      });
    }, 350);
  }

  function clearQuery() {
    setQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    startTransition(() => {
      router.replace("/explore");
    });
    inputRef.current?.focus();
  }

  return (
    <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-[var(--border-subtle)] px-4 py-3">
      <div className="relative max-w-2xl mx-auto">
        <Search
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors",
            query ? "text-foreground" : "text-muted-foreground"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="Buscar no Sinapse"
          className="w-full pl-11 pr-10 py-2.5 rounded-full bg-muted/70 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/25 focus:bg-background transition-all"
        />
        {query && (
          <button
            onClick={clearQuery}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isPending && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/20">
          <div className="h-full bg-foreground animate-pulse" />
        </div>
      )}
    </div>
  );
}
