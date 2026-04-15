"use client";

import { Check, X, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type Cell = { kind: "yes" } | { kind: "no"; note?: string } | { kind: "text"; value: string };

interface Row {
  label: string;
  sinapse: Cell;
  curso: Cell;
  grupo: Cell;
  social: Cell;
}

const rows: Row[] = [
  {
    label: "Busca e histórico de respostas",
    sinapse: { kind: "yes" },
    curso: { kind: "no", note: "conteúdo linear" },
    grupo: { kind: "no", note: "sem busca" },
    social: { kind: "no", note: "algoritmo decide" },
  },
  {
    label: "Donos de negócio verificados",
    sinapse: { kind: "yes" },
    curso: { kind: "no" },
    grupo: { kind: "no", note: "perfis mistos" },
    social: { kind: "no" },
  },
  {
    label: "Atualização contínua",
    sinapse: { kind: "yes" },
    curso: { kind: "no", note: "desatualiza em 6 meses" },
    grupo: { kind: "yes" },
    social: { kind: "yes" },
  },
  {
    label: "Sem guru vendendo mentoria",
    sinapse: { kind: "yes" },
    curso: { kind: "no" },
    grupo: { kind: "no", note: "spam de coach" },
    social: { kind: "no", note: "funil de curso" },
  },
  {
    label: "Preço previsível",
    sinapse: { kind: "text", value: "R$ 22,90/mês" },
    curso: { kind: "text", value: "R$ 2-5k upfront" },
    grupo: { kind: "text", value: "Grátis" },
    social: { kind: "text", value: "Grátis" },
  },
];

const columns = [
  { key: "sinapse" as const, label: "Sinapse", highlight: true },
  { key: "curso" as const, label: "Curso de IA", highlight: false },
  { key: "grupo" as const, label: "WhatsApp", highlight: false },
  { key: "social" as const, label: "Twitter / YouTube", highlight: false },
];

function CellView({ cell, highlight }: { cell: Cell; highlight: boolean }) {
  if (cell.kind === "yes") {
    return (
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full",
          highlight
            ? "bg-background text-foreground shadow-[var(--shadow-sm)]"
            : "bg-muted/70 text-muted-foreground"
        )}
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
    );
  }
  if (cell.kind === "no") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/60">
          <X className="size-3.5" strokeWidth={2.5} />
        </span>
        {cell.note && (
          <span className="text-[10px] text-muted-foreground">{cell.note}</span>
        )}
      </div>
    );
  }
  return (
    <span
      className={cn(
        "text-sm font-semibold",
        highlight ? "text-background" : "text-muted-foreground"
      )}
    >
      {cell.value}
    </span>
  );
}

export function LpComparativo() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.1,
  });

  return (
    <section
      id="comparativo"
      className="border-t border-border bg-muted/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 font-mono text-[13px] tracking-tight text-muted-foreground">
            {"//comparativo"}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Por que não usar
            <br />
            <span className="text-muted-foreground">o que já existe de graça?</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-muted-foreground">
            Todas as alternativas custam tempo em vez de dinheiro. O Sinapse
            cobra barato pra te devolver horas.
          </p>
        </div>

        <div ref={ref} className="overflow-x-auto pt-6">
          <table className="w-full min-w-[680px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-[30%] py-4 text-left" />
                {columns.map((col) => (
                  <th key={col.key} className="relative px-2 pb-4">
                    <div
                      className={cn(
                        "rounded-t-2xl px-4 py-4 text-center text-sm font-semibold tracking-tight",
                        col.highlight
                          ? "relative -mt-3 bg-foreground text-background shadow-[var(--shadow-lg)]"
                          : "text-muted-foreground"
                      )}
                    >
                      {col.highlight && (
                        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-[var(--shadow-md)]">
                          <Sparkles className="size-3" />
                          Recomendado
                        </div>
                      )}
                      {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isLast = i === rows.length - 1;
                return (
                  <tr
                    key={row.label}
                    className={cn(
                      "transition-all duration-700 ease-out",
                      inView
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    )}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <td className="border-t border-border py-5 pr-4 text-sm font-medium text-foreground">
                      {row.label}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-2 py-5 text-center align-middle",
                          col.highlight
                            ? cn(
                                "bg-foreground text-background",
                                isLast && "rounded-b-2xl shadow-[var(--shadow-lg)]"
                              )
                            : "border-t border-border"
                        )}
                      >
                        <CellView cell={row[col.key]} highlight={col.highlight} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
