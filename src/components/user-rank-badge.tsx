import { getRankFromRep, getRoleTierColor, formatRep } from "@/lib/reputation";
import { cn } from "@/lib/utils";

interface UserRankBadgeProps {
  reputation: number;
  role?: string;
  className?: string;
  /** Show reputation number alongside rank name */
  showRep?: boolean;
}

/**
 * Inline rank badge: "Sênior · 2.340"
 * Color comes from subscription role (tier), rank name from reputation.
 */
export function UserRankBadge({
  reputation,
  role = "free",
  className,
  showRep = true,
}: UserRankBadgeProps) {
  const rank = getRankFromRep(reputation);
  const color = getRoleTierColor(role);

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-[11px] font-medium", className)}
      style={{ color }}
    >
      {rank.name}
      {showRep && (
        <>
          <span className="opacity-50">·</span>
          <span>{formatRep(reputation)}</span>
        </>
      )}
    </span>
  );
}
