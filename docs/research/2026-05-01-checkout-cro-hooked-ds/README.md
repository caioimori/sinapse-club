# Pesquisa: Checkout, CRO, Hooked, Design Systems & Design Principles

> **Data:** 2026-05-01
> **Solicitante:** Caio Imori
> **Aplicacao primaria:** checkout sinapse.club (R$ 29,90/mes, BR mobile-first)
> **Profundidade:** DEEP DIVE (5 topicos × 5-10 fontes cada)

---

## Sumario executivo (1 pagina)

A pesquisa cruza 5 dominios pra um objetivo: **subir conversao do checkout SINAPSE sem trair o brand**. As conclusoes convergem em um diagnostico unico:

**O checkout otimo pra SINAPSE = one-page + Pix obrigatorio + microcopy especifico + garantia ao lado do botao + onboarding 72h pos-pagamento.**

Cada decisao tem evidencia documentada:

1. **One-page vs multi-step** (Topico 1) — Stripe analisou milhoes de sessoes: tickets <US$150 ganham +5.5pp em one-page. Ticket R$ 29,90 esta muito abaixo do threshold. **Decisao trivial.**

2. **Pix obrigatorio** (Topico 1) — 40-42% do GMV ecommerce BR. Audiencia 70% mobile. Sem Pix = perde quase metade do mercado.

3. **Microcopy + garantia** (Topico 2) — A/B tests publicos (Shopify, L'Axelle, CXL) documentam +15-32% lift por copy especifico no CTA + garantia visivel ao lado.

4. **Onboarding 72h** (Topico 3 - Hooked) — o pagamento ja e o investment maximo do ciclo. Mas sem variable reward + investment loop nas primeiras 72h, churn anual sera devastador. Esse e o **maior risco oculto** do produto.

5. **Brand B&W timeless** (Topicos 4 + 5) — Vignelli, Rams, Tufte, Apple, Vercel todos convergem: disciplina > expressao. SINAPSE ja esta no caminho canonico — defender a brandbook nao e teimosia, e estrategia.

---

## Estrutura

| Arquivo | Topico | Quem deve ler |
|---|---|---|
| [01-checkout-ux.md](./01-checkout-ux.md) | Padroes dominantes 2025-26: Stripe, Lemon Squeezy, Paddle, Apple Pay, Pix BR | Dev, design, founder |
| [02-cro.md](./02-cro.md) | CRO: heuristicas Nielsen, microcopy, anchor pricing, A/B tests | Founder, growth, design |
| [03-hooked-framework.md](./03-hooked-framework.md) | Trigger → Action → Variable Reward → Investment aplicado ao funil SINAPSE | Founder, product, content |
| [04-design-systems.md](./04-design-systems.md) | Arquitetura de DS: tokens W3C, atomic design, casos canonicos | Design, dev frontend |
| [05-design-principles.md](./05-design-principles.md) | Vignelli, Rams, Tufte, tipografia, monocromia, motion | Design, founder |
| [recommendations-sinapse.md](./recommendations-sinapse.md) | **Aplicacao direta no sinapse.club** com mocks, sequencias, metas | **Caio + dev squad** |

---

## 3 insights mais surpreendentes

### 1. **One-page vence so abaixo de US$150 (~R$ 800).** Acima disso, multi-step ganha por endowment effect.
A regra "single-page e sempre melhor" e MITO. Stripe demonstrou que tickets altos ($200+) **ganham com multi-step** porque os primeiros passos completados criam comprometimento psicologico que aumenta completion. Pra SINAPSE (R$ 29,90) e trivial — one-page. Mas guarde isso pra futuro produto premium ou planos enterprise.

### 2. **O ato de pagar JA e o investment maximo do ciclo Hooked.**
A maior alavanca de retencao **nao esta no checkout — esta nas 72h seguintes**. Sem onboarding orquestrado com triggers + variable rewards + investments nas primeiras 72h, mesmo o melhor checkout produz churn devastador. Eyal e Cialdini convergem: depois de pagar, o cerebro racionaliza pra usar — mas precisa de gancho diario na primeira semana.

### 3. **Brand B&W absoluto e a estetica MAIS facil de fazer parecer premium — desde que voce inclua textura.**
Tufte, Vignelli, Rams, Apple, Vercel, MoMA convergem. **B&W sem textura** = plano e cold (template generico). **B&W com grain/halftone/crosshair** = signature visual unica de timeless. SINAPSE rule 03 (grain SVG 5% sempre ativo) nao e detalhe estetico — e o que separa o produto de um "site Tailwind generico".

---

## 3 acoes imediatas pra essa semana

### 1. Validar/garantir que o checkout atual e one-page com Pix em destaque

**Como:** abrir checkout em mobile, contar campos (precisa ser ≤ 7), verificar se Pix aparece como primeira opcao de pagamento. Se nao, e o **maior leak** do funil.

**Esforco:** 1-2 dias de dev se ja tem Stripe configurado. **Impacto:** +20-40% conversion.

### 2. Inserir microcopy especifico + garantia visivel

**Como:**
- Botao final = "Pagar R$ 287/ano via Pix" (nao "Confirmar")
- Abaixo do botao: "✓ 7 dias de garantia. Sem perguntas. Devolvemos 100%."
- Proximo ao campo de cartao: "🔒 Pagamento processado por Stripe."

**Esforco:** 2-4 horas. **Impacto:** +15-25% conversion.

### 3. Desenhar (no papel) a sequencia de onboarding 72h

**Como:** mapear os 5 toques (T+0, T+5min, T+24h, T+48h, T+72h) com:
- O que cada email/push diz
- O que entrega de valor real (insight, conexao, conquista)
- Que acao espera do usuario

Sem implementar ainda — **decidir o conteudo primeiro**. Implementacao automation vem depois.

**Esforco:** 1 manha de pensamento. **Impacto:** +20-40pp em retencao M1 quando implementado.

---

## Quality gate (research-quality-checklist)

- [x] Fontes Tier 1-3 majoritarias (Baymard, NN/g, Stripe public, RevenueCat, Pentagram, Brad Frost, RIT)
- [x] Cada topico tem 5+ fontes distintas
- [x] Insights sao FINDING + IMPLICATION + RECOMMENDATION (Insight Crystallization Engine)
- [x] Aplicacao direta no SINAPSE em arquivo dedicado
- [x] Cross-references entre arquivos
- [x] Anti-patterns documentados em cada topico
- [x] Linguagem PT-BR pra Caio, sem jargao desnecessario

---

*Pesquisa conduzida por: research-orqx (Prism). Iluminando o caminho 🔮*
