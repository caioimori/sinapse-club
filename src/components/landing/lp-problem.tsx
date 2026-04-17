"use client";

import { Clock, Wallet, Network } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const problems = [
  {
    icon: Clock,
    title: "Você perde tempo na curva",
    desc: "Tutorial no YouTube, vídeo em inglês, ferramenta nova toda semana. Três meses depois, ainda sem implementar nada.",
  },
  {
    icon: Wallet,
    title: "Você paga caro pelo errado",
    desc: "Assinatura de IA que não usa, automação mal feita, consultor que cobra R$ 5k pra te entregar prompt.",
  },
  {
    icon: Network,
    title: "Você está sozinho na decisão",
    desc: "Ninguém na sua bolha entende. WhatsApp é bagunça. LinkedIn é teoria. Você precisa de quem já fez.",
  },
];

export function LpProblem() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.1,
  });

  return (
    <section id="problema" className="border-t border-border bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-[13px] tracking-tight text-muted-foreground">
            {"//problema"}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            IA virou ruído. E você
            <br />
            precisa de sinal.
          </h2>
        </div>

        <div ref={ref} className="grid gap-6 md:grid-cols-3">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className={cn(
                "group rounded-2xl border border-border bg-background p-7 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[var(--shadow-md)]",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-5 inline-flex size-10 items-center justify-center rounded-full bg-muted transition-all duration-500 group-hover:scale-110 group-hover:bg-foreground group-hover:text-background">
                <p.icon className="size-4 transition-colors" />
              </div>
              <h3 className="mb-2 text-base font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
