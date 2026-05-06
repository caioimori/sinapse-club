# Status Vivo — sinapse.club

> Snapshot do estado atual do projeto. Ler isso primeiro.
> **Última atualização:** 2026-05-06 (sessão YOLO: auditoria UX S2+S3 + 7 quick wins + Bloco C residual — 9 PRs)

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

### Curator bots humanizados (PRs #55 + #57)
- 5 curator bots agora têm avatares reais:
  - `@sinapse-bot` (UUID `00...001`) → **logo SINAPSE preto sobre BONE** (institucional, profile_type=`curator_bot`, **fora do ranking**)
  - `@rafael.automacao` (`00...002`) → foto humana (terno) + bio "Automação pra times comerciais e operações"
  - `@ana.ianegocios` (`00...003`) → foto humana + bio "IA aplicada pra negócios pequenos e médios"
  - `@lucas.growth` (`00...004`) → foto humana + bio "Growth pra produtos B2B de tecnologia"
  - `@carla.dados` (`00...005`) → foto humana + bio "Análise de dados pra quem não tem time de BI"
- Todas as fotos servidas pelo Supabase Storage `avatars/curators/{1..5}.webp` (~7KB cada, cache 1ano)
- Fonte: randomuser.me/api/portraits — license livre, padrão de mercado de placeholder
- 5 seed humans antigos (`maridata`, `rafaeldev`, `analima`, `juliaai`, `pedrotech`) também humanizados em `avatars/seed-humans/{username}.webp`
- `@ownersoier` (Matheus) NÃO entra no script — pessoa real
- Script idempotente em `scripts/seed-curator-avatars.mjs` (`--force` regenera tudo)

### Tipos de profile (3 categorias)
- `human` — pessoa real → ranking SIM, pode reagir/comentar
- `curator_persona` — bot humanizado (4 bots `@rafael/@ana/@lucas/@carla`) → ranking SIM, **NÃO** pode reagir/comentar (trigger DB)
- `curator_bot` — institucional `@sinapse-bot` → ranking NÃO, NÃO pode reagir/comentar
- View `v_weekly_leaderboard` filtra `IN ('human', 'curator_persona')`

### Pipeline de curadoria — MVP PT-only nativo (PR #56)
- **Removida função `translate-content`** completamente (pivot pra forum 100% PT)
- `curate-rss` agora cura SÓ de fontes BR validadas:
  - Tier AI (1): `canaltech.com.br/rss/inteligencia-artificial/` (aceita tudo)
  - Tier business (10): canaltech-empreendedorismo, olhardigital, neofeed, braziljournal, tiinside, digitalks, adnews, meioemensagem, b9, abradi (exige menção AI)
- AI gate **REFINADO**: token `"ia "` causava false positives gigantes (matchava "diretoria", "agência", "tecnologia", etc). Substituído por padrões com preposição/pontuação adjacente.
- `publish-curated` simplificado (sem gate de tradução)
- Backlog de 891 itens EN limpos no DB
- pg_cron: `curate-rss` hourly + `publish-curated` `:15 e :45` (3 posts/run)
- **Custo recorrente: R$ 0/mês** (só RSS público + Supabase free)
- Smoke test: 3 posts PT-BR publicados com sucesso pelos bots ana/rafael/sinapse-bot

### Botão "marcar todas como lidas" (PR #57)
- Bug: badge do sidebar levava 30s pra atualizar (poll), criando sensação de bug
- Fix: `NotificationsMarkRead` dispatch `CustomEvent("notifications-cleared")` + `Sidebar` listener zera badge imediatamente
- Sidebar também zera ao navegar pra `/notificacoes` (race condition do useEffect anterior corrigida)

### Auditoria UX profunda + 18 fixes funcionais (PRs #58 + #59)
**Sessão 1 da auditoria UX** (`docs/auditoria/2026-05-05-ux-deep-audit-REPORT-S1.md`):
- 5 gargalos quantitativos críticos achados (0 paying users, 63% dos cadastrados nunca logam, 0 posts orgânicos em 7d, sidebar com "Em breve" cinza, etc)
- 7 quick wins identificados pra próxima sprint
- Roadmap UX 4 semanas
- Plano completo em `docs/auditoria/2026-05-05-ux-deep-audit-PLAN.md`

**Auditoria funcional exaustiva** (`docs/auditoria/2026-05-05-functional-audit-REPORT.md`):
- 18 fixes implementados em 5 arquivos:
  - **3 CRITICAL:** avatares de comentários voltaram a aparecer; usuário comum agora reporta posts; cleanup automático de imagem órfã no Storage
  - **8 HIGH:** toast de erro em todos os catch silenciosos; `disabled={pending}` elimina race conditions; `likedSet` recursivo em replies; click outside fecha menu; `<Dialog>` shadcn no lugar de `confirm()`; validação de tamanho/tipo de imagem; cache de role; tap mobile pra unfollow
  - **7 MEDIUM:** indicador "Respondendo a @user"; empty state em comments; min/max + contador comments; toast no share; validação edit; Esc fecha edit; drag&drop imagem; autosave draft localStorage; char counter sempre visível
- Todos os fixes commitados, mergeados, TypeScript+ESLint exit 0

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

## 🔄 Próximo passo

### Bloco A — causas-raiz de conversão (única coisa que move agulha)

A auditoria S2 identificou 4 causas-raiz que explicam 0 tentativas de subscription, 0 posts orgânicos em 7d, 80% drop em email signup. Os 7 quick wins entregues nesta sessão tocam em sintomas. **Bloco A ataca causas:**

1. **A1 — Auto-login pós-confirmação de email** (~2h) — resolve drop de 80% no email signup
2. **A2 — Pricing redesign** (diferenciar features, social proof, garantia em destaque) — sai de 0 tentativas
3. **A3 — Email digest semanal automático via Resend** — gancho de retention day-2+
4. **A4 — Empty social proof** ("Seja o primeiro a curtir" em vez de "0 likes")

Total estimado: 8-10h (1 sessão dedicada).

### Pagamentos / testabilidade
- Stripe test mode (Soier cria keys + products test → Vercel preview env)
- Auditoria S2 confirmou: **0 paying users · 0 tentativas em 14 humans** — Bloco A é prerequisito pra paid media

### Bugs auth restantes
- Lista original com Caio (5 primeiros foram entregues, faltam os outros)

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
- **#55** `feat(forum): humaniza curator bots com avatares AI-generated`
- **#56** `feat(curadoria): MVP PT-only nativo, remove tradução`
- **#57** `feat(community): personas humanizadas + fix botão notificações`
- **#58** `docs(auditoria): UX audit Sessão 1 — 5 gargalos críticos + 7 quick wins`
- **#59** `fix(forum): 18 fixes funcionais — UX impecável nas interações core`
- **#60** `docs(auditoria): UX Sessão 2 — funnel SQL + mobile audit revelam causas-raiz`
- **#61** `refactor: QW#1 — cleanup rotas duplicadas (/feed /notifications /lp)`
- **#62** `feat(sidebar): QW#2 — Em breve agrupado/colapsável`
- **#63** `feat(lp): QW#3 — hero CTA hierarquia primary >> ghost`
- **#64** `fix(mobile-nav): QW#6 — a11y + indicador de tab ativa`
- **#65** `feat(register): QW#7 — indicador força de senha`
- **#66** `feat(onboarding): QW#4 — gancho de valor substitui "É opcional"`
- **#67** `feat(forum): QW#5 — banner de boas-vindas pra novato (0 posts)`
- **#68** `fix(forum,follow): Bloco C — emoji mobile + cache role TTL`

## Documentos de auditoria salvos
- `docs/auditoria/2026-05-05-ux-deep-audit-PLAN.md` — plano 7 fases
- `docs/auditoria/2026-05-05-ux-deep-audit-REPORT-S1.md` — Sessão 1 completa
- `docs/auditoria/2026-05-06-ux-deep-audit-REPORT-S2.md` — Sessão 2 (funnel + mobile)
- `docs/auditoria/2026-05-06-ux-deep-audit-REPORT-S3-FINAL.md` — síntese final + roadmap Bloco A
- `docs/auditoria/2026-05-05-functional-audit-REPORT.md` — auditoria funcional + 18 fixes
- `docs/auditoria/2026-05-05-ux-audit-REPORT.md` — auditoria de regressão pós-PRs
- `docs/stories/CURADORIA-PT-ONLY.story.md`
- `docs/stories/CURATOR-AVATARS.story.md`
