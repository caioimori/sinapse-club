import { redirect } from "next/navigation";
import { checkPaidTier, PAYWALL_ERROR_CODES } from "@/lib/access/paywall";

/**
 * Layout do forum — defense in depth (layer 3).
 * Camada 1: middleware redireciona free antes de renderizar.
 * Camada 2: RLS do Supabase (user_is_paid_member) bloqueia query.
 * Camada 3 (este arquivo): fallback caso middleware falhe (edge cases de routing),
 * previne flash de UI vazia para users free que driblem o middleware.
 */
export default async function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await checkPaidTier();

  if (!result.ok) {
    if (result.reason === PAYWALL_ERROR_CODES.UNAUTHENTICATED) {
      redirect("/login?redirect=/forum");
    }
    redirect("/pricing?upgrade=pro&from=/forum");
  }

  return <>{children}</>;
}
