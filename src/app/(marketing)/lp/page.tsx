import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "./components/hero";
import { Agitation } from "./components/agitation";
import { Transformation } from "./components/transformation";
import { Benefits } from "./components/benefits";
import { SocialProof } from "./components/social-proof";
import { AboutSinapse } from "./components/about-sinapse";
import { Offer } from "./components/offer";
import { FAQ } from "./components/faq";
import { Urgency } from "./components/urgency";
import { CTAFinal } from "./components/cta-final";
import { StickyCTA } from "./components/sticky-cta";
import "./lp.css";

export const metadata: Metadata = {
  title: "SINAPSE | Comunidade de IA para Negocios",
  description:
    "A comunidade onde donos de negocio aplicam IA na operacao real. Reduzem custo, aumentam margem e escalam sem depender de mais gente. Por R$27/mes.",
  openGraph: {
    title: "SINAPSE | Comunidade de IA para Negocios",
    description:
      "Forum ativo com empresarios que usam IA de verdade. Cursos praticos de IA aplicada chegando em breve. Mentoria com os fundadores ja disponivel. R$27/mes.",
    type: "website",
    url: "https://sinapse.club/lp",
  },
};

export default function LandingPage() {
  return (
    <div className="dark">
      <main className="min-h-dvh bg-background text-foreground antialiased">
        {/* Navbar */}
        <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/lp" className="text-xl font-bold text-gradient">
              SINAPSE
            </Link>
            <div className="flex items-center gap-3">
              <Link href="https://forum.sinapse.club/auth">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="https://forum.sinapse.club/auth">
                <Button size="sm" className="bg-foreground border-0">
                  Comecar agora
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Sections */}
        <Hero />
        <Agitation />
        <Transformation />
        <Benefits />
        <SocialProof />
        <AboutSinapse />
        <Offer />
        <FAQ />
        <Urgency />
        <CTAFinal />

        {/* Sticky CTA */}
        <StickyCTA />

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span className="text-lg font-bold text-gradient">SINAPSE</span>
              <p className="text-sm text-muted-foreground">
                SINAPSE AI. Todos os direitos reservados. Valores em reais (BRL).
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
