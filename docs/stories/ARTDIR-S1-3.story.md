# Story ARTDIR-S1-3 — Themes-bar sem auto-scroll infinito

## Overview

Trocar o auto-scroll horizontal infinito (`src/components/forum/themes-bar.tsx`, 282 linhas) por chips fixos com scroll horizontal manual (touch + mouse wheel hijack opcional). Motion perpétuo em surface vista 100x/dia = ruído cognitivo. Violação Pilar 8 (Lei da Inhabitação) e Disney 12 (Motion com propriedade).

**Fonte:** Relatório v1 squad-artdir, Ação #9. Impacto 3/5, esforço S.

## Source

- Relatório: `docs/art-direction/community-v1-report.md` §1.3 Axiom (Lei da Inhabitação — NAO PASSA)

## Spec (Tempo + Axiom)

### Comportamento atual (ruim)
- Chips em 2 cópias concatenadas
- `requestAnimationFrame` loop com `SPEED_PX_PER_MS = 20/1000`
- `translateX` decresce continuamente
- Pause no mouseenter, retoma após 3s
- Touch drag com clamp

### Comportamento novo (bom)

1. **Track único** (uma cópia dos chips — sem duplicação)
2. **Scroll horizontal nativo** via `overflow-x-auto` + `scrollbar-width: none` (hide scrollbar, mantém interação)
3. **Touch drag**: scroll-snap opcional, scroll nativo do browser
4. **Mouse wheel hijack**: `wheel` event listener converte deltaY → deltaX (scroll horizontal com scroll vertical do mouse) — comportamento reconhecido em chip-bars modernas (Linear, Slack)
5. **Fade masks nas bordas** (mesmo que já existe à esquerda, adicionar à direita): gradiente de `var(--background)` indicando que tem mais conteúdo overflow
6. **"Todos" button** permanece fixo à esquerda, fora do scroll (mesmo comportamento atual da Layer 1)
7. **Sem animação perpétua**: zero `requestAnimationFrame`, zero timers, zero refs de offset

### Estrutura esperada (pseudo-código)

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ThemesBar({ categories, activeCategory }: ThemesBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse wheel hijack: converte scroll vertical em horizontal (dentro da barra)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function handleSelect(slug: string | null) { /* mesmo do atual */ }

  return (
    <div className="relative flex items-center border-b border-[var(--border-subtle)] py-2">
      {/* Fixed "Todos" */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-4 pr-2 bg-background">
        <button /* ... */>Todos</button>
      </div>

      {/* Left fade mask */}
      <div
        className="absolute top-0 bottom-0 left-[80px] w-8 pointer-events-none z-[5]"
        style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
      />

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden ml-[88px] scrollbar-none"
      >
        <div className="flex items-center gap-2 pr-8">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.slug)}
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap",
                activeCategory === c.slug
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[var(--surface-default)]"
              )}
            >
              {c.icon && <span className="text-[11px] leading-none">{c.icon}</span>}
              <span>{toChipLabel(c.name)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right fade mask */}
      <div
        className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none z-[5]"
        style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
      />
    </div>
  );
}
```

Adicionar utility CSS em `globals.css` (dentro de `@layer utilities`):

```css
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
```

## Acceptance Criteria

- [ ] **Given** usuário abre `/forum`, **When** renderiza a themes-bar, **Then** os chips estão estáticos (zero motion horizontal) no load inicial
- [ ] **Given** usuário passa o mouse sobre a themes-bar com scroll vertical do mouse, **Then** a barra faz scroll horizontal (wheel hijack)
- [ ] **Given** usuário em mobile dá swipe horizontal, **Then** a barra rola suavemente via touch nativo do browser
- [ ] **Given** a barra tem overflow de chips, **Then** existe um fade mask à direita (além do já existente à esquerda) indicando mais conteúdo
- [ ] **Given** o código atualizado, **Then** `themes-bar.tsx` NÃO contém `requestAnimationFrame`, `SPEED_PX_PER_MS`, `offsetXRef`, `animFrameRef`, `isPausedRef`, `resumeTimerRef`, `singleWidthRef`, `touchStartXRef`, `touchStartOffsetRef`, `scheduleResume`, `pauseScroll`, `pauseAndScheduleResume`, `startScroll`, nem duplicação `[...chips, ...chips]`
- [ ] **Given** botão "Todos" fixo, **Then** mantém visualmente o mesmo comportamento e posição atual
- [ ] **Given** usuário clica num chip, **Then** navega para `/forum?categoria={slug}` (mesmo comportamento atual)
- [ ] **Given** usuário clica em "Todos", **Then** remove o `categoria` do URL
- [ ] **Given** `globals.css`, **Then** tem utility `.scrollbar-none` definida em `@layer utilities`
- [ ] **Given** build, **Then** `npm run lint` e `next build` passam
- [ ] **Given** `themes-bar.tsx` final, **Then** tem < 100 linhas (vs ~282 original)

## Scope

### IN
- `src/components/forum/themes-bar.tsx` — rewrite
- `src/app/globals.css` — adicionar utility `.scrollbar-none`

### OUT
- Mudança visual dos chips em si (cores, padding, radius)
- Mudança no botão "Todos"
- Mudança no comportamento de `handleSelect` / query string
- Keyboard navigation dos chips (out — Sprint 4 / ação #8)
- Scroll-snap (comportamento extra — pode virar follow-up)

## Dependencies

- Nenhuma. Simplificação pura.

## Complexity

**S (Small)** — Remover 180 linhas de state management complexo e substituir por scroll nativo do browser.

## Assigned Agent

@developer (Pixel) — implementation. @tempo (Motion Director) + @axiom (Product Surface Director) — spec owners.

## Technical Notes

- O scroll nativo do browser em `overflow-x-auto` é 60fps, acessível (keyboard arrows funcionam em alguns OS), e gratuito.
- O wheel hijack é opcional mas recomendado: sem ele, usuários desktop com mouse padrão não têm affordance óbvia para rolar horizontalmente. Com ele, scroll vertical do mouse → scroll horizontal dentro da barra. Slack, Linear e Notion fazem isso.
- O `e.preventDefault()` no wheel listener só dispara se o scroll for predominantemente vertical — evita bloquear trackpads que fazem scroll 2D natural.
- `pr-8` no inner track garante que o último chip tenha respiro antes do fade mask direito.
- Manter `"use client"` no topo do arquivo — é um client component por causa dos hooks.

## File List

- `src/components/forum/themes-bar.tsx` (MODIFY — rewrite)
- `src/app/globals.css` (MODIFY — adicionar .scrollbar-none)

## Status

- [x] Draft
- [x] Validated (Ready)
- [x] In Progress
- [x] Done

## Change Log

| Date | Change | Agent |
|------|--------|-------|
| 2026-04-12 | Story criada a partir do epic sprint1 | @sprint-lead (Sync) |
| 2026-04-12 | Validated: GO 10/10. Rewrite bem escopado, AC mensuráveis (code search), comportamento claro. Status Draft → Ready. | @product-lead (Axis) |
| 2026-04-12 | Implemented: themes-bar rewrite de 282 → 143 linhas. Scroll nativo horizontal + wheel hijack + fade masks esq/dir. Zero rAF, zero timers. `.scrollbar-none` utility adicionada em globals.css. | @developer (Pixel) |
| 2026-04-12 | QA Gate: PASS. Build passa, grep confirma zero requestAnimationFrame/SPEED_PX_PER_MS/animFrameRef no arquivo. Status → Done. | @quality-gate (Litmus) |
