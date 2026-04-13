"use client";

import { motion } from "framer-motion";
import { Clock, Wallet, Network } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Voce perde tempo na curva",
    desc: "Tutorial no YouTube, video em ingles, ferramenta nova toda semana. Tres meses depois, ainda sem implementar nada.",
  },
  {
    icon: Wallet,
    title: "Voce paga caro pelo errado",
    desc: "Assinatura de IA que nao usa, automacao mal feita, consultor que cobra R$5k pra te entregar prompt.",
  },
  {
    icon: Network,
    title: "Voce esta sozinho na decisao",
    desc: "Ninguem na sua bolha entende. WhatsApp e bagunca. LinkedIn e teoria. Voce precisa de quem ja fez.",
  },
];

export function LpProblem() {
  return (
    <section className="border-t border-border bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-16 max-w-2xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            O problema
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            IA virou ruido. E voce
            <br />
            precisa de sinal.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((p, i) => (
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
