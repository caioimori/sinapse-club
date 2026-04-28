import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ResendLink } from "./resend-link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bem-vindo — sinapse.club",
};

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; email?: string }>;
}) {
  const { plan, email } = await searchParams;

  // If the user already has a session (clicked the magic link and bounced
  // back), send them straight to the forum.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/forum");
  }

  const cleanEmail = email?.trim().toLowerCase() ?? null;

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
          <CheckCircle className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Pagamento confirmado!</h1>
          <p className="text-sm text-muted-foreground">
            {plan ? (
              <>
                Seu plano <strong className="text-foreground">{plan}</strong> ja
                esta ativo.
              </>
            ) : (
              "Seu plano ja esta ativo."
            )}
          </p>
        </div>

        {cleanEmail && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-left text-sm space-y-2">
            <p className="flex items-start gap-2 text-foreground">
              <Mail
                className="mt-0.5 h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              />
              <span>
                Enviamos um link magico para{" "}
                <strong>{cleanEmail}</strong>. Clique nele para entrar na
                plataforma.
              </span>
            </p>
            <p className="text-xs text-muted-foreground pl-6">
              Nao chegou em 1 minuto? Verifique a caixa de spam ou promocoes.
            </p>
          </div>
        )}

        {cleanEmail && <ResendLink email={cleanEmail} />}

        <div className="pt-2 space-y-2 text-sm">
          <Link
            href={`/register${plan ? `?plan=${plan}${cleanEmail ? `&email=${encodeURIComponent(cleanEmail)}&prefilled=1` : ""}` : ""}`}
            className="block text-muted-foreground hover:text-foreground"
          >
            Prefere criar uma senha?
          </Link>
          <Link
            href="/login"
            className="block text-muted-foreground hover:text-foreground"
          >
            Ja tenho conta — fazer login
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          Problemas? Mande um email para{" "}
          <a
            href="mailto:contato@sinapse.club"
            className="text-foreground underline"
          >
            contato@sinapse.club
          </a>
        </p>
      </div>
    </div>
  );
}
