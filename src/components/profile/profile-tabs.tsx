"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { GitFork, Bookmark } from "lucide-react";

export type ProfileTab = "posts" | "respostas" | "curtidas" | "salvos" | "github";

const BASE_TABS: { id: ProfileTab; label: React.ReactNode; href: string }[] = [
  { id: "posts", label: "Posts", href: "?tab=posts" },
  { id: "respostas", label: "Respostas", href: "?tab=respostas" },
  { id: "curtidas", label: "Curtidas", href: "?tab=curtidas" },
];

const SALVOS_TAB: { id: ProfileTab; label: React.ReactNode; href: string } = {
  id: "salvos",
  label: (
    <span className="flex items-center gap-1.5">
      <Bookmark className="h-3.5 w-3.5" />
      Salvos
    </span>
  ),
  href: "?tab=salvos",
};

const GITHUB_TAB: { id: ProfileTab; label: React.ReactNode; href: string } = {
  id: "github",
  label: (
    <span className="flex items-center gap-1.5">
      <GitFork className="h-3.5 w-3.5" />
      GitHub
    </span>
  ),
  href: "?tab=github",
};

interface ProfileTabsProps {
  baseHref?: string;
  showSalvos?: boolean;
}

export function ProfileTabs({ baseHref = "", showSalvos = false }: ProfileTabsProps) {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") ?? "posts";
  const activeTab: ProfileTab =
    rawTab === "respostas" ||
    rawTab === "curtidas" ||
    rawTab === "github" ||
    (rawTab === "salvos" && showSalvos)
      ? (rawTab as ProfileTab)
      : "posts";

  const TABS = showSalvos
    ? [...BASE_TABS, SALVOS_TAB, GITHUB_TAB]
    : [...BASE_TABS, GITHUB_TAB];

  return (
    <div className="flex w-full border-b border-border mt-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={`${baseHref}${tab.href}`}
            className={cn(
              "relative flex flex-1 items-center justify-center py-4 text-sm font-medium transition-colors hover:bg-muted/40",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-foreground" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
