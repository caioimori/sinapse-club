import type { Metadata } from "next";
import { Hero } from "./components/hero";
import { ParaQuem } from "./components/para-quem";
import { Programa } from "./components/programa";
import { Formato } from "./components/formato";
import { Mentores } from "./components/mentores";
import { Incluso } from "./components/incluso";
import { Investimento } from "./components/investimento";
import { FAQ } from "./components/faq";
import { CTAFinal } from "./components/cta-final";
import { Nav } from "./components/nav";
import "./lp.css";

export const metadata: Metadata = {
  title: "SINAPSE | Comunidade de IA para Negocios",
  description:
    "A comunidade onde donos de negocio aplicam IA na operacao real. Forum, cursos e mentoria. Por R$27/mes.",
  openGraph: {
    title: "SINAPSE | Comunidade de IA para Negocios",
    description:
      "Forum ativo com empresarios que usam IA de verdade. R$27/mes.",
    type: "website",
    url: "https://sinapse.club/lp",
  },
};

export default function LandingPage() {
  return (
    <div className="lp">
      <Nav />
      <main>
        <Hero />
        <ParaQuem />
        <Programa />
        <Formato />
        <Mentores />
        <Incluso />
        <Investimento />
        <FAQ />
        <CTAFinal />
      </main>
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 10, color: "var(--text-light)" }}>
          &copy; 2026 SINAPSE. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
