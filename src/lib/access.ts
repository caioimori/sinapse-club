import type { UserRole, ForumAccess } from "@/types/database";

// ─── Tier rank mapping (mirrors DB role_rank function) ───

const ROLE_RANKS: Record<UserRole, number> = {
  free: 10,
  pro: 20,
  premium: 30,
  instructor: 90,
  admin: 100,
};

export function roleRank(role: string): number {
  return ROLE_RANKS[role as UserRole] ?? 0;
}

/** @deprecated Use roleRank instead */
export const getRoleRank = roleRank;

/**
 * Check if a user role meets or exceeds the required tier.
 */
export function hasAccess(userRole: string, requiredRole: string): boolean {
  return roleRank(userRole) >= roleRank(requiredRole);
}

// ─── Convenience helpers ───

export function isProOrAbove(role: string): boolean {
  return roleRank(role) >= ROLE_RANKS.pro;
}

export function isPremiumOrAbove(role: string): boolean {
  return roleRank(role) >= ROLE_RANKS.premium;
}

export function isAdmin(role: string): boolean {
  return roleRank(role) >= ROLE_RANKS.admin;
}

export function isInstructorOrAbove(role: string): boolean {
  return roleRank(role) >= ROLE_RANKS.instructor;
}

// ─── Course access ───

export function canAccessCourse(
  userRole: string,
  isEnrolled: boolean,
  includedInPremium: boolean,
): boolean {
  if (isEnrolled) return true;
  if (isAdmin(userRole) || isInstructorOrAbove(userRole)) return true;
  if (includedInPremium && isPremiumOrAbove(userRole)) return true;
  return false;
}

// ─── Feature flags per tier ───

export const TIER_FEATURES = {
  free: {
    maxThreadsPerMonth: 3,
    forum: true,
    forumCategoriesPro: false,
    marketplace: false,
    tools: false,
    benefits: false,
    coursesIncludedInPremium: false,
  },
  pro: {
    maxThreadsPerMonth: Infinity,
    forum: true,
    forumCategoriesPro: true,
    marketplace: true,
    tools: true,
    benefits: true,
    coursesIncludedInPremium: false,
  },
  premium: {
    maxThreadsPerMonth: Infinity,
    forum: true,
    forumCategoriesPro: true,
    marketplace: true,
    tools: true,
    benefits: true,
    coursesIncludedInPremium: true,
  },
  admin: {
    maxThreadsPerMonth: Infinity,
    forum: true,
    forumCategoriesPro: true,
    marketplace: true,
    tools: true,
    benefits: true,
    coursesIncludedInPremium: true,
  },
  instructor: {
    maxThreadsPerMonth: Infinity,
    forum: true,
    forumCategoriesPro: true,
    marketplace: true,
    tools: true,
    benefits: true,
    coursesIncludedInPremium: true,
  },
} as const satisfies Record<string, Record<string, unknown>>;

export function getTierFeatures(role: string) {
  return TIER_FEATURES[role as keyof typeof TIER_FEATURES] ?? TIER_FEATURES.free;
}

// ─── Forum category access ───

/** All categories are visible (lock icon UX handled in TIERS-3) */
export function canViewCategory(_userRole: string, _categoryAccess: ForumAccess): boolean {
  return true;
}

export function canPostInCategory(userRole: string, categoryAccess: ForumAccess): boolean {
  return hasAccess(userRole, categoryAccess);
}

// ─── Labels & formatting ───

export const TIER_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
  admin: "Admin",
  instructor: "Instrutor",
};

export function formatPriceBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

// Re-export the type for convenience
export type { UserRole };
