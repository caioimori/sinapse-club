"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const testimonials = [
  {
    name: "Ricardo",
    role: "Dono de agencia de marketing digital, Sao Paulo",
    text: "Eu tinha 8 pessoas no time e margem de 18%. Depois que entrei na SINAPSE e implementei as automacoes que aprendi no forum, opero com 4 pessoas e margem de 34%. O forum me economizou meses de tentativa e erro.",
  },
  {
    name: "Fernanda",
    role: "E-commerce de moda feminina, Belo Horizonte",
    text: "70% dos tickets de atendimento resolvidos sem humano. Resposta media caiu de 4 horas pra 3 minutos. Aprendi a configurar tudo em uma semana seguindo os tutoriais que membros compartilharam no forum.",
  },
  {
    name: "Patricia",
    role: "Consultora de gestao empresarial, Curitiba",
    text: "Fazia 3 propostas por semana e levava 4 horas em cada uma. Agora faco 3 por dia com o mesmo nivel de personalizacao. Meu fechamento subiu 40%. A SINAPSE me deu clareza sobre qual IA usar pra que.",
  },
  {
    name: "Thiago",
    role: "Fundador de SaaS B2B, Florianopolis",
    text: "Eu gastava R$12k/mes com um time de conteudo. Hoje gasto R$3k e produzo 3x mais. O stack de IA que montei com ajuda da comunidade mudou completamente minha estrutura de custos.",
  },
  {
    name: "Marcos",
    role: "Infoprodutor, Rio de Janeiro",
    text: "Ja tinha comprado 4 cursos de IA e nao implementei nada. Na SINAPSE, em 2 semanas eu tinha meu primeiro agente de atendimento rodando. A diferenca e que aqui tem gente real pra tirar duvida quando voce empaca.",
  },
  {
    name: "Juliana",
    role: "Advogada empresarial, Brasilia",
    text: "Eu achava que IA nao era pra minha area. Em 1 mes na SINAPSE, automatizei a triagem de contratos e a geracao de pecas iniciais. Economizo 15 horas por semana. E nao precisei aprender a programar.",
  },
  {
    name: "Gustavo",
    role: "Coach de negocios, Porto Alegre",
    text: "Meus clientes estavam me perguntando sobre IA e eu nao sabia responder. Entrei na SINAPSE pra me atualizar e acabei transformando minha propria operacao. Hoje oferto consultoria de IA como servico adicional.",
  },
  {
    name: "Amanda",
    role: "Designer e estrategista digital, Recife",
    text: "Eu era freelancer trabalhando 14 horas por dia. Com as automacoes que aprendi na SINAPSE, reduzi pra 8 horas e atendo o triplo de clientes. Estou migrando de freelancer pra micro-agencia. Sem contratar ninguem.",
  },
  {
    name: "Eduardo",
    role: "Dono de rede de franquias de alimentacao, Campinas",
    text: "Gerencio 12 unidades. Antes, cada relatorio mensal levava 3 dias. Agora leva 3 horas. A troca no forum com outros empresarios de operacao me deu ideias que nunca teria sozinho.",
  },
  {
    name: "Camila",
    role: "Agencia de servicos B2B, Goiania",
    text: 'Cancelei meu mastermind de R$5k/mes e entrei na SINAPSE por R$27. Sinceramente? Aprendo mais aqui. A qualidade da troca no forum e absurda. E o melhor: todo mundo fala de resultado, nao de "mentalidade".',
  },
];

export function SocialProof() {
  return (
    <section className="relative px-5 py-20 md:px-6 md:py-32" id="prova-social">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="text-center text-[#888]">
            Empresarios de agencias de marketing, e-commerces, consultorias,
            SaaS, escritorios de advocacia e franquias. Gente que fatura de
            R$30 mil a R$5 milhoes por mes. Todos aplicando IA na operacao
            real e trocando resultados no forum.
          </p>
        </ScrollReveal>

        {/* Testimonials grid */}
        <StaggerContainer
          className="mt-12 grid gap-4 md:grid-cols-2"
          staggerDelay={0.06}
        >
          {testimonials.map((t, i) => (
            <StaggerItem key={i} animation="fade-up">
              <div className="flex h-full flex-col rounded-lg border border-[#222] bg-[#0F0F0F] p-6 transition-colors duration-200 hover:border-[#333]">
                <p className="flex-1 text-sm leading-relaxed text-[#CCC]">
                  &quot;{t.text}&quot;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-[#1A1A1A] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-semibold text-[#888]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F5F5F5]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#555]">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Forum as proof */}
        <ScrollReveal className="mt-16 text-center">
          <p className="text-lg text-[#F5F5F5]">
            Nao acredita? O forum esta la. As threads sao reais. Os membros sao
            verificados. Nao prometemos. Mostramos. Entra e ve com seus olhos.
          </p>
          <a
            href="#oferta"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#F5F5F5] px-8 py-3 font-semibold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)]"
          >
            Quero entrar na SINAPSE
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
