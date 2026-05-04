import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pagamento nao completou — sinapse.club",
  description: "Algo deu errado no processamento do pagamento. Tente novamente.",
};

export default async function PagamentoFalhouPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; plan?: string }>;
}) {
  const { error, plan } = await searchParams;
  const retryHref = plan ? `/checkout/${plan}` : "/pricing";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto grid min-h-dvh w-full max-w-screen-2xl grid-cols-1 items-center px-[clamp(1.25rem,5vw,4rem)] py-24 lg:grid-cols-12 lg:gap-16">
        <div
          className="space-y-10 lg:col-span-7 lg:col-start-2"
          style={{ maxWidth: "clamp(20rem, 60vw, 44rem)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Status · transacao
          </p>

          <h1 className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.95] tracking-tight">
            Pagamento
            <br />
            nao completou.
          </h1>

          {error && (
            <p className="border-l-2 border-destructive pl-4 text-[15px] leading-relaxed text-foreground/80">
              {decodeURIComponent(error)}
            </p>
          )}

          <div className="space-y-3 border-t border-border pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              O que pode ter acontecido
            </p>
            <ul className="space-y-1.5 text-[14px] leading-relaxed text-foreground/80">
              <li>Cartao recusado pela operadora</li>
              <li>Limite insuficiente ou bloqueio pra compras online</li>
              <li>Dados incorretos (numero, validade ou CVV)</li>
              <li>Antifraude do banco bloqueou a transacao</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={retryHref}
              className="flex h-12 w-full items-center justify-center bg-foreground text-sm font-medium uppercase tracking-wider text-background transition-colors hover:bg-foreground/90"
            >
              Tentar novamente
            </Link>
            <Link
              href="/"
              className="block w-full text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Voltar pro inicio
            </Link>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
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
  );
}
