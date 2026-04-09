"use client";

import { motion } from "framer-motion";

const headlineSegments = [
  "Pare de pagar caro",
  "pra fazer o que IA faz melhor.",
  "Escale sem aumentar a folha.",
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 md:px-6"
    >
      {/* Animated gradient background */}
      <div className="hero-bg absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0.2, 1] }}
          className="mb-6 rounded-full border border-[#333] bg-[#1A1A1A] px-4 py-1.5 text-xs text-[#888]"
        >
          Comunidade de IA para Negocios
        </motion.div>

        {/* Headline — stagger reveal */}
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-[#F5F5F5]">
          {headlineSegments.map((segment, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.2 + i * 0.08,
                ease: [0, 0, 0.2, 1],
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
          transition={{
            duration: 0.5,
            delay: 0.2 + headlineSegments.length * 0.08 + 0.12,
            ease: [0, 0, 0.2, 1],
          }}
          className="mx-auto mt-6 max-w-xl text-lg text-[#888888]"
        >
          A comunidade onde donos de negocio aplicam IA na operacao real. Reduzem
          custo, aumentam margem e escalam sem depender de mais gente. Tudo isso
          por R$27/mes.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#oferta"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: [0, 0, 0.2, 1] }}
          className="cta-primary mt-8 inline-flex min-w-[240px] items-center justify-center rounded-md bg-[#F5F5F5] px-10 py-4 font-semibold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)]"
        >
          Quero entrar na SINAPSE
        </motion.a>

        {/* Micro-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0, 0, 0.2, 1] }}
          className="mt-3 text-sm text-[#555555]"
        >
          R$27/mes. Cancele quando quiser. Garantia de 7 dias.
        </motion.p>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2, ease: [0, 0, 0.2, 1] }}
          className="mt-8 text-sm text-[#666666]"
        >
          Empresarios de agencias, e-commerces, consultorias e SaaS trocando
          resultados reais sobre IA aplicada a negocios.
        </motion.p>
      </div>

      {/* Forum screenshot placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0, 0, 0.2, 1] }}
        className="mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-t-xl border border-[#222] bg-[#111] shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-[#222] px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-[#333]" />
          <div className="h-3 w-3 rounded-full bg-[#333]" />
          <div className="h-3 w-3 rounded-full bg-[#333]" />
          <span className="ml-2 text-xs text-[#555]">forum.sinapse.club</span>
        </div>
        <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-3">
          {/* Sidebar placeholder */}
          <div className="hidden space-y-2 md:block">
            {["IA para Negocios", "Automacoes", "Stack de IA", "Cases Reais", "Ferramentas"].map(
              (cat) => (
                <div
                  key={cat}
                  className="rounded-md bg-[#1A1A1A] px-3 py-2 text-sm text-[#888]"
                >
                  {cat}
                </div>
              )
            )}
          </div>
          {/* Threads placeholder */}
          <div className="col-span-1 space-y-3 md:col-span-2">
            {[
              {
                title: "Como automatizei 70% do atendimento da minha agencia",
                replies: 24,
                time: "2h",
              },
              {
                title: "Stack de IA que uso pra gerar propostas em 20 min",
                replies: 18,
                time: "4h",
              },
              {
                title: "Cortei 3 posicoes operacionais com automacao",
                replies: 31,
                time: "6h",
              },
              {
                title: "Review honesto: Claude vs ChatGPT pra negocios",
                replies: 42,
                time: "1d",
              },
            ].map((thread) => (
              <div
                key={thread.title}
                className="rounded-lg border border-[#222] bg-[#111] p-4"
              >
                <p className="text-sm font-medium text-[#F5F5F5]">
                  {thread.title}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-[#555]">
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
