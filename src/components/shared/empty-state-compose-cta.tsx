"use client";

interface EmptyStateComposeCtaProps {
  label: string;
}

/**
 * Client CTA that dispatches the global `open-compose-modal` CustomEvent —
 * same plumbing used by the sidebar "Post" button. Used inside `EmptyState`
 * when we want the CTA to launch the composer instead of navigating.
 */
export function EmptyStateComposeCta({ label }: EmptyStateComposeCtaProps) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-compose-modal"))
      }
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/85 transition-colors"
    >
      {label}
    </button>
  );
}
