"use client";

import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

export function Benefits() {
  return (
    <section className="border-t border-border bg-card py-24" id="beneficios">
      <div className="mx-auto max-w-5xl px-4">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight">
              O que voce recebe
            </h2>
            <p className="mt-3 text-muted-foreground">
              Forum. Cursos. Mentoria. Cada passo no seu ritmo.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Card 1 — Forum (grande, 2 cols) */}
          <StaggerItem animation="fade-up">
            <ScrollReveal className="md:col-span-2">
              <div className="h-full rounded-2xl border border-border bg-background p-7 transition-all hover:border-border/60 hover:shadow-[var(--shadow-md)]">
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: "rgba(32,189,90,0.12)",
                      color: "#20BD5A",
                      border: "1px solid rgba(32,189,90,0.25)",
                    }}
                  >
                    R$27/mes
                  </span>
                  <span
                    className="inline-block h-2 w-2 animate-pulse rounded-full"
                    style={{ background: "#20BD5A" }}
                  />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">
                  Forum SINAPSE
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Threads diarias, categorias de alto valor, ranking de contribuicao.
                  Troque com empresarios que ja resolveram o que voce esta tentando resolver.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {["Categorias de alto valor", "Conteudo de trincheira", "Networking verificado", "Cases reais semanais"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span style={{ color: "#20BD5A" }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground/60">
                  Incluso no forum. Acesso imediato ao assinar.
                </p>
              </div>
            </ScrollReveal>
          </StaggerItem>

          {/* Card 2 — Cursos */}
          <StaggerItem animation="fade-up">
            <ScrollReveal delay={0.06}>
              <div className="h-full rounded-2xl border border-border bg-background p-7 transition-all hover:border-border/60 hover:shadow-[var(--shadow-md)]">
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Em breve
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  Cursos Praticos de IA
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Formacao modular de IA aplicada a negocios. Feito por quem opera,
                  nao por quem leu sobre. Membros do forum sao os primeiros a saber.
                </p>
                <p className="mt-4 text-xs italic text-muted-foreground/50">
                  Adquirido separadamente do forum.
                </p>
              </div>
            </ScrollReveal>
          </StaggerItem>

          {/* Card 3 — Conteudo de trincheira */}
          <StaggerItem animation="fade-up">
            <ScrollReveal delay={0.08}>
              <div className="h-full rounded-2xl border border-border bg-background p-7 transition-all hover:border-border/60">
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Incluso
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  Conteudo de Trincheira
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Reviews honestos, tutoriais praticos, cases reais. Zero teoria.
                  Tudo testado em negocio de verdade. Se nao funciona, a gente fala.
                </p>
              </div>
            </ScrollReveal>
          </StaggerItem>

          {/* Card 4 — Networking */}
          <StaggerItem animation="fade-up">
            <ScrollReveal delay={0.1}>
              <div className="h-full rounded-2xl border border-border bg-background p-7 transition-all hover:border-border/60">
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Incluso
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  Networking Verificado
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Empresarios de diferentes setores usando IA na operacao. Voce
                  conversa com quem entende a pressao e a oportunidade ao mesmo tempo.
                </p>
              </div>
            </ScrollReveal>
          </StaggerItem>

          {/* Card 5 — Mentoria (grande, 1 col mas destaque) */}
          <StaggerItem animation="fade-up">
            <ScrollReveal delay={0.12}>
              <div
                className="h-full rounded-2xl p-7 transition-all hover:shadow-[var(--shadow-md)]"
                style={{
                  background: "rgba(245, 158, 11, 0.05)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
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
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  Mentoria com os Fundadores
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Alguem olhando pro SEU negocio. Caio e Matheus. Nao mentores
                  certificados. Os fundadores, na trincheira, implementando com voce.
                </p>
                <a href="#oferta" className="mt-5 inline-block">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    Agendar conversa
                  </Button>
                </a>
              </div>
            </ScrollReveal>
          </StaggerItem>
        </div>

        {/* Ecosystem CTA */}
        <ScrollReveal className="mt-10">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-8 text-center">
            <p className="font-semibold text-foreground">
              Entra pelo forum por R$27/mes.
            </p>
            <p className="mt-2 text-muted-foreground text-sm">
              Cursos chegam em breve. Mentoria ja disponivel. Voce decide ate onde quer ir.
            </p>
            <a href="https://forum.sinapse.club/auth" className="mt-6 inline-block">
              <Button size="lg" className="bg-[#20BD5A] text-white border-0 hover:bg-[#1aa04d] px-8 text-base">
                Entrar no forum por R$27/mes
              </Button>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
