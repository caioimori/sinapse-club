"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const faqs = [
  {
    q: '"Mais uma comunidade de IA..."',
    a: 'Entendo. Voce ja viu 10 comunidades que prometem tudo e entregam um grupo de Telegram morto. A SINAPSE e diferente por uma razao simples: nao somos uma comunidade DE IA. Somos uma comunidade de NEGOCIOS que usa IA como alavanca. O foco e o resultado no seu faturamento, nao a tecnologia pela tecnologia. E por R$27/mes, o risco de testar e menor que um almoco de negocios.',
  },
  {
    q: '"Nao tenho tempo para participar."',
    a: 'Se voce tem 15 minutos por dia pra abrir o Instagram, voce tem 15 minutos pra abrir o forum. A diferenca e que no Instagram voce consome. Na SINAPSE voce implementa. O conteudo e digerido, pratico, aplicavel em sessoes curtas. IA de trincheira. Feito pra quem opera 12 horas por dia e precisa de resultado rapido.',
  },
  {
    q: '"IA nao funciona pro meu tipo de negocio."',
    a: 'Se voce tem atendimento, conteudo, propostas, relatorios ou tarefas repetitivas, IA funciona pro seu negocio. Dentro da SINAPSE tem dono de agencia, e-commerce, consultoria, SaaS, servicos, profissionais liberais. Gente do seu setor que ja implementou e esta vendo resultado. A questao nao e se IA funciona pro seu negocio. E se voce sabe COMO aplicar.',
  },
  {
    q: '"Minha equipe nao vai usar."',
    a: 'Bom. A SINAPSE nao e pra sua equipe. E pra voce. O conteudo e feito pro dono implementar. Voce aprende, voce configura, voce coloca pra rodar. Voce monta o stack de IA do negocio. Depois, se quiser, envolve o time.',
  },
  {
    q: '"Ja tenho ferramentas de IA, pra que pagar mais?"',
    a: 'Ter ferramentas de IA e como ter uma academia. Nao te faz forte. Saber COMO usar, isso faz. Ferramentas como Claude, ChatGPT, Codex sao o meio. A SINAPSE ensina como usar no contexto do seu negocio, com exemplos do seu setor, com gente que ja fez dando suporte. A diferenca entre pagar por ferramentas e nunca usar direito, e pagar R$27/mes pra SINAPSE e economizar R$5.000 no primeiro mes.',
  },
  {
    q: '"O que esta incluso nos R$27/mes?"',
    a: 'R$27/mes te da acesso completo ao forum: todas as categorias, todas as discussoes, networking com empresarios verificados, conteudo de trincheira atualizado toda semana. O forum e completo por si so. Se voce quiser ir mais fundo, cursos praticos de IA aplicada estao chegando como compra separada. E se quiser acompanhamento personalizado pro seu negocio, a mentoria com os fundadores ja esta disponivel como proximo passo. Cada um no seu ritmo.',
  },
  {
    q: '"Vou esperar a IA amadurecer mais."',
    a: 'Voce pode esperar. Mas seu concorrente nao vai. Dados de 2025-26 mostram que empresas que adotaram IA cedo tem 30-40% mais margem operacional. Esperar nao e prudencia. E abrir vantagem pro outro lado. A janela de vantagem esta aberta AGORA. Quem comeca hoje constroi negocio-prova. Quem espera, corre atras.',
  },
  {
    q: '"Nao sou tecnico, nao vou conseguir."',
    a: 'Otimo. A SINAPSE foi feita exatamente pra voce. Zero codigo. Zero jargao. Todo conteudo e explicado como um CEO explica pra outro CEO. Direto, pratico, sem firula tecnica. Se voce sabe usar WhatsApp, voce sabe usar as ferramentas que a gente compartilha. Serio.',
  },
  {
    q: '"Prefiro conteudo gratuito no YouTube."',
    a: 'Conteudo gratuito e otimo pra saber que IA existe. E pessimo pra implementar no seu negocio. Falta curadoria (voce nao sabe o que e bom), falta contexto brasileiro (90% do conteudo e gringo traduzido), e falta comunidade (voce nao tem quem perguntar quando empaca). A SINAPSE nao compete com conteudo gratuito. A SINAPSE e o que vem depois dele. E custa R$27/mes. Menos que a maioria dos apps que voce assina e nao usa.',
  },
  {
    q: '"E so um forum? Pra que eu preciso de forum em 2026?"',
    a: 'Forum e o formato mais eficiente pra troca de conhecimento entre empresarios. Diferente de grupo de WhatsApp, tem busca, categorias, historico e curadoria. Diferente de curso, tem gente real respondendo em tempo real. Diferente de rede social, nao tem algoritmo decidindo o que voce ve. E alem do forum, cursos praticos de IA aplicada estao chegando e a mentoria com os fundadores ja esta disponivel. O forum e a porta de entrada. O ecossistema e muito maior.',
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors"
        aria-expanded={open}
      >
        <span className="pr-4 font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-muted-foreground/60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="border-t border-border bg-card py-24" id="faq">
      <div className="mx-auto max-w-3xl px-4">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight">
            Perguntas frequentes
          </h2>
        </ScrollReveal>

        <StaggerContainer className="mt-12" staggerDelay={0.04}>
          {faqs.map((faq, i) => (
            <StaggerItem key={i} animation="fade-up">
              <AccordionItem q={faq.q} a={faq.a} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
