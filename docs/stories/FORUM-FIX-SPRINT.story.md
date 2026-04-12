# Story: Forum Foundation & Bug Sprint

**Epic:** Forum hardening pre-launch
**Status:** Ready
**Owner:** @developer
**Created:** 2026-04-12

## Context

Auditoria 360º (`docs/audits/00-executive-report.md`) identificou 14 bugs E2E + 3 críticos técnicos + 10 gaps de Hook + 14 recomendações de neurodesign. Um deles estava quebrando 100% dos likes em produção (trigger SQL com schema drift) — já corrigido via migration.

Este sprint ataca os 20-30 fixes de maior impacto antes de qualquer feature nova.

## Acceptance Criteria (Given / When / Then)

**AC1 — Foundation**
- Given o código usa `(supabase as any)` em 60+ lugares
- When types do Supabase forem gerados e aplicados no módulo forum
- Then nenhum `as any` permanece em `src/app/(dashboard)/forum/**` e `src/components/forum/**`

**AC2 — P0 Bugs**
- Given user publicava/curtia/navegava com bugs críticos
- When os 5 P0 bugs forem corrigidos (onboarding race, HTML leak, optimistic rollback, error boundaries, backfill rep)
- Then o E2E passa end-to-end sem intervenção manual

**AC3 — Segurança**
- Given server actions aceitavam input sem validação
- When Zod schemas forem aplicados em todas as actions críticas
- Then inputs inválidos retornam erro 400 estruturado sem crash

**AC4 — Dopamina**
- Given actions (like, post, follow, level up) tinham zero feedback
- When toasts/badges/celebration forem implementadas
- Then cada ação tem reward visual ≤ 500ms

**AC5 — Observability**
- Given produção tinha zero error tracking
- When Sentry for integrado
- Then exceptions e RLS violations disparam alertas

**AC6 — Thread detail compila**
- Given `/forum/thread/[id]` não compila no Windows (Turbopack + jsdom)
- When `isomorphic-dompurify` for substituído por `sanitize-html` server + DOMPurify client
- Then thread detail abre em <3s em dev e prod

## Scope

**IN:**
- Types do Supabase + refactor `as any` no módulo forum
- Sentry (nextjs integration)
- 5 bugs P0 (E2E-2, E2E-3, E2E-11/12, E2E-X1, backfill reputation)
- Zod em server actions de forum
- aria-labels nos action buttons
- RLS policies explícitas em notifications
- Error boundaries em rotas dinâmicas do forum
- Dopamine: unread badge, confetti like, first-post toast, empty states, streaks UI
- Drift fixes: hardcoded colors, scroll-behavior, sticky-cta bg
- Optimistic UI rollback no like/repost/follow
- E2E re-validation (thread detail, notifs, poll)

**OUT:**
- Iconografia proprietária (sprint separado)
- Custom display font (sprint separado)
- Tier Founders (sprint comercial)
- Marketplace / Tools / Courses features (conforme instrução)
- LGPD export/DPO (sprint compliance separado)
- Keyboard shortcuts visíveis

## Dependencies
- Supabase CLI (para gen types)
- Sentry account DSN (pode ser dev tier gratuito)
- `canvas-confetti` lib (add)
- `sanitize-html` lib (substitui isomorphic-dompurify)

## Estimativa
- Foundation: 4h
- P0 bugs: 4h
- Segurança: 4h
- Dopamina: 6h
- CRO/drift: 2h
- E2E validation: 2h
- Commits + PR: 1h
- **Total:** ~23h (~3 dias full-time)

## File List (will be updated)
_Updated during implementation._
