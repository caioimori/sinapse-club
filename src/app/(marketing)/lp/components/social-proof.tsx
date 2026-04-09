"use client";

import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const testimonials = [
  {
    name: "Ricardo",
    role: "Agencia de marketing digital · SP",
    text: "Eu tinha 8 pessoas no time e margem de 18%. Depois de implementar as automacoes que aprendi no forum, opero com 4 pessoas e margem de 34%.",
    highlight: "Margem: 18% → 34%",
  },
  {
    name: "Fernanda",
    role: "E-commerce de moda feminina · BH",
    text: "70% dos tickets resolvidos sem humano. Resposta media caiu de 4 horas pra 3 minutos. Aprendi tudo em uma semana seguindo tutoriais do forum.",
    highlight: "Atendimento: 4h → 3min",
  },
  {
    name: "Patricia",
    role: "Consultora de gestao · Curitiba",
    text: "Fazia 3 propostas por semana. Agora faco 3 por dia com o mesmo nivel de personalizacao. Fechamento subiu 40%.",
    highlight: "Propostas: 3/sem → 3/dia",
  },
  {
    name: "Thiago",
    role: "Fundador de SaaS B2B · Florianopolis",
    text: "Gastava R$12k/mes com time de conteudo. Hoje gasto R$3k e produzo 3x mais. O stack que montei com ajuda da comunidade mudou minha estrutura de custos.",
    highlight: "Custo: R$12k → R$3k/mes",
  },
  {
    name: "Juliana",
    role: "Advogada empresarial · Brasilia",
    text: "Achava que IA nao era pra minha area. Em 1 mes, automatizei triagem de contratos. Economizo 15 horas por semana. Sem programar nada.",
    highlight: "15h economizadas por semana",
  },
  {
    name: "Camila",
    role: "Agencia de servicos B2B · Goiania",
    text: "Cancelei meu mastermind de R$5k/mes e entrei na SINAPSE por R$27. Aprendo mais aqui. Todo mundo fala de resultado, nao de mentalidade.",
    highlight: "R$5k/mes → R$27/mes",
  },
];

export function SocialProof() {
  return (
    <section className="py-24 border-t border-border" id="prova-social">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight">
              Quem ja esta dentro
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Agencias, e-commerces, consultorias, SaaS, escritorios de advocacia e franquias.
              Todos aplicando IA na operacao real.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials grid */}
        <StaggerContainer
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.06}
        >
          {testimonials.map((t, i) => (
            <StaggerItem key={i} animation="fade-up">
              <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-border/60 hover:-translate-y-0.5">
                {/* Highlight badge */}
                <span
                  className="self-start rounded-full px-2.5 py-0.5 text-xs font-semibold mb-3"
                  style={{
                    background: "rgba(32,189,90,0.12)",
                    color: "#20BD5A",
                    border: "1px solid rgba(32,189,90,0.25)",
                  }}
                >
                  {t.highlight}
                </span>

                <p className="flex-1 text-sm leading-relaxed text-foreground/80">
                  &quot;{t.text}&quot;
                </p>

                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "#20BD5A" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground/60">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Forum as proof */}
        <ScrollReveal className="mt-12 text-center">
          <p className="text-base text-muted-foreground">
            O forum esta la. As threads sao reais. Nao prometemos. Mostramos.
          </p>
          <a href="https://forum.sinapse.club/auth" className="mt-6 inline-block">
            <Button size="lg" className="bg-[#20BD5A] text-white border-0 hover:bg-[#1aa04d] px-8 text-base">
              Quero entrar na SINAPSE
            </Button>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
