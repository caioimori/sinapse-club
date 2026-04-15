"use client";

import { Check, X } from "lucide-react";
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
  { key: "grupo" as const, label: "Grupo de WhatsApp", highlight: false },
  { key: "social" as const, label: "Twitter / YouTube", highlight: false },
];

function CellView({ cell, highlight }: { cell: Cell; highlight: boolean }) {
  if (cell.kind === "yes") {
    return (
      <span
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-full",
          highlight ? "bg-foreground text-background" : "bg-muted text-foreground"
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (cell.kind === "no") {
    return (
      <div className="flex flex-col items-center gap-0.5 sm:items-start">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
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
        "text-xs font-semibold",
        highlight ? "text-foreground" : "text-muted-foreground"
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
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Comparativo
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

        <div ref={ref} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-[32%] py-4 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground" />
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 pb-4 text-center text-xs font-semibold uppercase tracking-widest",
                      col.highlight
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
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
                        "border-t border-border px-4 py-5 text-center",
                        col.highlight && "bg-background"
                      )}
                    >
                      <CellView cell={row[col.key]} highlight={col.highlight} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
