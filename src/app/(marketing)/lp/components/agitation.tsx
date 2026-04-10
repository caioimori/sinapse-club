"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const pains = [
  {
    title: '"Estou ficando para tras."',
    body: "Voce ve todo mundo falando de IA e nao sabe O QUE fazer no SEU negocio. Cada semana sem agir, a distancia aumenta.",
  },
  {
    title: '"Meu time custa caro e nao escala."',
    body: "Cada novo funcionario e mais CLT, mais gestao, mais dor de cabeca. Voce precisa de mais resultado, nao de mais gente.",
  },
  {
    title: '"Nao tenho com quem trocar."',
    body: "Seu socio nao se interessa. Seus amigos acham que e coisa de TI. Voce esta sozinho tentando descobrir o caminho.",
  },
  {
    title: '"Tentei e nao deu certo."',
    body: "Assinou uma ferramenta de IA, nao viu resultado. Mas no fundo sabe que esta usando errado. Falta metodo, nao ferramenta.",
  },
  {
    title: '"Informacao demais, clareza de menos."',
    body: "Cada dia tem ferramenta nova, tecnica nova. Voce nao consegue filtrar o que importa. O excesso virou paralisia.",
  },
  {
    title: '"Nao tenho tempo pra estudar."',
    body: "Voce opera 12 horas por dia. Precisa de algo pratico, digerido, aplicavel em 30 minutos. IA de trincheira, nao de sala de aula.",
  },
];

export function Agitation() {
  return (
    <section className="border-t border-border py-24" id="agitacao">
      <div className="mx-auto max-w-5xl px-4">
        {/* Headline */}
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight">
              Voce ja sabe que IA vai mudar tudo.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              O problema e que &quot;saber&quot; nao paga boleto.
            </p>
          </div>
        </ScrollReveal>

        {/* Context */}
        <ScrollReveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-border bg-card p-6 md:p-8">
            <p className="text-muted-foreground leading-relaxed">
              Seu concorrente ja automatizou atendimento, gera proposta em 20 minutos e opera
              com metade do time. Voce testou ferramentas, assistiu tutoriais e nao implementou nada.
              Nao e falta de vontade. E falta de metodo e comunidade.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 pains */}
        <StaggerContainer
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.07}
        >
          {pains.map((pain, i) => (
            <StaggerItem key={i} animation="fade-up">
              <div className="h-full rounded-xl border border-border bg-card p-5 transition-all hover:border-border/60">
                <h3 className="text-sm font-semibold text-foreground">{pain.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pain.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Consequence + transition */}
        <ScrollReveal className="mt-12">
          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 md:p-8">
            <p className="text-lg font-semibold text-foreground">
              O custo de esperar nao e zero.
            </p>
            <p className="mt-3 text-muted-foreground">
              E o salario do funcionario desnecessario. O cliente perdido por demora.
              A margem que encolheu porque voce nao automatizou.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-12 text-center">
          <p className="text-xl font-semibold text-foreground">
            Empresarios que estavam exatamente onde voce esta resolveram isso. Juntos.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
