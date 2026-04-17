# LP v2 — Strategy Brief Executável

> Brief canônico para implementação direta. Validado pelo usuário em 2026-04-15 (YOLO mode). Sucessor de `docs/research/lp-v2-references.md`.

---

## 1. Audit-diff da v1

| Componente | Verdict | Razão |
|---|---|---|
| `lp-nav.tsx` | FIX | Estrutura boa, falta scroll-spy ativo + 6 jump links estilo `//label` + estética Nyo |
| `lp-hero.tsx` | REWRITE | Headline atual é metadata, não hook. Falta big idea e anchor ao founder strip |
| `lp-problem.tsx` | FIX | Copy dos 3 cards está forte, header genérico — virar stat block no topo + 3 cards abaixo |
| `lp-solution.tsx` | FIX | Boa base, renomear id para `solucao`, adicionar stagger reveal, manter 4 blocos |
| `lp-para-quem.tsx` | KEEP | Funcional, objeção "não é pra mim" resolvida em 3 cards — só stagger motion |
| `lp-mentores.tsx` | FIX | Header copy novo, reforço de credibilidade |
| `lp-pricing.tsx` | KEEP | 241 linhas recém-iteradas, semestral anchor, popular dark, lado a lado — só ajustar id |
| `lp-garantia.tsx` | KEEP | 27 linhas, CDC Art. 49, risk reversal antes da decisão |
| `lp-faq.tsx` | KEEP | 8 perguntas cobrem objeções, accordion funcional |
| `lp-cta-final.tsx` | KEEP | Copy "por menos que um almoço" forte, dark section funciona |
| `lp-footer.tsx` | KEEP | Enxuto por design, alinha com refusal de mega-menu |
| **NOVOS** | CREATE | `lp-founder-strip`, `lp-stat-block`, `lp-comparativo`, `lp-depoimentos` |

**Kills:** nada é deletado. v1 é esqueleto válido, v2 é reordenação + 4 novos + fixes cirúrgicos.

---

## 2. Posicionamento v2

### Hero headline — 3 candidatos

1. **"IA não é sobre ferramenta. É sobre operação."** ← VENCEDOR
2. "Pare de estudar IA. Comece a usar."
3. "A comunidade onde IA vira resultado antes de virar post."

**Por que (1):** reframe direto (ferramenta vs operação), ataca o status quo (curso/tutorial/influencer), cabe em 2 linhas display, é frase twittável, conversa com o dono que já testou ChatGPT e não aplicou.

### Subheadline
*"Fórum 24/7 de donos de negócio aplicando IA pra reduzir custo, escalar entrega e ganhar tempo. Sem teoria, sem guru, sem curso de R$ 5k. A partir de R$ 22,90/mês."*

### Big idea (1 frase)
**Sinapse é o anti-curso: em vez de te ensinar IA, te coloca no mesmo fórum de quem já implantou.**

### Voice rules
- Frase curta. Verbo no começo. Zero adjetivo corporativo.
- Nomeia inimigo real: curso de R$ 5k, guru do LinkedIn, grupo de WhatsApp, tutorial gringo.
- BR direto: "você", "a gente", "tá", contração natural. Nunca "nós acreditamos que".
- Número concreto > adjetivo vago. "R$ 22,90" vence "acessível".
- Uma piada seca por seção. Nunca duas.

---

## 3. Section blueprint v2

**Ordem:** Nav → Hero → Founder strip → Stat block → Problema → Solução → Para quem → Mentores → Comparativo → Depoimentos → Pricing → Garantia → FAQ → CTA final → Footer.

### 3.1 `lp-nav` — FIX
- **Goal:** orientação constante + scroll-spy reforça percepção de LP densa estilo Nyo.
- **Conteúdo:** logo · 6 jump links `//solucao`, `//mentores`, `//comparativo`, `//depoimentos`, `//precos`, `//faq` · CTA "Entrar" ghost · CTA "Assinar" primário → `#precos`.
- **Motion:** IntersectionObserver puro marca link ativo. Blur on scroll mantido.
- **Reference:** Nyo.

### 3.2 `lp-hero` — REWRITE
- **Goal:** reframe no primeiro segundo. Mata objeção "mais um curso de IA".
- **Conteúdo:** eyebrow "Soft launch · vagas de fundador" · H1 *"IA não é sobre ferramenta. É sobre operação."* · sub · CTA primário "Assinar por R$ 22,90" → `#precos` · CTA ghost "Ver como funciona" → `#solucao` · trust line "7 dias de garantia · cancele quando quiser".
- **Motion:** static.
- **Reference:** Abacate + Nyo.

### 3.3 `lp-founder-strip` — NEW
- **Goal:** humaniza antes da promessa. Mata "quem tá por trás disso?".
- **Conteúdo:** faixa horizontal com avatares Matheus + Caio + frase *"Construído por quem opera IA em produção todo dia — não por quem escreve post sobre."* · link "conheça os fundadores" → `#mentores`.
- **Motion:** fade-in CSS no mount.
- **Reference:** AbacatePay.

### 3.4 `lp-stat-block` — NEW
- **Goal:** proof numérica antes do pitch.
- **Conteúdo:** 3 stats em display bold — *"24/7 fórum sempre aberto"* · *"R$ 0,76 por dia no plano anual"* · *"7 dias pra pedir reembolso sem perguntar"*. Sem fake counters.
- **Motion:** stagger reveal (IntersectionObserver + transition-delay).
- **Reference:** Stripe.

### 3.5 `lp-problem` — FIX
- **Goal:** nomear a dor.
- **Conteúdo:** header *"IA virou ruído. Você precisa de sinal."* + 3 cards existentes.
- **Motion:** stagger reveal.
- **Reference:** Nyo.

### 3.6 `lp-solucao` — FIX
- **Goal:** mostra o produto em 4 pilares. Id vira `solucao`.
- **Conteúdo:** 4 blocos existentes. Header: *"Quatro coisas que um grupo de WhatsApp nunca vai te dar."*
- **Motion:** stagger reveal + hover lift.
- **Reference:** Abacate.

### 3.7 `lp-para-quem` — KEEP
- **Goal:** auto-qualificação.
- **Motion:** stagger reveal.

### 3.8 `lp-mentores` — FIX
- **Goal:** credibilidade aprofundada.
- **Conteúdo:** header *"Quem construiu isso opera IA em produção."*
- **Motion:** hover lift.

### 3.9 `lp-comparativo` — NEW
- **Goal:** anchoring contra alternativas.
- **Conteúdo:** tabela 4 colunas × 5 linhas.
  - Colunas: **Sinapse** · Curso de IA (R$ 2-5k) · Grupo de WhatsApp · Twitter/YouTube
  - Linhas: Busca + histórico · Donos de negócio verificados · Atualização contínua · Sem guru vendendo mentoria · Preço mensal
- **Motion:** stagger reveal de linhas.
- **Reference:** Nyo.

### 3.10 `lp-depoimentos` — NEW (condicional)
- **Goal:** social proof voz-de-dev.
- **Conteúdo:** 4-6 cards estilo Twitter. Se não há depoimentos reais no soft launch, seção é removida do render e o 6º jump link some.
- **Motion:** grid estático, stagger reveal.
- **Reference:** Abacate.

### 3.11 `lp-pricing` — KEEP (id → `precos`)
### 3.12 `lp-garantia` — KEEP
### 3.13 `lp-faq` — KEEP
### 3.14 `lp-cta-final` — KEEP
### 3.15 `lp-footer` — KEEP

---

## 4. Anchor IDs do scroll-spy nav

| Label nav | Anchor ID | Seção |
|---|---|---|
| `//solucao` | `#solucao` | lp-solucao |
| `//mentores` | `#mentores` | lp-mentores |
| `//comparativo` | `#comparativo` | lp-comparativo |
| `//depoimentos` | `#depoimentos` | lp-depoimentos (condicional) |
| `//precos` | `#precos` | lp-pricing |
| `//faq` | `#faq` | lp-faq |

Scroll-spy: IntersectionObserver com `rootMargin: "-40% 0px -55% 0px"`. Link ativo ganha `text-foreground` + underline. `prefers-reduced-motion` respeitado.

---

## 5. Component plan

| Path | Action |
|---|---|
| `src/app/page.tsx` | EDIT |
| `src/components/landing/lp-nav.tsx` | EDIT |
| `src/components/landing/lp-hero.tsx` | REWRITE |
| `src/components/landing/lp-founder-strip.tsx` | CREATE |
| `src/components/landing/lp-stat-block.tsx` | CREATE |
| `src/components/landing/lp-problem.tsx` | EDIT |
| `src/components/landing/lp-solution.tsx` | EDIT |
| `src/components/landing/lp-mentores.tsx` | EDIT |
| `src/components/landing/lp-comparativo.tsx` | CREATE |
| `src/components/landing/lp-depoimentos.tsx` | CREATE (condicional) |
| `src/components/landing/lp-pricing.tsx` | EDIT (id) |
| `src/hooks/use-in-view.ts` | CREATE |

---

## 6. Riscos + mitigações

1. **Depoimentos não existem no soft launch.** Seção condicional, removida do render se vazia.
2. **Scroll-spy quebra com Next 16 + React 19 hydration.** Hook 100% client-only, IntersectionObserver puro.
3. **Preços v1 vs memory.** Fonte-de-verdade = arquivo atual lp-pricing.tsx (semestral anchor). Memory atualizada após confirmação.
4. **Hero rewrite muda SEO metadata.** Atualizar `metadata.title` e `description` junto com hero.
5. **Tabela comparativa agressiva.** Categorias genéricas, linguagem factual.
