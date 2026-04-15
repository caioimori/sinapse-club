import type { Metadata } from "next";
import { LpNav } from "@/components/landing/lp-nav";
import { LpHero } from "@/components/landing/lp-hero";
import { LpFounderStrip } from "@/components/landing/lp-founder-strip";
import { LpStatBlock } from "@/components/landing/lp-stat-block";
import { LpProblem } from "@/components/landing/lp-problem";
import { LpSolution } from "@/components/landing/lp-solution";
import { LpParaQuem } from "@/components/landing/lp-para-quem";
import { LpMentores } from "@/components/landing/lp-mentores";
import { LpComparativo } from "@/components/landing/lp-comparativo";
import { LpPricing } from "@/components/landing/lp-pricing";
import { LpGarantia } from "@/components/landing/lp-garantia";
import { LpFaq } from "@/components/landing/lp-faq";
import { LpCtaFinal } from "@/components/landing/lp-cta-final";
import { LpFooter } from "@/components/landing/lp-footer";

export const metadata: Metadata = {
  title: "SINAPSE — IA não é sobre ferramenta. É sobre operação.",
  description:
    "Fórum 24/7 de donos de negócio aplicando IA pra reduzir custo, escalar entrega e ganhar tempo. Sem teoria, sem guru, sem curso de R$ 5k. A partir de R$ 22,90/mês.",
  openGraph: {
    title: "SINAPSE — IA não é sobre ferramenta. É sobre operação.",
    description:
      "Fórum 24/7 de donos de negócio aplicando IA na operação real. A partir de R$ 22,90/mês.",
    type: "website",
    url: "https://forum.sinapse.club",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SINAPSE — Comunidade de IA para negócios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SINAPSE — IA não é sobre ferramenta. É sobre operação.",
    description:
      "Fórum 24/7 de donos de negócio aplicando IA. A partir de R$ 22,90/mês.",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return (
    <>
      <LpNav />
      <main>
        <LpHero />
        <LpFounderStrip />
        <LpStatBlock />
        <LpProblem />
        <LpSolution />
        <LpParaQuem />
        <LpMentores />
        <LpComparativo />
        <LpPricing />
        <LpGarantia />
        <LpFaq />
        <LpCtaFinal />
      </main>
      <LpFooter />
    </>
  );
}
