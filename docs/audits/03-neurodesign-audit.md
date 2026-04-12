# Neurodesign / Art Direction Audit — SINAPSE
**Data:** 2026-04-12
**Escopo:** design tokens, UI, micro-interações, motion, tipografia, dark mode, navegação, brand voice, dopamina
**Profundidade:** Very thorough

## Executive Summary

**SINAPSE está em crossroads crítico.** Foundation de design system é rara (declarativo, well-named tokens, glass system coerente), mas sofre de **commodity pattern disease**: clona Twitter visualmente sem signature de craft, sem friction estratégica, sem reward ceremony. O design merece premium pelo conteúdo, mas não se *apresenta* como premium.

| Métrica | Score |
|---|---|
| Visual Polish | 7.5/10 (sólido técnico, commodity em DNA) |
| Motion Sophistication | 5/10 (tokens OK, zero uso em produto logado) |
| Dopamine Triggers | 4/10 (like sem burst, zero reward ceremony) |
| Brand Distinctiveness | 3/10 (Inter + Lucide + Tailwind defaults = commodity) |
| Pleasure to Use | 6.5/10 (funcional, limpo, sem graça) |
| **Weighted Premium Signal** | **4.2/10** (BLOQUEADO) |

**Top 3 oportunidades transformacionais:**
1. **Iconografia proprietária** (24-32 ícones core, single-stroke, B&W) — single sinal não-falsificável
2. **Remediação de emails transacionais** (Supabase auth + Abacate Pay) — Mailchimp-tier hoje, leak de premium no onboarding
3. **Choreography dos primeiros 5 minutos** — onboarding termina em redirect cru

---

## Design Tokens — Audit

### 1. Cores (PASSA com distinções)
**Local:** `src/app/globals.css` linhas 74-262

**Bom:**
- Surface scale 8 níveis (`void/base/default/raised/overlay/hover/alt/muted/deep`) — rara consistência
- Text scale 5 níveis com alpha (`primary 100%/secondary .65/tertiary .45/muted .30/disabled .15`)
- Border scale 4 níveis (subtle .04 → hover .20)
- Semantic accents (`--accent-like #E11D48`, `--accent-repost #059669`, `--accent-info #2563EB`, `--accent-warn #D97706`) com soft variants
- Dark mode com paridade real (cores lifted: 600 → 400)

**Drift detectado:**
- Hardcoded `text-rose-500`, `text-blue-500`, `text-emerald-500` em `thread-list-item.tsx` linhas 358-378 e `notificacoes/page.tsx` linhas 32-36
- `bg-zinc-800`, `border-zinc-800` em `forum/page.tsx` sort buttons — Tailwind defaults vazando
- Sticky CTA `bg-[#20BD5A]` hardcoded (verde WhatsApp)
- Sem token registry com owner/justificativa/changelog
- Sem versionamento semver no design system

**Contraste:** Light mode 20.5:1 (AAA), Dark mode 19.7:1 (AAA). Secondary colors margens curtas em AAA.

### 2. Tipografia (3/10 — commodity)
**Fontes:** Inter + JetBrains Mono (Google Fonts)

**Problema:** Pairing Vercel/Stripe/Next — zero distinctiveness. Benchmarks:
- Linear: Geist + custom display
- Arc: Geist custom fork
- Raycast: SF Pro custom subset
- Superhuman: bespoke kern

**Issues:**
- Sem custom display font — Inter é a Helvetica do SaaS 2024
- Line-height não declarado em tokens (inherit defaults)
- Sem drop caps, pull quotes, number formatting
- Letter-spacing tokens existem (`--tracking-tight`, `--tracking-heading`, `--tracking-wide`, `--tracking-widest`) mas só usados em 1 lugar

**Fix priority:** Avaliar serif editorial (Fraunces/Crimson/Playfair) para LP contrast + corpo Inter.

### 3. Spacing / Radius / Shadows (PASSA)
- Spacing: Tailwind defaults (4/8/12/16/24), sem escala custom nomeada
- Radius: 5 tokens (`button 8px`, `card 16px`, `modal 20px`, `badge full`, `input 8px`) — bem proporcionados
- Shadows: 5 níveis (xs→xl) com dark mode lifted alpha. Glass system com inset highlights (Apple-tier)

### 4. Motion Tokens (5/10 — bem nomeados, zero uso)
**Durations:** instant 80ms / fast 200ms / normal 320ms / slow 500ms
**Easings:** 5 custom (`precise`, `craft`, `spring`, `decisive`, `smooth`)
**Keyframes:** 6 definidos (`synapse-pulse`, `fade-in`, `fade-in-up`, `slide-up`, `scale-in`, `shimmer`, `text-reveal`)

**CRÍTICO:** Keyframes existem mas **zero uso em produto logado** (`/forum`, `/notificacoes`, `/profile`). Só aparecem na LP (`lp.css`).

**Framer Motion** instalado `^12.38` — usado APENAS na LP (`src/app/(marketing)/lp/components/*`). Zero uso em `src/app/(dashboard)/**`. Dependency "cargo cult" — instalado mas inert.

---

## Feed / Thread List — Hierarquia Visual

**Local:** `thread-list-item.tsx` linhas 215-403

### Layout
```
[Avatar 40px] [Content (author/title/body/image/category)] [5 Action buttons]
```

### Bom
- Avatar 40px com ring-1
- Content flex-col bem estruturado
- Hover: `bg-accent/30 transition-colors 150ms` — apropriadamente sutil
- Density Twitter-tier (py-3 px-4) — confortável para feed

### O que DEVERIA ser dopaminérgico mas não é

| Sinal | Atual | Benchmark | Gap |
|---|---|---|---|
| Like animation | Heart fill muda instantâneo | Arc: burst 12px particles + scale 1.2 + rotate | **CRÍTICO** |
| Repost feedback | Color muted→emerald | Twitter: spin 360° + color pop | **CRÍTICO** |
| Like count highlight | tabular nums, no emphasis | Linear: bold quando >10 | MÉDIA |
| Avatar on hover | nenhum | Superhuman: scale 1.05 + brighten | BAIXA |
| Thread hover | `bg-accent/30` sutil | Reddit: 10-15% opacity broader | OK |

### Empty state
`"Nenhuma publicacao ainda. Seja o primeiro!"` — genérico, sem CTA interativo, sem visual especial. **FAIL** pilar 8 (promessa do empty state).

---

## Micro-interações — Inventário (15 itens auditados)

| # | Interaction | Status | Benchmark | Severidade |
|---|---|---|---|---|
| 1 | Like button | Instant change | Arc burst + pop + rotate | **CRÍTICA** |
| 2 | Repost button | Color change only | Twitter spin 360° | **CRÍTICA** |
| 3 | Thread hover | OK sutil | Broader highlight | OK |
| 4 | Share button | Flip Share→Link (clever) | — | OK |
| 5 | Compose expand | `expandIn 180ms ease-out` | — | OK |
| 6 | Composer focus | Textarea auto-height | — | OK |
| 7 | Image preview | Static X on hover | — | OK |
| 8 | Character limit | Text color change at 85% | Gradient color | MÉDIA |
| 9 | Focus ring | Double-ring (light+dark) | — | OK |
| 10 | Sticky CTA LP | Framer AnimatePresence | — | OK |
| 11 | Empty state icon | 56px bg-muted | — | OK |
| 12 | First-post ceremony | NONE | Notion celebratory toast | **CRÍTICA** |
| 13 | Follow confirmation | Color only | Linear checkmark appear | MÉDIA |
| 14 | Notification badge | NONE | Discord pulse dot | **CRÍTICA** |
| 15 | Reveal on page load | NONE | Linear stagger fade-in | MÉDIA |

---

## Dopamina & Pleasure — 10 Gaps

### DOPA-1: Like animation & reward system — **BLOQUEADO**
**Local:** thread-list-item.tsx handleLike
**Atual:** Heart fill + count increment (instant)
**Proposta:**
```tsx
const likeVariants = {
  tap: { scale: [1, 1.3, 1], transition: { duration: 0.5, ease: "easeOut" } }
};
// + @keyframes particle-burst com 6 particles
// + toast.success("Você curtiu! ❤️")
```
**Impact:** ★★★★★ — Like é ação #1 de engagement. Falta 40% do neurochemical hit.

### DOPA-2: Repost feedback & virality signal — **PARCIAL**
**Falta:** rotação energética (repost é amplificação social = maior energy que like)
**Fix:** rotate 360° 300ms + scale pop

### DOPA-3: First post reward ceremony — **BLOQUEADO**
**Atual:** Modal fecha, router refresh, feed recarrega, novo post aparece. **Zero ceremony.**
**Proposta:** toast variant 'success' + Sparkles animation + "Parabéns! 🎉 Seu primeiro post"

### DOPA-4: Follow button confirmation — **PARCIAL**
**Falta:** checkmark appear + fade quando follow OK

### DOPA-5: Notification badge pulsing — **FALTA**
**Local:** sidebar.tsx linha 96 Bell icon
**Proposta:**
```css
@keyframes pulse-notify {
  0%,100% { box-shadow: 0 0 0 0 rgba(225,29,72,0.7); }
  50% { box-shadow: 0 0 0 6px rgba(225,29,72,0); }
}
```

### DOPA-6: Leaderboard position change signal — **NÃO AUDITADO**
Requer teste em /leaderboard (pendente).

### DOPA-7: Character limit progressive warning — **PARCIAL**
**Atual:** salta neutro → destructive. **Proposta:** gradient 0→100% (yellow → orange → red)

### DOPA-8: @mention autocomplete highlight — **FALTA**
Composer é textarea simples. Sem richtext real-time.

### DOPA-9: Reveal animation on feed load — **FALTA**
Feed renderiza instant. LP tem ScrollReveal, forum não.

### DOPA-10: Profile avatar frame / customization — **FALTA**
Avatar = AvatarImage simples. Zero frames, borders, badges ao redor.
**Benchmark:** Twitter verificado, Linear colored ring, Notion emoji frames.
**Impact:** Personalization drives retention.

---

## Tipografia — Expressividade (3/10)

- H1: `text-2xl font-bold` Inter Bold 32px — profissional, sem personalidade
- Body: `text-[15px]` Inter — legível, sem voz
- Mono: JetBrains em code blocks — belo mas esperado

**Sem** display font customizado, drop caps, pull quotes, ligaduras custom.

---

## Icon System (4/10)

**Lucide-react ^1.7** — consistência ✓, zero custom.

**Benchmarks:**
- Linear: 150+ custom icons, bespoke stroke, perfect 24px grid
- Vercel/Geist: ~80 custom
- Arc: illustrative custom (playful)

**Recomendação:** Desenhar 24-32 ícones core (thread, like, repost, follow, comment, share, trending, category) em single-stroke B&W, 24px grid. **GAP #1 de premium signal.** Iconografia própria é o único elemento não-commoditizável.

---

## Dark Mode (7.5/10)

**next-themes ^0.4** instalado.

**Bom:**
- Paridade real entre light/dark
- Cores semânticas lifted (rose-600→rose-400)
- Glass system com inset highlights em ambos modos

**Concerns:**
- Hardcoded `text-rose-500` sem variante `dark:` — funciona por acaso
- `bg-[#20BD5A]` no sticky CTA — sem variante

---

## Navigation & Wayfinding (8/10)

**Sidebar** (`layout/sidebar.tsx`) — sticky 280px, logo, nav items claros, separator, "Em breve" section, user card.
**Active state:** `bg-sidebar-accent` ✓
**Breadcrumbs:** nenhum (apropriado para flat feed)
**Current page indicator:** claro

**Gap:** Zero atalhos de teclado visíveis. Linear/Raycast mostram `⌘+/` para search, `c` para compose. Implementar.

---

## Emotional Tone / Copy Voice (5/10)

**Samples analisadas:**
- `"O que está acontecendo?"` — COPY LITERAL DO TWITTER
- `"Publicar"` — commodity
- `"Nenhuma publicacao ainda. Seja o primeiro!"` — generic motivational
- `"Tudo em dia / Quando alguém curtir, responder ou começar a te seguir, voce vera aqui"` — **best copy** (específico + actionable)

**Persona:** neutral professional, direto, sem gíria, sem meme.

**Gaps:**
1. Zero signature emocional
2. Placeholders Twitter-exatos
3. Qualidade varia (notifs empty OK, forum empty genérico)

**Benchmarks:**
- Linear: "No issues to show. Start creating."
- Raycast: "No extensions yet. Get started."
- Notion: "📝 Add a database..."

---

## Benchmark Positioning

```
                Commodity ←─────────→ Premium
Clarity           [SINAPSE]               Linear
Velocity                    [SINAPSE]
Personality                             Arc/Raycast
Depth                            [SINAPSE]
Craft                    [SINAPSE... BLOQUEADO]
```

**DNA atual:** 70% Twitter, 20% Linear, 10% Vercel, 0% Arc/Raycast/Superhuman

**DNA target:** Linear velocity + Vercel glass + Superhuman microinteractions + Arc personality + Raycast keyboard-first

---

## Top 14 Recommendations (priorizado por tier)

### Tier 0 — BLOQUEADORES (antes de qualquer outra coisa)
- **0a** Parar `text-rose-500` hardcoded → usar `--accent-like`. S (2h). Drift fix.
- **0b** Remover `bg-zinc-800` / `text-zinc-500` de sort buttons no forum/page.tsx. S (1h). Drift fix.

### Tier 1 — QUICK WINS (<4h cada)
1. **Like animation** (heart scale + particle burst). S (3h). ★★★★★
2. **Empty state reformulation** (4 empty states). S (4h). ★★★★
3. **Notif unread badge + pulse**. S (2h). ★★★★
4. **First-post reward toast**. S (1.5h). ★★★★
5. **Fix sticky-cta.tsx `bg-[#20BD5A]` hardcoded**. S (0.5h). ★★★

### Tier 2 — STRUCTURAL (1-3 dias)
6. **Email templates remediação** (Supabase + Abacate) alinhados aos tokens. M (2d). ★★★★★
7. **Token registry formal + semver + changelog**. M (2d). ★★★
8. **Follow confirmation visual** (checkmark). S (1h). ★★★
9. **Keyboard shortcuts visíveis** (c compose, j/k feed, g+f forum, ?). M (1.5d). ★★★

### Tier 3 — STRATEGIC (1-2 semanas)
10. **First 5 Minutes Choreography** (onboarding → guided actions + bot welcome). M (3d). ★★★★★
11. **Pricing page narrativa** (3 cards verticais, não tabela). M (2d). ★★★★

### Tier 4 — PREMIUM SIGNAL (2+ semanas)
12. **Iconografia proprietária** (24-32 custom icons single-stroke). L (1-2w). ★★★★★ — **GAP #1**
13. **Tier Founders** (R$497/mês invite-only, scarcity/friction estratégica). M (1w). ★★★★
14. **Custom display font** (serif editorial para LP hero + featured threads). L (1-2w). ★★★★

---

## Proposed Visual North Star (Ano 1)

> SINAPSE em 12 meses será um híbrido entre o design system maduro de **Linear** (confiança, clareza, profundidade), a personalidade de **Arc** (colorful, playful, proud), e a densidade microinterativa de **Superhuman** (cada ação celebrada em 200-500ms).
>
> **Diferenciadores visuais:**
> - Iconografia proprietária 24 ícones core (GAP #1)
> - Custom display font (serif editorial na LP + featured threads)
> - Emails transacionais em paridade com UI
> - Dopamina densa (like burst, repost spin, first-post confetti)
> - Fricção estratégica (tier Founders invite-only)
> - Keyboard-first visível (Raycast-style)
>
> **Resultado:** User novo abre SINAPSE, vê email profissional, completa onboarding com ceremony, faz primeiro post com confetti, clica like e vê burst — e pensa: "isto é premium, merece R$197".

---

**Score hoje:** 6.2/10. **Potencial com execução:** 9/10.
