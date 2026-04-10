"use client";

import { ScrollReveal } from "./motion-wrapper";

const timeline = [
  { year: "2024", status: "curiosidade", past: true },
  { year: "2025", status: "ferramenta", past: true },
  { year: "2026", status: "vantagem competitiva", past: false, current: true },
  { year: "2027", status: "obrigacao", past: false },
];

export function Urgency() {
  return (
    <section className="py-24 border-t border-border" id="urgencia">
      <div className="mx-auto max-w-3xl px-4">
        <ScrollReveal>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-center">
            A janela de vantagem esta aberta{" "}
            <span style={{ color: "#20BD5A" }}>agora.</span>
          </h2>
        </ScrollReveal>

        {/* Timeline visual */}
        <ScrollReveal delay={0.1} className="mt-10">
          <div className="flex items-center justify-center gap-0">
            {timeline.map((t, i) => (
              <div key={t.year} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
                    style={
                      t.current
                        ? {
                            background: "#20BD5A",
                            color: "#fff",
                            boxShadow: "0 0 20px rgba(32,189,90,0.2)",
                          }
                        : t.past
                        ? {
                            background: "var(--surface-raised, #1a1a1a)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border-default)",
                          }
                        : {
                            background: "transparent",
                            color: "var(--text-tertiary)",
                            border: "1px solid var(--border-subtle)",
                          }
                    }
                  >
                    {t.year.slice(2)}
                  </div>
                  <p
                    className="mt-2 text-center text-xs max-w-[72px]"
                    style={
                      t.current
                        ? { color: "#20BD5A", fontWeight: 600 }
                        : { color: "var(--text-tertiary)" }
                    }
                  >
                    {t.status}
                  </p>
                </div>
                {i < timeline.length - 1 && (
                  <div
                    className="h-px w-10 mx-2"
                    style={{
                      background: i < 2 ? "var(--border-strong)" : "var(--border-subtle)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal delay={0.15} className="mt-10">
          <p className="text-center text-muted-foreground">
            Quem monta seu stack de IA hoje opera a uma fracao do custo de quem
            comeca amanha. Essa vantagem se acumula. Cada mes na frente e um mes
            de otimizacao que o concorrente nao tem.
          </p>
        </ScrollReveal>

        {/* Cost of inaction */}
        <ScrollReveal className="mt-8">
          <div
            className="rounded-xl p-6 md:p-8"
            style={{
              background: "var(--surface-default, #111)",
              border: "1px solid var(--border-default)",
            }}
          >
            <p className="font-semibold text-foreground">
              O custo da SINAPSE e R$27/mes. Visivel. O custo de NAO estar la e
              invisivel. Mas real. E cresce todo mes.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Funcionario que voce nao precisava", value: "R$3-5k/mes" },
                { label: "Proposta que demorou 4h pra fazer", value: "Tempo x custo" },
                { label: "Margem que encolheu sem automacao", value: "Todo mes" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(220, 38, 38, 0.06)",
                    border: "1px solid rgba(220, 38, 38, 0.15)",
                  }}
                >
                  <p className="text-xs font-semibold text-red-400">{item.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm font-medium text-foreground">
              Voce pode aprender sozinho em 2 anos. Ou com a gente em 2 meses.
              O mercado nao vai esperar voce se sentir pronto.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
