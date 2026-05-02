import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-dvh bg-background text-foreground">
      <div className="absolute left-6 top-6 lg:left-12 lg:top-12">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Trocar plano
        </Link>
      </div>

      <div className="mx-auto grid min-h-dvh w-full max-w-screen-2xl grid-cols-1 items-center px-[clamp(1.25rem,5vw,4rem)] py-24 lg:grid-cols-12 lg:gap-16">
        <div
          className="space-y-10 lg:col-span-7 lg:col-start-2"
          style={{ maxWidth: "clamp(20rem, 60vw, 44rem)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Pagamento confirmado
          </p>

          <h1 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.95] tracking-tight">
            Bem-vindo.
          </h1>

          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {plan ? (
              <>
                Plano <span className="text-foreground">{plan}</span> ativo.{" "}
                {cleanEmail ? (
                  <>
                    Enviamos um link de acesso para{" "}
                    <span className="text-foreground">{cleanEmail}</span>. Clique
                    nele pra entrar.
                  </>
                ) : (
                  "Faca login pra entrar na plataforma."
                )}
              </>
            ) : cleanEmail ? (
              <>
                Enviamos um link de acesso para{" "}
                <span className="text-foreground">{cleanEmail}</span>. Clique
                nele pra entrar.
              </>
            ) : (
              "Faca login pra entrar na plataforma."
            )}
          </p>

          {cleanEmail && (
            <div className="space-y-3 border-t border-border pt-8">
              <ResendLink email={cleanEmail} />
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Nao chegou? Verifique spam ou promocoes.
              </p>
            </div>
          )}

          <div className="space-y-2 border-t border-border pt-8 text-[13px]">
            <Link
              href={`/register${plan ? `?plan=${plan}${cleanEmail ? `&email=${encodeURIComponent(cleanEmail)}&prefilled=1` : ""}` : ""}`}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              Prefere criar uma senha?
            </Link>
            <Link
              href="/login"
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              Ja tenho conta — fazer login
            </Link>
            <p className="pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Suporte ·{" "}
              <a
                href="mailto:contato@sinapse.club"
                className="text-foreground underline"
              >
                contato@sinapse.club
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
