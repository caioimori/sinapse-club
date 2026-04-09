import type { Metadata } from "next";
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
      <main className="min-h-dvh bg-[#0A0A0A] text-[#F5F5F5] antialiased">
        {/* Navbar */}
        <nav className="fixed left-0 right-0 top-0 z-40 border-b border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-6">
            <a href="/lp" className="text-lg font-bold tracking-tight text-[#F5F5F5]">
              SINAPSE
            </a>
            <a
              href="https://forum.sinapse.club/auth"
              className="rounded-md border border-[#333] px-4 py-2 text-sm text-[#F5F5F5] transition-colors duration-200 hover:bg-[#1A1A1A]"
            >
              Entrar
            </a>
          </div>
        </nav>

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
        <footer className="border-t border-[#1A1A1A] px-5 py-8 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-[#555] md:flex-row">
            <p>SINAPSE AI. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <span>Valores em reais (BRL). Pagamento via cartao de credito ou Pix.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
