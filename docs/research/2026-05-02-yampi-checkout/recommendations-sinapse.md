# Aplicação Direta no Checkout sinapse.club

## Contexto sinapse.club

- **Modelo:** SaaS de assinatura recorrente (mensal/anual)
- **Ticket:** R$29,90/mês (anual) ou R$X/mês — pricing baixo, alto volume
- **Pagamento:** Stripe-only (cartão de crédito, Pix em roadmap)
- **Estética:** B&W minimalista, brandbook SINAPSE rule-driven (12 regras)
- **Audiência:** criadores, builders, profissionais BR
- **Objetivo:** maximizar conversão da LP → checkout → assinatura ativa

## Filtro de aplicabilidade Yampi → sinapse

| Padrão Yampi | Aplica? | Por quê |
|---|---|---|
| Compra Fácil (passwordless email) | **SIM** | Stripe Customer Portal + magic link já fazem |
| Pix em primeiro | **SIM** (quando ativar Pix) | Mesmo SaaS, Pix tem 80% conversão |
| CTA "Comprar agora" → adaptado | **SIM** ("Assinar agora") | Verbo de ação imediata |
| Single-page checkout | **SIM** | Stripe Checkout já é |
| Order Bump | **PARCIAL** | Como upgrade de plano, não produto extra |
| Upsell 1-click pós-compra | **SIM** | "Mude pra anual e ganhe 2 meses" |
| Recuperação carrinho | **SIM** | Adaptar para "checkout iniciado, não terminou" |
| Retentativa transparente (cartão) | **SIM** | Stripe Smart Retries (1 toggle) |
| Cashback | **PARCIAL** | Crédito de indicação |
| Cupom colapsado | **SIM** | "Tem cupom?" como link |
| Trust badges contextuais | **SIM** | Selo Stripe, SSL, política compra |
| Tom de voz casual BR | **SIM** | Adaptar pra estética B&W minimalista |
| Frete | NÃO | SaaS digital |
| Endereço físico | NÃO (a menos que NF) | SaaS digital |
| Boleto | NÃO | Recorrência via boleto é caos |
| Order Bump agressivo | NÃO | Quebra confiança em SaaS |
| Contagem regressiva fake | NÃO | Anti-padrão |
| Selos amontoados | NÃO | Quebra estética minimalista |

## Recomendações priorizadas (alto → baixo ROI/esforço)

### Prioridade 1 — Mudanças de copy (esforço: baixo, impacto: médio-alto)

**O que fazer:**
1. Trocar CTA do checkout pra **"Assinar agora"** (não "Finalizar pagamento")
2. Estado disabled do botão: **"Preencha os dados acima"** (não "Por favor preencha campos obrigatórios")
3. Loading state: **"Processando..."** (não "Aguarde, validando seu pagamento")
4. Erro cartão: **"Cartão recusado. Tente outro."** (não "Pagamento não pôde ser concluído")
5. Cupom como link colapsado: **"Tem cupom?"**
6. Email de checkout abandonado: **"{nome}, faltou pouco pra liberar seu acesso"**

**Esforço:** 2-4 horas (achar strings, trocar, testar i18n)
**Impacto esperado:** +2-5% conversão (consenso de A/B tests do mercado em microcopy)

### Prioridade 2 — Stripe Smart Retries (esforço: baixíssimo, impacto: médio)

**O que fazer:**
1. Stripe Dashboard → Settings → Subscriptions → Smart Retries → ON
2. Configurar retry: 1h após falha, 24h depois, 3 dias depois
3. Configurar email automático "Houve um problema com seu pagamento" (template Stripe pronto)

**Esforço:** 30 minutos
**Impacto esperado:** +5-15% recuperação de cartões recusados (equivalente brasileiro do Retentativa Yampi)

### Prioridade 3 — Recuperação de checkout abandonado (esforço: médio, impacto: alto)

**O que fazer:**
1. Capturar email no INÍCIO do checkout (antes de cartão) — Stripe Checkout permite via custom field ou redirecionamento por LP customizada
2. Trigger Stripe webhook `checkout.session.expired`
3. Cron Vercel → enviar email via Resend em 30min, 4h, 24h, 48h
4. Cada email com cupom progressivo: 0% → 5% → 10% → 15%
5. CTA do email: link direto pra checkout pré-preenchido

**Esforço:** 8-16 horas (fluxo + templates + testes)
**Impacto esperado:** +8-12% recuperação de checkouts abandonados (Yampi declara 11%)

### Prioridade 4 — Magic-link / Compra Fácil (esforço: médio, impacto: alto)

**O que fazer:**
1. No checkout: campo email primeiro
2. Se email já tem conta → enviar código 6 dígitos via Resend
3. Cliente cola código → autocompletar nome, dados
4. Stripe Customer pré-existente → cobrança 1-click no cartão salvo

**Esforço:** 16-24 horas (Stripe Customers API + auth flow)
**Impacto esperado:** +10-20% conversão pra usuários recorrentes (renovações, upgrades)

> **Bônus:** elimina necessidade de "cadastro separado". Email + código vira o login do produto inteiro. Reduz fricção de signup.

### Prioridade 5 — Pix como método primário (esforço: médio-alto, impacto: alto)

**O que fazer:**
1. Habilitar Pix no Stripe BR (já disponível desde 2023)
2. Para assinatura recorrente: Stripe permite Pix como first payment, mas renovação ainda exige cartão. Solução: usar Pix pra primeiro mês, cartão pra renovação automática.
3. UI: tab "Pix" antes de "Cartão". Selo "Aprovação em segundos".
4. Mobile: copia-e-cola direto, sem QR.
5. Desktop: QR + copia.

**Esforço:** 16-24 horas (Stripe Pix integration + UI custom)
**Impacto esperado:** +15-30% conversão (Pix tem 80% vs cartão 50-60%)

> **Risco:** Pix em assinatura ainda é maturidade média no Stripe BR. Validar limites antes de prometer.

### Prioridade 6 — Order Bump como upgrade de plano (esforço: médio, impacto: médio)

**O que fazer:**
1. Cliente seleciona plano mensal R$X
2. Antes do CTA, card: "Mude pra anual e economize R$Y" (~17% desconto)
3. Checkbox "Mudar pra anual"
4. Stripe price atualiza dinâmico

**Esforço:** 4-8 horas
**Impacto esperado:** +10-25% LTV (mensal → anual upgrade)

### Prioridade 7 — Trust badges minimalistas (esforço: baixíssimo, impacto: baixo-médio)

**O que fazer:**
1. Próximo ao botão "Assinar agora": ícone cadeado + "Pagamento seguro · Stripe"
2. Rodapé: "Política · Termos · Contato" em cinza claro, sem destaque
3. NÃO amontoar selos. Usar 1-2 elementos de confiança discretos.

**Esforço:** 1-2 horas
**Impacto esperado:** +1-3% conversão (efeito de confiança, marginal mas grátis)

### Prioridade 8 — Página pós-compra com upsell anual (esforço: alto, impacto: médio)

**O que fazer:**
1. Após confirmar plano mensal: página de obrigado com oferta "Upgrade pra anual + 2 meses grátis com 1 clique"
2. Cobrar diferença no cartão já salvo
3. Se rejeita, pedir confirmação leve ("Tem certeza? Você economiza R$X/ano")

**Esforço:** 16-24 horas
**Impacto esperado:** +5-15% upgrade rate

## Roadmap sugerido (4 sprints)

| Sprint | Itens | Tempo | Impacto |
|---|---|---|---|
| **1 (semana 1)** | P1 (microcopy) + P2 (Smart Retries) + P7 (trust badges) | ~6h | +5-12% conversão direta |
| **2 (semana 2-3)** | P3 (recovery carrinho) + P6 (Order Bump anual) | ~12-24h | +10-15% recuperação + upgrade |
| **3 (semana 4-5)** | P4 (magic link Compra Fácil) | ~16-24h | +10-20% retorno |
| **4 (semana 6-8)** | P5 (Pix) + P8 (upsell pós-compra) | ~32-48h | +15-30% conversão Pix |

## O que NÃO fazer (anti-padrões)

1. **Não copiar selos amontoados estilo Hotmart** — quebra estética minimalista B&W
2. **Não usar contagem regressiva fake** — sinapse é sobre confiança, não pressão
3. **Não pedir CPF/endereço se não emite NF** — atrito desnecessário em SaaS digital
4. **Não fazer multi-step wizard** — single-page é superior
5. **Não usar "Por favor", "Prezado"** — quebra tom direto
6. **Não esconder preço final até última etapa** — sinapse é sobre transparência
7. **Não oferecer boleto recorrente** — operacionalmente caótico
8. **Não fazer Order Bump agressivo** — em SaaS B2C/criativo, mata confiança

## Métricas pra trackear pós-implementação

| Métrica | Baseline atual | Meta pós-implementação |
|---|---|---|
| Conversão LP → checkout iniciado | Medir | Manter |
| Conversão checkout iniciado → pago | Medir | +10-20% |
| Taxa de recuperação carrinho abandonado | 0% (não existe) | 8-12% |
| Recuperação cartão recusado (Smart Retries) | 0% (não ativo) | 10-15% |
| % usuários que escolhem Pix (quando ativar) | N/A | 40-60% |
| Upgrade mensal → anual | Medir | +5-15% |
| Tempo médio no checkout | Medir | -20-40% (com Compra Fácil) |

## Compatibilidade com brandbook SINAPSE

Verificação contra as 12 regras do brandbook:

| Regra | Compatível? | Nota |
|---|:---:|---|
| 01 Paleta B&W | OK | Trust badges em cinza, sem cor |
| 02 Preto #0A0A0A | OK | Botão CTA em preto puro permitido |
| 03 Grain SVG 5% | OK | Manter no fundo do checkout |
| 04 Sora · Inter · JetBrains | OK | Tipografia já é brand |
| 05 Tamanhos 11-14 OU 60-180 | ATENÇÃO | Botão CTA pode cair em dead-zone — usar 14px caps ou 60px+ |
| 06 Assimetria | OK | Layout já é assimétrico |
| 07 Motion reversível | OK | Loading states com motion |
| 08 prefers-reduced-motion | OK | Manter |
| 09 Semantic sobre primitive | OK | Tokens semânticos (`--color-cta`) |
| 10 Vignelli (menos componentes) | OK | Reusar Button, Input existentes |
| 11 Grain · crosshair · frame | OK | Frame discreto no checkout |
| 12 Não parecer template | OK | Customizar 100% sobre Stripe |

## Próximos passos recomendados

1. Caio aprovar roadmap (priorizar Sprint 1 para impacto rápido)
2. Delegar pra @developer (Pixel) implementar Sprint 1
3. Configurar tracking de métricas antes da implementação (baseline)
4. Criar story `STORY-{id}-checkout-yampi-style.md` com Sprint 1 como AC

## Fontes consolidadas

Todas as fontes citadas estão nos documentos individuais (01-04). Principais:
- [yampi.com.br/checkout](https://www.yampi.com.br/checkout)
- [help.yampi.com.br](https://help.yampi.com.br/pt-BR/articles/8429566-o-que-e-o-checkout-transparente-da-yampi)
- [Stripe Smart Retries docs](https://stripe.com/docs/billing/revenue-recovery/smart-retries)
- [Stripe Pix BR docs](https://stripe.com/docs/payments/pix)

— Prism, iluminando o caminho 🔮
