"use client";

import { motion } from "framer-motion";
import { Briefcase, BarChart3, User } from "lucide-react";

const personas = [
  {
    icon: Briefcase,
    title: "Donos de negocio",
    desc: "Que querem escalar sem contratar. IA corta custo e multiplica entrega.",
  },
  {
    icon: BarChart3,
    title: "Gestores e diretores",
    desc: "Que precisam de resultado em marketing, vendas ou produto. Rapido.",
  },
  {
    icon: User,
    title: "Profissionais autonomos",
    desc: "Que operam sozinhos e querem produzir o equivalente a uma equipe.",
  },
];

export function LpParaQuem() {
  return (
    <section className="border-t border-border bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Para quem e
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Para quem quer resultado,
            <br />
            <span className="text-muted-foreground">nao teoria.</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.165, 0.84, 0.44, 1],
              }}
              className="rounded-2xl border border-border bg-background p-7"
            >
              <div className="mb-5 inline-flex size-10 items-center justify-center rounded-full bg-muted">
                <p.icon className="size-4 text-foreground" />
              </div>
              <h3 className="mb-2 text-base font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
