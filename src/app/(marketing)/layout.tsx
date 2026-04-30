import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <footer className="border-t border-border bg-background">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} sinapse.club — Todos os direitos reservados</p>
          <nav className="flex items-center gap-6">
            <Link href="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <a href="mailto:contato@sinapse.club" className="hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
