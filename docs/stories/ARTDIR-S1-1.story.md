# Story ARTDIR-S1-1 — Drift removal: cores hardcoded → tokens semânticos

## Overview

Substituir TODAS as cores hardcoded (`text-rose-500`, `text-emerald-500`, `text-blue-500`, `text-amber-500`, `text-yellow-500`, `text-green-500`, `bg-zinc-800`, `border-zinc-800`, `text-zinc-500`) em 4 arquivos críticos da comunidade por tokens semânticos do `caioimori-design-system`. Quando necessário, adicionar tokens semânticos novos no `globals.css` ANTES de tocar os componentes.

**Fonte:** Relatório v1 squad-artdir, Ação #2 (Pilar 9 — drift removal). Impacto 4/5, esforço S.

## Source

- Relatório: `docs/art-direction/community-v1-report.md` §1.2 Atlas (Drift detectado)
- Design system de referência: `src/app/globals.css` (tokens já existentes)

## Token Map (Atlas spec)

Mapa oficial do @atlas (squad-artdir / Design System Architect):

| Hardcoded atual | Substituição | Justificativa |
|-----------------|--------------|---------------|
| `text-rose-500`, `bg-rose-500/10`, `fill-rose-500` | `text-[var(--accent-like)]`, `bg-[var(--accent-like-soft)]`, `fill-[var(--accent-like)]` | Like = novo token `--accent-like` (vermelho destructive-soft, dark parity) |
| `text-emerald-500`, `bg-emerald-500/10` | `text-[var(--accent-repost)]`, `bg-[var(--accent-repost-soft)]` | Repost = novo token `--accent-repost` |
| `text-blue-500`, `bg-blue-500` | `text-[var(--accent-info)]`, `bg-[var(--accent-info)]` | Info/follow/unread dot = novo token `--accent-info` |
| `text-amber-500` (Moderação icon sidebar) | `text-[var(--accent-warn)]` | Warning/admin = novo token `--accent-warn` |
| `text-yellow-500` (mention) | `text-[var(--accent-warn)]` | Reusar warn para mention |
| `text-green-500` (reply) | `text-[var(--accent-repost)]` | Reply = reaproveita repost (tom verde unificado) |
| `text-red-500` (like em notificações) | `text-[var(--accent-like)]` | Alinhamento |
| `bg-zinc-800`, `border-zinc-700`, `border-zinc-800`, `text-zinc-500`, `text-zinc-300`, `hover:bg-zinc-800` | `bg-foreground`, `border-[var(--border-strong)]`, `border-[var(--border-default)]`, `text-muted-foreground`, `text-foreground`, `hover:bg-[var(--surface-hover)]` | Todos mapeiam para tokens de surface/border existentes |
| `bg-background/90 backdrop-blur-sm` (sticky bars) | `glass-nav` (utility já existe em globals.css) | Unificar surface sticky ao glass system |
| `text-emerald-600 dark:text-emerald-400` (badge RESOLVIDO) | `text-[var(--accent-repost)]` | Um único tom dark-safe |
| `border-emerald-500/30` (badge RESOLVIDO) | `border-[var(--accent-repost)]/30` | Mesma família |

**Tokens novos no `globals.css` (light + dark):**

```css
/* Light (:root) — Accent colors (semantic, dark-parity) */
--accent-like: #E11D48;         /* rose-600 — melhor contraste em light que rose-500 */
--accent-like-soft: rgba(225, 29, 72, 0.10);
--accent-repost: #059669;       /* emerald-600 */
--accent-repost-soft: rgba(5, 150, 105, 0.10);
--accent-info: #2563EB;         /* blue-600 */
--accent-info-soft: rgba(37, 99, 235, 0.10);
--accent-warn: #D97706;         /* amber-600 */
--accent-warn-soft: rgba(217, 119, 6, 0.10);

/* Dark (.dark) — Lifted saturation for contrast on dark surfaces */
--accent-like: #FB7185;         /* rose-400 */
--accent-like-soft: rgba(251, 113, 133, 0.14);
--accent-repost: #34D399;       /* emerald-400 */
--accent-repost-soft: rgba(52, 211, 153, 0.14);
--accent-info: #60A5FA;         /* blue-400 */
--accent-info-soft: rgba(96, 165, 250, 0.14);
--accent-warn: #FBBF24;         /* amber-400 */
--accent-warn-soft: rgba(251, 191, 36, 0.14);
```

## Acceptance Criteria

### `src/components/forum/thread-list-item.tsx`
- [ ] **Given** o componente renderiza com um like ativo, **When** inspeciono, **Then** `text-rose-500` e `bg-rose-500/10` e `fill-rose-500` viraram `text-[var(--accent-like)]` / `bg-[var(--accent-like-soft)]` / `fill-[var(--accent-like)]`
- [ ] **Given** repost ativo, **Then** `text-emerald-500` e `bg-emerald-500/10` viraram `text-[var(--accent-repost)]` / `bg-[var(--accent-repost-soft)]`
- [ ] **Given** badge "RESOLVIDO", **Then** `text-emerald-600 dark:text-emerald-400` e `border-emerald-500/30` viraram `text-[var(--accent-repost)]` e `border-[var(--accent-repost)]/30`
- [ ] **Given** o arquivo após edição, **Then** busca por `emerald-`, `rose-` no arquivo retorna zero hits

### `src/app/(dashboard)/notificacoes/page.tsx`
- [ ] **Given** `<NotifIcon>`, **Then** todos os 5 case (like/follow/reply/repost/mention) usam `text-[var(--accent-X)]` (X = like/info/repost/warn) em vez de `text-red-500`, `text-blue-500`, `text-green-500`, `text-emerald-500`, `text-yellow-500`
- [ ] **Given** dot de unread, **Then** `bg-blue-500` vira `bg-[var(--accent-info)]`
- [ ] **Given** sticky header (`sticky top-0 z-40 bg-background/90 backdrop-blur-sm ...`), **Then** vira `sticky top-0 z-40 glass-nav ...` (backdrop removido pois glass-nav já aplica)
- [ ] **Given** o arquivo, **Then** busca por `-red-`, `-blue-`, `-green-`, `-emerald-`, `-yellow-` retorna zero hits fora de comentários

### `src/components/layout/sidebar.tsx`
- [ ] **Given** ícone de Moderação (admin), **Then** `text-amber-500` vira `text-[var(--accent-warn)]`
- [ ] **Given** o arquivo, **Then** busca por `-amber-`, `-rose-`, `-blue-` retorna zero hits

### `src/app/(dashboard)/forum/page.tsx` (linhas ~278-348)
- [ ] **Given** sort buttons, **Then** `bg-zinc-800 border-zinc-700 text-white` (ativo) vira `bg-foreground text-background border-foreground` e `border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700` (inativo) vira `border-[var(--border-default)] text-muted-foreground hover:text-foreground hover:border-[var(--border-strong)]`
- [ ] **Given** pagination buttons, **Then** `border-zinc-800 hover:bg-zinc-800 text-zinc-300` vira `border-[var(--border-default)] hover:bg-[var(--surface-hover)] text-foreground`
- [ ] **Given** "Página X" text, **Then** `text-zinc-500` vira `text-muted-foreground`
- [ ] **Given** o arquivo, **Then** busca por `zinc-` retorna zero hits

### `src/app/globals.css`
- [ ] **Given** o arquivo, **Then** existe a seção `/* ─── Accent (semantic) ─── */` em `:root` com os 8 tokens novos (like, like-soft, repost, repost-soft, info, info-soft, warn, warn-soft)
- [ ] **Given** a seção `.dark`, **Then** os mesmos 8 tokens têm override com saturação ajustada
- [ ] **Given** build, **Then** `npm run lint` passa sem warnings em nenhum dos 5 arquivos

## Scope

### IN
- `src/app/globals.css` — adicionar 8 tokens novos (4 base + 4 soft), light + dark
- `src/components/forum/thread-list-item.tsx` — substituição completa
- `src/app/(dashboard)/notificacoes/page.tsx` — substituição completa + sticky → glass-nav
- `src/components/layout/sidebar.tsx` — substituição completa
- `src/app/(dashboard)/forum/page.tsx` — sort controls + pagination

### OUT
- Outras páginas que possam ter drift (settings, admin, leaderboard etc.) — serão cobertas na ação #7 (token registry formal, Sprint 2)
- Reestilização completa de qualquer componente
- Mudança de layout, spacing ou typography
- Dark mode redesign

## Dependencies

- Nenhuma externa. Depende apenas do `globals.css` existente.

## Complexity

**S (Small)** — Substituições mecânicas guiadas pelo token map do @atlas. O único risco é `globals.css` syntax se o @developer errar os blocos CSS.

## Assigned Agent

@developer (Pixel) — implementation. @atlas (Design System Architect, squad-artdir) — token spec owner.

## Technical Notes

- Usar `text-[var(--token)]` (Tailwind arbitrary value) em vez de criar classes novas — shorter, inline, reusa sistema existente.
- Em classes condicionais com `cn()`, manter o padrão atual; apenas trocar os tokens.
- `fill-rose-500` (heart filled) precisa virar `style={{ fill: 'var(--accent-like)' }}` OU usar arbitrary value `fill-[var(--accent-like)]` — testar qual Tailwind v4 aceita.
- Sticky bar do notificações: apagar o `bg-background/90 backdrop-blur-sm` completo e trocar por `glass-nav` (utility já definida em globals.css linha ~345).
- NÃO mexer em LP (marketing) — está em trabalho ativo e fora de escopo.

## File List

- `src/app/globals.css` (MODIFY) — adicionar 8 accent tokens
- `src/components/forum/thread-list-item.tsx` (MODIFY)
- `src/app/(dashboard)/notificacoes/page.tsx` (MODIFY)
- `src/components/layout/sidebar.tsx` (MODIFY)
- `src/app/(dashboard)/forum/page.tsx` (MODIFY — sort/pagination blocks only)

## Status

- [x] Draft
- [x] Validated (Ready)
- [x] In Progress
- [x] Done

## Change Log

| Date | Change | Agent |
|------|--------|-------|
| 2026-04-12 | Story criada a partir do epic sprint1 | @sprint-lead (Sync) |
| 2026-04-12 | Validated: GO 10/10. Token map claro, AC mecânicas, escopo limitado. Status Draft → Ready. | @product-lead (Axis) |
| 2026-04-12 | Implemented: 8 accent tokens em globals.css (light + dark), 4 arquivos sem drift, grep confirma zero hits de rose-/emerald-/zinc-/amber-/blue-500/yellow-500/green-500/red-500. Build passa. | @developer (Pixel) |
| 2026-04-12 | QA Gate: PASS. Lint delta = 0. Typecheck = 0. next build = 35/35 páginas geradas. Status → Done. | @quality-gate (Litmus) |
