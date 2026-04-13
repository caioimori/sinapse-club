"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Preciso saber programar?",
    a: "Nao. O conteudo e para donos de negocio, gestores e profissionais — nao para devs. Direto, pratico, sem jargao tecnico.",
  },
  {
    q: "Qual a diferenca entre os tres planos?",
    a: "Todos os planos dao o mesmo acesso ao forum e a comunidade. O que muda e o tempo de compromisso e o desconto. Mensal e flexivel, semestral e o mais escolhido (R$ 3 de desconto por mes), e anual e o de maior economia (R$ 5 de desconto por mes).",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Cancelamento imediato, sem multa. Nos primeiros 14 dias, devolvemos 100% sem perguntas — voce mantem 100% do controle.",
  },
  {
    q: "Qual a diferenca de um grupo de WhatsApp?",
    a: "Forum tem busca, historico, threads organizadas e curadoria real. Sem ruido, sem spam, sem algoritmo. Voce acha o que precisa quando precisa.",
  },
  {
    q: "Ja uso varias ferramentas de IA. Por que pagar por uma comunidade?",
    a: "Ferramenta nao substitui estrategia. Aqui voce aprende como aplicar IA no SEU contexto, com quem ja fez. Network e processo valem mais do que qualquer ferramenta isolada.",
  },
  {
    q: "O que tem alem do forum?",
    a: "Forum e o coracao. Mas voce tambem ganha gamificacao, ranks, leaderboard, networking verificado e conteudo novo toda semana. Cursos e mentorias com os fundadores sao opcionais e separados.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Pix, cartao de credito ou boleto. Renovacao automatica conforme o plano que voce escolher. Voce pode trocar de plano a qualquer momento sem perder acesso.",
  },
  {
    q: "Posso acessar pelo celular?",
    a: "Sim. O forum e 100% responsivo. Acesso completo pelo navegador do celular, sem precisar instalar app.",
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-foreground"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-foreground sm:text-base">
          {q}
        </span>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-transform duration-300",
            isOpen && "rotate-45 bg-foreground text-background"
          )}
        >
          <Plus className="size-3.5" />
        </span>
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300",
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm font-light leading-relaxed text-muted-foreground">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LpFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-t border-border bg-muted/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Duvidas
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Perguntas frequentes
          </h2>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
