export interface Rank {
  level: number;
  name: string;
  minRep: number;
  color: string;
}

export const RANKS: Rank[] = [
  { level: 1, name: "Iniciante",  minRep: 0,     color: "#71717a" },
  { level: 2, name: "Operador",   minRep: 100,   color: "#3b82f6" },
  { level: 3, name: "Sênior",     minRep: 500,   color: "#8b5cf6" },
  { level: 4, name: "Referência", minRep: 2000,  color: "#06b6d4" },
  { level: 5, name: "Mestre",     minRep: 5000,  color: "#f59e0b" },
  { level: 6, name: "Legenda",    minRep: 10000, color: "#ef4444" },
];

export function getRankFromRep(reputation: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (reputation >= RANKS[i].minRep) return RANKS[i];
  }
  return RANKS[0];
}

/** Returns the next rank above the current one, or null if user is maxed out. */
export function getNextRank(reputation: number): Rank | null {
  const current = getRankFromRep(reputation);
  const next = RANKS.find((r) => r.level === current.level + 1);
  return next ?? null;
}

/**
 * Computes progress towards the next rank.
 * Returns 0..1 fraction plus absolute XP remaining, or null when at max rank.
 */
export function getRankProgress(reputation: number): {
  current: Rank;
  next: Rank;
  percent: number;
  gained: number;
  remaining: number;
} | null {
  const current = getRankFromRep(reputation);
  const next = getNextRank(reputation);
  if (!next) return null;
  const span = next.minRep - current.minRep;
  const gained = Math.max(0, reputation - current.minRep);
  const percent = span > 0 ? Math.min(1, gained / span) : 1;
  return {
    current,
    next,
    percent,
    gained,
    remaining: Math.max(0, next.minRep - reputation),
  };
}

/** Color based on subscription tier (role), not reputation rank */
export function getRoleTierColor(role: string): string {
  switch (role) {
    case "admin":
    case "instructor": return "#f59e0b"; // amber
    case "premium":    return "#22c55e"; // green
    case "pro":        return "#3b82f6"; // blue
    default:           return "#71717a"; // zinc (free)
  }
}

export function formatRep(rep: number): string {
  if (rep >= 1000) return `${(rep / 1000).toFixed(rep % 1000 === 0 ? 0 : 1)}k`;
  return rep.toLocaleString("pt-BR");
}
