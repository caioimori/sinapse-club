"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Preciso saber programar?",
    a: "Não. O conteúdo é para donos de negócio, gestores e profissionais — não para devs. Direto, prático, sem jargão técnico.",
  },
  {
    q: "Qual a diferença entre os três planos?",
    a: "Todos os planos dão o mesmo acesso ao fórum e à comunidade. O que muda é o tempo de compromisso e o desconto. Mensal é flexível, semestral oferece um bom desconto (R$ 3 a menos por mês) e é o mais escolhido, e anual é o de maior economia (R$ 5 a menos por mês).",
  },
  {
    q: "Como funciona o pagamento dos planos semestral e anual?",
    a: "Os planos semestral e anual são cobrados em pagamento único — R$ 149,40 (semestral) ou R$ 274,80 (anual). Você pode parcelar no cartão de crédito em até 12x. Se preferir pagar mês a mês sem se comprometer, escolha o plano mensal.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Cancelamento imediato, sem multa. Nos primeiros 7 dias você tem o direito legal de arrependimento (CDC, Art. 49) e devolvemos 100% do valor pago, sem perguntas.",
  },
  {
    q: "Qual a diferença de um grupo de WhatsApp?",
    a: "Fórum tem busca, histórico, threads organizadas e curadoria real. Sem ruído, sem spam, sem algoritmo. Você acha o que precisa quando precisa.",
  },
  {
    q: "Já uso várias ferramentas de IA. Por que pagar por uma comunidade?",
    a: "Ferramenta não substitui estratégia. Aqui você aprende como aplicar IA no SEU contexto, com quem já fez. Network e processo valem mais do que qualquer ferramenta isolada.",
  },
  {
    q: "O que tem além do fórum?",
    a: "Fórum é o coração. Mas você também ganha gamificação, ranks, leaderboard, networking verificado e conteúdo novo toda semana. Cursos e mentorias com os fundadores são opcionais e separados.",
  },
  {
    q: "Posso acessar pelo celular?",
    a: "Sim. O fórum é 100% responsivo. Acesso completo pelo navegador do celular, sem precisar instalar app.",
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
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left transition-colors hover:text-foreground"
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
            Dúvidas
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
