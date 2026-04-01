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
      className="group flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {subcategory.icon && <span className="mr-1.5">{subcategory.icon}</span>}
          {subcategory.name}
        </p>
        {subcategory.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
            {subcategory.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0 ml-3">
        <MessageSquare className="h-3 w-3" />
        <span className="tabular-nums">{subcategory.threads_count}</span>
      </div>
    </Link>
  );
}
