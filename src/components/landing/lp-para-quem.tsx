"use client";

import { Briefcase, BarChart3, User } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const personas = [
  {
    icon: Briefcase,
    title: "Donos de negócio",
    desc: "Que querem escalar sem contratar. IA corta custo e multiplica entrega.",
  },
  {
    icon: BarChart3,
    title: "Gestores e diretores",
    desc: "Que precisam de resultado em marketing, vendas ou produto. Rápido.",
  },
  {
    icon: User,
    title: "Profissionais autônomos",
    desc: "Que operam sozinhos e querem produzir o equivalente a uma equipe.",
  },
];

export function LpParaQuem() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.1,
  });

  return (
    <section className="border-t border-border bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-[13px] tracking-tight text-muted-foreground">
            {"//para-quem"}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Para quem quer resultado,
            <br />
            <span className="text-muted-foreground">não teoria.</span>
          </h2>
        </div>

        <div ref={ref} className="grid gap-5 md:grid-cols-3">
          {personas.map((p, i) => (
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
