import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LpHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Subtle background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Eyebrow badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-foreground animate-pulse" />
          Comunidade ativa · vagas de fundador abertas
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
          IA na operação.
          <br />
          <span className="text-muted-foreground">Sem teoria.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
          A comunidade onde donos de negócio aplicam IA para reduzir custo,
          escalar entrega e ganhar tempo. Fórum 24/7, conteúdo de trincheira,
          networking verificado. A partir de R$ 22,90/mês.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="#pricing">
            <Button
              size="lg"
              className="h-12 bg-foreground text-background border-0 px-7 text-sm font-semibold"
            >
              Ver planos e começar
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="#solucao">
            <Button
              size="lg"
              variant="ghost"
              className="h-12 px-5 text-sm text-muted-foreground hover:text-foreground"
            >
              Como funciona
            </Button>
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-6 text-xs text-muted-foreground">
          7 dias de garantia legal · cancele quando quiser
        </p>
      </div>
    </section>
  );
}
