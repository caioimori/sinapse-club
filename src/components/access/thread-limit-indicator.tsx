"use client";

import Link from "next/link";
import { hasAccess } from "@/lib/access";

interface ThreadLimitIndicatorProps {
  currentCount: number;
  maxCount?: number;
  userRole: string;
}

/**
 * Shows thread creation usage for free-tier users.
 * "2/3 threads este mes" with a visual progress bar.
 * At the limit, shows an upgrade CTA.
 *
 * Pro+ users: renders nothing.
 */
export function ThreadLimitIndicator({
  currentCount,
  maxCount = 3,
  userRole,
}: ThreadLimitIndicatorProps) {
  // Pro+ users don't have thread limits
  if (hasAccess(userRole, "pro")) return null;

  const atLimit = currentCount >= maxCount;
  const percentage = Math.min((currentCount / maxCount) * 100, 100);

  return (
    <div
      className="rounded-lg border px-4 py-3"
      style={{
        borderColor: atLimit ? "var(--border-hover)" : "var(--border-default)",
        background: "var(--surface-default)",
      }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          <span className="font-mono font-semibold text-foreground tabular-nums">
            {currentCount}/{maxCount}
          </span>{" "}
          threads este mes
        </span>
        {atLimit && (
          <Link
            href="/pricing?upgrade=pro"
            className="text-xs font-medium underline underline-offset-4 hover:text-foreground"
            style={{ color: "var(--text-secondary)" }}
          >
            Fazer upgrade
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: "var(--surface-raised)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            background: atLimit ? "var(--destructive)" : "var(--text-primary)",
            transition: "width var(--duration-normal) var(--ease-craft)",
          }}
        />
      </div>

      {atLimit && (
        <p className="mt-2 text-xs text-muted-foreground">
          Limite mensal atingido. Faca upgrade para threads ilimitados.
        </p>
      )}
    </div>
  );
}
