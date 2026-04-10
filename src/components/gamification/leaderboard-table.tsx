"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { UserRankBadge } from "@/components/user-rank-badge";
import { cn } from "@/lib/utils";
import type { ProfessionalCluster } from "@/types/database";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
  cluster: ProfessionalCluster;
  role_name: string;
  reputation: number;
  role: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const RANK_STYLES: Record<number, string> = {
  1: "border-l-2 border-l-yellow-500/60 bg-yellow-500/5",
  2: "border-l-2 border-l-zinc-400/60 bg-zinc-400/5",
  3: "border-l-2 border-l-amber-700/60 bg-amber-700/5",
};

const RANK_BADGE: Record<number, string> = {
  1: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  2: "bg-zinc-400/10 text-zinc-500 border-zinc-400/30",
  3: "bg-amber-700/10 text-amber-700 border-amber-700/30",
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Header */}
      <div className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-4 border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[3rem_1fr_auto_6rem_5rem]">
        <span className="text-center">#</span>
        <span>Membro</span>
        <span className="hidden sm:block">Cargo</span>
        <span className="text-center">Rank</span>
        <span className="text-right hidden sm:block">Rep</span>
      </div>

      {/* Rows */}
      {entries.map((entry) => (
        <div
          key={entry.rank}
          className={cn(
            "grid grid-cols-[3rem_1fr_auto_auto] items-center gap-4 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50 last:border-b-0 sm:grid-cols-[3rem_1fr_auto_6rem_5rem]",
            RANK_STYLES[entry.rank]
          )}
        >
          {/* Position */}
          <div className="flex justify-center">
            {entry.rank <= 3 ? (
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold",
                  RANK_BADGE[entry.rank]
                )}
              >
                {entry.rank}
              </span>
            ) : (
              <span className="text-sm font-mono text-muted-foreground">
                {entry.rank}
              </span>
            )}
          </div>

          {/* Avatar + Name */}
          <Link href={`/profile/${entry.username}`} className="flex items-center gap-3 min-w-0">
            <Avatar size="default">
              {entry.avatar_url ? (
                <AvatarImage src={entry.avatar_url} alt={entry.display_name} />
              ) : null}
              <AvatarFallback>
                {entry.display_name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium hover:underline">{entry.display_name}</p>
              <p className="truncate text-xs text-muted-foreground">@{entry.username}</p>
            </div>
          </Link>

          {/* Cargo Badge */}
          <div className="hidden sm:block">
            <CargoBadge cluster={entry.cluster} roleName={entry.role_name} size="sm" />
          </div>

          {/* Rank Badge */}
          <div className="text-center">
            <UserRankBadge reputation={entry.reputation} role={entry.role} showRep={false} />
          </div>

          {/* Reputation */}
          <div className="text-right hidden sm:block">
            <span className="font-mono text-sm tabular-nums">{entry.reputation.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
