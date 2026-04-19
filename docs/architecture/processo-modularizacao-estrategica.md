# Processo de Modularizacao Estrategica — sinapse.club

**Status:** Ativo | **Owners:** Caio (estrategia) + Soier (tech lead) | **Data:** 2026-04-17
**Arquitetura:** Modular Monolith (Next 15 + Supabase + Vercel)
**Escopo:** Roadmap Fase 1 (forum) -> Fase 2 (cursos) -> Fase 3 (marketplace + tools AI)

> Objetivo unico: entregar mais rapido, com mais qualidade, sem que modulo novo quebre modulo em producao.
> Regra de ouro: **boundary antes de feature**. Se voce nao consegue desenhar o contrato do modulo em 1 pagina, ainda nao pode escrever o codigo dele.

---

## 1. Estado atual vs estado alvo

### 1.1 O que ja existe (brownfield check)

| Area | Realidade hoje | Acao |
|---|---|---|
| `src/app/` | App Router Next 15 com `(auth)`, `(dashboard)`, `(marketing)`, `api/` | Manter. Rotas ficam aqui; logica sai pra `src/modules/` |
| `src/components/forum,courses,gamification,feed...` | Componentes soltos por dominio | **Migrar** pra `src/modules/{forum,courses}/ui/` |
| `src/lib/` | `abacatepay.ts`, `access.ts`, `reputation.ts`, `supabase/` | Separar: infra (supabase) -> `src/shared/db`, pagamentos -> `src/shared/payments`, reputation -> `src/modules/gamification` |
| Testes | **Nao existem** | Setup Vitest + Playwright na Fase 0 |
| Feature flags | Nao existem | Adicionar via tabela `feature_flags` no Supabase |
| Events | Nao existem | Adicionar `src/shared/events/` (in-process bus) |

### 1.2 Estrutura alvo

```
src/
  app/                          # Next App Router (rotas = thin layer)
    (dashboard)/forum/...       # importa APENAS de @/modules/forum/api
    (dashboard)/courses/...     # importa APENAS de @/modules/courses/api
    api/...                     # API routes (thin controllers)

  modules/                      # UM diretorio por dominio de negocio
    forum/
      api/                      # PUBLIC — unica porta de entrada
        index.ts                # export const forumAPI = { ... }
      domain/                   # Entidades, regras puras (sem I/O)
      application/              # Use cases (orquestra domain + infra)
      infra/                    # Supabase queries, adapters
      ui/                       # Componentes React do modulo
      events/                   # Eventos emitidos/consumidos
      contracts.ts              # Zod schemas — contrato publico
      flags.ts                  # Feature flags do modulo
      __tests__/

    courses/                    # (Fase 2)
    marketplace/                # (Fase 3)
    tools/                      # (Fase 3)
    gamification/               # Transversal mas isolado
    identity/                   # User profile compartilhado

  shared/                       # Infraestrutura cross-module
    auth/                       # Supabase auth helpers
    db/                         # Supabase client factory, tipos
    payments/                   # AbacatePay, Hotmart, Kiwify adapters
    events/                     # Event bus in-process
    ui/                         # Design system (shadcn, primitives)
    flags/                      # Feature flag client
    observability/              # Sentry wrappers, logger

  types/                        # Tipos 100% globais (raros)
```

**Regra visual:** se um arquivo importa de dois modulos diferentes (`@/modules/forum` + `@/modules/courses`), ele esta errado OU esta em `src/app/` (composicao de UI final).

---

## 2. Regras de acoplamento (duras, auditaveis)

### 2.1 Quem pode importar de quem

| De \ Para | `modules/X/api` | `modules/X/domain` | `modules/X/infra` | `modules/X/ui` | `shared/*` |
|---|---|---|---|---|---|
| `app/*` | OK | NAO | NAO | OK | OK |
| `modules/Y/*` (outro modulo) | OK | **NAO** | **NAO** | **NAO** | OK |
| `modules/X/*` (mesmo modulo) | — | OK | OK | OK | OK |
| `shared/*` | NAO (shared nao conhece modulos) | NAO | NAO | NAO | OK |

**Traducao em 1 linha:** modulo so fala com outro modulo via `@/modules/X/api` (a porta da frente). Nunca entra pela cozinha.

### 2.2 Enforcement (nao e sugestao)

Adicionar em `eslint.config.mjs`:

```js
// .eslintrc — regra no-restricted-imports
{
  "no-restricted-imports": ["error", {
    "patterns": [
      { "group": ["@/modules/*/domain/*", "@/modules/*/infra/*"],
        "message": "Importe apenas de @/modules/X/api. Nunca entre em domain/infra de outro modulo." },
      { "group": ["@/modules/*/ui/*"],
        "message": "UI de modulo e privada. Exponha via api se precisar reusar." }
    ]
  }]
}
```

Mais: **dependency-cruiser** no CI bloqueia ciclos entre modulos.

### 2.3 Comunicacao entre modulos — duas vias apenas

| Tipo | Quando usar | Como |
|---|---|---|
| **Query sincrona** (API contract) | Precisa de dado AGORA (ex: `forum` precisa do rank do usuario) | `await gamificationAPI.getUserRank(userId)` |
| **Evento assincrono** (Event bus) | "Algo aconteceu, quem se importa reage" (ex: post criado -> gamification da +10 pts) | `events.emit('forum.post.created', {...})` |

**Proibido:** modulo A chamar Supabase direto em tabela owned por modulo B. Sempre via API publica de B.

---

## 3. Contratos duros (o coracao da modularidade)

Cada modulo expoe **exatamente 3 arquivos publicos**:

| Arquivo | O que tem | Exemplo |
|---|---|---|
| `modules/forum/api/index.ts` | Funcoes publicas, tipadas | `createPost(input)`, `listFeed(filter)` |
| `modules/forum/contracts.ts` | Zod schemas de I/O | `CreatePostInput`, `Post`, `FeedFilter` |
| `modules/forum/events/index.ts` | Eventos que emite/consome | `forum.post.created`, `forum.post.deleted` |

### 3.1 Exemplo real — modulo `gamification` expondo para `forum`

```ts
// src/modules/gamification/contracts.ts
import { z } from 'zod';

export const UserRank = z.object({
  userId: z.string().uuid(),
  level: z.number().int().min(1),
  xp: z.number().int().min(0),
  badge: z.enum(['bronze','prata','ouro','diamante']),
});
export type UserRank = z.infer<typeof UserRank>;

// src/modules/gamification/api/index.ts
import { UserRank } from '../contracts';

export const gamificationAPI = {
  getUserRank: async (userId: string): Promise<UserRank> => { /* ... */ },
  awardXP: async (userId: string, amount: number, reason: string): Promise<void> => { /* ... */ },
};

// src/modules/forum/ui/PostCard.tsx  ← consumidor
import { gamificationAPI } from '@/modules/gamification/api';
// JAMAIS: import { calcRank } from '@/modules/gamification/domain/...'
```

### 3.2 Contrato = versao

Toda quebra de contrato de API publica entre modulos **exige**:
1. Bump de versao no header do arquivo `api/index.ts` (`@version 2.0.0`)
2. Contract test passando para ambas versoes durante 1 sprint (deprecation window)
3. ADR em `docs/architecture/ADR-XXX.md` justificando

---

## 4. Estrategia anti-regressao (o que DA garantia real)

### 4.1 Piramide de testes por modulo

| Camada | Ferramenta | Cobertura minima | Roda em |
|---|---|---|---|
| **Unit** (domain puro) | Vitest | 80% das regras de negocio | pre-commit + CI |
| **Contract** (api publica) | Vitest + Zod | 100% das funcoes de `api/index.ts` | CI obrigatorio |
| **Integration** (infra real) | Vitest + Supabase local | Queries criticas | CI |
| **E2E critico** | Playwright | 5-10 fluxos de receita | CI + pre-deploy |
| **Smoke producao** | Playwright headless | 3 fluxos ("login", "ver feed", "pagar") | Pos-deploy canary |

### 4.2 Contract tests — a defesa real contra regressao cruzada

Cada modulo que CONSOME outro grava o contrato esperado:

```ts
// modules/forum/__tests__/contracts/gamification.contract.test.ts
import { gamificationAPI } from '@/modules/gamification/api';
import { UserRank } from '@/modules/gamification/contracts';

test('gamification.getUserRank mantem contrato que forum depende', async () => {
  const result = await gamificationAPI.getUserRank('user-123');
  expect(() => UserRank.parse(result)).not.toThrow();
  expect(result).toHaveProperty('badge'); // forum UI usa isso
});
```

Se o modulo `gamification` mudar o shape e quebrar `forum`, o teste falha no CI **antes** de merge. Zero regressao cross-module.

### 4.3 E2E criticos (minimo absoluto)

Fluxos que, se quebrarem, o negocio para. Rodam em TODO PR:

| Fluxo | Fase | Criticidade |
|---|---|---|
| Login + onboarding | 1+ | P0 |
| Pagamento assinatura R$197 (AbacatePay) | 1+ | P0 |
| Criar post no forum + aparecer no feed | 1+ | P0 |
| Comprar curso (Hotmart/Kiwify) + acesso liberado | 2+ | P0 |
| Comprar item no marketplace | 3 | P0 |

---

## 5. Feature flag strategy (kill-switch em producao)

### 5.1 Modelo

Tabela `feature_flags` no Supabase:
```sql
create table feature_flags (
  key text primary key,         -- 'module.courses.enabled'
  enabled boolean not null default false,
  rollout_percent int default 0, -- 0..100 (canary)
  audience jsonb default '{}',   -- {tier:'pro'}, {users:['uuid']}
  updated_at timestamptz default now()
);
```

### 5.2 Convencao de nomes

| Tipo | Padrao | Exemplo |
|---|---|---|
| Modulo inteiro | `module.{nome}.enabled` | `module.courses.enabled` |
| Feature dentro de modulo | `{modulo}.{feature}` | `forum.rich_editor` |
| Kill-switch emergencia | `killswitch.{area}` | `killswitch.payments` |

### 5.3 Uso

```ts
// src/shared/flags/client.ts
export async function isEnabled(key: string, userId?: string): Promise<boolean> { /* ... */ }

// Em route/componente:
if (!(await isEnabled('module.courses.enabled', user.id))) return notFound();
```

**Regra:** todo modulo novo nasce atras de `module.{nome}.enabled = false`. Liga gradualmente (1% -> 10% -> 50% -> 100%). Se quebrar, desliga sem deploy.

---

## 6. Pipeline CI/CD minimo

### 6.1 Ordem obrigatoria (GitHub Actions)

```
PR aberta
  1. lint (eslint + no-restricted-imports + dependency-cruiser)
  2. typecheck (tsc --noEmit)
  3. unit tests (vitest)
  4. contract tests (vitest — contratos inter-modulo)
  5. build (next build)
  6. E2E criticos (Playwright em preview Vercel)
  -> merge bloqueado se qualquer falhar

main merged
  7. Deploy Vercel producao com canary 10%
  8. Smoke tests pos-deploy (Playwright)
  9. Se smoke falhar -> auto-rollback (Vercel promote anterior)
  10. Se OK -> rollout 100%
  11. Sentry watch 15min -> se error rate >2x baseline, auto-rollback
```

### 6.2 Proteg branch `main`

- Squash merge only
- Review obrigatorio (Caio aprova PRs do Soier; PRs do Caio vao direto por admin bypass quando solo)
- Status checks: todos os 6 steps acima

---

## 7. Fases de execucao (roadmap modular)

### Fase 0 — Setup modular (1 semana, BLOQUEADORA)
Sem isso, qualquer feature construida vira divida tecnica.

| # | Tarefa | Owner | Done quando |
|---|---|---|---|
| 0.1 | Criar `src/modules/` e `src/shared/` vazios | Soier | Pastas commitadas com README |
| 0.2 | Migrar `src/lib/supabase` -> `src/shared/db` | Soier | Imports atualizados, build verde |
| 0.3 | Migrar `src/lib/abacatepay.ts` -> `src/shared/payments/abacatepay` | Soier | Build verde |
| 0.4 | Setup Vitest + Playwright | Soier | `npm test` e `npm run e2e` funcionam |
| 0.5 | Setup dependency-cruiser + no-restricted-imports | Soier | CI falha se violar boundary |
| 0.6 | Tabela `feature_flags` + client `src/shared/flags/` | Soier | `isEnabled('test')` retorna false |
| 0.7 | Event bus in-process `src/shared/events/` | Soier | `events.emit` + `events.on` funcionam + testados |
| 0.8 | Pipeline CI completo (6 steps) | Caio+Soier | PR de teste passa todos os gates |

### Fase 1 — Forum isolado (4-6 semanas)
MVP que paga o R$10k MRR.

| # | Marco | Gate para proxima |
|---|---|---|
| 1.1 | Estrutura `modules/forum/{api,domain,application,infra,ui,contracts,events}` criada | Lint + typecheck verdes |
| 1.2 | Migrar `components/forum/*` -> `modules/forum/ui/` | Zero import de fora da api publica |
| 1.3 | Definir `forum/contracts.ts` (Post, Thread, Feed) | Revisao Caio + ADR |
| 1.4 | Definir `forum/api/index.ts` (createPost, listFeed, etc) | Contract tests 100% |
| 1.5 | `modules/identity` + `modules/gamification` extraidos | Forum consome via api publica apenas |
| 1.6 | E2E: "login -> pagar R$197 -> criar post -> aparecer no feed" verde | P0 E2E passa em 3 PRs seguidos |
| 1.7 | Deploy com `module.forum.enabled=true` a 10% -> 100% em 3 dias | Sentry sem alertas |

### Fase 2 — Cursos plug-in (6-8 semanas)
Precisa: modulo `courses` adicionado SEM tocar em `forum`.

| # | Marco | Regra |
|---|---|---|
| 2.1 | `modules/courses/` criado, flag `module.courses.enabled=false` | Merge permitido mesmo incompleto (desligado) |
| 2.2 | Integracao Hotmart/Kiwify via `shared/payments/` adapters | Webhook valida assinatura |
| 2.3 | Courses consome `identity.api` e `gamification.api` — nunca tabelas de outro modulo | Contract tests |
| 2.4 | E2E P0 de forum **continua passando** sem nenhuma modificacao | Gate: se quebrou, rollback |
| 2.5 | Canary 10% -> 100% | Flag por audiencia (`tier:pro`) |

### Fase 3 — Marketplace + Tools AI (8-12 semanas)
Mesmo padrao. Modulos `marketplace` e `tools` nascem atras de flag. Consomem `identity`, `payments`, `gamification` apenas via api publica.

---

## 8. Checklist "Done" por modulo (NAO merge sem isso)

Todo modulo novo so e considerado entregue quando:

- [ ] Estrutura `api/ domain/ application/ infra/ ui/ contracts.ts events/` presente
- [ ] `contracts.ts` com Zod schemas para todo I/O publico
- [ ] `api/index.ts` exporta objeto unico `{nomeAPI}` — nenhuma funcao solta
- [ ] Zero `import` de `domain/` ou `infra/` de outro modulo (ESLint verifica)
- [ ] Zero query Supabase em tabelas owned por outro modulo
- [ ] Unit tests >= 80% em `domain/`
- [ ] Contract tests 100% em `api/`
- [ ] E2E P0 do modulo passa
- [ ] E2E P0 dos modulos ANTERIORES continuam passando (regressao zero)
- [ ] Feature flag `module.{nome}.enabled` existe e default false em prod
- [ ] ADR criado em `docs/architecture/ADR-XXX.md` se houve decisao nao-obvia
- [ ] README do modulo em `src/modules/{nome}/README.md` (1 pagina: o que faz, api, eventos)
- [ ] Sentry tag `module:{nome}` configurada
- [ ] Canary 10% rodou por >= 24h sem alerta

---

## 9. Anti-patterns (matam a modularidade — ZERO tolerancia)

| Anti-pattern | Por que mata | O certo |
|---|---|---|
| Import direto em `domain/` ou `infra/` de outro modulo | Acopla permanentemente; refactor vira rewrite | `@/modules/X/api` apenas |
| "Shared utils" virando lixeira de logica de negocio | `shared/` incha e ninguem sabe quem depende do que | Regra de negocio SEMPRE em `modules/X/domain/` |
| Modulo fazendo query em tabela de outro modulo | Bypassa contrato; quebra silenciosamente em schema change | API publica do dono da tabela |
| Event bus com payload sem schema | Consumidor quebra quando emissor muda shape | Zod schema em `events/index.ts` obrigatorio |
| Deploy sem feature flag | Bug em producao = rollback manual apavorado | Tudo nasce com flag default off |
| "Teste a gente faz depois" | "Depois" nunca chega; divida tecnica exponencial | Contract tests sao PRE-requisito de merge |
| Modulo novo mexendo em codigo de modulo antigo | Regressao garantida | Modulo antigo so evolui via PR proprio com seus testes |
| Feature flag virando configuracao permanente | Codigo com 5 flags aninhadas e infernvel | Flags sao temporarias; remover em <= 2 sprints pos-100% |
| "Vou colocar em `src/lib` rapidinho" | `lib` vira lixeira, boundary some | Decidir: e shared infra ou modulo? Nao existe meio termo |
| PR gigante com N modulos | Impossivel revisar; regressao mascarada | 1 PR = 1 modulo = < 400 linhas |

---

## 10. Resumo operacional (cola na parede)

1. **1 modulo = 1 pasta em `src/modules/`** com 6 sub-pastas fixas
2. **Porta unica:** so `api/index.ts` e publico
3. **Fala entre modulos:** api publica sincrona OU event bus assincrono. Nada mais.
4. **Toda mudanca de contrato:** bump versao + ADR + deprecation 1 sprint
5. **Todo modulo novo:** nasce com flag OFF, canary 10%, E2E anteriores verdes
6. **CI bloqueia:** lint boundary + typecheck + unit + contract + E2E P0 + build
7. **Deploy bloqueia:** smoke pos-deploy falhou -> rollback automatico
8. **"Done" = checklist secao 8 100%.** Nao tem "quase done".

---

**Proximo passo imediato:** executar Fase 0 (1 semana). Antes dela, nenhuma feature nova no forum deve ser construida com a estrutura atual — vira migracao dupla.

**Revisar em:** fim da Fase 1, para ajustar pipeline e thresholds com dados reais.
