import { Clock, Wallet, Network } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Você perde tempo na curva",
    desc: "Tutorial no YouTube, vídeo em inglês, ferramenta nova toda semana. Três meses depois, ainda sem implementar nada.",
  },
  {
    icon: Wallet,
    title: "Você paga caro pelo errado",
    desc: "Assinatura de IA que não usa, automação mal feita, consultor que cobra R$ 5k pra te entregar prompt.",
  },
  {
    icon: Network,
    title: "Você está sozinho na decisão",
    desc: "Ninguém na sua bolha entende. WhatsApp é bagunça. LinkedIn é teoria. Você precisa de quem já fez.",
  },
];

export function LpProblem() {
  return (
    <section id="problema" className="border-t border-border bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            O problema
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            IA virou ruído. E você
            <br />
            precisa de sinal.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-background p-7"
            >
              <div className="mb-5 inline-flex size-10 items-center justify-center rounded-full bg-muted">
                <p.icon className="size-4 text-foreground" />
              </div>
              <h3 className="mb-2 text-base font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
