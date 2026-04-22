# PAYWALL-4: Testes — 9 cenarios do hard paywall

> **Status:** Done
> **Epic:** Forum Hard Paywall (Opcao A — gate total)
> **Assigned to:** @developer (Dex) -> @quality-gate (Quinn)
> **Complexity:** M
> **Created:** 2026-04-21
> **Design doc:** `docs/architecture/forum-paywall-gate.md`

---

## Objective

Cobrir os 9 cenarios criticos do paywall com testes automatizados (unit/integration via vitest) + um script SQL de verificacao RLS executavel via Supabase SQL editor ou `psql`. Nao depende de Playwright estar configurado — priorizamos testes rapidos e deterministicos.

## Cenarios (9)

| # | Cenario | Esperado |
|---|---|---|
| 1 | Anon em `/forum` | 302 para `/login?redirect=/forum` |
| 2 | Free logado em `/forum` | 302 para `/pricing?upgrade=pro&from=/forum` |
| 3 | Pro em `/forum` | 200 + conteudo renderizado |
| 4 | Admin em `/forum` | 200 + conteudo + admin widgets |
| 5 | Query direta `SELECT * FROM posts WHERE category_id IS NOT NULL` como free via anon key | 0 rows |
| 6 | Call `/api/forum/search?q=teste` como free | 403 `{ error: "paywall" }` |
| 7 | Deep link `/forum/thread/{id}` como free | 302 preservando `from` |
| 8 | Webhook `billing.cancelled` downgrade pro->free | role atualiza para `free`, proxima request redireciona |
| 9 | Query direta `SELECT * FROM forum_categories` como free | 0 rows |

## Acceptance Criteria

### AC-1: testes unit de `user_is_paid_member` (SQL)
- [ ] Arquivo `tests/sql/paywall-rls.sql` com:
  - `SET LOCAL request.jwt.claims = '{"sub":"<free_user_id>"}'` -> `SELECT user_is_paid_member()` = false
  - Mesmo com pro user -> true
  - Anon (sem JWT) -> false

### AC-2: testes integration de middleware
- [ ] Arquivo `tests/integration/paywall-middleware.test.ts` (vitest)
- [ ] Mock `createServerClient` para retornar user+profile controlaveis
- [ ] 4 casos: anon/forum, free/forum, pro/forum, admin/forum
- [ ] Verifica status code + redirect location

### AC-3: testes integration de API
- [ ] Arquivo `tests/integration/paywall-api.test.ts`
- [ ] Mock supabase server client
- [ ] 3 casos para `/api/forum/search`: anon (401), free (403), pro (200)

### AC-4: testes integration de server action
- [ ] Em `tests/integration/paywall-actions.test.ts`
- [ ] 2 casos: free tenta `updatePost` (throw), pro executa com sucesso

### AC-5: script SQL de smoke test RLS
- [ ] `tests/sql/paywall-rls.sql` inclui:
  - Count de posts com category_id visiveis por role (usando `SET LOCAL` para simular JWT)
  - Count de forum_categories por role
  - Count de reactions por role
  - Output esperado documentado em comentarios

### AC-6: teste de webhook de cancelamento
- [ ] `tests/integration/paywall-webhook-cancel.test.ts`
- [ ] Mock supabase admin client
- [ ] Payload `billing.cancelled` -> verifica que `profiles.update({ role: 'free' })` foi chamado
- [ ] Cobre logica existente em `processCancellationEvent`

### AC-7: CI passa
- [ ] `npm run typecheck` sem erros novos
- [ ] `npm run lint` passa nos arquivos novos
- [ ] `npm test -- paywall` roda os testes novos localmente com sucesso

## Scope

### IN
- 4 arquivos de teste vitest
- 1 script SQL smoke
- Fixtures/mocks necessarios

### OUT
- Testes E2E com browser (Playwright) — defer para depois, fora do MVP deste flow
- Testes de performance
- Testes de migration rollback (validado manualmente)

## Dependencies

- Vitest configurado (existe? verificar `package.json`)
- PAYWALL-1/2/3 implementados

## Technical Notes

- Se vitest nao estiver configurado, criar setup minimo (`vitest.config.ts` + adicionar script `"test": "vitest run"` no package.json)
- Mocks de supabase: padronizar em `tests/_helpers/supabase-mock.ts`
- SQL script executavel via: `psql $DATABASE_URL -f tests/sql/paywall-rls.sql` OU copiar/colar no SQL editor do Supabase

## File List

- `tests/sql/paywall-rls.sql` (novo)
- `tests/integration/paywall-middleware.test.ts` (novo)
- `tests/integration/paywall-api.test.ts` (novo)
- `tests/integration/paywall-actions.test.ts` (novo)
- `tests/integration/paywall-webhook-cancel.test.ts` (novo)
- `tests/_helpers/supabase-mock.ts` (novo se nao existir)
- `vitest.config.ts` (criar se nao existe)
- `package.json` (script `test` se nao existe)

## Progress

- [ ] AC-1: testes SQL user_is_paid_member
- [ ] AC-2: middleware integration
- [ ] AC-3: API integration
- [ ] AC-4: actions integration
- [ ] AC-5: script SQL smoke
- [ ] AC-6: webhook cancel
- [ ] AC-7: CI passa

## Change Log

- 2026-04-21: Draft criado (@sprint-lead)
- 2026-04-21: Validada 9/10 (vitest setup marcado como opcional em AC-7) (@product-lead) -> Ready
