# 01 — Checkout UX: padroes dominantes 2025-2026

> Pesquisa profunda sobre anatomia de checkout de alta conversao.
> Foco: ticket baixo BR (R$ 29,90/mes), assinatura SaaS/comunidade, mobile-first.

---

## TL;DR (1 paragrafo)

Checkout de alta conversao em 2025 segue 3 leis: **(1) menos campos** (media do mercado: 11.3 — otimo: 7-8); **(2) one-page para ticket abaixo de US$150 / R$800** (multi-step ganha acima disso por endowment effect); **(3) mobile-first BR exige Pix obrigatorio** (40% do GMV ecommerce, 51% projetado pra 2027). O "perceived effort" e o que importa, nao o numero de steps. 65% dos sites lideres ainda performam mediocre ou pior em checkout — a barra e baixissima.

---

## 1. Padroes dominantes (benchmarks 2025-2026)

| Plataforma | Padrao | Quando funciona | Trade-off |
|---|---|---|---|
| **Stripe Checkout** (hosted) | One-page redirect, 40+ metodos, Apple/Google Pay nativos | SaaS rapido, ticket baixo a medio | Branding limitado |
| **Stripe Elements** (custom) | Inline embedded, totalmente brandable | Produto premium, brand forte | Engenharia substancial |
| **Lemon Squeezy** | Overlay modal sobre o site, auto-currency | Indie/microSaaS, time-to-revenue critico | Fee de 5%, branding modesto |
| **Paddle** | Overlay (visualmente datado), 200+ metodos | Cobertura global agressiva | UX abaixo de Stripe |
| **Shopify Checkout** | One-page extendido (pos 2024), Shop Pay | E-commerce fisico/SaaS hibrido | So Shopify ecosystem |
| **Apple Pay sheet** | Native bottomsheet, biometria | iOS, conversao ~2x cards | So Apple ecosystem |
| **Substack/Patreon/Whop** | Embedded gradient card + email-first | Comunidade/conteudo recorrente | Limita upsell complexo |

### Single-page vs multi-step — evidencia 2024 (Stripe + Digismoothie)

| Cenario | Single-page | Multi-step | Diferenca |
|---|---:|---:|---:|
| Geral | 85.2% | 79.7% | +5.5pp single |
| Acima de US$200 | 78.1% | 82.4% | +4.3pp multi |
| Threshold consistente | < US$150 = single ganha | > US$150 = multi ganha | "endowment effect" |

**Fonte:** Stripe (analise de milhoes de sessoes) + Digismoothie analysis 2024.

> **Aplicacao SINAPSE:** R$ 29,90/mes = ticket extremamente baixo. **One-page e a escolha correta.** Nao tem dilema.

---

## 2. Anatomia de form ideal

### Numero de campos
- **Media do mercado:** 11.3 campos (Baymard 2024)
- **Otimo:** 7-8 campos (3 a menos que a media)
- **Cada campo extra:** ~10% drop em conversao mobile (Baymard)
- **22% dos abandonos:** complexidade de checkout
- **18% dos abandonos:** desconfianca com pagamento

### Ordem otima (consenso Baymard + NN/g 2025)

1. **Email** primeiro (anchor de identidade + recuperacao de carrinho)
2. **Nome completo** (1 campo, nao 2 — split aumenta erro mobile)
3. **CPF** (BR — necessario pra emissao de NF e Pix)
4. **Pagamento** (cartao/Pix/boleto)
5. **Senha (se assinatura)** — DEPOIS do pagamento, nao antes

### Field design rules (Baymard)

- **Inline validation** > submit validation (reduz frustacao em 22%)
- **Single column** > 2 colunas (mobile)
- **Autofill aggressive** (autocomplete=email, cc-number, etc)
- **Numeric keyboard** automatico em campos numericos (`inputmode="numeric"`)
- **Mascara de cartao** progressiva (4-4-4-4)
- **Sem perguntas opcionais** no fluxo principal (move pra pos-checkout)

---

## 3. Order summary patterns

| Pattern | Quando usar | Trade-off |
|---|---|---|
| **Sticky lateral** (desktop) | Carrinho com >1 item, valores visuais importantes | Ocupa 30-40% da viewport |
| **Accordion mobile** | Mobile sempre — collapsado por padrao | Esconde info, requer tap |
| **Inline summary** | Single product / single subscription | Lineariza fluxo, ideal pra SaaS |
| **Floating sticky bottom** | Mobile com 1+ item | Total sempre visivel, padrao Shopee/iFood |

> **Aplicacao SINAPSE:** Subscription unica = **inline summary**. Mostrar plano + preco + recorrencia + total NFC, sem accordion.

---

## 4. Trust signals — peso real (Baymard + Crazy Egg + Mailchimp 2024)

| Signal | Lift documentado | Posicionamento otimo |
|---|---:|---|
| SSL badge visivel | +20-42% em algumas categorias | Header + proximo ao botao pagar |
| Garantia de devolucao | +32% (Shopify case) | NEXT TO botao final, nao no footer |
| Testimonials/reviews | 86% dos compradores confia | Acima do form, nao abaixo |
| Selo de pagamento (bandeiras) | +5-10% incremental | Discreto perto do campo cartao |
| Certificacao de privacidade (LGPD) | +10-15% em audiencia BR consciente | Microcopy abaixo do email |

**Lei de ouro (Baymard):** trust signals **proximo ao ponto de ansiedade** (botao pagar) > trust signals em footer/header genericos.

---

## 5. Mobile-first Brasil (~70% trafego, expectativa Pix)

### Peculiaridades documentadas (PCMI/EBANX 2025, Baymard, Stripe)

- **88% dos brasileiros** tem smartphone (95% projetado 2030)
- **Pix = 40-42%** do GMV ecommerce BR (cartao caindo pra 36%)
- **Digital wallets** = metodo de crescimento mais rapido em 2025
- **Boleto:** ainda 7-10% mas em queda livre — manter so como opcao
- **Teclado numerico** automatico essencial (CPF, cartao, CEP)
- **Autenticacao biometrica** (Face ID, fingerprint) reduz friction de cartao em 30%+
- **One-tap (Apple Pay/Google Pay)** converte ~2x vs cartao manual em mobile

### Pix no checkout — anatomia ideal

```
[QR Code grande, centralizado]
[OU "Copiar codigo Pix" — botao secundario]
[Timer regressivo de 10min]
[Status polling: "Aguardando pagamento..."]
[Sucesso automatico ao detectar — sem F5]
```

> **Aplicacao SINAPSE:** Pix obrigatorio. Sem Pix = perde 40%+ de potencial converters BR.

---

## 6. Metricas de conversao por padrao (benchmarks 2025)

### Ecommerce geral BR

| Metrica | p25 | mediana | p75 |
|---|---:|---:|---:|
| Cart abandonment | ~85% | 70% | 60% |
| Checkout abandonment | ~50% | 30% | 20% |
| Conversion rate (visitor→buyer) | 0.8% | 1.5-2% | 3.5% |

### SaaS / subscription (ticket baixo)

| Metrica | p25 | mediana | p75 |
|---|---:|---:|---:|
| Pricing page → checkout | 5% | 12% | 25% |
| Checkout completion | 60% | 80% | 90%+ |
| Trial → paid (se aplicavel) | 15% | 25% | 40%+ |

**Sources:** Nector benchmarks 2025-26, Skailama industry data 2026, Stripe public reports.

---

## 7. Anti-patterns FORBIDDEN (Baymard + NN/g)

- Forcar criacao de conta antes do pagamento (62% dos sites lideres ainda fazem isso = perda massiva)
- Senha obrigatoria com regras complexas no checkout (65% sites lideres erram aqui)
- Esconder shipping/tax ate o final
- Form de cartao em multiplos steps (atomizar)
- Pedir telefone como obrigatorio sem justificativa
- "Delivery speed" em vez de "delivery date" (48% erra)
- CAPTCHA visivel (use invisible v3)
- Botao "Pagar" generico (use "Pagar R$ 29,90" — copy especifico converte +15%)

---

## Fontes

- [Baymard Institute — Checkout Usability Research](https://baymard.com/research/checkout-usability)
- [Baymard — Checkout Form Fields Average](https://baymard.com/blog/checkout-flow-average-form-fields)
- [Baymard — Form Design Best Practices](https://baymard.com/learn/form-design)
- [Baymard — Current State of Checkout UX 2025](https://baymard.com/blog/current-state-of-checkout-ux)
- [Stripe vs Paddle vs Lemon Squeezy comparison](https://medium.com/@muhammadwaniai/stripe-vs-paddle-vs-lemon-squeezy-i-processed-10k-through-each-heres-what-actually-matters-27ef04e4cb43)
- [Lemon Squeezy alternatives 2026](https://affonso.io/blog/lemon-squeezy-alternatives-for-saas)
- [Digismoothie — One-page vs Multi-page Checkout Real Data](https://www.digismoothie.com/blog/one-page-checkout-vs-multi-page-checkout)
- [BOGOS — Shopify Checkout Conversion Rate 2025](https://bogos.io/shopify-checkout-conversion-rate/)
- [PaymentsCMI — Pix in Brazil Statistics 2025](https://paymentscmi.com/insights/pix-in-brazil-latest-statistics-central-bank/)
- [PYMNTS — Pix Surges 53% Brazil 2025](https://www.pymnts.com/news/international/latin-america/2025/pix-surges-53percent-digital-payments-overtake-cards-brazil/)
- [Stripe — Pix payments guide](https://stripe.com/resources/more/pix-replacing-cards-cash-brazil)
- [InPlaySoft — Pix Mobile Brazil iGaming UX](https://inplaysoft.com/knowledgebase/pix-mobile-and-instant-play-how-brazil-is-reshaping-the-igaming-ux)
- [TrustSignals — 77 Trust Signals](https://www.trustsignals.com/blog/77-trust-signals-to-increase-your-online-conversion-rate)
- [Crazy Egg — 5 Trust Signals](https://www.crazyegg.com/blog/trust-signals/)
