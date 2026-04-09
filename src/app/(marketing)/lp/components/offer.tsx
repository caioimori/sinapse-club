"use client";

import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./motion-wrapper";

const comparisons = [
  {
    label: "1 funcionario junior",
    price: "R$3.000-5.000/mes",
    problems: "CLT, gestao, ferias, pode pedir demissao",
    highlight: false,
  },
  {
    label: "Mastermind de negocios",
    price: "R$5.000-15.000/mes",
    problems: "Bom networking, nao ensina IA aplicada",
    highlight: false,
  },
  {
    label: "Aprender sozinho",
    price: '"Gratis"',
    problems: "6-12 meses de tentativa e erro. Quanto vale 1 ano?",
    highlight: false,
  },
];

export function Offer() {
  return (
    <section className="py-24 border-t border-border" id="oferta">
      <div className="mx-auto max-w-5xl px-4">
        {/* Anchoring */}
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight">
              Quanto custa resolver isso sem a SINAPSE?
            </h2>
          </div>
        </ScrollReveal>

        {/* Comparison cards */}
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {comparisons.map((c, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">{c.label}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{c.problems}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                  {c.price}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bridge */}
        <ScrollReveal className="mt-8">
          <p className="mx-auto max-w-3xl text-center text-lg font-semibold text-foreground">
            Agora veja o que a SINAPSE entrega por R$27/mes.
          </p>
        </ScrollReveal>

        {/* Main pricing card */}
        <ScrollReveal className="mt-8">
          <div
            className="mx-auto max-w-lg rounded-2xl p-8 md:p-10 text-center shadow-[0_0_60px_-20px_rgba(32,189,90,0.25)]"
            style={{
              background: "#0f1a13",
              border: "2px solid rgba(32,189,90,0.25)",
            }}
          >
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
              style={{
                background: "rgba(32,189,90,0.12)",
                color: "#20BD5A",
                border: "1px solid rgba(32,189,90,0.25)",
              }}
            >
              Forum SINAPSE
            </span>

            <div className="mt-6 flex items-end justify-center gap-1">
              <span className="text-5xl font-bold text-foreground">R$27</span>
              <span className="mb-1.5 text-muted-foreground">/mes</span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground/60">
              Cobranca mensal. Cancele quando quiser. Sem multa.
            </p>

            <div className="mt-6 space-y-2 text-sm text-left">
              {[
                "Acesso completo ao forum",
                "Todas as categorias e threads",
                "Networking com empresarios verificados",
                "Conteudo de trincheira atualizado",
                "Ranking e historico completo",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-muted-foreground">
                  <span style={{ color: "#20BD5A" }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <a href="https://forum.sinapse.club/auth" className="mt-8 block">
              <Button size="lg" className="bg-[#20BD5A] text-white border-0 hover:bg-[#1aa04d] w-full text-base">
                Entrar no forum por R$27/mes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </ScrollReveal>

        {/* Ecosystem steps */}
        <div className="mx-auto mt-6 grid max-w-3xl gap-4 md:grid-cols-2">
          <ScrollReveal delay={0.05}>
            <div className="h-full rounded-xl border border-emerald-500/15 bg-card p-6">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                Em breve
              </span>
              <h3 className="mt-4 font-semibold text-foreground">
                Cursos Praticos de IA
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Formacao modular de IA aplicada a negocios. Membros do forum serao
                os primeiros a saber.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              className="h-full rounded-xl p-6"
              style={{
                background: "rgba(245, 158, 11, 0.04)",
                border: "1px solid rgba(245, 158, 11, 0.18)",
              }}
            >
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                }}
              >
                Vagas limitadas
              </span>
              <h3 className="mt-4 font-semibold text-foreground">
                Mentoria com os Fundadores
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Estrategia personalizada. Caio e Matheus, olhando pro seu negocio.
              </p>
              <a href="#contato-mentoria" className="mt-4 inline-block">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  Agendar conversa
                </Button>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Guarantee */}
        <ScrollReveal className="mt-8">
          <div
            className="mx-auto max-w-3xl rounded-xl p-7 text-center"
            style={{
              background: "var(--surface-default, #111)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" style={{ color: "#20BD5A" }} />
              <h3 className="font-semibold text-foreground">
                7 dias de garantia incondicional.
              </h3>
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Entra. Explora. Participa. Se em 7 dias nao valeu, devolvemos 100%.
              Sem pergunta. Sem formulario. Sem convencimento pra ficar.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/50">
              O risco real e NAO entrar e perder mais 6 meses tentando sozinho.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
