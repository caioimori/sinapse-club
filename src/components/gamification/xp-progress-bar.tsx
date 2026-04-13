"use client";

import { getRankProgress, formatRep } from "@/lib/reputation";
import { cn } from "@/lib/utils";

interface XpProgressBarProps {
  reputation: number;
  /** Compact = no labels, só a barra (sidebar). Default mostra labels. */
  compact?: boolean;
  className?: string;
}

/**
 * Progress bar do nível atual → próximo.
 * Neuro: visible progress é o driver #2 de habit formation (Duolingo, Fitbit).
 * Mostra "250/500 XP" + "250 para Sênior" em vez do silêncio atual.
 */
export function XpProgressBar({ reputation, compact = false, className }: XpProgressBarProps) {
  const progress = getRankProgress(reputation);

  if (!progress) {
    // User hit max rank — celebrate with a filled legendary bar.
    return (
      <div className={cn("space-y-1", className)}>
        {!compact && (
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-foreground">Legenda</span>
            <span className="text-muted-foreground">{formatRep(reputation)} XP</span>
          </div>
        )}
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "#ef4444" }}
        />
      </div>
    );
  }

  const { current, next, percent, remaining } = progress;
  const percentLabel = Math.round(percent * 100);

  return (
    <div className={cn("space-y-1", className)}>
      {!compact && (
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 font-medium">
            <span style={{ color: current.color }}>{current.name}</span>
            <span className="text-muted-foreground">→</span>
            <span style={{ color: next.color }}>{next.name}</span>
          </span>
          <span className="text-muted-foreground tabular-nums">
            {formatRep(reputation)} / {formatRep(next.minRep)}
          </span>
        </div>
      )}
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={percentLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${remaining} XP para ${next.name}`}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent * 100}%`,
            backgroundColor: current.color,
          }}
        />
      </div>
      {!compact && (
        <p className="text-[10px] text-muted-foreground">
          Faltam <span className="tabular-nums font-medium text-foreground">{formatRep(remaining)}</span>{" "}
          XP para <span style={{ color: next.color }}>{next.name}</span>
        </p>
      )}
    </div>
  );
}
