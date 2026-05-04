# Status Vivo — sinapse.club

> Snapshot do estado atual do projeto. Atualizado conforme avança.
> **Última atualização:** 2026-05-04

## Onde estamos

- **MVP funcional:** ✅ Forum BlackRat-style, gamificação, access tiers, LP v3
- **Branch ativa de trabalho:** `caio/fix/checkout-summary-redesign` (refatoração editorial+CRO do checkout)
- **Próximo grande gate:** Stripe em produção → deploy oficial

## Frentes em aberto

### 🔴 Stripe — bloqueador pra deploy

**Estado:** infraestrutura pronta, falta credenciais e wire final.

| Item | Status | Quem |
|------|--------|------|
| `lib/stripe.ts` (SDK + createSubscription + billing portal) | ✅ Pronto | — |
| `actions.ts` (`createStripeSubscriptionForVisitor`) | ✅ Pronto | — |
| `stripe-checkout-form.tsx` (Payment Element) | ✅ Pronto | — |
| `payment-provider.ts` feature flag | ✅ Default `stripe` | — |
| `pk_live_…` (publishable key) | ✅ Vercel prod env | Caio (2026-05-04) |
| `sk_live_…` (secret key) | ✅ Vercel prod env | Caio (2026-05-04) |
| Price IDs (mensal/semestral/anual) | ✅ Vercel prod env | Caio (2026-05-04) |
| `STRIPE_WEBHOOK_SECRET` | ✅ Vercel prod env (endpoint `forum.sinapse.club/api/webhooks/stripe`) | Caio (2026-05-04) |
| Wire `StripeCheckoutForm` no `page.tsx` | 🟡 Page renderiza `CheckoutFlow` (mock); precisa migrar UI editorial pro Stripe form OU integrar Payment Element no CheckoutFlow | Dev (eu/Caio) |

Detalhes: `docs/onboarding-stripe.md`

### 🟢 Checkout redesign — em validação

**Branch:** `caio/fix/checkout-summary-redesign`

- Layout 2 colunas (form esquerda, summary direita)
- Editorial headline "Acesso imediato." + subhead garantia
- Cards: Plan/Total/Garantia + "O que está incluso"
- Trust row com bandeiras SVG reais (Visa/Master/Elo/Amex/Pix)
- Progress bar linear no topo do form
- CTA forte: "Continuar pra pagamento" → "Liberar meu acesso agora"
- FAQ inline 2 perguntas no stage 2
- Logotipo SVG no header
- Travado em `h-dvh + overflow-hidden` — sem scroll

Screenshots em: `.tmp/checkout-screens/v10-anual.png`

### ⚪ Outros pendentes

- AbacatePay em fade-out (deprecated, removível 30 dias após Stripe estável)
- Migrations Supabase relacionadas a Stripe (verificar se aplicadas)
- Branch protection em `main` (atualmente DESPROTEGIDA)
- Convites Vercel/Supabase pro Soier

## Convenção de colab (resumo)

- **Branch naming:** `caio/{type}/{slug}` ou `soier/{type}/{slug}` (auto-detectado)
- **Sem hierarquia:** ambos podem mergear sem aprovação obrigatória
- **PR template:** sempre marcar o outro como reviewer (ciência, não bloqueante)
- **Nada de push direto em `main`** (quando branch protection ativar)
- **Hooks ativos:** secret scanning, story gate, delegation, architecture first

Detalhes completos: `.claude/rules/safe-collaboration.md`

## Como atualizar este doc

Toda mudança grande de status (release, breakage, novo bloqueador) → editar a tabela acima e bumpar a data.
