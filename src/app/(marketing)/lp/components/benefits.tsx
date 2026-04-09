"use client";

import { MessageSquare, BookOpen, Users, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";
import type { LucideIcon } from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  color: "blue" | "green" | "amber";
  badge: string;
  title: string;
  feature: string;
  benefit: string;
  impact: string;
  note?: string;
}

const benefits: Benefit[] = [
  {
    icon: MessageSquare,
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
    icon: BookOpen,
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
    icon: Users,
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
    icon: FileText,
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
    icon: Zap,
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

const colorMap = {
  blue: {
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    icon: "text-blue-400",
  },
  green: {
    badge: "bg-green-500/10 text-green-400 border border-green-500/20",
    icon: "text-green-400",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    icon: "text-amber-400",
  },
};

export function Benefits() {
  return (
    <section className="border-t border-border bg-card py-24" id="beneficios">
      <div className="mx-auto max-w-5xl px-4">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-tight">
            O que voce recebe
          </h2>
        </ScrollReveal>

        {/* Benefit cards */}
        <StaggerContainer className="mt-16 space-y-6" staggerDelay={0.12}>
          {benefits.map((b, i) => {
            const colors = colorMap[b.color];
            const Icon = b.icon;
            return (
              <StaggerItem key={i} animation="fade-up">
                <div className="rounded-xl border border-border bg-background p-6 transition-all hover:shadow-[var(--shadow-card-hover)] md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-xl border border-border bg-card p-3">
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {b.title}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-mono uppercase tracking-widest ${colors.badge}`}
                        >
                          {b.badge}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{b.feature}</p>
                      <p className="mt-3 text-foreground/80">{b.benefit}</p>
                      <p className="mt-3 text-sm text-muted-foreground">{b.impact}</p>
                      {b.note && (
                        <p className="mt-3 text-xs italic text-muted-foreground/60">
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
          <div className="rounded-xl ring-1 ring-foreground/10 bg-background p-8 text-center md:p-10">
            <h3 className="text-xl font-semibold text-foreground">
              Forum. Cursos. Mentoria. Cada passo no seu ritmo.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Entra pelo forum a R$27/mes. Se quiser ir mais fundo, cursos
              praticos de IA aplicada estao chegando. Se quiser alguem olhando
              especificamente pro seu negocio, a mentoria com os fundadores ja
              esta disponivel. Voce decide ate onde quer ir.
            </p>
            <a href="#oferta" className="mt-6 inline-block">
              <Button size="lg" className="bg-foreground border-0 text-base px-8">
                Entrar no forum por R$27/mes
              </Button>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
