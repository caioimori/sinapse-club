"use client";

import { MessagesSquare, Users, BookOpen, Trophy } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const blocks = [
  {
    icon: MessagesSquare,
    title: "Fórum 24/7",
    desc: "Categorias por área: marketing, vendas, operação, financeiro, automação. Pergunte de tarde, leia respostas à noite.",
  },
  {
    icon: Users,
    title: "Networking verificado",
    desc: "Donos de negócio reais. Sem perfil fake, sem influencer de IA, sem promessa furada.",
  },
  {
    icon: BookOpen,
    title: "Conteúdo de trincheira",
    desc: "Casos reais publicados toda semana. O que funcionou, o que não funcionou e por quê.",
  },
  {
    icon: Trophy,
    title: "Gamificação com propósito",
    desc: "Ranks, streaks e leaderboard. Quem mais ajuda sobe. Quem mais aprende fica.",
  },
];

export function LpSolution() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.1,
  });

  return (
    <section id="solucao" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-[13px] tracking-tight text-muted-foreground">
            {"//solucao"}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Quatro coisas que um grupo
            <br />
            <span className="text-muted-foreground">de WhatsApp nunca vai te dar.</span>
          </h2>
        </div>

        <div ref={ref} className="grid gap-6 sm:grid-cols-2">
          {blocks.map((b, i) => (
            <div
              key={b.title}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[var(--shadow-lg)]",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-foreground/0 blur-2xl transition-all duration-700 group-hover:bg-foreground/[0.04]"
              />
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-muted transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-4deg] group-hover:bg-foreground group-hover:text-background">
                <b.icon className="size-5 transition-colors" />
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {b.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
