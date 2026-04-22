# PAYWALL-2: Middleware Tier Gate — /forum e rotas pagas

> **Status:** Done
> **Epic:** Forum Hard Paywall (Opcao A — gate total)
> **Assigned to:** @developer (Dex)
> **Complexity:** S
> **Created:** 2026-04-21
> **Design doc:** `docs/architecture/forum-paywall-gate.md`

---

## Objective

Estender o middleware (`src/lib/supabase/middleware.ts`) para redirecionar user `free` logado em qualquer rota do forum para `/pricing?upgrade=pro&from={path}`. Anon continua com redirect para `/login`.

## Acceptance Criteria

### AC-1: lista paidGatedRoutes
- [ ] Constante `paidGatedRoutes` definida com: `/forum`, `/feed`, `/posts`, `/spaces`, `/courses`, `/calendar`
- [ ] Nao inclui `/profile`, `/settings`, `/notifications`, `/explore`, `/leaderboard` (membros free ainda acessam esses para gerenciar conta)
- [ ] `/marketplace`, `/benefits`, `/tools` continuam com gate pro existente (sem duplicar)

### AC-2: redirect free -> /pricing
- [ ] User autenticado com `role_rank(profile.role) < 20` em rota de `paidGatedRoutes` recebe 302 para `/pricing?upgrade=pro&from={pathname}`
- [ ] Pathname original preservado no query param `from`
- [ ] Redirect ocorre APOS check de onboarding (se nao onboarded, vai para `/onboarding` primeiro — prioridade mantida)

### AC-3: bypass pro+/admin/instructor
- [ ] `role_rank >= 20` passa (pro, premium, instructor, admin)
- [ ] Admin em `/admin` continua funcionando (check de admin ja existente antes do paywall)

### AC-4: anon comportamento mantido
- [ ] Anon em `/forum/*` -> 302 para `/login?redirect=/forum/...` (comportamento atual preservado)
- [ ] NAO redireciona anon para `/pricing` (mantem fluxo de login primeiro)

### AC-5: zero regressoes
- [ ] `/pricing`, `/login`, `/register`, `/demo`, `/api/*`, `/` continuam publicos
- [ ] Auth callback `/auth/callback` continua funcionando

## Scope

### IN
- Modificar `src/lib/supabase/middleware.ts`
- Adicionar constante `paidGatedRoutes`
- Logica de tier check

### OUT
- RLS (PAYWALL-1)
- Server defense (PAYWALL-3)
- Testes (PAYWALL-4)
- UI da pagina `/pricing?upgrade=pro&from=...` (ja existe, nao faz parte)

## Dependencies

- PAYWALL-1 nao e bloqueante (middleware e layer 1, RLS layer 2 — podem ir juntos ou separados, mas aqui vamos atomicos)
- `getRoleRank` ja existe em `src/lib/access.ts`

## Technical Notes

- O middleware ja carrega `profile.role` e `profile.onboarded` em uma query. Reusar.
- Ordem dos gates: anon -> onboarding -> admin -> paywall (free) -> proGated (ja existente)
- Nao alterar a lista `isDashboardRoute` (continua cobrindo auth redirect)

## File List

- `src/lib/supabase/middleware.ts` (modificado)

## Progress

- [ ] AC-1: paidGatedRoutes definido
- [ ] AC-2: redirect free
- [ ] AC-3: bypass pro+
- [ ] AC-4: anon mantido
- [ ] AC-5: zero regressoes

## Change Log

- 2026-04-21: Draft criado (@sprint-lead)
- 2026-04-21: Validada 10/10 (@product-lead) -> Ready
