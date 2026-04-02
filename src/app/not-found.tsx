import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-foreground/20">404</h1>
        <h2 className="text-xl font-semibold">Pagina nao encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          A pagina que voce esta procurando nao existe ou foi movida.
        </p>
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Voltar ao forum
        </Link>
      </div>
    </div>
  );
}
