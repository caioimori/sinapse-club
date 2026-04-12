# Story ARTDIR-S1-2 — Empty states reformulados (forum, profile, tab seguindo)

## Overview

Elevar os empty states "ruins" ao nível do empty state de notificações (que é o bom referencial). O empty state de notificações já tem: círculo 56px com ícone muted + título bold + descrição explicativa + tom próprio. Os outros estão em `text-muted-foreground` genérico, sem ícone, sem CTA. Cada empty state vira uma mini-LP intencional — Pilar 8 (promessa do empty state).

**Fonte:** Relatório v1 squad-artdir, Ação #3. Impacto 4/5, esforço S.

## Source

- Relatório: `docs/art-direction/community-v1-report.md` §1.3 Axiom (Promessa do Empty State)
- Referência de qualidade: `src/app/(dashboard)/notificacoes/page.tsx` linhas 182-191 (empty "Tudo em dia")

## Empty State Spec (Aura + Axiom)

### Padrão compartilhado (copiar estrutura literal)

```tsx
<div className="flex flex-col items-center py-20 gap-3 text-center px-4">
  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
    <Icon className="h-7 w-7 text-muted-foreground" />
  </div>
  <p className="font-bold text-foreground text-lg">{title}</p>
  <p className="text-sm text-muted-foreground max-w-xs">
    {description}
  </p>
  {cta && (
    <Link
      href={cta.href}
      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/85 transition-colors"
    >
      {cta.label}
    </Link>
  )}
</div>
```

### Casos específicos

| # | Local | Ícone | Título | Descrição | CTA |
|---|-------|-------|--------|-----------|-----|
| 1 | `forum/page.tsx` — feed sem threads (tab=recent) | `Sparkles` | "Aqui é onde o sinal começa" | "Ninguém publicou ainda nesta categoria. Seja a primeira voz — o que você aprendeu essa semana?" | "Escrever o primeiro post" → dispara `open-compose-modal` (mesmo CustomEvent do sidebar) |
| 2 | `forum/page.tsx` — tab "Seguindo" vazia | `UserPlus` | "Seu feed está em branco" | "Quando você seguir pessoas, os posts delas aparecem aqui antes dos outros." | "Descobrir pessoas" → `/explore` (ou `/leaderboard` se explore não existir) |
| 3 | `profile/page.tsx` (self) — tab Posts sem posts | `PenLine` | "Nenhum post ainda" | "Seu primeiro post é o que transforma seu perfil de visitante em membro." | "Escrever primeiro post" → dispara `open-compose-modal` |
| 4 | `profile/page.tsx` (self) — tab Respostas sem respostas | `MessageCircle` | "Nenhuma resposta ainda" | "Responder a outros posts é a forma mais rápida de ser notado na comunidade." | "Explorar posts" → `/forum` |
| 5 | `profile/page.tsx` (self) — tab Curtidas vazia | `Heart` | "Nenhuma curtida ainda" | "Os posts que você curtir aparecem aqui como referência rápida." | — (sem CTA) |
| 6 | `profile/[username]/page.tsx` — tab Posts do outro vazia | `FileText` | "Nenhum post ainda" | "@{username} ainda não publicou nada." | — (sem CTA) |
| 7 | `profile/[username]/page.tsx` — tab Respostas vazia | `MessageCircle` | "Nenhuma resposta ainda" | "@{username} ainda não respondeu a nenhum post." | — |
| 8 | `profile/[username]/page.tsx` — tab Curtidas vazia | `Heart` | "Nenhuma curtida ainda" | "@{username} ainda não curtiu nenhum post." | — |

### Implementação — Helper component

Criar `src/components/shared/empty-state.tsx` como componente reutilizável:

```tsx
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: {
    label: string;
    href?: string;           // Link navigation
    onClick?: () => void;    // Button action (for CustomEvent dispatch)
  };
}

export function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
  // Render <div>...<Link|<button>...</div>
}
```

Para o CTA "Escrever primeiro post" (casos 1 e 3), como o composer é um CustomEvent, precisamos de um wrapper `"use client"` que chama `window.dispatchEvent(new CustomEvent("open-compose-modal"))`. Criar `src/components/shared/empty-state-compose-cta.tsx` como client component leve.

## Acceptance Criteria

### Forum — feed sem threads (tab=recent)
- [ ] **Given** um usuário abre `/forum` numa categoria vazia, **When** renderiza, **Then** vê círculo 56px com `Sparkles`, título "Aqui é onde o sinal começa", descrição conforme spec, e botão "Escrever o primeiro post"
- [ ] **Given** clica no botão, **Then** o composer modal abre (mesmo comportamento do botão "Post" no sidebar)

### Forum — tab "Seguindo" vazia
- [ ] **Given** usuário abre `/forum?tab=following` sem seguir ninguém, **Then** vê círculo 56px com `UserPlus`, título "Seu feed está em branco", descrição conforme spec, e link "Descobrir pessoas" para `/explore`
- [ ] **Given** clica "Descobrir pessoas", **Then** navega para `/explore`

### Profile (self) — Posts tab vazia
- [ ] **Given** usuário abre `/profile` (próprio) sem nenhum post, **Then** vê empty state completo com `PenLine`, título, descrição, CTA "Escrever primeiro post" que dispara composer modal

### Profile (self) — Respostas tab vazia
- [ ] **Given** usuário abre `/profile?tab=respostas` sem respostas, **Then** vê empty state com `MessageCircle`, título, descrição, CTA "Explorar posts" para `/forum`

### Profile (self) — Curtidas tab vazia
- [ ] **Given** usuário abre `/profile?tab=curtidas` sem curtidas, **Then** vê empty state com `Heart`, título "Nenhuma curtida ainda", descrição, sem CTA

### Profile public `[username]` — todas as tabs vazias
- [ ] **Given** qualquer tab vazia no perfil público, **Then** usa `EmptyState` com mensagem específica de terceira pessoa ("@username ainda não...") e SEM CTA (não é o próprio usuário)

### Componente compartilhado
- [ ] **Given** `src/components/shared/empty-state.tsx` existe, **Then** exporta `EmptyState` com tipos corretos
- [ ] **Given** `src/components/shared/empty-state-compose-cta.tsx` existe, **Then** é client component que dispatch `open-compose-modal` CustomEvent
- [ ] **Given** empty state de notificações (referência), **Then** NÃO é alterado — continua como está (é a referência de qualidade)

### Qualidade
- [ ] **Given** build, **Then** `npm run lint` passa
- [ ] **Given** todos os empty states, **Then** estrutura visual é idêntica (mesma padding, mesmo círculo 56px, mesma tipografia)

## Scope

### IN
- Novo: `src/components/shared/empty-state.tsx`
- Novo: `src/components/shared/empty-state-compose-cta.tsx`
- Modify: `src/app/(dashboard)/forum/page.tsx` — substituir 2 blocos de empty inline
- Modify: `src/app/(dashboard)/profile/page.tsx` — substituir 3 blocos de empty inline
- Modify: `src/app/(dashboard)/profile/[username]/page.tsx` — substituir 3 blocos de empty inline

### OUT
- Empty state de notificações — **não tocar**, é a referência
- Empty state de settings, admin, outros dashboards fora da comunidade
- Empty states de loading/skeleton (são outra categoria, out of scope)
- Ilustrações custom (Sprint 4 quando iconografia proprietária existir)
- Animações de entrada (fade-in) — reusa default do browser

## Dependencies

- **ARTDIR-S1-1** (tokens semânticos) — ideal landar primeiro para não reintroduzir drift nos empty states. Mas as 2 stories podem ser implementadas em sequência no mesmo PR.
- `lucide-react` já instalado (dep existente)

## Complexity

**S (Small)** — Refatoração de 8 empty states para 1 componente compartilhado. Lógica trivial.

## Assigned Agent

@developer (Pixel) — implementation. @aura (Premium Packaging Strategist) — copy owner. @axiom (Product Surface Director) — visual pattern owner.

## Technical Notes

- O composer modal é acionado via `window.dispatchEvent(new CustomEvent("open-compose-modal"))` — já existe em `sidebar.tsx` linha 103, copiar exatamente.
- `profile/page.tsx` e `profile/[username]/page.tsx` têm código parecido — componente compartilhado reduz duplicação.
- `max-w-xs` na descrição mantém paridade visual com empty state de notificações.
- Nenhuma animação custom — estado estático é melhor nesse caso (Pilar 8 Lei da Inhabitação).

## File List

- `src/components/shared/empty-state.tsx` (NEW)
- `src/components/shared/empty-state-compose-cta.tsx` (NEW)
- `src/app/(dashboard)/forum/page.tsx` (MODIFY)
- `src/app/(dashboard)/profile/page.tsx` (MODIFY)
- `src/app/(dashboard)/profile/[username]/page.tsx` (MODIFY)

## Status

- [x] Draft
- [x] Validated (Ready)
- [x] In Progress
- [x] Done

## Change Log

| Date | Change | Agent |
|------|--------|-------|
| 2026-04-12 | Story criada a partir do epic sprint1 | @sprint-lead (Sync) |
| 2026-04-12 | Validated: GO 10/10. Spec de copy + visual explícito, AC cobre 8 empty states, componente compartilhado. Status Draft → Ready. | @product-lead (Axis) |
| 2026-04-12 | Implemented: EmptyState + EmptyStateLinkCta + EmptyStateComposeCta shared components. 8 empty states refatorados (forum recent/following, profile self x3, profile public x3). Referência de notificações preservada. | @developer (Pixel) |
| 2026-04-12 | QA Gate: PASS. Build passa, todos empty states renderizam via shared component, copy conforme spec. Status → Done. | @quality-gate (Litmus) |
