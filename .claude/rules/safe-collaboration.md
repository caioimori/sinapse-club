# Safe Collaboration — Git Safety Net (NON-NEGOTIABLE)

> **Applies to ALL agents in this project.**
> Users are product builders, NOT git experts.
> Agents MUST handle ALL git complexity automatically and safely.

## Golden Rule

**Users focus on WHAT to build. Agents handle HOW to save and share it safely.**

Users should NEVER need to:
- Resolve merge conflicts manually
- Decide which branch to use
- Remember to pull before working
- Worry about overwriting each other's code

## Session Start — Auto-Sync (MANDATORY)

Before ANY work begins, the agent MUST:
1. `git fetch origin`
2. Check if local main is behind origin/main
3. If behind: `git pull origin main` (fast-forward only)
4. If diverged: STOP, inform user, resolve safely
5. Create work branch if not already on one
6. NEVER start work on `main` directly

## Branch Naming — Automatic

| Who | Pattern | Example |
|-----|---------|---------|
| caio | `caio/{type}/{desc}` | `caio/feat/new-feature` |
| soier | `soier/{type}/{desc}` | `soier/fix/bug-fix` |

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`

**User Detection (priority order):**
1. `git config user.name` -> lookup in mapping table (case-insensitive)
2. `$USERNAME` (Windows) or `$USER` (Unix) -> lookup
3. Fallback: `dev/`

| git config / env contains | Branch prefix |
|----------------------------|---------------|
| caio (case-insensitive) | `caio/` |
| soier (case-insensitive) | `soier/` |
| (anything else)              | `dev/`        |

## Before Every Commit — Safety Checks

1. `git status` — verify only expected files changed
2. `git diff --stat` — show summary to user
3. SECRET SCAN — reject .env, API keys, tokens, passwords, private keys
4. Commit with conventional message

## Before Push — Conflict Prevention

1. `git fetch origin main`
2. `git merge origin/main --no-edit` (into feature branch)
3. If conflicts: agent resolves (simple: auto, complex: ask user)
4. Run tests after merge
5. Only then: push

## PR Creation — Automatic

1. `gh pr create` with clear title/description
2. Auto-assign other team member as reviewer
3. Inform user in simple language

## Conflict Resolution

| Scenario | Action |
|----------|--------|
| Same file, different sections | Auto-merge |
| Same file, same lines | Show both, ask user |
| package.json version | Take higher version |
| Generated files | Regenerate |
| Docs | Merge both (additive) |

## Destructive Operations — BLOCKED

These require EXPLICIT user confirmation:
- `git push --force` / `--force-with-lease`
- `git reset --hard`
- `git branch -D`
- `git clean -f`

## Anti-Patterns (FORBIDDEN)

- Working on `main` directly
- Pushing without PR
- Skipping `git fetch` at session start
- Using `--force` without confirmation
- Committing secrets
- Skipping tests after conflict resolution
