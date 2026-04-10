"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const headlineSegments = [
  "Pare de pagar caro",
  "pra fazer o que IA faz melhor.",
];

const industries = [
  "Agencias",
  "E-commerces",
  "Consultorias",
  "SaaS",
  "Servicos",
  "Profissionais liberais",
];

const threads = [
  { title: "Como automatizei 70% do atendimento da minha agencia", replies: 24, time: "2h" },
  { title: "Stack de IA que uso pra gerar propostas em 20 min", replies: 18, time: "4h" },
  { title: "Cortei 3 posicoes operacionais com automacao", replies: 31, time: "6h" },
  { title: "Review honesto: Claude vs ChatGPT pra negocios", replies: 42, time: "1d" },
];

const categories = ["IA para Negocios", "Automacoes", "Stack de IA", "Cases Reais", "Ferramentas"];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden pt-14"
    >
      {/* Dark stone background */}
      <div className="hero-bg absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wider uppercase"
          style={{
            borderColor: "rgba(32,189,90,0.25)",
            background: "rgba(32,189,90,0.12)",
            color: "#20BD5A",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#20BD5A]" />
          Comunidade de IA para Negocios
        </motion.div>

        {/* Headline */}
        <h1 className="text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
          {headlineSegments.map((segment, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.1,
                ease: [0.165, 0.84, 0.44, 1],
              }}
              className="block"
            >
              {i === 1 ? (
                <>
                  pra fazer o que{" "}
                  <span style={{ color: "#20BD5A" }}>IA faz melhor.</span>
                </>
              ) : (
                segment
              )}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.165, 0.84, 0.44, 1] }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          A comunidade onde donos de negocio aplicam IA na operacao real.
          Reduzem custo, escalam sem contratar e saem da operacao.
          <span className="font-semibold text-foreground"> Por R$27/mes.</span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <a href="https://forum.sinapse.club/auth">
            <Button
              size="lg"
              className="bg-[#20BD5A] text-white border-0 hover:bg-[#1aa04d] px-8 text-base"
            >
              Quero entrar na SINAPSE
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <p className="text-sm text-muted-foreground/60">
            R$27/mes · Cancele quando quiser · Garantia de 7 dias
          </p>
        </motion.div>

        {/* Industry logo bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85, ease: [0.165, 0.84, 0.44, 1] }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50">
            Empresarios de
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {industries.map((ind) => (
              <span
                key={ind}
                className="text-sm font-medium text-muted-foreground/70"
              >
                {ind}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Forum mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.165, 0.84, 0.44, 1] }}
        className="mx-auto mt-14 w-full max-w-4xl overflow-hidden rounded-t-2xl border border-border bg-card px-4 shadow-[0_-20px_60px_-20px_rgba(32,189,90,0.08)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
          <span className="ml-3 text-xs text-muted-foreground/40">
            forum.sinapse.club
          </span>
          <div className="ml-auto flex items-center gap-1">
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "#20BD5A" }}
            />
            <span className="text-xs" style={{ color: "#20BD5A" }}>
              online
            </span>
          </div>
        </div>

        {/* Forum content */}
        <div className="grid grid-cols-1 gap-3 py-5 md:grid-cols-4">
          {/* Sidebar */}
          <div className="hidden space-y-1.5 md:block">
            {categories.map((cat, i) => (
              <div
                key={cat}
                className={`rounded-lg px-3 py-2 text-sm ${
                  i === 0
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
                style={
                  i === 0
                    ? {
                        background: "rgba(32,189,90,0.12)",
                        color: "#20BD5A",
                      }
                    : {}
                }
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Threads */}
          <div className="col-span-1 space-y-2.5 md:col-span-3">
            {threads.map((thread) => (
              <div
                key={thread.title}
                className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-border/80"
              >
                <p className="text-sm font-medium text-foreground leading-snug">
                  {thread.title}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground/50">
                  <span>{thread.replies} respostas</span>
                  <span>{thread.time}</span>
                  <span
                    className="font-medium"
                    style={{ color: "#20BD5A" }}
                  >
                    ativo
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
