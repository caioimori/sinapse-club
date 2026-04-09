"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const differentials = [
  {
    title: "Nao e um curso.",
    body: "Cursos vendem teoria. Aqui voce aplica no dia a dia, com gente no mesmo barco.",
  },
  {
    title: "Nao e grupo de WhatsApp.",
    body: "Grupos tem ruido. Aqui tem estrutura, categorias, busca e curadoria real.",
  },
  {
    title: "Nao e mastermind de R$10k/mes.",
    body: "Masterminds vendem acesso. A SINAPSE entrega acesso, formacao e comunidade por R$27.",
  },
  {
    title: "Nao e mais um infoproduto.",
    body: "Infoprodutos morrem no login. Aqui o forum tem threads novas todos os dias.",
  },
];

export function Transformation() {
  return (
    <section className="py-24 border-t border-border" id="virada">
      <div className="mx-auto max-w-5xl px-4">
        {/* Headline */}
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight">
              A SINAPSE e onde donos de negocio{" "}
              <span style={{ color: "#20BD5A" }}>aplicam IA na operacao real.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Nao estudam teoria. Aplicam. Testam. Compartilham o que funciona.
            </p>
          </div>
        </ScrollReveal>

        {/* Central promise */}
        <ScrollReveal delay={0.1} className="mt-10">
          <div
            className="mx-auto max-w-3xl rounded-2xl p-8 text-center md:p-10"
            style={{
              background: "rgba(32,189,90,0.12)",
              border: "1px solid rgba(32,189,90,0.25)",
            }}
          >
            <p className="text-xl font-semibold text-foreground leading-snug md:text-2xl">
              Reduza custos. Escale sem contratar.
              <br />
              Saia da operacao. Volte pra estrategia.
            </p>
            <p className="mt-3 text-muted-foreground">
              Com metodo, comunidade e formacao pratica. Sem precisar programar.
            </p>
          </div>
        </ScrollReveal>

        {/* Differentials 2x2 */}
        <StaggerContainer className="mt-12 grid gap-4 md:grid-cols-2" staggerDelay={0.08}>
          {differentials.map((diff, i) => (
            <StaggerItem key={i} animation="fade-up">
              <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-border/60">
                <h3 className="font-semibold text-foreground">{diff.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{diff.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Positioning */}
        <ScrollReveal className="mt-10 text-center">
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            A SINAPSE e a unica comunidade operacional de IA para negocios no Brasil.
            O espaco entre &quot;eu sei que IA existe&quot; e &quot;eu uso IA todo dia&quot;
            estava vazio. A gente ocupa esse espaco.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
