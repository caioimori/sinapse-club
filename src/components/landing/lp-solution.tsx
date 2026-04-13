import { MessagesSquare, Users, BookOpen, Trophy } from "lucide-react";

const blocks = [
  {
    icon: MessagesSquare,
    title: "Forum 24/7",
    desc: "Categorias por area: marketing, vendas, operacao, financeiro, automacao. Pergunte de tarde, leia respostas a noite.",
  },
  {
    icon: Users,
    title: "Networking verificado",
    desc: "Donos de negocio reais. Sem perfil fake, sem influencer-de-IA, sem promessa furada.",
  },
  {
    icon: BookOpen,
    title: "Conteudo de trincheira",
    desc: "Casos reais publicados toda semana. O que funcionou, o que nao funcionou e por que.",
  },
  {
    icon: Trophy,
    title: "Gamificacao com proposito",
    desc: "Ranks, streaks e leaderboard. Quem mais ajuda sobe. Quem mais aprende fica.",
  },
];

export function LpSolution() {
  return (
    <section id="solucao" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            A solucao
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Tudo o que falta esta
            <br />
            <span className="text-muted-foreground">dentro de um lugar so.</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {blocks.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            >
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-muted">
                <b.icon className="size-5 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {b.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
