"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./motion-wrapper";

export function CTAFinal() {
  return (
    <section className="border-t border-border bg-card py-24" id="cta-final">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight">
            A decisao e sua.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-4 text-muted-foreground">
            Forum ativo. Empresarios que aplicam IA de verdade. Cursos chegando.
            Mentoria disponivel. Por R$27/mes.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div
            className="mx-auto mt-8 max-w-lg rounded-xl p-6"
            style={{
              background: "rgba(32,189,90,0.12)",
              border: "1px solid rgba(32,189,90,0.25)",
            }}
          >
            <p className="text-foreground font-medium">
              Voce pode aprender sozinho em 2 anos. Ou com a comunidade em 2 meses.
              O mercado nao vai esperar voce se sentir pronto.
            </p>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.2} className="mt-8">
          <a href="https://forum.sinapse.club/auth" className="inline-block">
            <Button size="lg" className="bg-[#20BD5A] text-white border-0 hover:bg-[#1aa04d] px-10 py-6 text-lg">
              Entrar pra SINAPSE agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </ScrollReveal>

        {/* Reassurance */}
        <ScrollReveal delay={0.25}>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
            Comunidade de empresarios verificados. R$27/mes protegido por
            7 dias de garantia. Devolucao total, sem burocracia.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/50">
            R$27/mes · Cancele quando quiser · Garantia de 7 dias
          </p>
        </ScrollReveal>

        {/* Footer note */}
        <ScrollReveal delay={0.3} className="mt-12">
          <p className="mx-auto max-w-md text-sm text-muted-foreground/50 italic">
            A SINAPSE nao e pra todo mundo. E pra quem quer resultado, nao diploma.
            Pra quem quer aplicar, nao estudar. Se voce e esse empresario,
            a gente esta te esperando la dentro.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
