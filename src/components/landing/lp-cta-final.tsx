"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LpCtaFinal() {
  return (
    <section className="relative border-t border-border bg-foreground py-24 text-background sm:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-6 text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          Por menos que um almoco.
          <br />
          <span className="text-background/60">Por mais que voce imagina.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-background/70 sm:text-lg"
        >
          Entre na comunidade, faca a primeira pergunta hoje, comece a aplicar
          IA na operacao real ja na proxima semana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.165, 0.84, 0.44, 1],
          }}
        >
          <Link href="#pricing">
            <Button
              size="lg"
              className="h-12 bg-background text-foreground border-0 px-8 text-sm font-semibold hover:bg-background/90"
            >
              Escolher meu plano
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <p className="mt-5 text-xs text-background/50">
            14 dias de garantia · cancele quando quiser · pix, cartao ou boleto
          </p>
        </motion.div>
      </div>
    </section>
  );
}
