"use client";

import { ScrollReveal } from "./motion-wrapper";

export function AboutSinapse() {
  return (
    <section className="relative px-5 py-20 md:px-6 md:py-32" id="quem-somos">
      <div className="mx-auto max-w-3xl">
        {/* FOMO headline */}
        <ScrollReveal>
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight text-[#F5F5F5]">
            A maioria dos empresarios brasileiros vai descobrir o que IA faz por
            negocios daqui a 2 anos. Voce pode descobrir agora.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-8 text-[#888]">
            Enquanto voce le isso, tem empresario la dentro do forum fechando
            automacao que vai economizar R$4.000 por mes. Tem outro montando um
            stack de IA que substitui 3 posicoes operacionais. Tem outro
            compartilhando o passo a passo de como cortou 40% do custo de
            atendimento sem demitir ninguem.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="mt-4 text-lg font-medium text-[#F5F5F5]">
            Isso esta acontecendo agora. Todo dia. E voce nao esta la.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-[#888]">
            A SINAPSE nao nasceu pra ser mais uma comunidade de IA. Nasceu
            porque os fundadores precisavam do que ela e. Precisavam de um lugar
            onde empresarios de verdade, que operam negocios de verdade,
            compartilham o que funciona de verdade. Sem guru. Sem slide
            motivacional. Sem promessa de &quot;transformacao&quot;.
          </p>
        </ScrollReveal>

        {/* What SINAPSE knows */}
        <ScrollReveal className="mt-12">
          <div className="rounded-xl border border-[#222] bg-[#111] p-8">
            <h3 className="text-lg font-semibold text-[#F5F5F5]">
              O que a SINAPSE sabe que o mercado ainda nao sabe:
            </h3>
            <p className="mt-4 text-[#888]">
              IA nao e sobre tecnologia. E sobre quem paga menos pra entregar
              mais. E sobre quem escala sem inflar a folha. E sobre quem sai da
              operacao e volta pra estrategia enquanto a concorrencia afunda em
              planilha e reuniao.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-8 text-[#888]">
            Os empresarios que estao dentro da SINAPSE hoje estao construindo
            vantagem competitiva AGORA. Estao montando seus stacks de IA. Estao
            automatizando tarefas que seus concorrentes ainda fazem na mao.
            Estao trocando com outros donos de negocio que pensam do mesmo
            jeito.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-4 text-[#888]">
            E essa vantagem se acumula. Cada dia dentro e um dia de
            implementacao que quem esta fora nao tem. Cada semana dentro e uma
            automacao a mais rodando. Cada mes dentro e uma fatia maior de
            margem que nao volta pro concorrente.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-6 font-medium text-[#F5F5F5]">
            Isso nao e para todo mundo. E pra quem quer resultado, nao diploma.
            Pra quem quer aplicar, nao estudar. Pra quem entende que o custo de
            ficar parado e maior que o custo de entrar.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-6 text-[#888]">
            Se voce esta lendo isso e pensando &quot;sera que vale a
            pena?&quot;, pensa no seguinte: quanto voce perdeu nos ultimos 6
            meses tentando descobrir IA sozinho? Quantas ferramentas testou e
            abandonou? Quantas horas jogou fora em tutorial que nao aplicou?
            Quanto a mais voce pagou em funcionario porque nao sabia automatizar?
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-4 text-[#888]">
            Esse custo invisivel e real. E cresce todo mes que voce nao resolve.
          </p>
        </ScrollReveal>

        {/* Founders */}
        <div className="mt-16 space-y-8">
          {/* Caio */}
          <ScrollReveal>
            <div className="rounded-xl border border-[#222] bg-[#0F0F0F] p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1A1A] text-lg font-bold text-[#F5F5F5]">
                  CI
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5]">
                    Caio Imori
                  </h3>
                  <p className="text-sm text-[#555]">Co-fundador</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#888]">
                Caio constroi negocios com IA desde antes de virar manchete.
                Nao e &quot;entusiasta de IA&quot;. E empresario que usa IA como
                alavanca operacional todo dia. Criou o SINAPSE AI Framework com
                78+ agentes de IA e 778+ tasks automatizadas. Arquiteta
                sistemas, automatiza processos e ensina outros donos de negocio a
                fazer o mesmo. Sem teoria. Na trincheira.
              </p>
            </div>
          </ScrollReveal>

          {/* Matheus */}
          <ScrollReveal>
            <div className="rounded-xl border border-[#222] bg-[#0F0F0F] p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1A1A] text-lg font-bold text-[#F5F5F5]">
                  MS
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5]">
                    Matheus Soier
                  </h3>
                  <p className="text-sm text-[#555]">Co-fundador</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#888]">
                Matheus Soier e empresario e desenvolvedor. Construiu o
                sinapse.club inteiro sozinho: forum, autenticacao, sistema de
                tiers, deploy em producao. Socio em empresas digitais onde aplica
                IA na operacao real, gerando resultados mensuraveis para os
                negocios que toca. Especialista em Next.js, React e TypeScript.
                Matheus e quem transforma estrategia em produto rodando. Enquanto
                o mercado discute se IA vai substituir empregos, Matheus
                implementa as automacoes que ja substituiram tarefas. Transforma
                &quot;isso seria legal&quot; em &quot;isso esta rodando desde
                segunda.&quot; Pratico ate o osso. Quando voce entra na
                mentoria, e o Matheus que te mostra exatamente como implementar
                no seu negocio.
              </p>
            </div>
          </ScrollReveal>

          {/* Together */}
          <ScrollReveal>
            <div className="rounded-xl border border-amber-500/20 bg-[#111] p-6 text-center md:p-8">
              <p className="text-[#CCC]">
                100+ alunos formados. Mentorados fechando contratos de R$5k na
                segunda call de mentoria. Caio e Matheus aplicam as turmas
                juntos, combinando estrategia e execucao. Nao terceirizam pra
                &quot;mentores certificados&quot;. Sao eles dois, na trincheira,
                olhando pro seu negocio.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Mission */}
        <ScrollReveal className="mt-12 text-center">
          <p className="text-lg font-medium text-[#F5F5F5]">
            Dar a todo empresario brasileiro as ferramentas, o metodo e a
            comunidade pra usar IA como vantagem competitiva. Antes que vire
            obrigacao.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
