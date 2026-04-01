import Link from "next/link";
import { MessageSquare } from "lucide-react";
import type { Database } from "@/types/database";

type ForumSubcategory = Database["public"]["Tables"]["forum_subcategories"]["Row"];

interface SubcategoryCardProps {
  subcategory: ForumSubcategory;
  categorySlug: string;
}

export function SubcategoryCard({ subcategory, categorySlug }: SubcategoryCardProps) {
  return (
    <Link
      href={`/forum/${categorySlug}/${subcategory.slug}`}
      className="group flex items-center justify-between rounded-xl border border-[var(--border-default)] px-4 py-3 transition-all duration-200 hover:shadow-xs hover:border-[var(--border-hover)] hover:bg-[var(--surface-default)]"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {subcategory.icon && <span className="mr-1.5">{subcategory.icon}</span>}
          {subcategory.name}
        </p>
        {subcategory.description && (
          <p className="mt-0.5 text-xs line-clamp-1" style={{ color: "var(--text-tertiary)" }}>
            {subcategory.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs flex-shrink-0 ml-3" style={{ color: "var(--text-tertiary)" }}>
        <MessageSquare className="h-3 w-3" />
        <span className="tabular-nums">{subcategory.threads_count}</span>
      </div>
    </Link>
  );
}
