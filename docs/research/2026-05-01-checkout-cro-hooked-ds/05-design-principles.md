# 05 — Principios de Design (atemporais)

> Os fundamentos que sobrevivem a tendencia. Vignelli, Rams, Tufte, tipografia, monocromia, motion.

---

## TL;DR

Os mestres convergem em 4 verdades: **(1) disciplina > expressao** (Vignelli, Rams) — restricao gera identidade; **(2) menos > mais** (Rams "as little design as possible", Tufte "data-ink ratio") — cada elemento precisa ganhar seu lugar; **(3) timelessness > trendiness** — design baseado em logica de comunicacao envelhece bem; **(4) hierarquia tipografica e o esqueleto** — se tipografia esta certa, 70% do design esta certo. Monocromia B&W e a estetica mais dificil de errar e mais facil de fazer parecer premium — desde que voce inclua textura/granulacao pra evitar planice. Motion design segue principios fisicos (Disney 12, Apple HIG): natural physics > linear easing.

---

## 1. Massimo Vignelli — The Vignelli Canon

Vignelli (1931-2014) — designer italiano de NYC subway map, American Airlines, Bloomingdale's, MoMA early.

### 12 principios (do livro Canon, 2010)

**Intangibles (conceitos):**
1. **Semantic** — design comunica significado, nao decora
2. **Syntactic** — gramatica visual coerente
3. **Pragmatic** — funcional acima de bonito
4. **Discipline** — sem disciplina, anarquia. **"Design without discipline is anarchy, an exercise of irresponsibility."**
5. **Appropriateness** — adequado ao problema (formal, casual, etc)
6. **Ambiguity** — evitar — clareza sempre ganha
7. **Design is One** — graphic, product, interior — tudo aplica os mesmos principios
8. **Visual Power** — impacto visual nao e gritar, e ressoar
9. **Intellectual Elegance** — solucoes elegantes saem de pensamento profundo, nao de estilo
10. **Timelessness** — recusa moda, busca duracao
11. **Responsibility** — designer responde por o que coloca no mundo
12. **Equity** — todo trabalho merece dignidade, do livreto ao logo

**Tangibles (ferramentas):**
- Grid, tipografia (Vignelli usava ~6 fontes pra vida toda — Helvetica, Bodoni, Garamond, Times, Century, Futura)
- Cor (preferencia por monocromia + um accent)
- Layout assimetrico estruturado por grid

> **SINAPSE = canon de Vignelli aplicado.** B&W + Sora/Inter/JetBrains + grid + grain. Brandbook do Sinapse e essencialmente Vignelli digital.

---

## 2. Dieter Rams — 10 principles of good design

Designer industrial Braun (1955-1995). Ja influenciou Apple (Jony Ive abertamente). Os 10 principios sao **anti-floreio**.

| # | Principio | Aplicacao digital |
|---|---|---|
| 1 | Innovative | Inovacao serve a usabilidade, nao a si propria |
| 2 | Useful | Util > bonito. Form follows function |
| 3 | Aesthetic | Beleza emerge da utilidade |
| 4 | Understandable | Auto-explicativo. Se precisa tutorial, falhou |
| 5 | Unobtrusive | Nao chamar atencao a si — servir o conteudo |
| 6 | Honest | Nao prometer mais do que entrega |
| 7 | Long-lasting | Recusa trendy, busca timeless |
| 8 | Thorough down to last detail | Detalhe e amor, nao perfectionismo |
| 9 | Environmentally friendly | (digital): performance = energia |
| 10 | **As little design as possible** | "Less, but better" — Weniger, aber besser |

**Conexao com Apple:** o iPod, iPhone early, AirPods, Mac mini sao Rams aplicado a digital. Mesma filosofia.

---

## 3. Edward Tufte — information design

Tufte e o canon de visualizacao de dado. Livros: *Visual Display of Quantitative Information* (1983), *Envisioning Information* (1990).

### Conceitos chave

- **Data-ink ratio:** maximizar ink que mostra DADO, minimizar ink decorativo. Ratio alto = grafico mais informativo.
- **Chartjunk:** elementos visuais que nao adicionam info — gradientes, sombras 3D, decoracoes — REMOVER
- **Small multiples:** comparar atraves de mini-graficos repetidos > 1 grafico complexo
- **Sparklines:** graficos word-sized embutidos em texto/tabela
- **Lie factor:** distorcao visual vs distorcao real do dado — manter abaixo de 1.05

### Aplicacao em UI nao-grafico

- Tabelas: remover bordas redundantes, alternar fundo so se necessario
- Cards de metrica: numero grande + delta — nao grafico decorativo
- Dashboards: small multiples > 1 dashboard sobrecarregado
- Status: cor + glyph minimalista, nao animacao

> **Critica moderna (Frank Elavsky 2025):** "data-to-ink ratio" levado ao extremo gera graficos esteticamente cold — equilibrio importa. Mas o principio basico (tirar lixo decorativo) permanece.

---

## 4. Tipografia editorial em UI

### Hierarquia (consenso 2025)

**Modular scale** com ratio:
- 1.125 (Major Second) — escala suave, body-heavy
- 1.250 (Major Third) — equilibrio (Tailwind default)
- 1.333 (Perfect Fourth) — editorial classico
- 1.500 (Perfect Fifth) — display dramatico

**Niveis tipicos:**
| Nivel | Tipo | Uso |
|---|---|---|
| Display (60-180px) | Hero, brand statement | Aparece raramente |
| H1 (40-60px) | Page title | 1 por pagina |
| H2 (28-36px) | Section title | 3-7 por pagina |
| H3 (20-24px) | Subsection | Quantos forem |
| Body large (18-20px) | Content principal | — |
| Body (16px) | Default | — |
| Body small (14px) | Captions, meta | — |
| Caption (12px) | Legenda, ajuda | — |

### Fluid typography (clamp())

Padrao 2025 e usar `clamp(min, preferred, max)`:

```css
h1 { font-size: clamp(2.5rem, 5vw + 1rem, 5rem); }
```

**Vantagem:** sem media queries, escala suavemente em qualquer breakpoint.
**Cuidado:** scale compression em mobile — H1 e H2 podem virar similares. Solucao: clamp asimetrico, com niveis maiores comprimindo mais agressivo.

### Brandbook SINAPSE rule 05

> "Tamanhos: 11-14px OU 60-180px. Faixa 32-48px PROIBIDA."

Por que? **Dead-zone:** 32-48px e o tamanho "default bootstrappy" que aparece em template generico. Recusar essa faixa forca decisao consciente — ou tipografia funcional pequena, ou statement grande.

---

## 5. Monocromia B&W — a estetica mais durdura

### Por que funciona

- **Coerencia maxima:** menos variaveis, mais foco no conteudo
- **Timelessness:** B&W nunca virou "out" — Bauhaus, Suiço, Apple early, NYT, MoMA, Vercel
- **Identidade:** virou signature em mercado saturado de cor
- **Tipografia ganha protagonismo** — cor nao distrai

### Por que e dificil

- **Falta dimensao** se nao tiver textura/grain — vira plano e cold
- **Sem cor pra criar urgencia/atencao** — precisa usar SCALE, WEIGHT, CONTRAST
- **A11y exige cuidado** — contraste rigoroso, foco em estados (hover, active) sem cor

### Tecnicas pra B&W nao virar generico

| Tecnica | O que faz |
|---|---|
| **Grain SVG** (3-7% opacity) | Adiciona ruido visual, "breath" |
| **Crosshair markers** | Pontos focais com geometria |
| **Frame/border lines** | Estrutura visivel, swiss-style |
| **Texturas de papel** | Calor analog em digital |
| **Halftone patterns** | Profundidade sem cor |
| **Asymmetric grid** | Movimento sem cor |
| **Type weight contrast** | Hierarquia via peso (300 vs 800) |

### Casos canonicos
- **MoMA (Pentagram, 2009):** identity B&W com type-as-image
- **Apple early (1998-2008):** B&W + accent color minimo (azul iPod)
- **NYT digital:** B&W + serifa = autoridade timeless
- **Vercel Geist:** B&W absoluto + Geist font + Cartesian grid
- **Yves Klein, Malevich:** monocromia como statement de pintura, nao falta de cor

---

## 6. Grids vs assimetria

### Grid simetrico (Bauhaus, Swiss)
- Coluna unica centrada — formal, classico, calmo
- Funciona em: livro, manifesto, pricing simples
- Risco: enjoativo se overuse

### Grid de 12 colunas (Bootstrap-era)
- Padrao web 2010s
- Flexivel mas previsivel — facil parecer "site generico"

### Assimetria deliberada (Vignelli, Wim Crouwel)
- Hero descentralizado, peso visual em um lado
- Type set em margem incomum
- Texto bate com imagem em angulo nao-trivial
- **Mais memoravel** — quebra expectativa
- **Mais dificil** — exige decisao real

### Grid fluido (2024-2025)
- `clamp()` em width: `width: clamp(20rem, 50vw, 60rem)`
- Container queries (`@container`)
- `grid-template-columns: repeat(auto-fit, minmax(...))`
- Adapta sem media query — mais natural

> **Lei de Vignelli:** grid e DISCIPLINA, nao prisao. Quebra-lo eh OK quando ha INTENCAO. Sem grid = anarquia.

---

## 7. Motion design — Disney 12 + Apple HIG

### Disney 12 principles (1981) aplicados a UI

| Disney | UI digital |
|---|---|
| Squash & stretch | Spring physics em transitions |
| Anticipation | Preload state antes de transition |
| Staging | 1 elemento foca, outros recuam |
| Straight-ahead vs pose-to-pose | Keyframe animation |
| Follow-through & overlap | Elementos secundarios chegam apos primario |
| Slow in & slow out | **Easing curves** — nunca linear |
| Arcs | Movimento curvo > reto |
| Secondary action | Sub-animacao reforca primaria |
| Timing | 200-400ms = sweet spot UI |
| Exaggeration | Subtil em UI, pronunciado em delight moments |
| Solid drawing | Hierarquia visual durante movimento |
| Appeal | Caracter emocional |

### Apple Human Interface Motion Guidelines (resumo)

- **Purpose:** motion serve funcao (orientation, feedback) — nao decoracao
- **Subtlety:** rapido, sutil, fluido
- **Reducible:** respeitar `prefers-reduced-motion`
- **Continuous:** transicoes mantem contexto (elementos parecem se mover, nao desaparecer)
- **Reversible:** voltar deve sentir como reverter, nao novo movimento

### Easing curves canonicos

| Nome | CSS | Quando usar |
|---|---|---|
| ease-out | `cubic-bezier(0, 0, 0.2, 1)` | Entrada (mais comum) |
| ease-in | `cubic-bezier(0.4, 0, 1, 1)` | Saida |
| ease-in-out | `cubic-bezier(0.4, 0, 0.2, 1)` | Movimento entre dois pontos |
| spring | Spring(stiffness: 300, damping: 30) | Tatil, fisico |
| linear | `linear` | NUNCA pra UI (so loops) |

### Timings

- 100-200ms — micro feedback (hover, click)
- 200-400ms — transition (modal, sheet)
- 400-600ms — page transition
- > 800ms — quase nunca (so storytelling)

> **Brandbook SINAPSE rule 07-08:** "Motion reversivel" + "respeitar prefers-reduced-motion" — Apple HIG aplicado.

---

## 8. Anti-patterns FORBIDDEN

- Centralizacao simetrica simplista (hero centrado generico)
- Easing linear (mata sensacao tatil)
- Tamanhos de fonte na "dead zone" (32-48px) sem justificativa
- Fundo `#000000` puro (use `#0A0A0A` — preto perfeito chumba a tela)
- Branco `#FFFFFF` puro (use `#FAFAFA` — bate menos no olho)
- Decoracao 3D, gradientes desnecessarios (chartjunk de UI)
- Trendiness ("vou usar glassmorphism porque ta na moda")
- Misturar 3+ fontes sem hierarquia clara
- Iconografia com 3 estilos diferentes (outline + filled + duotone juntos)

---

## Fontes

- [The Vignelli Canon (PDF, RIT)](https://www.rit.edu/vignellicenter/sites/rit.edu.vignellicenter/files/documents/The%20Vignelli%20Canon.pdf)
- [Lars Müller — The Vignelli Canon](https://www.lars-mueller-publishers.com/vignelli-canon)
- [Creative Bloq — Vignelli teaching](https://www.creativebloq.com/graphic-design/massimo-vignelli-61411897)
- [IxDF — Dieter Rams 10 principles](https://ixdf.org/literature/article/dieter-rams-10-timeless-commandments-for-good-design)
- [Empathy.co — Rams in digital world](https://empathy.co/blog/dieter-rams-10-principles-of-good-design-in-a-digital-world/)
- [Design Museum — What is good design](https://designmuseum.org/discover-design/all-stories/what-is-good-design-a-quick-look-at-dieter-rams-ten-principles)
- [Tufte's Principles — DoubleThink](https://thedoublethink.com/tuftes-principles-for-visualizing-quantitative-information/)
- [Frank Elavsky — Critique of data-to-ink ratio (2025)](https://www.frank.computer/blog/2025/04/data-to-ink.html)
- [Graficto — Tufte's Influence Legacy](https://graficto.com/blog/discover-edward-tuftes-essential-principles-for-effective-data-visualization/)
- [Brndle — Fluid Typography Clamp Guide](https://brndle.com/fluid-typography-in-block-themes-the-complete-css-clamp-guide/)
- [FrontendTools — Modern Web Typography 2025](https://www.frontendtools.tech/blog/modern-web-typography-techniques-2025-readability-guide)
- [ClampGenerator — Fluid Typescale Modern CSS](https://clampgenerator.com/blog/fluid-typescale-modern-css-without-media-queries/)
- [Pentagram — MoMA identity](https://www.pentagram.com/work/moma/story)
- [Order — MoMA design](https://order.design/project/moma)
- [Apple Inc Design Motifs — Wikipedia](https://en.wikipedia.org/wiki/Apple_Inc._design_motifs)
- [Design Work Life — Black-and-White Graphics Guide](https://designworklife.com/the-designers-guide-to-creating-bold-memorable-black-and-white-graphics/)
