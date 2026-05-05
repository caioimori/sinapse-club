import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" },
    ],
  },
  /**
   * Proxy reverso transparente do Supabase via nosso domínio.
   *
   * Substitui `udwpovojufbpzrexvkcc.supabase.co` por `forum.sinapse.club/sb/*`
   * em TODAS as chamadas client-side e na URL da barra do navegador durante
   * o OAuth flow. Mantém branding limpo no plano Free do Supabase (sem
   * precisar do add-on Custom Domain de $10/mês).
   *
   * Como funciona:
   * - NEXT_PUBLIC_SUPABASE_URL = "https://forum.sinapse.club/sb"
   * - Cliente JS chama `/sb/auth/v1/...`, `/sb/rest/v1/...`, etc.
   * - Vercel/Edge faz proxy transparente pro real Supabase URL
   * - Browser nunca vê o subdomain `*.supabase.co`
   *
   * IMPORTANTE pro OAuth (Google/GitHub):
   * - "Site URL" e "Redirect URLs" no Supabase Dashboard devem apontar
   *   pra `https://forum.sinapse.club/sb`
   * - Authorized Redirect URI no Google Console / GitHub OAuth App deve
   *   ser `https://forum.sinapse.club/sb/auth/v1/callback`
   */
  async rewrites() {
    const supabaseUpstream =
      process.env.SUPABASE_PROXY_UPSTREAM ??
      "https://udwpovojufbpzrexvkcc.supabase.co";
    return [
      {
        source: "/sb/:path*",
        destination: `${supabaseUpstream}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content-Security-Policy is set dynamically in middleware.ts
          // with per-request nonces for production XSS protection.
        ],
      },
    ];
  },
};

// Wrap with Sentry only when the DSN is set. Otherwise return the config
// untouched so dev builds don't pay the cost of the Sentry webpack plugin.
const hasSentryDsn =
  !!process.env.SENTRY_DSN || !!process.env.NEXT_PUBLIC_SENTRY_DSN;

export default hasSentryDsn
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      disableLogger: true,
      automaticVercelMonitors: false,
    })
  : nextConfig;
