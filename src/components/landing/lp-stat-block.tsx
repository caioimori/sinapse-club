"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: "24/7",
    label: "Fórum sempre aberto",
    sub: "Pergunte de tarde, leia respostas à noite",
  },
  {
    value: "R$ 0,76",
    label: "por dia no plano anual",
    sub: "Menos que um café do posto",
  },
  {
    value: "7 dias",
    label: "pra pedir reembolso",
    sub: "Sem pergunta, sem burocracia",
  },
];

export function LpStatBlock() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.2,
  });

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div ref={ref} className="mx-auto max-w-5xl px-4">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.value}
              className={cn(
                "text-center transition-all duration-700 ease-out sm:text-left",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="mb-2 text-5xl font-bold tracking-[-0.03em] text-foreground sm:text-6xl">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {stat.label}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
