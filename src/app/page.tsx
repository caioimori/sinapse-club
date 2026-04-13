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
  title: "SINAPSE — IA na operação real, sem teoria",
  description:
    "A comunidade onde donos de negócio aplicam IA para reduzir custo, escalar entrega e ganhar tempo. Fórum 24/7, networking verificado, conteúdo de trincheira. A partir de R$ 22,90/mês.",
  openGraph: {
    title: "SINAPSE — IA na operação real, sem teoria",
    description:
      "A comunidade onde donos de negócio aplicam IA na operação. Fórum 24/7, networking verificado. A partir de R$ 22,90/mês.",
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
    title: "SINAPSE — IA na operação real",
    description:
      "Fórum 24/7 onde donos de negócio aplicam IA. A partir de R$ 22,90/mês.",
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
