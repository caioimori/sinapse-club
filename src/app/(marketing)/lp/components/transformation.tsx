"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const differentials = [
  {
    title: "Nao e um curso.",
    body: "Cursos vendem teoria. A SINAPSE e pratica diaria no forum com gente que esta no mesmo barco.",
  },
  {
    title: "Nao e um grupo de WhatsApp.",
    body: "Grupos tem ruido. A SINAPSE tem conteudo estruturado, categorias, busca e curadoria.",
  },
  {
    title: "Nao e um mastermind de R$10k/mes.",
    body: "Masterminds vendem acesso. A SINAPSE entrega acesso, formacao e comunidade por R$27/mes.",
  },
  {
    title: "Nao e mais um infoproduto.",
    body: "Infoprodutos morrem no login. A SINAPSE tem forum vivo com threads diarias.",
  },
];

export function Transformation() {
  return (
    <section className="py-24" id="virada">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-3xl">
          {/* What it is */}
          <ScrollReveal>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-tight">
              A SINAPSE e a comunidade onde donos de negocio aplicam IA na
              operacao real.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-lg text-muted-foreground">
              Nao estudam teoria, nao assistem palestra. Aplicam. Testam. Medem
              resultado. E compartilham o que funciona.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-muted-foreground">
              Forum ativo com empresarios de verdade. Cursos praticos de IA
              aplicada chegando em breve. Mentoria direto com os fundadores ja
              disponivel.
            </p>
          </ScrollReveal>
        </div>

        {/* Central promise */}
        <ScrollReveal className="mt-16">
          <div className="rounded-xl ring-1 ring-foreground/10 bg-card p-8 text-center md:p-10">
            <p className="text-xl font-semibold text-foreground md:text-2xl">
              Reduza custos. Escale sem aumentar time. Saia da operacao e volte
              pra estrategia. Com metodo, comunidade e formacao pratica. Sem
              precisar programar uma linha de codigo.
            </p>
          </div>
        </ScrollReveal>

        {/* Differentials 2x2 */}
        <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
          {differentials.map((diff, i) => (
            <StaggerItem key={i} animation="fade-up">
              <div className="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
                <h3 className="font-semibold text-foreground">{diff.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{diff.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Positioning */}
        <ScrollReveal className="mt-16 text-center">
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A SINAPSE e a unica comunidade operacional de IA para negocios no
            Brasil. O espaco entre &quot;eu sei que IA existe&quot; e &quot;eu
            uso IA todo dia no meu negocio&quot; estava vazio. A SINAPSE ocupa
            esse espaco.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
