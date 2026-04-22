# Forum Paywall Gate — Dupla Camada

> **Status:** Draft v1.0 · **Autor:** Aria (@architect) · **Data:** 2026-04-21
> **Contexto:** Hard paywall (opção A). Usuário `free` NÃO vê nada do fórum.
> **Stack:** Next 16, React 19, Supabase (SSR auth helpers).

## 1. Diagnóstico do Estado Atual

### O que JÁ existe
- **Auth:** `profiles.role ∈ {free, pro, premium, instructor, admin}` + função SQL `role_rank()` (free=10, pro=20, premium=30, instructor=90, admin=100). Tabela `subscriptions` alimenta `role` via webhook (não diretamente consultada no gate).
- **Middleware:** `src/middleware.ts` → `src/lib/supabase/middleware.ts` já:
  - Redireciona anon em `/forum` pra `/login?redirect=...`.
  - Gates `pro` APENAS em `/marketplace`, `/benefits`, `/tools` (redirect pra `/pricing?upgrade=pro`).
  - **GAP:** `/forum/*` NÃO tem gate de tier — qualquer user autenticado (inclusive `free`) passa.
- **RLS (posts):** `user_has_forum_access(category_id, subcategory_id)` compara `role_rank(user)` vs `role_rank(category.access)`. Como **todas categorias têm `access='free'` (default)**, free lê tudo hoje.
- **RLS (reactions):** `SELECT using(true)` — **vaza contagens de likes/saves publicamente** (violação Art. X).
- **RLS (forum_categories / forum_subcategories):** `SELECT using(is_active=true)` — categorias visíveis pra anon/free (aceitável pra teaser na LP, mas precisa reavaliar sob hard paywall).

### O que falta (bloqueadores do hard paywall)
1. Middleware não bloqueia `free` em `/forum/*`.
2. RLS de `posts` permite `free` porque categorias são `access='free'`.
3. `reactions` sem gate.
4. API routes (`/api/forum/search`) sem gate de tier.
5. Server actions (`forum/actions.ts`) confiam em RLS, mas RLS atual é permissiva.
6. Sem bypass explícito para `admin`/`instructor` documentado (role_rank cobre, mas precisa teste).

## 2. Arquitetura Proposta — Dupla Camada

### Princípio: Defense in Depth
- **Camada 1 (Middleware):** UX rápida. Redireciona antes de renderizar. Barato, não é fonte da verdade.
- **Camada 2 (RLS):** Fonte da verdade. Mesmo que middleware falhe ou seja bypassado (edge function, query direta com anon key), DB nega.

### Camada 1 — Middleware (`src/lib/supabase/middleware.ts`)

Adicionar `/forum`, `/feed`, `/posts`, `/spaces`, `/courses`, `/calendar` a uma nova lista `paidGatedRoutes` (tier >= pro). Lógica:

```
if user.role_rank < 20 AND path ∈ paidGatedRoutes:
  redirect → /pricing?upgrade=pro&from={path}
```

- **Anon:** continua redirecionando pra `/login` (comportamento atual).
- **Free logado:** novo redirect pra `/pricing`.
- **Pro+:** passa.
- **Admin/instructor:** passa (role_rank 90/100).

### Camada 2 — RLS (Supabase)

Nova função SQL `user_is_paid_member()` — retorna `true` se `role_rank(auth.uid()) >= 20`. Usada em todas policies de leitura de fórum.

**Tabelas afetadas:**
| Tabela | Policy atual | Policy nova |
|---|---|---|
| `posts` (SELECT) | `user_has_forum_access(category_id, subcategory_id)` | adiciona `AND user_is_paid_member()` no branch de forum threads |
| `reactions` (SELECT) | `using(true)` ❌ | `using(user_is_paid_member())` |
| `forum_categories` (SELECT) | `is_active=true` | `is_active=true AND (user_is_paid_member() OR auth.uid() IS NULL AND preview_mode=true)` — decisão: manter público pra SEO/teaser na `/pricing`? **Default: gate total. Se quiser teaser, criar view `public_forum_teaser`.** |
| `forum_subcategories` (SELECT) | `is_active=true` | mesmo que categories |
| `post_views`, `shares`, `notifications` | RLS já restringe a `user_id = auth.uid()` | manter |

**Decisão chave — categories públicas ou gated?**
Recomendo **gated total** + criar view materializada `public_forum_teaser` (top 5 threads com título+autor, sem conteúdo) se quiser usar na `/pricing` como prova social. Mantém paywall hard e resolve SEO via metadata.

## 3. Arquivos a Criar/Modificar

### Modificar
- `src/lib/supabase/middleware.ts` — adicionar `paidGatedRoutes` + lógica de redirect.
- `src/app/(dashboard)/layout.tsx` (ou `forum/layout.tsx`) — defense in depth no server component (checar role, redirect se free, prevenir flash).
- `src/app/api/forum/search/route.ts` — validar tier antes de query.
- `src/app/(dashboard)/forum/actions.ts` — guard functions em mutations.

### Criar
- `supabase/migrations/20260421000000_paywall_gate.sql` — função `user_is_paid_member()` + update de policies.
- `src/lib/access/paywall.ts` — helper `requirePaidTier()` pra server components/actions.
- (Opcional) `supabase/migrations/20260421000001_public_forum_teaser.sql` — view se optar por teaser.

### Testes
- `tests/e2e/forum-paywall.spec.ts` — casos: anon, free, pro, admin, cancellation webhook.
- `tests/rls/forum-paywall.sql` — testes pgTAP ou Supabase local.

## 4. Edge Cases

| Caso | Tratamento |
|---|---|
| **Cancelamento de plano (webhook)** | Webhook atualiza `profiles.role = 'free'`. Próxima request do user → middleware redireciona. Sessão atual continua até refresh (aceitável). **Se quiser kill imediato:** invalidar sessão Supabase via `auth.admin.signOut(user_id)` no webhook. |
| **Trial** | Hoje não existe. Se futuro: `profiles.role = 'pro'` + `trial_ends_at`. Middleware lê ambos. **Fora do escopo MVP.** |
| **Admin/Instructor** | role_rank 90/100 → passam automaticamente. Testar explicitamente. |
| **Bypass server-to-server (service_role)** | RLS ignorada por service_role (by design). Nunca expor service_role no client (já é regra). |
| **OAuth onboarding incompleto** | Middleware atual já redireciona pra `/onboarding` se `profile.onboarded=false`. Mantém prioridade: onboarding > paywall. |
| **Deep links (email, share)** | Middleware redireciona preservando `?redirect={path}` → pós-checkout volta pra thread. |
| **Shares públicos (link de thread fora da plataforma)** | Hoje `shares` table existe. Avaliar feature futura "public preview" com 1 thread via slug público + nofollow. **Fora do escopo.** |
| **Reações em posts antigos (migração)** | RLS nova rejeita leitura de reactions pra free. Zero impacto em dados existentes — apenas visibilidade. |

## 5. Plano de Migração

### Fase 1 — Preparação (sem quebrar)
1. Criar migration com `user_is_paid_member()` SEM aplicar policies novas.
2. Deploy. Validar função em SQL (`SELECT user_is_paid_member()` como user free vs pro).

### Fase 2 — RLS (noite / baixo tráfego)
3. Aplicar policies novas em transação. Rollback script pronto.
4. Smoke test: login como free → query `posts` retorna 0 rows. Login como pro → retorna threads.

### Fase 3 — Middleware (deploy coordenado)
5. Deploy middleware update. Free logados recebem redirect.
6. Monitorar logs Vercel 1h: contar 302s pra `/pricing?upgrade=pro`.

### Fase 4 — Limpeza
7. Se tiver teaser público, aplicar migration da view.
8. Atualizar docs: `ADR-002-access-control-tiers.md` com changelog.

**Rollback:** single migration com `-- DOWN` section. Middleware rollback = revert commit + redeploy Vercel (1 min).

**Usuários atuais free:** comunicar por email antes ("apartir de X, fórum exclusivo pra membros Pro"). Fora do escopo técnico.

## 6. Stories Sugeridas (pro @sprint-lead)

| ID sugerido | Título | Tamanho |
|---|---|---|
| **PAYWALL-1** | SQL: função `user_is_paid_member()` + policies RLS em posts/reactions/categories | M |
| **PAYWALL-2** | Middleware: gate tier pro em `/forum`, `/feed`, `/posts`, `/spaces`, `/courses`, `/calendar` | S |
| **PAYWALL-3** | Server defense in depth: layout + helper `requirePaidTier()` + guard em API/actions | S |
| **PAYWALL-4** | Testes E2E paywall (anon/free/pro/admin) + testes RLS | M |
| **PAYWALL-5** (opcional) | View pública `public_forum_teaser` + integração na `/pricing` | S |
| **PAYWALL-6** (opcional) | Webhook de cancelamento: kill session imediato | XS |

**Ordem:** 1 → 2 → 3 → 4 (bloqueantes). 5 e 6 depois do MVP.

## 7. Referências

- `.claude/rules/security-data-protection.md` — Art. X, RLS mandatory
- `docs/architecture/ADR-002-access-control-tiers.md` — tier model atual
- `supabase/migrations/20260401183821_access_control_tiers.sql` — role_rank + RLS base
- `supabase/migrations/20260405133000_secure_forum_thread_access.sql` — user_has_forum_access
- `src/lib/access.ts` — helpers TS (mirror do SQL)
