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
    <div className="min-h-dvh bg-background text-foreground py-16 px-6">
      <div className="mx-auto max-w-2xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Status · transacao
          </p>
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Pagamento nao completou
          </h1>
          {error && (
            <p className="text-base text-foreground/80 border-l-2 border-destructive pl-4">
              {decodeURIComponent(error)}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            O que pode ter acontecido
          </h2>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>— Cartao recusado pela operadora</li>
            <li>— Limite insuficiente ou cartao bloqueado pra compras online</li>
            <li>— Dados do cartao incorretos (numero, validade ou CVV)</li>
            <li>— Antifraude do banco bloqueou a transacao</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href={retryHref}
            className="block w-full bg-foreground text-background hover:bg-foreground/90 rounded-none h-12 flex items-center justify-center text-sm uppercase tracking-wider font-medium"
          >
            Tentar novamente
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Voltar pro inicio
          </Link>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{" "}
            <a
              href="mailto:contato@sinapse.club"
              className="text-foreground underline hover:opacity-70"
            >
              contato@sinapse.club
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
