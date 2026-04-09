"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./motion-wrapper";

export function Offer() {
  return (
    <section className="py-24" id="oferta">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-3xl">
          {/* Anchoring */}
          <ScrollReveal>
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold tracking-tight">
              Vamos fazer uma conta rapida.
            </h2>
          </ScrollReveal>

          <div className="mt-8 space-y-4">
            <ScrollReveal delay={0.05}>
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="font-medium text-foreground">
                  1 funcionario junior
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  R$3.000 a R$5.000 por mes com encargos. Precisa de treinamento,
                  gestao, ferias e pode pedir demissao.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="font-medium text-foreground">
                  1 mastermind de negocios
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  R$5.000 a R$15.000 por mes. Bom networking, mas nao ensina IA. E voce paga todo mes.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="font-medium text-foreground">Aprender sozinho</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  &quot;Gratis&quot;. Mas custa 6 a 12 meses de tentativa e erro,
                  ferramentas erradas e tempo que nao volta. Quanto vale 1 ano da
                  sua vida?
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="mt-8">
            <p className="text-xl font-semibold text-foreground">
              Agora veja o que a SINAPSE entrega por R$27 por mes.
            </p>
          </ScrollReveal>
        </div>

        {/* Forum pricing card — highlighted */}
        <ScrollReveal className="mt-12">
          <div className="mx-auto max-w-3xl rounded-2xl border-2 border-foreground bg-background p-8 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono uppercase tracking-widest text-blue-400">
                R$27/mes
              </span>
              <h3 className="text-xl font-bold text-foreground">
                Forum SINAPSE
              </h3>
            </div>

            <p className="mt-4 text-lg text-foreground/80">
              Acesso completo ao forum. Todas as discussoes. Todos os membros.
              Todas as categorias.
            </p>

            <p className="mt-4 text-muted-foreground">
              Pra quem quer parar de pesquisar sozinho e comecar a trocar com
              empresarios que ja usam IA na operacao real. Threads diarias.
              Ranking de contribuicao. Networking com empresarios verificados.
            </p>

            <p className="mt-3 text-muted-foreground">
              Conteudo de trincheira: reviews honestos, tutoriais praticos, cases
              reais. Tudo testado em negocio de verdade.
            </p>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">R$27</span>
              <span className="mb-1 text-muted-foreground/60">/mes</span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground/60">
              Cobranca mensal. Cancele quando quiser. Sem multa, sem burocracia.
            </p>

            <a href="https://forum.sinapse.club/auth" className="mt-6 block">
              <Button size="lg" className="w-full bg-foreground border-0 text-base">
                Entrar no forum por R$27/mes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>

            <p className="mt-3 text-center text-xs text-muted-foreground/60">
              7 dias de garantia. Se nao fizer sentido, devolucao total.
            </p>
          </div>
        </ScrollReveal>

        {/* Ecosystem steps */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Courses */}
          <ScrollReveal delay={0.05}>
            <div className="h-full rounded-xl border border-green-500/20 bg-card p-6">
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-mono uppercase tracking-widest text-green-400">
                Em breve
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Cursos Praticos de IA Aplicada
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Se voce quiser ir mais fundo, cursos praticos de IA aplicada
                estao chegando. Formacao modular, feita pra quem quer resultado,
                nao certificado. Adquiridos separadamente do forum. Membros do
                forum serao os primeiros a saber.
              </p>
            </div>
          </ScrollReveal>

          {/* Mentoria */}
          <ScrollReveal delay={0.1}>
            <div className="h-full rounded-xl border border-amber-500/20 bg-card p-6">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-mono uppercase tracking-widest text-amber-400">
                Vagas limitadas
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Mentoria com os Fundadores
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Se voce quer alguem olhando especificamente pro seu negocio, com
                estrategia personalizada e acompanhamento de implementacao, a
                mentoria com Caio e Matheus ja esta disponivel. Vagas limitadas
                de verdade, porque mentoria de verdade exige tempo e atencao.
              </p>
              <a href="#contato-mentoria">
                <Button variant="outline" size="sm" className="mt-4 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                  Agendar uma conversa
                </Button>
              </a>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Sem compromisso. A gente conversa, entende seu momento e ve se
                faz sentido.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Guarantee */}
        <ScrollReveal className="mt-12">
          <div className="mx-auto max-w-3xl rounded-xl ring-1 ring-foreground/10 bg-card p-8 text-center md:p-10">
            <h3 className="text-xl font-semibold text-foreground">
              7 dias de garantia incondicional.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Entra. Explora. Participa. Se em 7 dias voce achar que a SINAPSE
              nao valeu o investimento, devolvemos 100% do valor. Sem pergunta.
              Sem formulario de 15 campos. Sem &quot;convencimento pra
              ficar.&quot;
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              A gente so pede uma coisa: que voce entre de verdade. Abra o
              forum, leia as threads, faca perguntas. Se depois de usar de
              verdade voce ainda achar que nao vale, devolucao total. Porque
              confianca se constroi com experiencia, nao com promessa.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
