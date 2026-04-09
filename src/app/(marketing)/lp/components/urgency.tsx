"use client";

import { ScrollReveal } from "./motion-wrapper";

export function Urgency() {
  return (
    <section className="py-24" id="urgencia">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight tracking-tight">
              A janela de vantagem esta aberta agora.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-muted-foreground">
              Em 2024, IA era curiosidade. Em 2025, virou ferramenta. Em 2026,
              quem nao usa perde competitividade.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-muted-foreground">
              A janela de vantagem esta aberta agora. Esse e o periodo em que
              empresarios que implementam IA constroem diferencial real sobre quem
              espera. Quem monta seu stack de IA hoje opera a uma fracao do custo
              de quem vai comecar amanha. E essa vantagem se acumula. Cada mes na
              frente e um mes de otimizacao que o concorrente nao tem.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mt-4 text-muted-foreground">
              A SINAPSE ja esta ativa. O forum esta rodando. Empresarios ja estao
              trocando. Quanto mais voce espera, mais conteudo, mais conexoes e
              mais oportunidades passam sem voce.
            </p>
          </ScrollReveal>

          {/* Cost of inaction */}
          <ScrollReveal className="mt-12">
            <div className="rounded-xl ring-1 ring-foreground/10 bg-card p-8">
              <p className="text-lg font-medium text-foreground">
                Voce esta pagando mais do que devia e trabalhando mais do que
                precisava.
              </p>
              <p className="mt-4 text-muted-foreground">
                Cada mes sem IA e o salario de um funcionario que voce nao
                precisava contratar. E a proposta que seu concorrente entregou em
                20 minutos enquanto voce levou 4 horas. E a margem que encolheu
                porque voce nao otimizou o que podia ser automatizado.
              </p>
              <p className="mt-4 text-muted-foreground">
                O custo da SINAPSE e R$27/mes. Visivel, claro, sem surpresa. O
                custo de NAO estar na SINAPSE e invisivel. Mas real. E cresce todo
                mes.
              </p>
              <p className="mt-4 font-medium text-foreground">
                Voce pode aprender sozinho em 2 anos. Ou com a gente em 2 meses. O
                mercado nao vai esperar voce se sentir pronto.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
