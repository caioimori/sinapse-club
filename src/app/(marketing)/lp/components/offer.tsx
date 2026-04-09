"use client";

import { ScrollReveal } from "./motion-wrapper";

export function Offer() {
  return (
    <section className="relative px-5 py-20 md:px-6 md:py-32" id="oferta">
      <div className="mx-auto max-w-3xl">
        {/* Anchoring */}
        <ScrollReveal>
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-[#F5F5F5]">
            Vamos fazer uma conta rapida.
          </h2>
        </ScrollReveal>

        <div className="mt-8 space-y-6">
          <ScrollReveal delay={0.05}>
            <div className="rounded-lg border border-[#222] bg-[#111] p-6">
              <p className="font-medium text-[#F5F5F5]">
                1 funcionario junior
              </p>
              <p className="mt-2 text-sm text-[#888]">
                R$3.000 a R$5.000 por mes com encargos. Precisa de treinamento,
                gestao, ferias e pode pedir demissao.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-lg border border-[#222] bg-[#111] p-6">
              <p className="font-medium text-[#F5F5F5]">
                1 mastermind de negocios
              </p>
              <p className="mt-2 text-sm text-[#888]">
                R$5.000 a R$15.000 por mes. Bom networking, mas nao ensina IA. E voce paga todo mes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="rounded-lg border border-[#222] bg-[#111] p-6">
              <p className="font-medium text-[#F5F5F5]">Aprender sozinho</p>
              <p className="mt-2 text-sm text-[#888]">
                &quot;Gratis&quot;. Mas custa 6 a 12 meses de tentativa e erro,
                ferramentas erradas e tempo que nao volta. Quanto vale 1 ano da
                sua vida?
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-8">
          <p className="text-xl font-semibold text-[#F5F5F5]">
            Agora veja o que a SINAPSE entrega por R$27 por mes.
          </p>
        </ScrollReveal>

        {/* Forum pricing card */}
        <ScrollReveal className="mt-12">
          <div className="rounded-2xl border-2 border-blue-500/30 bg-[#0F0F0F] p-8">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                R$27/mes
              </span>
              <h3 className="text-xl font-bold text-[#F5F5F5]">
                Forum SINAPSE
              </h3>
            </div>

            <p className="mt-4 text-lg text-[#CCC]">
              Acesso completo ao forum. Todas as discussoes. Todos os membros.
              Todas as categorias.
            </p>

            <p className="mt-4 text-[#888]">
              Pra quem quer parar de pesquisar sozinho e comecar a trocar com
              empresarios que ja usam IA na operacao real. Threads diarias.
              Ranking de contribuicao. Networking com empresarios verificados.
            </p>

            <p className="mt-3 text-[#888]">
              Conteudo de trincheira: reviews honestos, tutoriais praticos, cases
              reais. Tudo testado em negocio de verdade.
            </p>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-bold text-[#F5F5F5]">R$27</span>
              <span className="mb-1 text-[#555]">/mes</span>
            </div>

            <p className="mt-2 text-xs text-[#555]">
              Cobranca mensal. Cancele quando quiser. Sem multa, sem burocracia.
            </p>

            <a
              href="https://forum.sinapse.club/auth"
              className="mt-6 flex w-full items-center justify-center rounded-md bg-[#F5F5F5] px-8 py-4 font-semibold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)]"
            >
              Entrar no forum por R$27/mes
            </a>

            <p className="mt-3 text-center text-xs text-[#555]">
              7 dias de garantia. Se nao fizer sentido, devolucao total.
            </p>
          </div>
        </ScrollReveal>

        {/* Ecosystem steps */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Courses */}
          <ScrollReveal delay={0.05}>
            <div className="rounded-xl border border-green-500/20 bg-[#0F0F0F] p-6">
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                Em breve
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#F5F5F5]">
                Cursos Praticos de IA Aplicada
              </h3>
              <p className="mt-3 text-sm text-[#888]">
                Se voce quiser ir mais fundo, cursos praticos de IA aplicada
                estao chegando. Formacao modular, feita pra quem quer resultado,
                nao certificado. Adquiridos separadamente do forum. Membros do
                forum serao os primeiros a saber.
              </p>
            </div>
          </ScrollReveal>

          {/* Mentoria */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-xl border border-amber-500/20 bg-[#0F0F0F] p-6">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                Vagas limitadas
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#F5F5F5]">
                Mentoria com os Fundadores
              </h3>
              <p className="mt-3 text-sm text-[#888]">
                Se voce quer alguem olhando especificamente pro seu negocio, com
                estrategia personalizada e acompanhamento de implementacao, a
                mentoria com Caio e Matheus ja esta disponivel. Vagas limitadas
                de verdade, porque mentoria de verdade exige tempo e atencao.
              </p>
              <a
                href="#contato-mentoria"
                className="mt-4 inline-flex items-center rounded-md border border-amber-500/30 px-5 py-2 text-sm font-medium text-amber-400 transition-colors duration-200 hover:bg-amber-500/10"
              >
                Agendar uma conversa
              </a>
              <p className="mt-2 text-xs text-[#555]">
                Sem compromisso. A gente conversa, entende seu momento e ve se
                faz sentido.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Guarantee */}
        <ScrollReveal className="mt-12">
          <div className="rounded-xl border border-[#222] bg-[#111] p-8 text-center">
            <h3 className="text-xl font-semibold text-[#F5F5F5]">
              7 dias de garantia incondicional.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-[#888]">
              Entra. Explora. Participa. Se em 7 dias voce achar que a SINAPSE
              nao valeu o investimento, devolvemos 100% do valor. Sem pergunta.
              Sem formulario de 15 campos. Sem &quot;convencimento pra
              ficar.&quot;
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#888]">
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
