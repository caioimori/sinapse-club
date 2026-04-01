import Link from "next/link";
import { Lock, MessageSquare, FileText } from "lucide-react";
import type { Database } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

interface CategoryCardProps {
  category: ForumCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const isPro = category.access === "pro";

  return (
    <Link
      href={`/forum/${category.slug}`}
      className="group flex gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
    >
      {/* Icon + color dot */}
      <div className="flex flex-col items-center gap-1.5 pt-0.5">
        <span className="text-2xl leading-none">{category.icon || "💬"}</span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: category.color || "#71717A" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-foreground/90 truncate">
            {category.name}
          </h3>
          {isPro && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 px-1.5 py-0 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              <Lock className="h-2.5 w-2.5" />
              PRO
            </span>
          )}
        </div>

        {category.description && (
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        )}

        {/* Stats */}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span className="tabular-nums">{category.threads_count}</span>{" "}
            threads
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span className="tabular-nums">{category.posts_count}</span> posts
          </span>
        </div>
      </div>
    </Link>
  );
}
