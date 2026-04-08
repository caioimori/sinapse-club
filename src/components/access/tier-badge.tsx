import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

const TIER_STYLES: Record<string, { border: string; text: string }> = {
  free: {
    border: "border-zinc-400/60",
    text: "text-zinc-500 dark:text-zinc-400",
  },
  pro: {
    border: "border-blue-500/60",
    text: "text-blue-600 dark:text-blue-400",
  },
  premium: {
    border: "border-green-500/60",
    text: "text-green-600 dark:text-green-400",
  },
  instructor: {
    border: "border-amber-500/60",
    text: "text-amber-600 dark:text-amber-400",
  },
  admin: {
    border: "border-red-500/60",
    text: "text-red-600 dark:text-red-400",
  },
};

const TIER_LABELS: Record<string, string> = {
  free: "FREE",
  pro: "MEMBRO",
  premium: "ALUNO",
  instructor: "MENTORADO",
  admin: "ADMIN",
};

interface TierBadgeProps {
  tier: UserRole;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Tier badge following the CargoBadge pattern:
 * pill shape, font-mono, tracking-widest, border-only with color accent.
 *
 * free users get no badge by default (render nothing).
 * Pass showFree={true} on a variant if you want to show FREE explicitly.
 */
export function TierBadge({ tier, size = "sm", className }: TierBadgeProps) {
  // Free users: no badge shown (cleaner UI)
  if (tier === "free") return null;

  const styles = TIER_STYLES[tier] || TIER_STYLES.free;
  const label = TIER_LABELS[tier] || tier.toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center border bg-transparent font-mono uppercase whitespace-nowrap",
        styles.border,
        styles.text,
        size === "sm" && "px-1.5 py-0 text-[10px] leading-4",
        size === "md" && "px-2 py-0.5 text-xs leading-4",
        className,
      )}
      style={{
        borderRadius: "var(--radius-badge)",
        letterSpacing: "var(--tracking-widest)",
      }}
    >
      {label}
    </span>
  );
}
