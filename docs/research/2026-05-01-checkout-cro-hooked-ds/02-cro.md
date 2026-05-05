# 02 — CRO: principios, heuristicas e A/B tests acionaveis

> Conversion Rate Optimization aplicado a subscription/community produto BR.
> Fontes: Nielsen Norman Group, Baymard, ConversionXL/CXL, GoodUI, Booking.com, RevenueCat.

---

## TL;DR

CRO real e disciplina experimental, nao opiniao. Os 3 leverage points com maior ROI documentado: **(1) reduzir friction no form principal** (-1 campo = +10% mobile), **(2) microcopy especifico no CTA** ("Comecar agora" → "Pagar R$ 29,90/mes" = +15-90% em testes), **(3) trust + garantia ao lado do botao final** (+20-42% em casos documentados). Anchor pricing + decoy + popularidade ("mais escolhido") composta gera lift agregado de 30-50% em pricing pages SaaS. Speed perception > speed real: skeleton states + optimistic UI sao mais baratos e impactantes que otimizar back-end.

---

## 1. Principios fundamentais

### Friction reduction (Baymard, NN/g)
Cada interacao requerida do usuario adiciona "friction tax". Friction se acumula:
- Campo extra: +friction cognitiva (recall, decisao)
- Click extra: +friction motora
- Scroll extra: +friction de descoberta
- Decisao extra: +friction de escolha (Hick's Law)

**Regra:** se voce nao consegue justificar um campo/botao/passo com aumento de receita, **remove**.

### Cognitive load (NN/g — 4 principles 2024)

1. **Recognition over recall** — autofill, defaults inteligentes, dropdowns sobre input livre
2. **Chunking** — agrupar campos relacionados (Slack: "Org info" / "Payment")
3. **Progressive disclosure** — mostrar so o relevante naquele momento
4. **Minimize context switching** — nao saltar entre apps/abas

### Decision fatigue (Iyengar & Lepper, jam study)
3-4 opcoes maximo em cada decisao. **Pricing com 2 planos converte mais que 4-5** em ticket baixo SaaS (RevenueCat 2024).

---

## 2. Heuristicas Nielsen aplicadas a checkout

| # | Heuristica | Aplicacao checkout |
|---|---|---|
| 1 | Visibility of system status | Progress bar (multi-step), skeleton states, "Salvando..." |
| 2 | Match real world | "Pagar R$ 29,90" nao "Process subscription" |
| 3 | User control | "Voltar" sempre disponivel, edit inline do plano |
| 4 | Consistency | Mesmo padrao de erro, mesma cor de CTA, mesma fonte |
| 5 | Error prevention | Mascara de cartao, validacao inline, autocomplete |
| 6 | Recognition over recall | Email autopreenche nome se ja cadastrado |
| 7 | Flexibility/efficiency | Apple Pay/Google Pay 1-tap pra power users |
| 8 | Aesthetic & minimalist | Tirar tudo que nao serve a "pagar" |
| 9 | Help users recognize errors | "Cartao recusado pelo banco — tente outro ou Pix" — especifico |
| 10 | Help & docs | Link "duvidas?" minimal, abre side-sheet (nao redireciona) |

---

## 3. Microcopy que converte (CXL + GoodUI + casos documentados)

### Botao primario
- ❌ "Submit" / "Confirmar" / "Continuar"
- ✅ "Pagar R$ 29,90" / "Comecar minha assinatura" / "Garantir minha vaga"
- **Lift documentado:** 15-90% (varia por contexto)

### Campos
- ❌ "Email *" → ✅ "Seu email" (placeholder no label, label visivel)
- ❌ "Phone" → ✅ "Telefone (opcional, pra recuperar conta)" — justifica
- ❌ "Card number" → ✅ "Numero do cartao" + bandeiras visuais

### Erros
- ❌ "Invalid input" / "Erro no servidor"
- ✅ "CPF nao confere — confira os 11 digitos" (especifico + acionavel)
- ❌ "Payment failed"
- ✅ "Banco recusou esse cartao. Tenta outro ou paga via Pix?" (caminho alternativo)

### Trust microcopy proximo ao botao
- "Pagamento seguro via Stripe"
- "7 dias de garantia — devolvemos 100% sem perguntas"
- "Cancela quando quiser, em 1 click"

### Cases documentados (CXL/Unbounce/lineardesign)
- L'Axelle: copy de acao = +93% clicks
- "You" → "Me" no CTA: +90% conversao em alguns casos
- White space ao redor do CTA: +232% em alguns testes

---

## 4. Pricing psychology — anchor, decoy, loss aversion

### Anchor pricing
Primeiro numero ancora todos subsequentes (Tversky & Kahneman 1974). Em pricing page:
- Mostra valor ANCORA alto primeiro (anual, ou plano premium)
- Plano-alvo aparece relativamente "barato"

### Decoy effect (Ariely 2008 — Economist study)
Adiciona terceira opcao deliberadamente pior pra empurrar pra a opcao alvo.

| Setup | Comportamento | Resultado |
|---|---|---|
| Digital US$59 + Print US$125 | 68% escolheu digital | — |
| Digital US$59 + Print US$125 + Print+Digital US$125 | 84% escolheu Print+Digital | Decoy "Print US$125" empurra |

**Aplicacao em SaaS:** plano "popular" no meio destacado, plano caro a direita como ancora, plano free/basico a esquerda como decoy reverso.

### Loss aversion (Kahneman)
Perdas pesam ~2x ganhos. Frame:
- ❌ "Economize R$ 60 no anual"
- ✅ "Voce perde R$ 60 se ficar no mensal" (mais persuasivo, mas eticamente cinzento)
- ✅ Compromisso: "Anual: -33% — voce nao paga R$ X em fees mensais"

### Quando NAO usar
- Audiencia sofisticada (B2B, devs) detecta decoy e perde confianca
- Ticket baixo BR — funciona, mas com moderacao (overuse irrita)
- Comunidade de aprendizado (caso SINAPSE): tom precisa ser honesto, decoy explicito quebra trust

---

## 5. A/B tests classicos — cases publicos

### Booking.com (industria de referencia em CRO)
- 1.000+ experimentos rodando simultaneos
- Mais variantes vivas que humanos que ja viveram
- Padrao: testa **tudo** — copy, cor, posicao, ordem, microcopy
- Lesson: **velocidade de teste** > sofisticacao de cada teste

### Airbnb
- Social proof primario: reviews + ratings em destaque
- A/B testa o que mostrar primeiro (preco vs amenities vs reviews) por segmento

### Shopify
- Live sales notifications ("Maria de SP comprou ha 3min") — FOMO
- Trust badge dinamico (selo "Loja oficial")
- Shop Pay one-click — reduce friction massivo

### Erros comuns em A/B
- Testar mudancas pequenas demais (precisa de N gigante)
- Parar teste cedo (significancia falsa positiva)
- Testar so visual sem mover a metrica de fundo
- Nao segmentar (mobile vs desktop, novo vs retornante)

---

## 6. Speed perception > speed real

### Tecnicas
- **Skeleton states** — mostra estrutura antes do dado (percepcao de velocidade +30%)
- **Optimistic UI** — atualiza UI antes da resposta do server (Twitter, Linear)
- **Progressive enhancement** — content first, JS depois
- **Prefetch** rotas prováveis (hover -> fetch)

### Numeros (Google Core Web Vitals)
- LCP > 2.5s: -7% conversao por segundo extra
- CLS > 0.1: -3% conversao
- FID > 100ms: percepcao de "lag", -2-5%

**Lei de Doherty:** abaixo de 400ms o usuario sente "instantaneo" e a interacao fica viciante.

---

## 7. Recomendacoes priorizadas (impacto x esforco)

| # | Acao | Impacto | Esforco | Quick win? |
|---|---|---|---|---|
| 1 | Garantia visivel ao lado do CTA final | Alto (+20-32%) | Baixo | SIM |
| 2 | Microcopy especifico no botao ("Pagar R$ X") | Alto (+15%) | Baixissimo | SIM |
| 3 | Reduzir form pra 7 campos | Alto | Medio | — |
| 4 | Pix como metodo destacado | Alto BR | Medio | SIM se ja tem |
| 5 | Trust signals no checkout (nao footer) | Medio (+10-20%) | Baixo | SIM |
| 6 | Skeleton + optimistic UI | Medio (+5-10%) | Medio | — |
| 7 | Decoy plano caro como ancora | Medio (+10%) | Baixo | SIM |
| 8 | Live social proof ("X pessoas se inscreveram") | Variavel | Medio | — |
| 9 | Retargeting recovery email se abandono | Alto (10-30% recover) | Alto | — |
| 10 | A/B contínuo de microcopy CTA | Cumulativo | Alto (infra) | — |

---

## Fontes

- [CXL — Beginners Guide to CRO](https://cxl.com/conversion-rate-optimization/)
- [Unbounce — 12 Real CRO Case Studies 2025](https://unbounce.com/conversion-rate-optimization/cro-case-studies/)
- [LinearDesign — 25 CRO Case Studies](https://lineardesign.com/blog/conversion-rate-optimization-case-studies/)
- [NN/g — 4 Principles to Reduce Cognitive Load](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/)
- [NN/g — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Booking.com A/B testing strategy — DevCycle](https://devcycle.com/blog/how-booking-com-a-b-tests-like-nobodys-business)
- [Booking.com A/B testing — InfoQ](https://www.infoq.com/news/2015/11/ab-testing/)
- [Barilliance — Booking.com personalization](https://www.barilliance.com/what-we-can-learn-from-booking-com/)
- [Simon-Kucher — Decoy Pricing](https://www.simon-kucher.com/en/insights/positioning-decoy-pricing-shape-how-customers-perceive-value)
- [RevenueCat — Subscription Pricing Psychology](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/)
- [Varify — Decoy Effect](https://varify.io/en/blog/decoy-effect/)
- [Convertize — Social Proof Marketing](https://www.convertize.com/social-proof-marketing/)
