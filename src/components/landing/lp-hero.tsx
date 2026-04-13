"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LpHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Subtle background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-foreground animate-pulse" />
          Comunidade ativa · vagas de fundador abertas
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.05,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="mb-6 text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl"
        >
          IA na operacao.
          <br />
          <span className="text-muted-foreground">Sem teoria.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.12,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg"
        >
          A comunidade onde donos de negocio aplicam IA para reduzir custo,
          escalar entrega e ganhar tempo. Forum 24/7, conteudo de trincheira,
          networking verificado. A partir de R$ 22,90/mes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link href="#pricing">
            <Button
              size="lg"
              className="h-12 bg-foreground text-background border-0 px-7 text-sm font-semibold"
            >
              Ver planos e comecar
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="#solucao">
            <Button
              size="lg"
              variant="ghost"
              className="h-12 px-5 text-sm text-muted-foreground hover:text-foreground"
            >
              Como funciona
            </Button>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          14 dias de garantia incondicional · cancele quando quiser
        </motion.p>
      </div>
    </section>
  );
}
