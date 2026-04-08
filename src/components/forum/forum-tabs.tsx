"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function ForumTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "for-you";
  const isForYou = tab !== "following";

  return (
    <div className="flex w-full">
      <Link
        href="/forum"
        className={cn(
          "relative flex flex-1 items-center justify-center py-4 text-sm font-medium transition-colors hover:bg-muted/40",
          isForYou ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Para você
        {isForYou && (
          <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-foreground" />
        )}
      </Link>

      <Link
        href="/forum?tab=following"
        className={cn(
          "relative flex flex-1 items-center justify-center py-4 text-sm font-medium transition-colors hover:bg-muted/40",
          !isForYou ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Seguindo
        {!isForYou && (
          <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-foreground" />
        )}
      </Link>
    </div>
  );
}
