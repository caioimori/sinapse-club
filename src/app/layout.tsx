import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sinapse.club"),
  title: {
    default: "sinapse.club — Comunidade de AI em Portugues",
    template: "%s | sinapse.club",
  },
  description:
    "A comunidade de inteligencia artificial mais acessivel do mundo lusofono. Conteudo curado, traduzido e discutido.",
  keywords: [
    "inteligencia artificial",
    "AI",
    "comunidade",
    "portugues",
    "cursos AI",
    "machine learning",
    "LLM",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://sinapse.club",
    siteName: "sinapse.club",
    title: "sinapse.club — AI sem barreira. Comunidade sem fronteira.",
    description:
      "Todo o ecossistema de AI — curado do X, Reddit e docs oficiais. Traduzido para portugues. Discutido por profissionais como voce.",
  },
  twitter: {
    card: "summary_large_image",
    title: "sinapse.club",
    description: "A comunidade de AI que o Brasil merece.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
