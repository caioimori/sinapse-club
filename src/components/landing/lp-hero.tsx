import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function LpHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Subtle background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.03] blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Eyebrow badge */}
        <div
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground opacity-0"
          style={{
            animation: "fade-in 0.6s ease-out 0.1s forwards",
          }}
        >
          <span className="size-1.5 rounded-full bg-foreground animate-pulse" />
          Soft launch · vagas de fundador abertas
        </div>

        {/* Headline */}
        <h1
          className="mb-6 text-5xl font-bold leading-[0.95] tracking-[-0.04em] opacity-0 sm:text-7xl lg:text-[5.25rem]"
          style={{
            animation: "text-reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards",
          }}
        >
          IA não é sobre ferramenta.
          <br />
          <span className="text-muted-foreground">É sobre operação.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-muted-foreground opacity-0 sm:text-lg"
          style={{
            animation: "fade-in-up 0.7s ease-out 0.45s forwards",
          }}
        >
          Fórum 24/7 de donos de negócio aplicando IA pra reduzir custo,
          escalar entrega e ganhar tempo. Sem teoria, sem guru, sem curso
          de R$ 5k. A partir de R$ 22,90/mês.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col items-center gap-3 opacity-0 sm:flex-row sm:justify-center"
          style={{
            animation: "fade-in-up 0.7s ease-out 0.6s forwards",
          }}
        >
          <Link
            href="#precos"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-12 bg-foreground text-background [a]:hover:bg-foreground/90 border-0 px-7 text-sm font-semibold shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5"
            )}
          >
            Ver planos
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="#solucao"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "h-12 px-5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            )}
          >
            Ver como funciona
          </Link>
        </div>

        {/* Trust line */}
        <p
          className="mt-6 text-xs text-muted-foreground opacity-0"
          style={{
            animation: "fade-in 0.6s ease-out 0.85s forwards",
          }}
        >
          7 dias de garantia · cancele quando quiser
        </p>
      </div>
    </section>
  );
}
