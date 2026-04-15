"use client";

/* eslint-disable @next/next/no-img-element */
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const mentores = [
  {
    photo: "/matheus-soier.png",
    name: "Matheus Soier",
    role: "Fundador do SINAPSE",
    bio: "Especialista em IA aplicada, automação e agentes autônomos. Construiu o framework SINAPSE e opera assessoria de marketing digital com IA para dezenas de empresas. Experiência prática em Claude Code, VPS, Playwright e orquestração de agentes em produção.",
  },
  {
    photo: "/caio-imori.png",
    name: "Caio Imori",
    role: "Co-fundador do SINAPSE",
    bio: "Atuação em tecnologia e estratégia de negócios com IA. Experiência em implementação de soluções de inteligência artificial para empresas, com foco em resultados práticos e retorno mensurável.",
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
                "rounded-2xl border border-border bg-card p-8 transition-all duration-700 ease-out",
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="mb-5 size-20 overflow-hidden rounded-full border border-border">
                <img
                  src={m.photo}
                  alt={m.name}
                  width={80}
                  height={80}
                  className="size-full object-cover"
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
