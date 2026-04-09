"use client";

import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "./motion-wrapper";

const pains = [
  {
    title: '"Estou ficando para tras."',
    body: 'Voce abre o LinkedIn e ve todo mundo falando de IA. Agentes, automacoes, prompts. Sente que o mercado esta se movendo e voce esta parado. Nao por falta de vontade. Por falta de clareza sobre O QUE fazer no SEU negocio. E cada semana que passa sem agir, a distancia entre voce e quem ja comecou aumenta.',
  },
  {
    title: '"Meu time custa caro e nao escala."',
    body: 'Cada novo funcionario e mais CLT, mais gestao, mais treinamento, mais dor de cabeca. Voce precisa de mais resultado, nao de mais gente. Mas ninguem te mostra como fazer isso na pratica. Enquanto isso, a folha de pagamento come 50% do faturamento e a margem encolhe todo mes.',
  },
  {
    title: '"Nao tenho com quem trocar sobre isso."',
    body: 'Seu socio nao se interessa. Seus funcionarios nao entendem. Seus amigos acham que "IA e coisa de TI". Voce esta sozinho tentando descobrir o caminho. E sozinho ninguem chega longe. A solidao de quem opera tudo sozinho e real, e ninguem fala sobre isso.',
  },
  {
    title: '"Tentei e nao deu certo."',
    body: 'Assinou uma ferramenta de IA, fez meia duzia de perguntas, nao viu resultado. Concluiu que "IA nao funciona pro meu caso." Mas no fundo sabe que esta usando errado. So nao sabe usar certo. Ter a ferramenta sem o metodo e como ter academia sem saber treinar.',
  },
  {
    title: '"Informacao demais, clareza de menos."',
    body: 'Cada dia tem ferramenta nova, modelo novo, tecnica nova. Voce nao consegue filtrar o que importa pro seu negocio do que e hype puro. E no fim do dia, nao implementa nada. O excesso de informacao virou paralisia. E a paralisia esta custando dinheiro.',
  },
  {
    title: '"Nao tenho tempo para estudar."',
    body: 'Voce opera 12 horas por dia. Nao vai fazer um curso de 40 horas. Precisa de algo pratico, digerido, que voce aplique em 30 minutos, nao em 30 dias. Precisa de IA de trincheira, nao de IA de sala de aula.',
  },
];

export function Agitation() {
  return (
    <section className="relative px-5 py-20 md:px-6 md:py-32" id="agitacao">
      <div className="mx-auto max-w-3xl">
        {/* Intro block */}
        <ScrollReveal>
          <p className="text-lg text-[#888] md:text-xl">
            Voce ja sabe que IA vai mudar tudo. O problema e que
            &quot;saber&quot; nao paga boleto.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-6 text-[#888]">
            Enquanto voce assiste mais um video generico sobre ferramentas de IA,
            seu concorrente esta automatizando o atendimento dele. Esta gerando
            proposta em 20 minutos. Proposta que o seu time leva 4 horas. Esta
            rodando com metade da equipe e entregando o dobro.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="mt-4 text-[#888]">
            E voce? Testou 3 ferramentas, assistiu 20 tutoriais e ainda nao
            implementou nada de verdade no seu negocio.
          </p>
        </ScrollReveal>

        {/* 6 pains */}
        <StaggerContainer className="mt-16 space-y-6" staggerDelay={0.08}>
          {pains.map((pain, i) => (
            <StaggerItem key={i} animation="fade-left">
              <div className="rounded-lg border border-[#222] bg-[#111]/50 p-6">
                <h3 className="text-lg font-semibold text-[#F5F5F5]">
                  {pain.title}
                </h3>
                <p className="mt-3 leading-relaxed text-[#888]">{pain.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Consequence */}
        <ScrollReveal className="mt-16">
          <div className="border-l-2 border-[#333] pl-6">
            <p className="text-lg font-medium text-[#F5F5F5]">
              Voce esta pagando mais do que devia e trabalhando mais do que
              precisava.
            </p>
            <p className="mt-4 text-[#888]">
              Cada mes que voce espera, a distancia entre voce e quem ja usa IA
              aumenta. Nao e linear. E exponencial. O empresario que automatizou
              o atendimento hoje esta reinvestindo esse tempo em vendas amanha. E
              voce? Esta gastando 4 horas fazendo na mao o que ele faz em 15
              minutos.
            </p>
            <p className="mt-4 text-[#888]">
              O custo de esperar nao e zero. E o custo do funcionario que voce
              nao precisava contratar. E o cliente que voce perdeu porque demorou
              2 dias pra responder. E a margem que encolheu porque voce nao
              otimizou o que podia.
            </p>
          </div>
        </ScrollReveal>

        {/* Transition */}
        <ScrollReveal className="mt-16 text-center">
          <p className="text-xl font-medium text-[#F5F5F5]">
            Nao precisa ser assim. Existe um lugar onde empresarios que estavam
            exatamente onde voce esta agora resolveram isso. Juntos.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
