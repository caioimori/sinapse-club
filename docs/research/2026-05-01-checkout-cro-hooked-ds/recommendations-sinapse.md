# Recomendacoes praticas — checkout SINAPSE.club

> Aplicacao direta dos 5 topicos de pesquisa no contexto atual: subscription R$ 29,90/mes, audiencia BR, comunidade paga, brand B&W absoluto.

---

## Contexto atual (Abril 2026)

- Plataforma pronta, soft launch iminente
- Ticket: R$ 29,90/mes (anual ~R$ 358 com possivel desconto pra ~R$ 287/anual = -20%)
- Audiencia BR ~70% mobile, expectativa Pix
- Brand: B&W absoluto, Sora/Inter/JetBrains, grain, faixa 32-48px proibida
- Stack: Next.js + Supabase + (provavelmente) Stripe
- Forum: gate total ja implementado pos-paywall (#41, #40)

---

## Tres recomendacoes imediatas (prioridade dessa semana)

### Recomendacao 1 — One-page checkout com Pix obrigatorio em destaque

**Por que:** ticket abaixo de R$ 800 (Stripe threshold ~US$150), one-page tem +5.5pp de conversao. BR sem Pix perde 40% do mercado. Audiencia mobile-first nao tolera multi-step.

**O que fazer:**
- Stripe Checkout hosted (rapido) OU Stripe Elements custom (se brand for prioridade)
- Pix como **primeira opcao visivel**, nao escondido em "outras formas"
- Cartao como segunda opcao
- Boleto: opcional, escondido em "ver mais opcoes"
- Form com 7 campos max: email, nome, CPF, plano, metodo pagto + dados do metodo
- **Mock visual:**
  ```
  ┌─────────────────────────────────────┐
  │  SINAPSE                            │
  │                                     │
  │  Seu email *                        │
  │  [____________________]             │
  │                                     │
  │  Seu nome completo                  │
  │  [____________________]             │
  │                                     │
  │  CPF                                │
  │  [___.___.___-__]                   │
  │                                     │
  │  ┌─ Plano selecionado ─────────┐    │
  │  │ ○ Mensal R$ 29,90/mes       │    │
  │  │ ● Anual R$ 287/ano (-20%)   │    │
  │  │   Por R$ 23,90/mes          │    │
  │  └─────────────────────────────┘    │
  │                                     │
  │  Pagamento                          │
  │  ┌─ [● Pix] [○ Cartao] ──────┐      │
  │  │ [QR Code] [Copiar codigo] │      │
  │  └────────────────────────────┘     │
  │                                     │
  │  [Pagar R$ 287/ano via Pix]         │
  │                                     │
  │  🔒 Pagamento seguro Stripe         │
  │  ✓ 7 dias de garantia, devolvemos   │
  │    100% sem perguntas               │
  └─────────────────────────────────────┘
  ```

**Impacto esperado:** +20-30% conversion vs multi-step generico. +40% potencial BR market vs sem Pix.

---

### Recomendacao 2 — Microcopy especifico + garantia ao lado do CTA

**Por que:** lift documentado de 15-32% em testes publicos (Shopify, L'Axelle, CXL). Custo: 1 hora de copy + UI shift.

**Acoes:**
1. Botao final: **"Pagar R$ 287/ano via Pix"** (especifico, nao "Confirmar")
2. Microcopy de garantia **diretamente abaixo do botao** (nao no footer):
   - "✓ 7 dias de garantia. Sem perguntas. Devolvemos 100%."
3. Microcopy de seguranca proximo ao campo de cartao:
   - "🔒 Pagamento seguro processado por Stripe. Nao guardamos seu cartao."
4. Mensagem de erro especifica (nao generica):
   - ❌ "Pagamento recusado"
   - ✅ "Banco recusou esse cartao. Tenta outro ou paga via Pix?"
5. CTA secundario "Continuar via mensal R$ 29,90" como fallback se anual nao convertir

**Trust signals que importam (em ordem de impacto):**
1. Garantia 7 dias visivel ao lado do botao final
2. "Cancela quando quiser, em 1 click" microcopy
3. Selo SSL/Stripe perto do form de pagto
4. Numero de membros ("X+ membros ativos") se for ≥ 100 — caso contrario nao mencionar

**Impacto esperado:** +15-25% conversion incremental sobre Recomendacao 1.

---

### Recomendacao 3 — Onboarding de 72h pos-pagamento (formacao de habito)

**Por que:** ciclo Hooked se forma nas primeiras 72h. Sem ele, churn anual sera 60-80%. Investimento minimo, ROI gigante na LTV.

**Sequencia:**

| Momento | Trigger | Acao desejada | Reward |
|---|---|---|---|
| **T+0min** (pos-pagto) | Tela de boas-vindas in-app | Ler 1 post curado pelo Caio | "Voce e o membro #X. Bem-vindo." |
| **T+5min** | Email "Bem-vindo + primeiro insight" | Voltar pro forum | Insight exclusivo de quality alta |
| **T+24h** | Push/email "X comentou no post que voce leu ontem" | Engajar com comentario | Tribe reward (alguem te incluiu) |
| **T+48h** | Email do Caio direto (parece pessoal) | Postar primeiro pensamento | Self reward (autoria) |
| **T+72h** | "Sua primeira semana — voce ganhou X XP" | Manter streak | Mestria + loss aversion (streak) |

**Investments capturados ao longo dos 72h:**
- Profile (foto, bio)
- Primeiro post
- Primeiras conexoes (follows)
- Primeiro comment
- XP acumulado

**Anti-pattern:** mandar 5 emails em 72h sem valor real = unsubscribe. Cada trigger precisa de **valor concreto** (insight, mensagem que parece pessoal, conexao social genuina).

**Impacto esperado:** retencao M1 (mes 1) +20-40pp. Em ticket R$ 29,90, isso significa LTV indo de ~R$ 60 (2 meses) pra R$ 180+ (6 meses).

---

## Recomendacoes secundarias (mes 1)

### Pricing page

- **Anchor pricing visivel:** mostrar mensal R$ 29,90 com **anual R$ 23,90/mes (-20%)** ao lado, badge "Mais escolhido" no anual
- **Decoy reverso:** considerar plano "free trial 7 dias" gratis como decoy que valoriza a opcao paga
- **Social proof real:** se ≥ 100 membros, mostrar "X membros ativos". Se nao, nao mostrar (numero baixo gera duvida)
- **Garantia visivel:** "7 dias pra cancelar e receber 100% de volta" no plano page, nao so no checkout

### Forum (Hooked aplicado)

- Algoritmo de feed com **variability deliberada** — destacar posts inesperados, nao so o mais recente
- Drops de conteudo do Caio em **horarios variados** (nao "toda terca 10h" — vira esperado)
- Notificacoes contextuais (alguem reagiu, mencionou, novo post de quem voce segue)
- Streak de leitura/post visivel no perfil
- Leaderboard semanal de XP

### Design system

- **Componentizacao Vignelli-aware:** poucos componentes flexiveis com variantes claras, nao 80 componentes especificos
- **Tokens em 3 camadas** (primitive → semantic → component) seguindo W3C DTFM
- **Validation gate em CI:** lint que bloqueia hardcoded color/spacing — forca uso de token
- **Brandbook como Constitution**, DS como codigo (ja e o padrao SINAPSE)

### Tipografia

- **Validar que rule 05 ta sendo cumprida** — auditoria de tamanhos de fonte na plataforma. Faixa 32-48px proibida ainda esta sendo respeitada?
- **Fluid clamp** em todos os breakpoints (nao usar tamanho fixo)
- **Modular scale 1.333 (Perfect Fourth)** se ainda nao ta definido

---

## Roadmap sugerido (90 dias)

**Semana 1-2:** Recomendacoes 1, 2, 3 (checkout + onboarding)
**Semana 3-4:** Pricing page anchoring + Pix integration validation
**Mes 2:** Forum variability + onboarding email automation maturada
**Mes 3:** A/B test infra + primeiro teste sistematico (microcopy CTA)

---

## Metricas pra acompanhar

| Metrica | Baseline esperado | Meta 90 dias |
|---|---|---|
| Pricing → checkout | 12% (mediana SaaS) | 18%+ |
| Checkout completion | 60-70% (sem Pix) | 80%+ (com Pix one-page) |
| Trial-to-paid (se aplicavel) | 25% | 35%+ |
| Churn M1 | 30-40% (sem onboarding) | 15-20% (com onboarding 72h) |
| LTV (12 meses) | R$ 100-150 | R$ 250+ |

---

## O que NAO fazer

- **Nao introduzir multi-step checkout** — ticket baixo, nao ha justificativa
- **Nao esconder Pix** atras de "outras formas" — e a opcao primaria do publico BR
- **Nao copiar UI de Stripe/Vercel sem entender** — adaptar principios, manter brand SINAPSE
- **Nao adicionar 5 testimonials genericos** se nao tem 100+ membros — quality > quantity
- **Nao usar decoy pricing agressivo** com audiencia de aprendizado — quebra trust
- **Nao subir email automation sem conteudo real** — spam aliena
- **Nao montar A/B test infra antes** de ter trafico significativo (>1k/mes em pricing) — N pequeno = falso positivo

---

*Cross-references: [01-checkout-ux.md](./01-checkout-ux.md), [02-cro.md](./02-cro.md), [03-hooked-framework.md](./03-hooked-framework.md), [04-design-systems.md](./04-design-systems.md), [05-design-principles.md](./05-design-principles.md)*
