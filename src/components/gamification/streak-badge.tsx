"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  days: number;
  /** `compact` shows just the icon + number (sidebar). Default shows label. */
  compact?: boolean;
  className?: string;
}

/**
 * Streak badge — loss aversion driver.
 * Duolingo / Snapchat / Fitbit all rely on streaks as the #1 retention mechanic.
 * Hide entirely if days === 0 (no "your streak is 0" anti-pattern).
 */
export function StreakBadge({ days, compact = false, className }: StreakBadgeProps) {
  if (days <= 0) return null;

  const intensity = Math.min(1, days / 30); // max intensity at 30+ days
  const hue = 20 - intensity * 10; // 20° (orange) → 10° (red)

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        className,
      )}
      style={{
        backgroundColor: `hsla(${hue}, 95%, 55%, 0.12)`,
        color: `hsl(${hue}, 95%, 45%)`,
      }}
      aria-label={`Sequência de ${days} ${days === 1 ? "dia" : "dias"}`}
      title={`Você entrou por ${days} ${days === 1 ? "dia" : "dias"} seguidos. Mantenha a sequência!`}
    >
      <Flame className="h-3 w-3 fill-current" aria-hidden="true" />
      <span className="tabular-nums">{days}</span>
      {!compact && <span className="hidden sm:inline">{days === 1 ? "dia" : "dias"}</span>}
    </div>
  );
}
