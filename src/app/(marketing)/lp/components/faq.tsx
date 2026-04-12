"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Preciso saber programar?",
    a: "Nao. O conteudo e para donos de negocio, nao para devs. Direto, pratico, sem jargao tecnico.",
  },
  {
    q: "O que esta incluso nos R$27/mes?",
    a: "Forum completo, todas as categorias, networking verificado e conteudo novo toda semana. Por menos que um almoco.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Cancelamento imediato, sem multa. Nos primeiros 7 dias, devolvemos 100% sem perguntas.",
  },
  {
    q: "Qual a diferenca de um grupo de WhatsApp?",
    a: "Forum tem busca, historico e curadoria real. Sem ruido, sem spam, sem algoritmo. Voce acha o que precisa.",
  },
  {
    q: "Ja tenho ferramentas de IA, pra que pagar?",
    a: "Ferramenta nao substitui estrategia. Aqui voce aprende como aplicar no seu contexto, com quem ja fez.",
  },
  {
    q: "E so um forum?",
    a: "Forum e a porta de entrada. Cursos e mentoria com os fundadores completam o ecossistema — opcionais.",
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 24,
          paddingBottom: 24,
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: 16,
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#1a1a1a",
            lineHeight: 1.5,
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: "#9a9a9a",
            flexShrink: 0,
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>

      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 300 : 0,
          transition: "max-height 0.25s ease",
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 300,
            color: "#6e6e6e",
            lineHeight: 1.65,
            paddingBottom: 24,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section
      id="faq"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#f7f7f7",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-1.5px",
              color: "#1a1a1a",
              lineHeight: 1.1,
            }}
          >
            Perguntas frequentes
          </h2>
        </div>

        {/* Accordion */}
        <div>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
