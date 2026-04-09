"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const benefits = [
  {
    icon: "forum",
    color: "blue",
    badge: "R$27/mes",
    title: "Forum SINAPSE",
    feature:
      "Forum ativo com categorias de alto valor, threads diarias, ranking de membros, networking com empresarios verificados.",
    benefit:
      "Voce nao precisa descobrir nada sozinho. Toda duvida que voce tem, alguem ja resolveu. Toda ferramenta que voce quer testar, alguem ja testou. Toda dor que voce sente, alguem ja passou.",
    impact:
      "Em vez de perder 6 horas pesquisando no Google, voce faz uma pergunta no forum e em 30 minutos tem a resposta de quem ja fez. Isso e 5 horas e meia da sua semana de volta. Por R$27/mes.",
  },
  {
    icon: "courses",
    color: "green",
    badge: "Em breve",
    title: "Cursos Praticos de IA Aplicada",
    feature:
      "Cursos praticos de IA aplicada a negocios. O primeiro curso esta chegando.",
    benefit:
      "Formacao pratica, modular, que voce consome no seu ritmo. Feito por quem opera IA no dia a dia, nao por quem leu sobre.",
    impact:
      "Voce aprende a montar seu stack de IA, o conjunto de ferramentas e automacoes customizado pro seu negocio. Em semanas, nao em anos.",
    note: "Cursos sao adquiridos separadamente do forum. O primeiro curso de IA aplicada chega em breve.",
  },
  {
    icon: "mentoria",
    color: "amber",
    badge: "Vagas limitadas",
    title: "Mentoria com os Fundadores",
    feature:
      'Acesso direto a Caio e Matheus. Mentoria em grupo e individual. Nao a "mentores certificados". Aos fundadores.',
    benefit:
      '"faz isso, ignora aquilo, automatiza por aqui." Nao e conselho generico. E implementacao guiada.',
    impact:
      "O empresario que trabalha sozinho erra 10 vezes antes de acertar. Com mentoria, voce pula direto pro que funciona. Economia de meses de tentativa e erro.",
    note: "A mentoria tem vagas limitadas e venda consultiva. Agende uma conversa pra saber se faz sentido pro seu momento.",
  },
  {
    icon: "conteudo",
    color: "blue",
    badge: "Incluso no forum",
    title: "Conteudo de Trincheira",
    feature:
      "Conteudo criado por quem opera IA no dia a dia. Reviews honestos de ferramentas, tutoriais praticos, cases reais de membros.",
    benefit:
      "Zero teoria academica. Tudo que voce le aqui ja foi testado em negocio real. Se nao funciona, a gente fala. Honestidade brutal como principio.",
    impact:
      "Voce para de gastar R$200/mes em ferramenta que nao serve e comeca a investir no que realmente move o ponteiro.",
  },
  {
    icon: "networking",
    color: "blue",
    badge: "Incluso no forum",
    title: "Networking com Empresarios que Usam IA",
    feature:
      "Rede de empresarios de diferentes setores, todos usando IA na operacao.",
    benefit:
      "Validacao, troca real, parcerias. Voce conversa com gente que entende a pressao de ter negocio e a oportunidade da IA ao mesmo tempo.",
    impact:
      "O dono de agencia que automatizou propostas compartilha o passo a passo. O dono de e-commerce que cortou posicoes mostra como. Voce nao precisa inventar. Precisa copiar o que funciona.",
  },
];

const colorMap: Record<string, { badge: string; accent: string }> = {
  blue: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accent: "border-blue-500/20",
  },
  green: {
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
    accent: "border-green-500/20",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    accent: "border-amber-500/20",
  },
};

const iconMap: Record<string, string> = {
  forum: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  courses: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  mentoria: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  conteudo: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  networking: "M13 10V3L4 14h7v7l9-11h-7z",
};

export function Benefits() {
  return (
    <section className="relative px-5 py-20 md:px-6 md:py-32" id="beneficios">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(2rem,3.5vw,3rem)] font-bold text-[#F5F5F5]">
            O que voce recebe
          </h2>
        </ScrollReveal>

        {/* Benefit cards */}
        <StaggerContainer className="mt-16 space-y-8" staggerDelay={0.12}>
          {benefits.map((b, i) => {
            const colors = colorMap[b.color];
            return (
              <StaggerItem key={i} animation="fade-up">
                <div
                  className={`rounded-xl border border-[#222] bg-[#0F0F0F] p-6 transition-colors duration-200 hover:border-[#333] md:p-8`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg border border-[#222] bg-[#1A1A1A] p-3">
                      <svg
                        className="h-6 w-6 text-[#888]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={iconMap[b.icon]}
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-[#F5F5F5]">
                          {b.title}
                        </h3>
                        <span
                          className={`rounded-full border px-3 py-0.5 text-xs font-medium ${colors.badge}`}
                        >
                          {b.badge}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[#888]">{b.feature}</p>
                      <p className="mt-3 text-[#CCC]">{b.benefit}</p>
                      <p className="mt-3 text-sm text-[#888]">{b.impact}</p>
                      {b.note && (
                        <p className="mt-3 text-xs italic text-[#555]">
                          {b.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Ecosystem block */}
        <ScrollReveal className="mt-16">
          <div className="rounded-xl border border-[#222] bg-gradient-to-b from-[#111] to-[#0A0A0A] p-8 text-center">
            <h3 className="text-xl font-semibold text-[#F5F5F5]">
              Forum. Cursos. Mentoria. Cada passo no seu ritmo.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-[#888]">
              Entra pelo forum a R$27/mes. Se quiser ir mais fundo, cursos
              praticos de IA aplicada estao chegando. Se quiser alguem olhando
              especificamente pro seu negocio, a mentoria com os fundadores ja
              esta disponivel. Voce decide ate onde quer ir.
            </p>
            <a
              href="#oferta"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-[#F5F5F5] px-8 py-3 font-semibold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)]"
            >
              Entrar no forum por R$27/mes
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
