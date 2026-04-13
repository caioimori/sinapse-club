/* eslint-disable @next/next/no-img-element */

const mentores = [
  {
    photo: "/matheus-soier.png",
    name: "Matheus Soier",
    role: "Fundador do SINAPSE",
    bio: "Especialista em IA aplicada, automacao e agentes autonomos. Construiu o framework SINAPSE e opera assessoria de marketing digital com IA para dezenas de empresas. Experiencia pratica em Claude Code, VPS, Playwright e orquestracao de agentes em producao.",
  },
  {
    photo: "/caio-imori.png",
    name: "Caio Imori",
    role: "Co-fundador do SINAPSE",
    bio: "Atuacao em tecnologia e estrategia de negocios com IA. Experiencia em implementacao de solucoes de inteligencia artificial para empresas, com foco em resultados praticos e retorno mensuravel.",
  },
];

export function LpMentores() {
  return (
    <section id="mentores" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Quem conduz
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Quem vai te guiar
          </h2>
        </div>

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {mentores.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-border bg-card p-8"
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
