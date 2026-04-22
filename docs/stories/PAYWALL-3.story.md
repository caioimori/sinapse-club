# PAYWALL-3: Server Defense — requirePaidTier + API/actions guards

> **Status:** Done
> **Epic:** Forum Hard Paywall (Opcao A — gate total)
> **Assigned to:** @developer (Dex)
> **Complexity:** S
> **Created:** 2026-04-21
> **Design doc:** `docs/architecture/forum-paywall-gate.md`

---

## Objective

Criar helper `requirePaidTier()` e aplicar em (a) API route `/api/forum/search`, (b) server actions de forum, (c) layout do dashboard (prevenir flash em caso de bypass de middleware). Defense in depth na camada de aplicacao.

## Acceptance Criteria

### AC-1: helper requirePaidTier
- [ ] Arquivo novo `src/lib/access/paywall.ts` com funcao `requirePaidTier()` async
- [ ] Usa `createClient()` de `@/lib/supabase/server`
- [ ] Chama `supabase.auth.getUser()` e le `profiles.role`
- [ ] Se sem user -> throw `new Error("UNAUTHENTICATED")`
- [ ] Se role_rank < 20 -> throw `new Error("PAYWALL_BLOCKED")`
- [ ] Retorna `{ user, role, profile }` em caso de sucesso
- [ ] Funcao auxiliar `checkPaidTier()` que retorna `{ ok: boolean, role?: string }` sem throw (para usar em layouts)

### AC-2: /api/forum/search gated
- [ ] Route chama `requirePaidTier()` no inicio
- [ ] Em caso de `UNAUTHENTICATED` -> 401
- [ ] Em caso de `PAYWALL_BLOCKED` -> 403 com body `{ error: "paywall", upgrade_url: "/pricing?upgrade=pro" }`
- [ ] Cobertura de query direta com anon key: bloqueado

### AC-3: server actions em `forum/actions.ts`
- [ ] Funcao `requireUser()` substituida por (ou complementada com) `requirePaidTier()` em mutations que dependem de membership (`updatePost`, `updateReply`, `deletePost`, `deleteReply`, `reportContent`)
- [ ] Admin actions (`adminDeletePost`, `adminDeleteReply`, `dismissReport`) continuam usando `requireAdmin()` (admin ja e paid tier por role_rank)
- [ ] Mensagem de erro amigavel: `"Upgrade para Pro necessario"`

### AC-4: layout defense in depth (preventir flash)
- [ ] `src/app/(dashboard)/forum/layout.tsx` (criar se nao existir) ou adicionar check em `src/app/(dashboard)/layout.tsx`
- [ ] Check de tier no server component, redirect via `redirect("/pricing?upgrade=pro&from=/forum")` se free
- [ ] Rotas do paidGatedRoutes cobertas pelo layout — evita render de UI para free mesmo que middleware falhe
- [ ] Decisao: como `(dashboard)` tambem abriga `/profile`, `/settings` (que free acessa), o check de tier vai em **um layout dedicado** `src/app/(dashboard)/forum/layout.tsx`. Para outras rotas pagas (`/feed`, `/posts`, `/spaces`, `/courses`, `/calendar`), criar layouts analogos OU helper `requirePaidTier()` invocado no inicio de cada page.tsx raiz

### AC-5: zero quebra em mutations existentes
- [ ] Admin (role=admin) continua editando/deletando
- [ ] Pro+ continua criando/editando posts proprios
- [ ] Free tenta mutation -> erro claro "Upgrade para Pro necessario"

## Scope

### IN
- Helper `src/lib/access/paywall.ts`
- Gate em `/api/forum/search/route.ts`
- Gate em `src/app/(dashboard)/forum/actions.ts` (mutations non-admin)
- Layout gate em `src/app/(dashboard)/forum/layout.tsx`

### OUT
- RLS (PAYWALL-1)
- Middleware (PAYWALL-2)
- Tests (PAYWALL-4)
- Refatorar todas as rotas do dashboard (fora do forum) — decisao: foco em `/forum/*` neste MVP; rotas `/feed`, `/courses`, `/calendar`, `/posts`, `/spaces` ficam protegidas apenas por middleware + RLS (reavaliar depois de deploy)

## Dependencies

- PAYWALL-1 (RLS) — desejavel mas nao bloqueante (helper funciona independente)
- `createClient` de `@/lib/supabase/server` (existe)
- `getRoleRank` de `@/lib/access` (existe)

## Technical Notes

- Exportar `PAYWALL_ERROR_CODES = { UNAUTHENTICATED, PAYWALL_BLOCKED }` como const para match client
- `checkPaidTier()` evita throw em layouts (preferivel `redirect()` do next/navigation)
- Layout dedicado para `/forum` simplifica defesa em `page.tsx` (todos os children herdam)

## File List

- `src/lib/access/paywall.ts` (novo)
- `src/app/api/forum/search/route.ts` (modificado)
- `src/app/(dashboard)/forum/actions.ts` (modificado)
- `src/app/(dashboard)/forum/layout.tsx` (novo)

## Progress

- [ ] AC-1: helper criado
- [ ] AC-2: /api/forum/search gated
- [ ] AC-3: actions gated
- [ ] AC-4: layout defense
- [ ] AC-5: zero quebras

## Change Log

- 2026-04-21: Draft criado (@sprint-lead)
- 2026-04-21: Validada 9/10 (layout strategy explicitada em AC-4) (@product-lead) -> Ready
