"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./motion-wrapper";

const faqs = [
  {
    q: '"Mais uma comunidade de IA..."',
    a: 'Nao somos uma comunidade DE IA. Somos uma comunidade de NEGOCIOS que usa IA como alavanca. O foco e resultado no faturamento, nao tecnologia pela tecnologia. Por R$27/mes, o risco de testar e menor que um almoco.',
  },
  {
    q: '"Nao tenho tempo para participar."',
    a: 'Se voce tem 15 minutos pra abrir o Instagram, tem 15 minutos pra abrir o forum. A diferenca: no Instagram voce consome, na SINAPSE voce implementa. Conteudo digerido, pratico, aplicavel em sessoes curtas.',
  },
  {
    q: '"IA nao funciona pro meu tipo de negocio."',
    a: 'Se voce tem atendimento, propostas ou tarefas repetitivas, IA funciona. Dentro da SINAPSE tem agencias, e-commerces, SaaS e profissionais liberais que ja implementaram. A questao nao e se IA funciona. E se voce sabe COMO aplicar.',
  },
  {
    q: '"Minha equipe nao vai usar."',
    a: 'A SINAPSE nao e pra sua equipe. E pra voce. O dono aprende, configura e coloca pra rodar. Depois, se quiser, envolve o time.',
  },
  {
    q: '"Ja tenho ferramentas de IA, pra que pagar mais?"',
    a: 'Ter ferramenta nao te faz usar certo. A SINAPSE ensina como aplicar no seu contexto, com casos do seu setor, com quem ja fez. A diferenca entre pagar por ferramenta e nunca usar direito — e pagar R$27/mes e economizar R$5k no primeiro mes.',
  },
  {
    q: '"O que esta incluso nos R$27/mes?"',
    a: 'Acesso completo ao forum: todas as categorias, networking verificado, conteudo de trincheira semanal. Cursos praticos chegam em breve como compra separada. Mentoria com os fundadores ja disponivel como proximo passo.',
  },
  {
    q: '"Vou esperar a IA amadurecer mais."',
    a: 'Seu concorrente nao vai esperar. Empresas que adotaram IA cedo tem 30-40% mais margem operacional. Esperar nao e prudencia. E abrir vantagem pro outro lado.',
  },
  {
    q: '"Nao sou tecnico, nao vou conseguir."',
    a: 'A SINAPSE foi feita exatamente pra voce. Zero codigo. Zero jargao. Tudo explicado como CEO pra CEO. Se voce usa WhatsApp, voce usa as ferramentas que a gente compartilha.',
  },
  {
    q: '"Prefiro conteudo gratuito no YouTube."',
    a: 'YouTube e otimo pra saber que IA existe. Pessimo pra implementar. Falta curadoria, contexto brasileiro e comunidade pra quando voce empaca. A SINAPSE e o que vem depois do YouTube. Por R$27/mes.',
  },
  {
    q: '"E so um forum? Pra que forum em 2026?"',
    a: 'Forum tem busca, categorias e historico — sem algoritmo decidindo o que voce ve. Tem gente real respondendo em tempo real. E e a porta de entrada: cursos praticos e mentoria com os fundadores completam o ecossistema.',
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
