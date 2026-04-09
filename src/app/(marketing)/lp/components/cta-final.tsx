"use client";

import { ScrollReveal } from "./motion-wrapper";

export function CTAFinal() {
  return (
    <section className="relative px-5 py-20 md:px-6 md:py-32" id="cta-final">
      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <p className="text-lg text-[#888]">
            Forum ativo com empresarios que usam IA de verdade. Cursos praticos
            de IA aplicada chegando em breve. Mentoria com os fundadores ja
            disponivel.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-6 text-xl font-semibold text-[#F5F5F5] md:text-2xl">
            Por R$27/mes, voce entra no lugar onde empresarios como voce estao
            montando seus stacks de IA, cortando custos e construindo
            negocios-prova. Com metodo, com comunidade e com gente que ja fez
            dando suporte.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="mt-4 text-lg text-[#888]">
            A janela de vantagem esta aberta. A decisao e sua.
          </p>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.2}>
          <a
            href="https://forum.sinapse.club/auth"
            className="cta-pulse mt-8 inline-flex min-w-[280px] items-center justify-center rounded-md bg-[#F5F5F5] px-10 py-4 text-lg font-semibold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)]"
          >
            Entrar pra SINAPSE agora
          </a>
        </ScrollReveal>

        {/* Reassurance */}
        <ScrollReveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-lg text-sm text-[#888]">
            Voce esta entrando numa comunidade de empresarios verificados. Seu
            investimento de R$27/mes e protegido por 7 dias de garantia
            incondicional. Se nao fizer sentido, devolucao total sem burocracia.
          </p>
        </ScrollReveal>

        {/* Micro-copy */}
        <ScrollReveal delay={0.3}>
          <p className="mt-3 text-xs text-[#555]">
            R$27/mes. Cancele quando quiser. Garantia de 7 dias.
          </p>
        </ScrollReveal>

        {/* Footer note */}
        <ScrollReveal delay={0.35}>
          <p className="mx-auto mt-12 max-w-lg text-sm text-[#555]">
            A SINAPSE nao e pra todo mundo. E pra quem quer resultado, nao
            diploma. Pra quem quer aplicar, nao estudar. Pra quem quer vantagem
            competitiva real, nao mais um login esquecido. Se voce e esse
            empresario, a gente esta te esperando la dentro.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
