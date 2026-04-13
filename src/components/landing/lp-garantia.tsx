"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function LpGarantia() {
  return (
    <section className="border-t border-border py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          className="rounded-2xl border border-border bg-card p-10 text-center sm:p-14"
        >
          <div className="mx-auto mb-6 inline-flex size-14 items-center justify-center rounded-full bg-muted">
            <ShieldCheck className="size-6 text-foreground" />
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            14 dias de garantia incondicional
          </h2>
          <p className="mx-auto max-w-lg text-base font-light leading-relaxed text-muted-foreground">
            Entre, conheca o forum, leia as discussoes, fale com os membros. Se
            voce nao achar que vale o preco de um almoco por mes, devolvemos
            100% — sem perguntas, sem burocracia, sem cara feia.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
