"use client";

/* eslint-disable @next/next/no-img-element */
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const mentores = [
  {
    photo: "/matheus-soier.png",
    name: "Matheus Soier",
    role: "CEO & Fundador do SINAPSE",
    bio: "Fundou e lidera o SINAPSE. Arquiteto principal do framework de orquestração de squads de agentes que roda por trás da plataforma. Também toca sua própria assessoria de marketing, onde aplica IA em volume real pra escalar entregas de dezenas de clientes brasileiros. Stack hands-on: Claude Code, Playwright, VPS e pipelines de agentes autônomos em produção 24/7. Referência em engenharia de contexto, orquestração cross-domain e automação ponta a ponta.",
  },
  {
    photo: "/caio-imori.png",
    name: "Caio Imori",
    role: "Co-fundador do SINAPSE · CAIOaaS",
    bio: "Chief AI Office as a Service. Co-arquiteta o framework SINAPSE e opera o ecossistema de squads de agentes que roda por trás da plataforma. Desenha pipelines de IA ponta a ponta (estratégia, copy, brand, growth, produto) pra donos de negócio que querem sair do discurso e entrar em produção. Foco em decisão assistida por agentes e ROI mensurável.",
  },
];

export function LpMentores() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.1,
  });

  return (
    <section id="mentores" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-[13px] tracking-tight text-muted-foreground">
            {"//mentores"}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Quem construiu isso
            <br />
            <span className="text-muted-foreground">opera IA em produção.</span>
          </h2>
        </div>

        <div ref={ref} className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {mentores.map((m, i) => (
            <div
              key={m.name}
              className={cn(
                "group rounded-2xl border border-border bg-card p-8 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[var(--shadow-lg)]",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="mb-5 size-20 overflow-hidden rounded-full border border-border transition-all duration-500 group-hover:scale-105 group-hover:border-foreground">
                <img
                  src={m.photo}
                  alt={m.name}
                  width={80}
                  height={80}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{m.name}</h3>
              <p className="mb-4 text-xs text-muted-foreground">{m.role}</p>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
