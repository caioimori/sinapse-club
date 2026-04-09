"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const headlineSegments = [
  "Pare de pagar caro",
  "pra fazer o que IA faz melhor.",
  "Escale sem aumentar a folha.",
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden pt-14"
    >
      {/* Animated gradient background */}
      <div className="hero-bg absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/30 bg-foreground/5 px-4 py-1.5 text-sm text-muted-foreground"
        >
          <Zap className="h-3.5 w-3.5" />
          Comunidade de IA para Negocios
        </motion.div>

        {/* Headline */}
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight">
          {headlineSegments.map((segment, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.2 + i * 0.08,
                ease: [0.165, 0.84, 0.44, 1],
              }}
              className="block"
            >
              {segment}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.165, 0.84, 0.44, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          A comunidade onde donos de negocio aplicam IA na operacao real. Reduzem
          custo, aumentam margem e escalam sem depender de mais gente. Tudo isso
          por R$27/mes.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: [0.165, 0.84, 0.44, 1] }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a href="#oferta">
            <Button size="lg" className="bg-foreground border-0 text-base px-8">
              Quero entrar na SINAPSE
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </motion.div>

        {/* Micro-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.165, 0.84, 0.44, 1] }}
          className="mt-3 text-sm text-muted-foreground/60"
        >
          R$27/mes. Cancele quando quiser. Garantia de 7 dias.
        </motion.p>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1, ease: [0.165, 0.84, 0.44, 1] }}
          className="mt-6 text-sm text-muted-foreground"
        >
          Empresarios de agencias, e-commerces, consultorias e SaaS trocando
          resultados reais sobre IA aplicada a negocios.
        </motion.p>
      </div>

      {/* Forum screenshot mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.165, 0.84, 0.44, 1] }}
        className="mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-t-xl border border-border bg-card px-4 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-2 py-3">
          <div className="h-3 w-3 rounded-full bg-foreground/10" />
          <div className="h-3 w-3 rounded-full bg-foreground/10" />
          <div className="h-3 w-3 rounded-full bg-foreground/10" />
          <span className="ml-2 text-xs text-muted-foreground/50">forum.sinapse.club</span>
        </div>
        <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-3">
          {/* Sidebar */}
          <div className="hidden space-y-2 md:block">
            {["IA para Negocios", "Automacoes", "Stack de IA", "Cases Reais", "Ferramentas"].map(
              (cat) => (
                <div
                  key={cat}
                  className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground"
                >
                  {cat}
                </div>
              )
            )}
          </div>
          {/* Threads */}
          <div className="col-span-1 space-y-3 md:col-span-2">
            {[
              { title: "Como automatizei 70% do atendimento da minha agencia", replies: 24, time: "2h" },
              { title: "Stack de IA que uso pra gerar propostas em 20 min", replies: 18, time: "4h" },
              { title: "Cortei 3 posicoes operacionais com automacao", replies: 31, time: "6h" },
              { title: "Review honesto: Claude vs ChatGPT pra negocios", replies: 42, time: "1d" },
            ].map((thread) => (
              <div
                key={thread.title}
                className="rounded-xl border border-border bg-background p-4"
              >
                <p className="text-sm font-medium text-foreground">{thread.title}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground/60">
                  <span>{thread.replies} respostas</span>
                  <span>{thread.time}</span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    online
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
