import { createClient } from "@/lib/supabase/server";
import { roleRank } from "@/lib/access";

export const PAYWALL_ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  PAYWALL_BLOCKED: "PAYWALL_BLOCKED",
} as const;

export type PaywallErrorCode = typeof PAYWALL_ERROR_CODES[keyof typeof PAYWALL_ERROR_CODES];

export class PaywallError extends Error {
  code: PaywallErrorCode;
  constructor(code: PaywallErrorCode, message?: string) {
    super(message ?? code);
    this.name = "PaywallError";
    this.code = code;
  }
}

/**
 * requirePaidTier — throws PaywallError se user nao for autenticado
 * ou nao tiver role_rank >= 20 (pro/premium/instructor/admin).
 * Usar em server actions e API routes que exigem membership.
 */
export async function requirePaidTier() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new PaywallError(PAYWALL_ERROR_CODES.UNAUTHENTICATED, "Nao autenticado");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role ?? "free";

  if (roleRank(role) < 20) {
    throw new PaywallError(PAYWALL_ERROR_CODES.PAYWALL_BLOCKED, "Upgrade para Pro necessario");
  }

  return { supabase, user, role, profile };
}

/**
 * checkPaidTier — versao sem throw para usar em layouts/pages (preferir redirect).
 * Retorna { ok: false } se anon ou free.
 */
export async function checkPaidTier(): Promise<
  | { ok: true; userId: string; role: string }
  | { ok: false; reason: PaywallErrorCode }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: PAYWALL_ERROR_CODES.UNAUTHENTICATED };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role ?? "free";

  if (roleRank(role) < 20) {
    return { ok: false, reason: PAYWALL_ERROR_CODES.PAYWALL_BLOCKED };
  }

  return { ok: true, userId: user.id, role };
}
