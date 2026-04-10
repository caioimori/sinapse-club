"use client";

import { ScrollReveal } from "./motion-wrapper";

const founders = [
  {
    initials: "CI",
    name: "Caio Imori",
    role: "Co-fundador",
    bio: "Constroi negocios com IA desde antes de virar manchete. Criou o SINAPSE AI Framework com 78+ agentes e 778+ tasks automatizadas. Arquiteta sistemas e ensina outros donos a fazer o mesmo. Sem teoria. Na trincheira.",
  },
  {
    initials: "MS",
    name: "Matheus Soier",
    role: "Co-fundador",
    bio: "Empresario e desenvolvedor. Construiu o sinapse.club do zero: forum, autenticacao, tiers, deploy em producao. Socio em empresas digitais onde aplica IA na operacao real. Quando voce entra na mentoria, e o Matheus que te mostra como implementar no seu negocio.",
  },
];

export function AboutSinapse() {
  return (
    <section className="border-t border-border bg-card py-24" id="quem-somos">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-3xl">
          {/* FOMO headline */}
          <ScrollReveal>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight">
              A maioria dos empresarios brasileiros vai descobrir
              o que IA faz daqui a 2 anos.{" "}
              <span style={{ color: "#20BD5A" }}>
                Voce pode descobrir agora.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-muted-foreground">
              Enquanto voce le isso, tem empresario la dentro fechando automacao
              que vai economizar R$4.000 por mes. Tem outro montando stack de IA
              que substitui 3 posicoes operacionais. Tem outro compartilhando como
              cortou 40% do custo de atendimento sem demitir ninguem.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-lg font-semibold text-foreground">
              Isso esta acontecendo agora. Todo dia. E voce nao esta la.
            </p>
          </ScrollReveal>

          {/* What SINAPSE knows */}
          <ScrollReveal className="mt-10">
            <div
              className="rounded-xl p-6 md:p-8"
              style={{
                background: "rgba(32,189,90,0.12)",
                border: "1px solid rgba(32,189,90,0.25)",
              }}
            >
              <h3 className="font-semibold" style={{ color: "#20BD5A" }}>
                O que a SINAPSE sabe que o mercado ainda nao sabe:
              </h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                IA nao e sobre tecnologia. E sobre quem paga menos pra entregar mais.
                Sobre quem escala sem inflar a folha. Sobre quem sai da operacao e
                volta pra estrategia enquanto a concorrencia afunda em planilha e reuniao.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-8 text-muted-foreground">
              Os empresarios dentro da SINAPSE hoje estao construindo vantagem
              competitiva AGORA. Cada dia dentro e um dia de implementacao que
              quem esta fora nao tem. Essa vantagem se acumula.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <p className="mt-6 font-semibold text-foreground">
              Isso nao e para todo mundo. E pra quem quer resultado, nao diploma.
              Pra quem quer aplicar, nao estudar. Pra quem entende que o custo de
              ficar parado e maior que R$27/mes.
            </p>
          </ScrollReveal>
        </div>

        {/* Founders */}
        <div className="mx-auto mt-16 max-w-3xl grid gap-4 md:grid-cols-2">
          {founders.map((f) => (
            <ScrollReveal key={f.name}>
              <div className="h-full rounded-xl border border-border bg-background p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: "#20BD5A" }}
                  >
                    {f.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground/60">{f.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {f.bio}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Together */}
        <ScrollReveal className="mt-6">
          <div
            className="mx-auto max-w-3xl rounded-xl p-6 text-center"
            style={{
              background: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            <p className="text-sm text-muted-foreground">
              100+ alunos formados. Mentorados fechando contratos de R$5k na segunda call.
              Caio e Matheus aplicam juntos, combinando estrategia e execucao.
              Sao eles dois, na trincheira, olhando pro seu negocio.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
