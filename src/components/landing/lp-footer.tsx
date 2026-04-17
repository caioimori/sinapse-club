import Link from "next/link";

export function LpFooter() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" aria-label="sinapse.club" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/sinapse.svg" alt="sinapse" className="h-6 w-auto" />
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/privacidade"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacidade
            </Link>
            <Link
              href="/termos"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Termos
            </Link>
            <Link
              href="/privacidade/dpo"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              DPO
            </Link>
            <a
              href="mailto:contato@sinapse.club"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Contato
            </a>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} sinapse.club
          </p>
        </div>
      </div>
    </footer>
  );
}
