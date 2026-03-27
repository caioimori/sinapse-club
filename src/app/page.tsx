import Link from "next/link";
import { ArrowRight, Globe, MessageSquare, BookOpen, Calendar, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-gradient">
            sinapse.club
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gradient-synapse border-0">
                Comecar gratis
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden pt-14">
        <div className="gradient-mesh absolute inset-0" />
        <div className="gradient-glow absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sinapse-purple-600/30 bg-sinapse-purple-600/10 px-4 py-1.5 text-sm text-sinapse-purple-300">
            <Zap className="h-3.5 w-3.5" />
            Vagas de fundador abertas
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            AI sem barreira.
            <br />
            <span className="text-gradient">Comunidade sem fronteira.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Todo o ecossistema de AI — curado do X, Reddit e docs oficiais.
            Traduzido para portugues. Discutido por profissionais como voce.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gradient-synapse border-0 text-base px-8">
                Comecar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="text-base px-8">
                Ver planos
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Junte-se a 500+ profissionais de AI
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            O problema que todo profissional de AI no Brasil conhece
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Voce tenta acompanhar tudo. Mas o firehose de informacao e em ingles, fragmentado, e infinito.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "95% em ingles",
                description: "Voce entende, mas absorve melhor em portugues. Traduzir mentalmente o dia todo cansa.",
              },
              {
                icon: Zap,
                title: "Fontes fragmentadas",
                description: "X + Reddit + Docs + YouTube + Newsletters = 2 horas por dia filtrando conteudo.",
              },
              {
                icon: MessageSquare,
                title: "Sem comunidade local",
                description: "Discord e bagunca. X e algoritmo. Ninguem fala do contexto brasileiro.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-background p-6 transition-all hover:border-sinapse-purple-600/50 hover:shadow-[var(--shadow-glow-purple)]"
              >
                <item.icon className="mb-4 h-8 w-8 text-sinapse-purple-400" />
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Tudo que voce precisa para dominar AI
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Curadoria. Traducao. Comunidade. Cursos. Tudo em um lugar so.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: "Feed Curado", description: "50+ items/dia das maiores fontes de AI. Categorizado por tema.", color: "text-sinapse-purple-400" },
              { icon: Globe, title: "Traducao EN↔PT", description: "Toggle entre original e traduzido. DeepL — a melhor traducao do mercado.", color: "text-sinapse-cyan-400" },
              { icon: MessageSquare, title: "Forum", description: "Poste, comente, discuta. Spaces tematicos para cada area de AI.", color: "text-sinapse-purple-400" },
              { icon: BookOpen, title: "Cursos Gravados", description: "Aprenda AI com cursos praticos em portugues. No seu ritmo.", color: "text-sinapse-cyan-400" },
              { icon: Calendar, title: "Lives & Calls", description: "Lives semanais, office hours, workshops exclusivos.", color: "text-sinapse-purple-400" },
              { icon: Trophy, title: "Gamificacao", description: "Pontos, badges, leaderboard. Suba no ranking da comunidade.", color: "text-sinapse-cyan-400" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <feature.icon className={`mb-4 h-8 w-8 ${feature.color}`} />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Escolha seu plano
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Comece gratis. Faca upgrade quando estiver pronto.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free */}
            <div className="rounded-xl border border-border bg-background p-8">
              <h3 className="mb-1 text-lg font-semibold">Free</h3>
              <p className="mb-6 text-sm text-muted-foreground">Para explorar</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 0</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm">
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Feed curado (limitado)</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> 1 space</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Perfil basico</li>
              </ul>
              <Link href="/register"><Button variant="outline" className="w-full">Comecar gratis</Button></Link>
            </div>
            {/* Pro */}
            <div className="relative rounded-xl border-2 border-sinapse-purple-600 bg-background p-8 shadow-[var(--shadow-glow-purple)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sinapse-purple-600 px-3 py-0.5 text-xs font-medium text-white">
                Popular
              </div>
              <h3 className="mb-1 text-lg font-semibold">Pro</h3>
              <p className="mb-6 text-sm text-muted-foreground">Para profissionais</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 49</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm">
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Tudo do Free</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Forum completo</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Todos os spaces</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Lives semanais</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Calendario</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Toggle bilingual</li>
              </ul>
              <Link href="/register?plan=pro"><Button className="w-full gradient-synapse border-0">Assinar Pro</Button></Link>
            </div>
            {/* Premium */}
            <div className="rounded-xl border border-border bg-background p-8">
              <h3 className="mb-1 text-lg font-semibold">Premium</h3>
              <p className="mb-6 text-sm text-muted-foreground">Para quem quer tudo</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 97</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm">
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Tudo do Pro</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Workshops</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Office hours</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Conteudo exclusivo</li>
                <li className="flex items-center gap-2"><span className="text-sinapse-cyan-400">✓</span> Suporte prioritario</li>
              </ul>
              <Link href="/register?plan=premium"><Button variant="outline" className="w-full">Assinar Premium</Button></Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Cursos vendidos separadamente. PIX e cartao aceitos. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Pronto para entrar na maior comunidade de AI em portugues?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Curadoria. Traducao. Comunidade. Cursos. Tudo em um lugar so.
          </p>
          <Link href="/register">
            <Button size="lg" className="gradient-synapse border-0 text-base px-8">
              Criar minha conta gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Sem cartao de credito. Setup em 30 segundos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-lg font-bold text-gradient">sinapse.club</span>
            <p className="text-sm text-muted-foreground">
              © 2026 sinapse.club. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
