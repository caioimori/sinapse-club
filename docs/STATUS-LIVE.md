# Status Vivo — sinapse.club

> Snapshot do estado atual do projeto. Ler isso primeiro.
> **Última atualização:** 2026-05-05 (sessão massiva — Stripe live, AbacatePay removido, auth UX, email branded)

---

## ✅ Em produção (live em forum.sinapse.club)

### Pagamentos — Stripe 100% no ar (sem AbacatePay)
- Checkout autoral SINAPSE em `forum.sinapse.club/checkout/[plano]` (mensal/semestral/anual)
- Stripe Payment Element inline no nosso domínio (não Hosted Checkout)
- `pk_live`, `sk_live`, 3 Price IDs e webhook secret em **Vercel prod env**
- Webhook endpoint live em `forum.sinapse.club/api/webhooks/stripe` (idempotente via tabela `stripe_webhook_events`)
- AbacatePay TOTALMENTE removido (lib, types, routes, webhook, envs) — PR #51

**Price IDs (live):**
- `STRIPE_PRICE_MENSAL` = `price_1TTReOIVSkjtCZn9YLCuV8L6` (R$ 37,90/mês)
- `STRIPE_PRICE_SEMESTRAL` = `price_1TTR9OIVSkjtCZn9HOrbIclg` (R$ 203,40/6 meses)
- `STRIPE_PRICE_ANUAL` = `price_1TTRepIVSkjtCZn9RonGju57` (R$ 358,80/ano)

### Auth UX (PR #53)
- `middleware.ts` bloqueia user com `!email_confirmed_at` (signOut + redirect `/login?error=unconfirmed`)
- `/register` editorial brandbook + Termos/Privacidade visíveis + validação senha < 8 + removido `/api/checkout` 404
- `/login` editorial + CTA "Criar conta" proeminente + erro mapeado (unconfirmed/invalid) + "Esqueci senha"

### Email branded SINAPSE via Resend (PR #54)
- Domain `sinapse.club` **verified** no Resend (DKIM/SPF/MX via Vercel DNS — Soier adicionou)
- Supabase SMTP: `smtp.resend.com:465`, user=`resend`, sender=`noreply@sinapse.club`, name=`sinapse.club`
- 3 templates HTML editorial brandbook (Vanta `#0A0A0A` bg, Sora 56px, JetBrains mono labels) aplicados:
  - Confirm sign up
  - Magic link
  - Reset password
- HTMLs commitados em `docs/email-templates/`
- Free tier Resend: 3.000 emails/mês

### Roles e access
- Caio (`imoricaio@gmail.com`) e Soier (`ownersoier@gmail.com`): role `admin` (rank 100) no Supabase `profiles` → bypass paywall, acesso total sem pagar
- Soier convidado no GitHub `caioimori/sinapse-club` como `maintain` (login canônico: `Matheus-soier`)

### Repo collab portátil (PR #50 incluiu)
- `.claude/settings.json` com hooks via `$CLAUDE_PROJECT_DIR` (funciona em qualquer máquina)
- Permissions allowList: git/gh/npm/supabase/vercel/stripe pré-aprovadas
- Deny rules em `.env*`
- `docs/onboarding-soier-prompt.md` — prompt pronto pra mandar pro Soier
- `docs/STATUS-LIVE.md` (este arquivo)

---

## ⚠️ Trade-offs aceitos / limitações conhecidas

### URL feia `udwpovojufbpzrexvkcc.supabase.co` durante OAuth
- Aparece <1s quando user clica "Continuar com Google/GitHub" (step de redirect)
- **Constraint arquitetural do Supabase GoTrue** — server força `redirect_uri` baseado no próprio hostname
- Único fix oficial: **Supabase Custom Domain** ($25/mês Pro + $10/mês add-on)
- Rewrite `/sb/*` proxy mergeada e latente em `next.config.ts` — pronta pra ativar quando o plano subir
- Decisão: aceitar enquanto não há tração financeira justificando custom domain

### Vercel preview deploys têm SSO protection
- Preview URLs retornam 401 sem login Vercel — não dá pra testar fluxos OAuth/checkout no preview
- Stripe envs Preview são placeholders (`pk_test_PLACEHOLDER_PREVIEW`, etc) — build passa, mas pagamento não funciona em preview

---

## 🔄 Próximo passo (quando Caio retomar)

- **Caio prometeu mandar 1 tarefa específica** na próxima sessão
- Ainda tem itens da lista de bugs auth original (ele mandou os 5 primeiros, faltam os outros)
- Stripe test mode pra testar sem cobrar:
  - Soier cria test mode keys + 3 products test no Stripe Dashboard
  - Configura no Vercel preview env
  - Permite testar checkout completo em preview com cartão `4242 4242 4242 4242` sem cobrança real

---

## 📦 Inventário técnico

| Recurso | Onde |
|---|---|
| Repo GitHub | `caioimori/sinapse-club` (público) |
| Vercel project | `sinapse-club` (team `caio-imoris-projects`, projectId `prj_rbrZbpScftxLSrAN2vmhFyoOYmCK`) |
| Supabase project | `sinapse-club` (id `udwpovojufbpzrexvkcc`, region sa-east-1, plano FREE) |
| DNS sinapse.club | Vercel DNS (na conta do Soier — Caio não tem permissão direta) |
| Stripe | account live ativa, MCC 5734, Brasil |
| Resend | account `imoricaio@gmail.com`, free plan |
| GitHub OAuth | client `Ov23lirAZARlkHBYxsvx` (homepage `https://sinapse.club`, callback Supabase real) |
| Google OAuth | client `188559297085-p4qd...` (2 redirect URIs autorizados: real Supabase + proxy futuro) |

| URL | Propósito |
|---|---|
| `sinapse.club` | Landing estática (LP v3, fora do Next.js) |
| `forum.sinapse.club` | App Next.js completo (forum, checkout, login, etc) |
| `forum.sinapse.club/api/webhooks/stripe` | Webhook handler Stripe |

---

## PRs históricos relevantes (mergeados em main)

- **#50** `feat(checkout): redesign editorial 2-col + wire StripeCheckoutForm`
- **#51** `feat(payments): elimina AbacatePay completo — Stripe-only`
- **#52** `feat(branding): proxy Supabase via /sb/*` (rewrite latente)
- **#53** `fix(auth): bugs UX cadastro/login + bloqueio user nao confirmado`
- **#54** `feat(email): templates SINAPSE-branded + Resend SMTP`
