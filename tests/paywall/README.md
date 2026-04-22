# PAYWALL-4 — Cobertura de testes

> 9 cenarios validados via: testes JS (node --test) + SQL smoke + validacao manual.

## Cobertura

| # | Cenario | Onde |
|---|---|---|
| 1 | Anon em /forum | `middleware.test.ts` (anon -> /login) |
| 2 | Free logado em /forum | `middleware.test.ts` (free -> /pricing) |
| 3 | Pro em /forum | `middleware.test.ts` (pro passa) |
| 4 | Admin em /forum | `middleware.test.ts` (admin passa) |
| 5 | Query direta posts como free | `tests/sql/paywall-rls.sql` teste 6 |
| 6 | /api/forum/search como free | validacao manual (curl abaixo) |
| 7 | Deep link /forum/thread/{id} como free | `middleware.test.ts` |
| 8 | Webhook billing.cancelled | cobertura existente em `abacatepay/route.ts` (downgrade para free) |
| 9 | Query direta forum_categories como free | `tests/sql/paywall-rls.sql` teste 4 |

## Rodar testes JS

```bash
# Node 20+ (nativo)
node --test --import tsx tests/paywall/middleware.test.ts tests/paywall/helper.test.ts
```

## Rodar SQL smoke

Abrir SQL editor do Supabase (projeto correto), colar `tests/sql/paywall-rls.sql`, substituir os UUIDs por users reais (um free + um pro), rodar bloco por bloco e conferir outputs esperados nos comentarios.

## Validacao manual API (cenario 6)

```bash
# Como anon (sem cookie):
curl -i https://forum.sinapse.club/api/forum/search?q=teste
# Esperado: 401 {"error":"unauthenticated"}

# Como free (com cookie de sessao free):
curl -i --cookie "sb-access-token=..." https://forum.sinapse.club/api/forum/search?q=teste
# Esperado: 403 {"error":"paywall","upgrade_url":"/pricing?upgrade=pro"}

# Como pro:
curl -i --cookie "sb-access-token=..." https://forum.sinapse.club/api/forum/search?q=teste
# Esperado: 200 {"results":[...]}
```

## Webhook (cenario 8)

Logica existente em `src/app/api/webhooks/abacatepay/route.ts` `processCancellationEvent`:
- Recebe `billing.cancelled` / `subscription.cancelled`
- Atualiza `profiles.role = 'free'`
- Atualiza `subscriptions.status = 'canceled'`

Na proxima request autenticada, middleware detecta role=free e redireciona para /pricing. Sem kill de sessao imediato (aceitavel no MVP — documentado em forum-paywall-gate.md secao 4).
