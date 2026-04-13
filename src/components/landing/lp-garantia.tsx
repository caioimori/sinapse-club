import { ShieldCheck } from "lucide-react";

export function LpGarantia() {
  return (
    <section className="border-t border-border py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-border bg-card p-10 text-center sm:p-14">
          <div className="mx-auto mb-6 inline-flex size-14 items-center justify-center rounded-full bg-muted">
            <ShieldCheck className="size-6 text-foreground" />
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            7 dias de garantia incondicional
          </h2>
          <p className="mx-auto max-w-lg text-base font-light leading-relaxed text-muted-foreground">
            Entre, conheça o fórum, leia as discussões, fale com os membros. Se
            nos primeiros 7 dias você não achar que vale o preço de um almoço
            por mês, devolvemos 100% — sem perguntas, sem burocracia.
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs text-muted-foreground">
            Garantia alinhada ao direito de arrependimento previsto no Código de
            Defesa do Consumidor (Art. 49).
          </p>
        </div>
      </div>
    </section>
  );
}
