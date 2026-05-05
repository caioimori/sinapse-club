# 04 — Design Systems: arquitetura, governanca e casos canonicos

> Como construir DS que escala sem virar cemiterio de componentes.
> Foco: tokens, atomic design, semantic layers, casos lideres 2025.

---

## TL;DR

DS robusto em 2025 tem 3 camadas: **(1) tokens primitivos** (raw values: #0A0A0A, 16px), **(2) tokens semanticos** (intent-based: --color-text-primary, --space-card-padding), **(3) componentes** que consomem so semantic tokens. **Nunca** componente le primitivo direto. W3C Design Tokens Format Module e o padrao emergente. Casos lideres: Vercel Geist (B&W absoluto + Geist font, vinculado a brand), Linear (rigor de motion + speed), Stripe (qualidade tipografica), Shopify Polaris (data-density + a11y enterprise). Mono-brand e mais coerente; multi-brand precisa de **theme tokens** acima de semantic. Mais regras > mais componentes (Vignelli aplicado a DS).

---

## 1. Anatomia de um DS robusto

### Camadas (do mais primitivo ao mais aplicado)

```
1. Brand Foundations (pre-DS)
   └─ Mood, voz, principios — input pro DS, nao parte dele
   
2. Primitives / Reference Tokens
   └─ --color-black: #0A0A0A
   └─ --color-white: #FAFAFA
   └─ --space-100: 0.25rem (4px)
   └─ --font-size-200: 0.75rem
   └─ Nomes ABSTRATOS, sem intent

3. Semantic / System Tokens
   └─ --color-text-primary: var(--color-black)
   └─ --color-bg-elevated: var(--color-white)
   └─ --space-card-padding: var(--space-400)
   └─ Nomes com INTENT, mas agnostico de componente

4. Component Tokens (opcional)
   └─ --button-bg: var(--color-bg-action)
   └─ --button-padding-y: var(--space-200)
   └─ Especifico de componente

5. Components
   └─ Button, Card, Input, Modal — consomem so semantic+component tokens

6. Patterns
   └─ Combinacoes recorrentes (PaymentForm, EmptyState, OnboardingStep)

7. Templates / Pages
   └─ Layouts compostos
```

### Por que separar primitive de semantic?

- **Tema (light/dark, multi-brand)**: trocar so o mapping primitive→semantic
- **Refactoring**: mudar paleta sem tocar componente
- **Documentacao**: semantic explica intent, primitive explica unidade
- **Acessibilidade**: contraste validado uma vez no nivel semantic

---

## 2. Atomic Design (Brad Frost) — o classico

| Nivel | Definicao | Exemplo |
|---|---|---|
| Tokens (subatomic) | Raw values | #0A0A0A, 16px |
| Atoms | Menor componente funcional | Button, Input, Label |
| Molecules | Combinacao de atoms com proposito | SearchBar (Input + Button) |
| Organisms | Secoes complexas | Header, ProductCard, CheckoutForm |
| Templates | Layouts sem dado real | Page skeleton |
| Pages | Templates com dado | Checkout page final |

**Critica em 2025:** os labels (atom/molecule/organism) sao guideline, nao dogma. Frost mesmo admite que muitos teams ignoram a hierarquia rigida e organizam por dominio (auth/, payment/, social/). **O que importa e a logica de composicao**, nao a taxonomia.

---

## 3. Mono-brand vs multi-brand

### Mono-brand (Vercel Geist, Linear, Stripe, SINAPSE)
- **Vantagem:** coerencia maxima, decisoes mais rapidas, brand DNA visivel
- **Estrutura:** 3 camadas (primitive → semantic → component)
- **Trade-off:** se brand muda, refactor de tudo

### Multi-brand (Shopify Polaris pra apps de terceiros, Material 3 pra Android)
- **Vantagem:** reuso entre produtos/clientes
- **Estrutura:** 4 camadas (primitive → **theme** → semantic → component)
- **Theme layer:** mapping configuravel — cada brand tem seu mapping primitive→semantic

> **SINAPSE = mono-brand.** 3 camadas suficientes. Nao introduzir theme layer prematuramente.

---

## 4. W3C Design Tokens Format Module (DTFM) — padrao emergente

Specification draft em desenvolvimento desde 2021, ganhando traction 2024-2025. Define formato JSON canonico:

```json
{
  "color": {
    "brand": {
      "black": {
        "$value": "#0A0A0A",
        "$type": "color"
      }
    }
  },
  "space": {
    "card": {
      "padding": {
        "$value": "{space.400}",
        "$type": "dimension"
      }
    }
  }
}
```

**Por que importa:**
- Tools (Figma Tokens Studio, Style Dictionary, Token Studio) convergem pra DTFM
- Pipeline: Figma → JSON DTFM → CSS vars / Tailwind / iOS / Android — single source of truth
- Versionamento e diff de tokens vira primeira-class

> **Recomendacao SINAPSE:** se ainda nao usa DTFM, comecar agora — custo baixo, futuro-proof.

---

## 5. Componentizacao — a regra de Vignelli aplicada

> "More rules, fewer components." — Vignelli (parafraseado)

DS imatura: **muitos componentes especificos** (PrimaryButtonLarge, SecondaryButtonSmall, IconButton, GhostButton...).
DS madura: **poucos componentes flexiveis** com regras claras de variantes (Button com props: variant, size, intent).

### Sinais de componentes demais
- Mais de 3 variantes do mesmo elemento sem justificativa
- Componentes que existem so em 1 lugar
- "Wrapper" components que so envolvem outro

### Sinais de componentes de menos
- Devs copiando codigo entre features
- Inconsistencias visuais entre paginas
- Hard-coded values em templates

---

## 6. Casos canonicos — comparativo

### Vercel Geist
- **Filosofia:** B&W absoluto, brand-coupled (Geist font), monoline icons
- **Forca:** identidade fortissima, signature visual reconhecivel
- **Estrutura:** primitive scarce (poucas cores, escalas modulares), semantic robusta
- **Lesson:** restricao gera identidade. **Quanto menos primitives, mais coerente.**

### Linear
- **Filosofia:** speed e precisao — motion < 200ms, hotkeys, density alta
- **Forca:** sensacao de qualidade tatil, motion design exemplar
- **Estrutura:** dark-first com monocromia + accent color saturado
- **Lesson:** **motion timing** e parte do DS, nao afterthought. Spec curves de easing como tokens.

### Stripe (Dashboard + Elements)
- **Filosofia:** qualidade tipografica, dado denso mas legivel
- **Forca:** tipografia editorial em produto SaaS — raro
- **Estrutura:** modular scale rigorosa, espacamento matematico
- **Lesson:** typography como leve sistema independente vale o investimento

### Shopify Polaris
- **Filosofia:** data-rich admin, a11y enterprise-grade
- **Forca:** amadureceu sem revolucao — token-first desde antes do trend
- **Trade-off:** evolucao lenta, look-and-feel ainda 2018-ish (criticado)
- **Lesson:** maturidade > novidade em DS de produto B2B

### Material Design 3 (Google) e Apple HIG
- **Filosofia:** Material = expressivo + adaptativo (dynamic color), HIG = clarity + deference + depth
- **NAO usar como ESTETICA default** — sao referencias de qualidade, nao moldes pra B2C de marca propria
- **Lesson:** copiar Material 3 inteiro = produto generico. Adapter principios, nao tokens.

---

## 7. Governanca — DS vivo nao e doc estatica

### Quem mantem
- **Solo project (SINAPSE):** Caio + 1 agent owner (design-orqx)
- **Time pequeno (5-15):** 1 designer + 1 dev como guardioes, comite mensal
- **Empresa (50+):** time dedicado de DS engineer + designer + content

### Como evolui
- Componente novo precisa de **3+ usos previstos** pra entrar
- Token novo precisa **justificar nao reuso** de existente
- Breaking change exige migration guide + deprecation period
- Versionamento semver (DS 1.x → 2.x = breaking)

### Validacao automatizada
- Lint de tokens (`stylelint-design-tokens`, ESLint custom rules)
- Visual regression (Chromatic, Percy)
- A11y audit em CI (axe-core, pa11y)
- Token coverage report (% de styles que usa token vs hardcoded)

---

## 8. Brandbook como documento vivo

DS sem brandbook = componentes sem alma. Brandbook formaliza:
- **Voz e tom** (afeta microcopy)
- **Principios visuais** (ex: "B&W absoluto", "grain 5%")
- **Anti-patterns** (ex: "nunca #000 puro", "nunca max-w-7xl em hero")
- **Decisoes historicas** com rationale

**Exemplo SINAPSE:** brandbook tem 12 leis numeradas. DS implementa cada uma como token + lint rule. Brandbook e a Constitution; DS e o codigo.

---

## 9. Anti-patterns FORBIDDEN

- Componente que recebe className livre que sobrescreve tokens (escape hatch que mata DS)
- Tokens com nome de cor (ex: `--blue-500`) em vez de intent (`--color-action-primary`)
- Variantes de cor hardcoded em props (`color="red"`) em vez de intent (`intent="danger"`)
- Documentar em Notion/Doc separado do codigo (drift garantido)
- Lancar v1 com 80 componentes — comeca com 10 robustos
- Misturar Material/HIG com brand proprio sem theme layer
- Forkar componente em produto especifico em vez de extender via prop

---

## Fontes

- [Brad Frost — Design Tokens + Atomic Design](https://bradfrost.com/blog/post/design-tokens-atomic-design-%E2%9D%A4%EF%B8%8F/)
- [Brad Frost interview — Design Systems Collective](https://www.designsystemscollective.com/from-atomic-to-subatomic-brad-frost-on-design-systems-tokens-and-the-human-side-of-ui-189609dd9ac8)
- [Design Tokens Course — Brad & Ian Frost](https://designtokenscourse.com/)
- [Universal Design System docs — Atomic Design](https://docs.devlaunchers.org/dl-docs/universal-design-system/universal-design-system/getting-started/design-principles/atomic-design)
- [Qt — Atomic Design Systems Why Labels Don't Matter](https://www.qt.io/software-insights/atomic-design-systems-why-the-labels-dont-matter)
- [Vercel Geist Design System](https://designsystems.surf/design-systems/vercel)
- [Shopify Polaris docs](https://polaris-react.shopify.com/design)
- [Shopify Polaris evolution — Medium](https://medium.com/shopify-ux/uplifting-shopify-polaris-7c54fc6564d9)
- [W3C Design Tokens Format Module — gist](https://gist.github.com/stormwild/f2c4ac9819fbcaf96a819aa35063da2f)
- [Awesome DESIGN.md collection](https://github.com/VoltAgent/awesome-design-md)
