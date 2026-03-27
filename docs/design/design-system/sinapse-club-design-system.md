# Design System — sinapse.club

> Documento vivo. Fonte de verdade para toda decisao visual e de componentes da plataforma.
> Owner: @design (Nexus) + @brand (Meridian)

---

## 1. Brand Foundation

### 1.1 Posicionamento Visual

sinapse.club e a comunidade de AI mais acessivel e atualizada do mundo lusofono. O design deve transmitir:

- **Inteligencia** — sofisticado sem ser elitista
- **Velocidade** — conteudo fresco, updates em tempo real
- **Conexao** — sinapses neurais, rede, comunidade
- **Bilinguismo** — ponte entre o ecossistema global (EN) e local (PT-BR)

### 1.2 Conceito Visual

Inspiracao no conceito de **sinapse neural**: conexoes, pulsos eletricos, redes neurais. Traduzido visualmente em:
- Linhas de conexao sutis entre elementos
- Gradientes que simulam pulsos de energia
- Grid system que remete a uma rede neural
- Micro-animacoes de "ativacao" em interacoes

---

## 2. Color System

### 2.1 Core Palette

```
Primary:
  sinapse-purple:    #7C3AED   (Violet 600 — identidade principal)
  sinapse-purple-50: #F5F3FF
  sinapse-purple-100:#EDE9FE
  sinapse-purple-200:#DDD6FE
  sinapse-purple-300:#C4B5FD
  sinapse-purple-400:#A78BFA
  sinapse-purple-500:#8B5CF6
  sinapse-purple-600:#7C3AED   ← primary
  sinapse-purple-700:#6D28D9
  sinapse-purple-800:#5B21B6
  sinapse-purple-900:#4C1D95

Secondary:
  sinapse-cyan:      #06B6D4   (Cyan 500 — accent, links, highlights)
  sinapse-cyan-50:   #ECFEFF
  sinapse-cyan-100:  #CFFAFE
  sinapse-cyan-200:  #A5F3FC
  sinapse-cyan-300:  #67E8F9
  sinapse-cyan-400:  #22D3EE
  sinapse-cyan-500:  #06B6D4   ← secondary
  sinapse-cyan-600:  #0891B2
  sinapse-cyan-700:  #0E7490

Accent:
  sinapse-amber:     #F59E0B   (Amber 500 — warnings, highlights, gamification)
  sinapse-emerald:   #10B981   (Emerald 500 — success, online status, badges)
  sinapse-rose:      #F43F5E   (Rose 500 — errors, urgent, live indicators)
```

### 2.2 Semantic Colors

```
Background:
  bg-primary:        #0F0F1A   (dark mode — default)
  bg-secondary:      #1A1A2E
  bg-tertiary:       #252540
  bg-surface:        #16162A
  bg-elevated:       #1E1E38
  bg-overlay:        rgba(15, 15, 26, 0.8)

  bg-light-primary:  #FFFFFF   (light mode)
  bg-light-secondary:#F8FAFC
  bg-light-tertiary: #F1F5F9

Text:
  text-primary:      #F8FAFC   (dark) / #0F172A (light)
  text-secondary:    #94A3B8   (dark) / #475569 (light)
  text-tertiary:     #64748B   (dark) / #64748B (light)
  text-accent:       #A78BFA   (purple 400)
  text-link:         #22D3EE   (cyan 400)

Border:
  border-default:    #2D2D4A   (dark) / #E2E8F0 (light)
  border-hover:      #3D3D5C   (dark) / #CBD5E1 (light)
  border-active:     #7C3AED   (purple 600)
  border-subtle:     #1E1E38   (dark) / #F1F5F9 (light)

Status:
  status-online:     #10B981   (emerald)
  status-live:       #F43F5E   (rose — pulsing dot)
  status-away:       #F59E0B   (amber)
  status-offline:    #64748B   (slate)
```

### 2.3 Gradient System

```css
/* Hero gradient — identidade principal */
.gradient-hero {
  background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);
}

/* Synapse pulse — usado em CTAs e highlights */
.gradient-synapse {
  background: linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, #06B6D4 100%);
}

/* Card glow — hover effect em cards */
.gradient-glow {
  background: radial-gradient(ellipse at top, rgba(124, 58, 237, 0.15), transparent 70%);
}

/* Live indicator */
.gradient-live {
  background: linear-gradient(90deg, #F43F5E, #FB7185);
}

/* Neural mesh — background decorativo */
.gradient-mesh {
  background:
    radial-gradient(at 20% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
    radial-gradient(at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
    radial-gradient(at 50% 50%, rgba(15, 15, 26, 1) 0%, rgba(15, 15, 26, 1) 100%);
}
```

### 2.4 Dark Mode First

sinapse.club adota **dark mode como padrao** (alinhado com Circle, Maven, e preferencia do publico tech/AI). Light mode disponivel como alternativa.

Rationale:
- Publico tech prefere dark mode (>70% segundo pesquisas)
- Concorrentes premium (Circle, Maven) usam dark
- Melhor para leitura prolongada de conteudo tecnico
- Contraste forte com o purple/cyan highlights

---

## 3. Typography

### 3.1 Font Stack

```
Display/Headings:  "Cal Sans" or "Inter Display"
  - Usada em h1, h2, hero sections
  - Weight: 600 (semibold), 700 (bold)
  - Alternativa: "Satoshi", "Plus Jakarta Sans"

Body:              "Inter"
  - Texto corrido, UI elements, labels
  - Weights: 400 (regular), 500 (medium), 600 (semibold)

Mono:              "JetBrains Mono"
  - Code blocks, tags, badges tecnicos
  - Weight: 400, 500

Fallback:          system-ui, -apple-system, sans-serif
```

### 3.2 Type Scale

```
text-xs:     12px / 16px   — badges, timestamps, meta
text-sm:     14px / 20px   — secondary text, captions
text-base:   16px / 24px   — body text (default)
text-lg:     18px / 28px   — lead paragraphs, card titles
text-xl:     20px / 28px   — section headers
text-2xl:    24px / 32px   — page titles
text-3xl:    30px / 36px   — hero subtitles
text-4xl:    36px / 40px   — hero titles
text-5xl:    48px / 48px   — landing hero
text-6xl:    60px / 60px   — splash/marketing
```

### 3.3 Font Pairing Rules

| Context | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Hero headline | Cal Sans | 700 | text-5xl | text-primary |
| Section title | Cal Sans | 600 | text-2xl | text-primary |
| Card title | Inter | 600 | text-lg | text-primary |
| Body text | Inter | 400 | text-base | text-secondary |
| Code/tag | JetBrains Mono | 500 | text-sm | text-accent |
| Timestamp | Inter | 400 | text-xs | text-tertiary |
| Button | Inter | 600 | text-sm | varies |
| Badge | JetBrains Mono | 500 | text-xs | varies |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (8px base)

```
space-0:   0px
space-0.5: 2px
space-1:   4px
space-1.5: 6px
space-2:   8px      ← base unit
space-3:   12px
space-4:   16px
space-5:   20px
space-6:   24px
space-8:   32px
space-10:  40px
space-12:  48px
space-16:  64px
space-20:  80px
space-24:  96px
```

### 4.2 Grid System

```
Container:
  max-w-7xl:  1280px  (main content)
  max-w-5xl:  1024px  (reading width)
  max-w-3xl:  768px   (article/post width)
  max-w-lg:   512px   (forms, modals)

Layout:
  sidebar:    280px   (fixed, collapsible)
  main:       flex-1  (fluid)
  aside:      320px   (right panel, optional)

Breakpoints:
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
  2xl: 1536px
```

### 4.3 Layout Patterns

```
┌──────────────────────────────────────────────────┐
│  Top Bar (fixed, 56px)                           │
├──────────┬───────────────────────┬───────────────┤
│          │                       │               │
│ Sidebar  │    Main Content       │  Right Panel  │
│  280px   │    (fluid)            │   320px       │
│          │                       │  (optional)   │
│ - Nav    │  - Feed               │  - Profile    │
│ - Spaces │  - Course player      │  - Leaderboard│
│ - DMs    │  - Calendar           │  - Trending   │
│          │  - Search results     │  - Widgets    │
│          │                       │               │
└──────────┴───────────────────────┴───────────────┘

Mobile (< 768px):
  - Sidebar collapsa em bottom nav (5 items)
  - Right panel vira sheet ou tab
  - Content full-width
```

---

## 5. Component Library

### 5.1 Buttons

```
Variants:
  primary:     bg-purple-600, text-white, hover:bg-purple-700
  secondary:   bg-surface, text-primary, border, hover:bg-elevated
  ghost:       transparent, text-secondary, hover:bg-surface
  danger:      bg-rose-600, text-white, hover:bg-rose-700
  accent:      gradient-synapse, text-white

Sizes:
  sm:   h-8,  px-3, text-sm
  md:   h-10, px-4, text-sm    (default)
  lg:   h-12, px-6, text-base
  xl:   h-14, px-8, text-lg

States:
  default → hover → active → disabled → loading

Border Radius: rounded-lg (8px)
```

### 5.2 Cards

```
Base Card:
  bg: bg-surface
  border: border-default (1px)
  radius: rounded-xl (12px)
  padding: p-4 (16px)
  hover: border-hover + subtle shadow + translateY(-1px)
  transition: all 150ms ease

Card Variants:
  - PostCard:      avatar + author + content + reactions + timestamp
  - CourseCard:    thumbnail + title + progress + badge
  - EventCard:     date badge + title + host + join button
  - MemberCard:    avatar + name + role + stats
  - NewsCard:      source icon + headline + translation badge + timestamp
```

### 5.3 Navigation

```
Top Bar (56px):
  - Logo (left)
  - Search (center, expandable)
  - Notifications bell + DMs + Avatar (right)
  - bg: bg-primary with border-b

Sidebar (280px):
  - Collapsible sections:
    1. Spaces (Forum categories)
    2. Courses (enrolled)
    3. Calendar (upcoming)
    4. Direct Messages
  - Active state: bg-elevated + border-l-2 border-purple-600
  - Hover: bg-surface

Bottom Nav (mobile):
  5 items: Home | Courses | Calendar | Search | Profile
  Active: text-purple-400 with dot indicator
```

### 5.4 Feed Components

```
Post:
  ┌────────────────────────────────────────┐
  │ [Avatar] Author · Role · 2h ago        │
  │          [Category Badge] [Source Badge]│
  │                                        │
  │ Post content here with rich text...    │
  │                                        │
  │ [Image/Video/Link Preview]             │
  │                                        │
  │ 💬 24  ❤️ 142  🔄 Share  📌 Save       │
  └────────────────────────────────────────┘

Curated News Item:
  ┌────────────────────────────────────────┐
  │ [X/Reddit/Docs icon] Source · 1h ago   │
  │                                        │
  │ Original headline (EN)                 │
  │ Titulo traduzido (PT-BR)              │
  │                                        │
  │ Summary (2 lines)...                   │
  │                                        │
  │ [🌐 EN] [🇧🇷 PT] [↗ Original] [💬 12] │
  └────────────────────────────────────────┘
```

### 5.5 Course Components

```
Course Card:
  ┌────────────────────────────────────────┐
  │ ┌──────────────────────────────────┐   │
  │ │     Thumbnail (16:9)             │   │
  │ │         [▶ Play]                 │   │
  │ │              [Badge: NOVO/LIVE]  │   │
  │ └──────────────────────────────────┘   │
  │ Course Title                           │
  │ Instructor · 12 aulas · 4h30          │
  │ ████████░░ 68% concluido             │
  │                                        │
  │ [Continuar] or [R$ 197]              │
  └────────────────────────────────────────┘

Video Player:
  - Aspect ratio: 16:9
  - Controls: play/pause, volume, speed (0.5x-2x), quality, fullscreen
  - Progress bar with chapter markers
  - Side panel: module list with checkmarks
  - Notes: inline note-taking per timestamp
```

### 5.6 Calendar Components

```
Event Card:
  ┌────────────────────────────────────────┐
  │ ┌─────┐                                │
  │ │ MAR │  Live: Novidades Claude 4.5    │
  │ │  28 │  @caio · 19:00 BRT · 1h       │
  │ │ SEX │  [🔴 LIVE] or [⏰ Lembrar]     │
  │ └─────┘                                │
  │         [Entrar] [Adicionar ao Google] │
  └────────────────────────────────────────┘

Calendar View:
  - Month view (default) with event dots
  - Week view with time blocks
  - List view for upcoming events
  - Filter: [Todos] [Calls] [Lives] [Workshops]
```

### 5.7 Translation Toggle

```
Bilingual Indicator:
  ┌──────────────────────────┐
  │ [🌐 EN ←→ 🇧🇷 PT]  Auto │
  └──────────────────────────┘

  - Toggle between original (EN) and translated (PT-BR)
  - Default: user's preferred language
  - "Auto" badge when AI-translated
  - Hover: "Traduzido automaticamente — ver original"
  - Option: side-by-side bilingual view
```

### 5.8 Gamification Components

```
Leaderboard Widget:
  ┌────────────────────────────────────────┐
  │ 🏆 Leaderboard (30 dias)              │
  │                                        │
  │ 1. 🥇 @user1 ·········· 5,550 pts    │
  │ 2. 🥈 @user2 ·········· 4,230 pts    │
  │ 3. 🥉 @user3 ·········· 3,890 pts    │
  │ ...                                    │
  │ 42. You ·················· 890 pts     │
  └────────────────────────────────────────┘

Points System:
  - Post: +10 pts
  - Comment: +5 pts
  - Like received: +2 pts
  - Course lesson completed: +20 pts
  - Streak day: +15 pts
  - Helpful answer: +25 pts

Badges:
  - 🔥 Streak (3, 7, 30, 100 dias)
  - 📚 Scholar (cursos completos)
  - 💬 Contributor (posts/comments)
  - 🌍 Translator (contribuicoes bilingual)
  - 🎓 Graduate (certificados)
  - ⭐ Top contributor (mensal)

Streak Indicator:
  [🔥 12 dias] — shown in profile and posts
```

---

## 6. Iconography

### 6.1 Icon Library

```
Primary: Lucide Icons (MIT, tree-shakeable, consistent)
  - Consistent stroke width: 1.5px
  - Size: 16px (sm), 20px (md), 24px (lg)
  - Color inherits from parent text color

Custom Icons (sinapse-specific):
  - Synapse logo mark
  - Translation indicator (EN↔PT)
  - AI-curated badge
  - Source badges (X, Reddit, GitHub, Docs)
  - Course/module indicators
  - Live pulse indicator
```

### 6.2 Source Badges

```
Platform badges para conteudo curado:
  [𝕏] X/Twitter      — slate bg, white icon
  [🤖] Reddit         — orange bg, white icon
  [📄] Docs           — blue bg, white icon
  [🐙] GitHub         — dark bg, white icon
  [📰] Blog           — green bg, white icon
  [🎥] YouTube        — red bg, white icon
  [📧] Newsletter     — purple bg, white icon
```

---

## 7. Motion & Animation

### 7.1 Timing

```
Duration:
  instant:   0ms
  fast:      100ms   — micro-interactions (hover, focus)
  normal:    200ms   — transitions (expand, collapse)
  moderate:  300ms   — page transitions, modals
  slow:      500ms   — complex animations, onboarding

Easing:
  ease-default: cubic-bezier(0.4, 0, 0.2, 1)    — general purpose
  ease-in:      cubic-bezier(0.4, 0, 1, 1)        — entering elements
  ease-out:     cubic-bezier(0, 0, 0.2, 1)        — exiting elements
  ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1) — playful (badges, achievements)
  ease-spring:  cubic-bezier(0.175, 0.885, 0.32, 1.275) — spring feel
```

### 7.2 Animation Patterns

```
Synapse Pulse:
  - Usado em: live indicators, notifications, CTAs
  - Efeito: glow pulsante com roxo/cyan
  - CSS: @keyframes synapse-pulse { 0% { opacity: 0.6 } 50% { opacity: 1 } 100% { opacity: 0.6 } }

Neural Connection:
  - Usado em: loading states, onboarding
  - Efeito: linhas de conexao se formando entre pontos
  - Implementacao: SVG path animation ou Canvas

Feed Entry:
  - Novos posts entram com fadeInUp (200ms, ease-out)
  - Staggered: cada item 50ms depois do anterior

Achievement Unlock:
  - Scale de 0 → 1.1 → 1 com ease-bounce (400ms)
  - Confetti ou particle burst (opcional)
  - Sound effect (opcional, respeitar preferencia do usuario)

Translation Flip:
  - Texto original → fade out (100ms) → fade in traduzido (100ms)
  - Ou slide horizontal como um "flip"

Skeleton Loading:
  - Shimmer gradient animado (left to right)
  - Cor: bg-surface → bg-elevated → bg-surface
  - Duration: 1.5s, infinite
```

---

## 8. Responsive Strategy

### 8.1 Breakpoint Behavior

| Breakpoint | Layout | Sidebar | Right Panel | Navigation |
|------------|--------|---------|-------------|------------|
| < 640px | Single column | Hidden (bottom nav) | Hidden (sheet) | Bottom nav |
| 640-768px | Single column | Overlay (hamburger) | Hidden | Bottom nav |
| 768-1024px | 2 columns | Collapsible (icons only) | Hidden | Top bar |
| 1024-1280px | 2 columns | Full sidebar | Optional | Top bar |
| > 1280px | 3 columns | Full sidebar | Visible | Top bar |

### 8.2 Mobile-First Components

```
Mobile Priorities:
  1. Feed (swipe between spaces)
  2. Course player (fullscreen)
  3. Calendar (list view default)
  4. Quick actions (FAB for new post)
  5. Notifications (pull down)

Touch Targets:
  - Minimum: 44x44px
  - Recommended: 48x48px
  - Spacing between: 8px minimum

Gestures:
  - Swipe left/right: navigate spaces
  - Swipe down: refresh feed
  - Long press: context menu
  - Double tap: like
```

---

## 9. Accessibility (a11y)

### 9.1 Standards

```
Target: WCAG 2.1 AA

Contrast Ratios (dark mode):
  - text-primary on bg-primary:    15.4:1 ✅ (AAA)
  - text-secondary on bg-primary:   7.1:1 ✅ (AA)
  - purple-400 on bg-primary:       5.2:1 ✅ (AA)
  - cyan-400 on bg-primary:         6.8:1 ✅ (AA)

Focus Indicators:
  - Visible focus ring: 2px solid purple-400, offset 2px
  - Never remove :focus-visible

Screen Reader:
  - All images have alt text
  - ARIA labels on interactive elements
  - Live regions for real-time updates (new posts, notifications)
  - Translation toggle announces language change

Keyboard:
  - Full keyboard navigation
  - Tab order follows visual order
  - Escape closes modals/overlays
  - Enter/Space activates buttons
```

---

## 10. Design Tokens (Tailwind Config)

### 10.1 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sinapse: {
          purple: {
            50: '#F5F3FF',
            100: '#EDE9FE',
            200: '#DDD6FE',
            300: '#C4B5FD',
            400: '#A78BFA',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
            800: '#5B21B6',
            900: '#4C1D95',
          },
          cyan: {
            50: '#ECFEFF',
            100: '#CFFAFE',
            200: '#A5F3FC',
            300: '#67E8F9',
            400: '#22D3EE',
            500: '#06B6D4',
            600: '#0891B2',
            700: '#0E7490',
          },
        },
        surface: {
          DEFAULT: '#16162A',
          hover: '#1E1E38',
          active: '#252540',
        },
        background: {
          primary: '#0F0F1A',
          secondary: '#1A1A2E',
          tertiary: '#252540',
        },
      },
      fontFamily: {
        display: ['Cal Sans', 'Inter Display', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'badge': '6px',
        'pill': '9999px',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'synapse-pulse': 'synapse-pulse 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 200ms ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        'synapse-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
}

export default config
```

---

## 11. Component Status Tracker

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| Button | 📋 Spec'd | P0 | All variants defined |
| Card (Base) | 📋 Spec'd | P0 | |
| PostCard | 📋 Spec'd | P0 | MVP core |
| NewsCard (curated) | 📋 Spec'd | P0 | MVP core — bilingual |
| CourseCard | 📋 Spec'd | P0 | MVP core |
| EventCard | 📋 Spec'd | P1 | Calendar MVP |
| Top Bar | 📋 Spec'd | P0 | |
| Sidebar | 📋 Spec'd | P0 | |
| Bottom Nav (mobile) | 📋 Spec'd | P0 | |
| Video Player | 📋 Spec'd | P0 | Course MVP |
| Calendar View | 📋 Spec'd | P1 | |
| Leaderboard | 📋 Spec'd | P2 | Gamification |
| Badge System | 📋 Spec'd | P2 | Gamification |
| Translation Toggle | 📋 Spec'd | P0 | Key differentiator |
| Skeleton Loading | 📋 Spec'd | P1 | |
| Avatar | 📋 Spec'd | P0 | |
| Input/Form | 📋 Spec'd | P0 | |
| Modal/Dialog | 📋 Spec'd | P1 | |
| Toast/Notification | 📋 Spec'd | P1 | |
| Dropdown/Menu | 📋 Spec'd | P1 | |
| Tabs | 📋 Spec'd | P1 | |
| Progress Bar | 📋 Spec'd | P1 | Course progress |
| Rich Text Editor | 📋 Spec'd | P0 | Post creation |

**Status Legend:** 📋 Spec'd | 🎨 Designed | 🔨 Building | ✅ Done | 🔄 Iterating

---

## 12. Competitor Visual Analysis

### Skool
- **Strengths:** Clean, fast, gamification (leaderboard), simple nav
- **Weaknesses:** Light mode only, generic design, no dark mode, limited customization
- **Takeaway:** Gamification model (leaderboard, points) funciona — adotar

### Circle
- **Strengths:** Dark theme premium, flexible, events + courses + community integrated
- **Weaknesses:** Complex UI, overwhelming for new users, expensive
- **Takeaway:** Dark mode + premium feel — alinhar com nossa abordagem

### Maven
- **Strengths:** Cohort model, discovery/trending, expert-led
- **Takeaway:** Trending/discovery para cursos e conteudo — adotar

### Key Differentiators visuais do sinapse.club:
1. **Bilingual UI** — toggle EN↔PT e um first-class citizen visual
2. **Source badges** — saber de onde veio o conteudo (X, Reddit, Docs)
3. **Neural aesthetic** — gradientes e conexoes que remetem a sinapses
4. **Dark-first** — premium como Circle, mas mais acessivel
5. **Gamification visual** — leaderboard como Skool, mas com badges de AI

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-27 | Initial design system spec | @design (Nexus) + Imperator |
