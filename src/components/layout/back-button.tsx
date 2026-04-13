"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Twitter-style back arrow for drill-down pages. Uses `router.back()` when
 * there's session history, otherwise falls back to `fallbackHref` so users
 * who deep-link into a thread don't end up stuck.
 */
export function BackButton({
  fallbackHref = "/forum",
  label,
  className,
}: {
  fallbackHref?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label ?? "Voltar"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full p-2 -ml-2 hover:bg-muted/60 transition-colors text-foreground",
        className,
      )}
    >
      <ArrowLeft className="h-5 w-5" />
      {label && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
}
