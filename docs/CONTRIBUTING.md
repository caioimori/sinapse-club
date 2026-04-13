# Contribuindo para sinapse-plataform

Este guia existe para o Caio e o Matheus trabalharem em paralelo sem pisar um no pé do outro.
Tudo de git é automatizado via agentes — o humano só fala o que quer fazer em português.

## TL;DR

- **Nunca trabalhe direto em `main`.** Todo trabalho vive numa branch.
- Caio abre PRs de `caio/...`, Matheus abre de `soier/...`.
- PR precisa passar CI (typecheck + lint + build).
- Enquanto for solo: Caio pode mergear sem review. Quando Matheus entrar no PR, vira mandatório 1 review.
- O agente resolve todo o git — conflitos, rebase, push, PR, merge, delete branch.

## Branch naming

```
<owner>/<type>/<short-desc-kebab>
```

| Owner | Prefix |
|---|---|
| Caio | `caio/` |
| Matheus | `soier/` |
| Agentes auto-criando | `dev/` |

| Type | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refactor sem mudança de comportamento |
| `chore` | Tooling, deps, configs |
| `docs` | Só documentação |
| `test` | Só testes |
| `perf` | Performance |

**Exemplos válidos:**
- `caio/feat/launch-ready-sprint`
- `caio/fix/forum-foundation-and-bugs`
- `soier/feat/mobile-nav`
- `soier/refactor/notification-hooks`

## Fluxo padrão (rodado pelo agente)

1. **Start of session** — agente faz `git fetch origin && git pull origin main` se estiver atrás.
2. **Work** — agente cria branch nova, faz edits, roda typecheck/lint local.
3. **Commit** — agente escreve commit message seguindo Conventional Commits.
4. **Pre-push safety** — agente roda `git fetch origin main` + merge no branch para resolver conflitos antes.
5. **Push** — `git push -u origin <branch>`.
6. **PR** — agente cria PR via `gh pr create` com título claro + checklist.
7. **Review** —
   - Solo (só Caio): agente mergeia via `gh pr merge --squash --delete-branch` após CI verde.
   - Colab: agente pede review do outro via `gh pr create --reviewer @outro`, só mergeia após APPROVED.
8. **Cleanup** — branch remota e local deletadas, volta para main sincronizado.

## Conventional Commits

```
<type>(<scope>): <subject>

<body opcional>

<footer opcional>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`.

**Examples:**
- `feat(forum): add confetti on like`
- `fix(onboarding): hard navigation on completion`
- `chore(deps): bump next to 16.2.1`
- `docs(audits): 5-part forum hardening report`

## O que NUNCA commitar

- `.env*` (exceto `.env.example`)
- API keys / secrets em plaintext
- `node_modules/`
- `.next/` (build cache)
- Screenshots privados / dados pessoais de usuários reais

## Automação

### CI (`.github/workflows/ci.yml`)

Roda em todo PR:
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`

Se falhar, o agente corrige e faz novo commit no mesmo PR.

### CODEOWNERS (`.github/CODEOWNERS`)

- Todos os arquivos: review de @caioimori @Matheus-soier
- `.github/`, `.sinapse-ai/`, `.claude/`, `package.json`: exclusivo @caioimori
- `.env*`, `*.config.(js|ts)`: exclusivo @caioimori

### PR template (`.github/PULL_REQUEST_TEMPLATE.md`)

Todo PR carrega checklist de:
- [ ] Testei localmente
- [ ] Sem warnings novos
- [ ] Sem secrets/hardcoded keys
- [ ] Typecheck e lint passam
- [ ] Docs atualizadas se necessário

## Atalho para humanos

**Você NUNCA precisa:**
- Decorar comandos git
- Resolver merge conflicts manualmente
- Escrever commit messages
- Lembrar de pullar main

**Você SÓ precisa dizer** (ao agente, em português):
- "Começa uma feature nova X"
- "Salva isso aqui"
- "Manda pro Matheus revisar"
- "Mergeia se o CI passar"
- "Puxa o que o Matheus fez"

O agente cuida de todo o resto.
