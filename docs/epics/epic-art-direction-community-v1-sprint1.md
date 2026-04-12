# Epic — Art Direction Community v1 — Sprint 1

## Overview

Remediation quick-wins da direção artística da Comunidade Sinapse, derivados do relatório v1 do squad-artdir v2.0 (`docs/art-direction/community-v1-report.md`, 2026-04-12). Sprint 1 cobre 3 das 10 ações prioritárias — as de menor esforço e maior relação impacto/esforço — com objetivo de **remover drift visual**, **elevar empty states ao nível do melhor do produto** e **matar motion perpétuo sem propósito**.

**Contexto estratégico:** O produto já tem `caioimori-design-system` declarado em `src/app/globals.css` (351 linhas, light-first, glass, dark parity real). O gap atual não é foundation — é **enforcement**. Cada nova feature adicionou um pouco de drift. Sprint 1 é saneamento antes de evoluções estruturais (emails transacionais, registry, choreography 5min).

## Source

- Relatório: `docs/art-direction/community-v1-report.md` (Canvas / squad-artdir v2.0)
- Ações cobertas: #2 (Drift removal), #3 (Empty states reformulados), #9 (Themes-bar sem auto-scroll)
- Pilares violados sendo remediados: **Pilar 8** (Ergonomia logada), **Pilar 9** (Design system multi-surface)

## Goals

1. **Zero cores hardcoded** nos 4 arquivos identificados como poluentes (`thread-list-item.tsx`, `notificacoes/page.tsx`, `sidebar.tsx`, `forum/page.tsx`). Todas mapeadas para tokens semânticos do design system.
2. **Empty states do forum e profile** elevados ao nível do de notificações (ícone em círculo + título bold + texto explicativo + CTA acionável opcional).
3. **Themes-bar** com scroll manual (touch + wheel) em vez de auto-scroll infinito — motion perpétuo violava Pilar 8 (Lei da Inhabitação) e Disney 12 (motion sem propriedade).

## Stories

| ID | Título | Tamanho | Owner |
|----|--------|---------|-------|
| ARTDIR-S1-1 | Drift removal — cores hardcoded → tokens semânticos | S | @developer (Pixel) |
| ARTDIR-S1-2 | Empty states reformulados — forum, profile, tab seguindo | S | @developer (Pixel) |
| ARTDIR-S1-3 | Themes-bar sem auto-scroll infinito | S | @developer (Pixel) |

## Acceptance Criteria (Epic-level)

- [ ] Todas as 3 stories `Done`
- [ ] `npm run lint` limpo
- [ ] `npm run typecheck` limpo (ou `tsc --noEmit` se typecheck não existir)
- [ ] Build `next build` roda sem erros
- [ ] Visual manual checkpoint: forum (light + dark), notificações (light + dark), profile sem posts, tab seguindo vazia
- [ ] PR aberto, review automática de checks passando, mergeado em main

## Out of Scope (Sprint 2-4)

- Ação #1 — Emails transacionais (Sprint 2, M)
- Ação #7 — Token registry formal com semver (Sprint 2, M)
- Ação #4 — First 5 Minutes Choreography (Sprint 3, M)
- Ação #10 — Pricing com retórica narrativa (Sprint 3, M)
- Ação #5 — Iconografia proprietária (Sprint 4, L)
- Ação #6 — Tier Founders R$497 invite-only (Sprint 4, M)
- Ação #8 — Atalhos de teclado visíveis (Continuous)

## Dependencies

- Design system já declarado: `src/app/globals.css`
- Nenhuma mudança de schema de DB
- Nenhuma mudança de API

## Risks

| Risco | Mitigação |
|-------|-----------|
| Cor semântica faltando para "destructive soft" (like heart vermelho) | @atlas adiciona token `--accent-like` no `globals.css` antes do @developer tocar componentes |
| Empty states novos ficarem inconsistentes entre si | Reutilizar a mesma estrutura: `<div className="flex flex-col items-center py-20 gap-3 text-center px-4"> + circulo 56px + título bold + descrição muted + CTA opcional` |
| Themes-bar manual scroll "parecer quebrado" sem o motion | Adicionar fade masks nas bordas esquerda/direita como affordance visual |

## Timeline

Target: 1 dia de execução (quick wins). PR aberto no mesmo dia.

## Change Log

| Date | Change | Agent |
|------|--------|-------|
| 2026-04-12 | Epic criado a partir do relatório v1 squad-artdir | @sprint-lead (Sync) |
