import type { Metadata } from "next";
import { LpNav } from "@/components/landing/lp-nav";
import { LpHero } from "@/components/landing/lp-hero";
import { LpProblem } from "@/components/landing/lp-problem";
import { LpSolution } from "@/components/landing/lp-solution";
import { LpParaQuem } from "@/components/landing/lp-para-quem";
import { LpMentores } from "@/components/landing/lp-mentores";
import { LpPricing } from "@/components/landing/lp-pricing";
import { LpGarantia } from "@/components/landing/lp-garantia";
import { LpFaq } from "@/components/landing/lp-faq";
import { LpCtaFinal } from "@/components/landing/lp-cta-final";
import { LpFooter } from "@/components/landing/lp-footer";

export const metadata: Metadata = {
  title: "SINAPSE — IA na operacao real, sem teoria",
  description:
    "A comunidade onde donos de negocio aplicam IA para reduzir custo, escalar entrega e ganhar tempo. Forum 24/7, networking verificado, conteudo de trincheira. A partir de R$ 22,90/mes.",
  openGraph: {
    title: "SINAPSE — IA na operacao real, sem teoria",
    description:
      "A comunidade onde donos de negocio aplicam IA na operacao. Forum 24/7, networking verificado. A partir de R$ 22,90/mes.",
    type: "website",
    url: "https://forum.sinapse.club",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SINAPSE — Comunidade de IA para negocios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SINAPSE — IA na operacao real",
    description:
      "Forum 24/7 onde donos de negocio aplicam IA. A partir de R$ 22,90/mes.",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return (
    <>
      <LpNav />
      <main>
        <LpHero />
        <LpProblem />
        <LpSolution />
        <LpParaQuem />
        <LpMentores />
        <LpPricing />
        <LpGarantia />
        <LpFaq />
        <LpCtaFinal />
      </main>
      <LpFooter />
    </>
  );
}
