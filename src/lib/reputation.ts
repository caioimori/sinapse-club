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
