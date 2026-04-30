import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Layout do forum — Cenario B (preview limitado pra free).
 *
 * Free LOGADO: pode ver listing do forum, mas detail pages redirecionam
 * pra /pricing e mutations sao bloqueadas no server (paywall.ts + RLS).
 * Anonimo: redireciona pra login (precisa de auth pra abrir o forum).
 *
 * Defesa em profundidade:
 * - Middleware: exige auth, nao bloqueia mais por tier em /forum.
 * - Layout (aqui): exige auth.
 * - Server actions (forum/actions.ts): requirePaidUser() em mutations.
 * - Thread detail page: redirect free pra /pricing.
 */
export default async function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/forum");
  }

  return <>{children}</>;
}
