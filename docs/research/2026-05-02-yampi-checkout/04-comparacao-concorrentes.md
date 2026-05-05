# 04 — Yampi vs Concorrentes (Análise Justa)

## Mapa do mercado BR

| Plataforma | Foco | Modelo |
|---|---|---|
| **Yampi** | E-commerce físico/digital | Checkout transparente sobre gateway |
| **Hotmart** | Infoprodutos digitais | Plataforma fechada com afiliados |
| **Kiwify** | Infoprodutos digitais | Concorrente direto Hotmart, mais leve |
| **Cartpanda** | E-commerce | Concorrente direto Yampi, gateway próprio |
| **Eduzz** | Infoprodutos digitais | Mais antigo, mais corporativo |
| **Monetizze** | Infoprodutos | Foco em afiliados/cupons |
| **Cakto** | Infoprodutos | Player novo, foco em conversão |
| **Vindi** | SaaS recorrente | **Mais próximo do caso sinapse.club** |

> sinapse.club é **SaaS recorrente, não infoproduto, não e-commerce físico**. Por isso a Yampi é referência de UX/CRO mas não de modelo de negócio. Vindi/Stripe são referências de modelo. Yampi é referência de **estética e psicologia de conversão**.

## Comparação dimensão a dimensão

### Conversão declarada

| Plataforma | Taxa publicada |
|---|---|
| Yampi | 61% checkout / 40% acesso → pedido |
| Cartpanda | Não publica número geral |
| Hotmart | Não publica (varia muito por afiliado) |
| Kiwify | "Maior conversão" (sem número) |

> Apenas Yampi publica métrica auditável. Isso é DIFERENCIAL DE MARKETING — eles transformaram conversão em prova social.

### Recursos de CRO nativos

| Recurso | Yampi | Hotmart | Kiwify | Cartpanda | Eduzz |
|---|:---:|:---:|:---:|:---:|:---:|
| Order Bump | Grátis | Pago/Pro | Grátis | Sim | Sim |
| Upsell 1-Click | Grátis | Sim | Sim | Sim | Sim |
| Retentativa Transparente | **Exclusivo** | Não | Não | Parcial | Não |
| Recuperação carrinho | 5 mensagens grátis | Sim (limitado) | Sim | Sim | Sim |
| Compra Fácil (passwordless) | **Sim** | Não | Não | Não | Não |
| Pix Parcelado | Sim | Sim | Sim | Sim | Sim |
| Cashback nativo | Sim | Não | Não | Sim | Não |

### Botão CTA padrão

| Plataforma | CTA |
|---|---|
| Yampi | "Comprar agora" |
| Hotmart | "Comprar agora" / "Pagar com Pix" |
| Kiwify | "Comprar agora" |
| Cartpanda | "Comprar agora" |
| Eduzz | "Finalizar pedido" |
| Stripe Checkout | "Pagar R$ X,XX" |

> "Comprar agora" virou padrão BR. Stripe sem personalização parece estrangeiro.

### Etapas do checkout

| Plataforma | Estrutura |
|---|---|
| Yampi | Single-page, blocos sequenciais |
| Hotmart | Single-page, mais denso (selos, garantias visíveis) |
| Kiwify | Single-page, mais limpo, focado em mobile |
| Cartpanda | Single-page, similar Yampi |
| Eduzz | Multi-step (mais antigo, em processo de migração) |

### Taxas (free tier vs pago)

| Plataforma | Free | Top tier |
|---|---|---|
| Yampi | 2,5% / venda | 1,5% / venda + R$527/mês |
| Cartpanda | 2,5% / venda + R$4,99/mês | 0,5% / venda + R$1.649/mês |
| Hotmart | 9,9% + R$1,00 / venda | Negociado |
| Kiwify | ~5% / venda | ~3,99% / venda |
| Cakto | ~6,99% / venda | Negociado |

### Suporte

| Plataforma | Tempo resposta | Satisfação |
|---|---|---|
| Yampi | 30s média | 96% |
| Hotmart | Variável (chat + tickets) | Não publicado |
| Kiwify | Email/chat | Não publicado |
| Cartpanda | Email business hours | Mais lento (apontado em reviews) |

## Em que Yampi GANHA

1. **Retentativa Transparente** — único player com retry automático em gateway secundário invisível ao cliente
2. **Compra Fácil passwordless** — único com magic-link nativo no checkout
3. **Conversão declarada e auditada** — só player que publica número e mostra dashboard
4. **Suporte humano rápido** — 30s vs concorrentes em horário comercial
5. **Stack CRO grátis no plano free** — Order Bump, Upsell, Recovery sem cobrança extra
6. **Tom de voz casual brasileiro** — mais humano que Eduzz, mais polido que Kiwify
7. **Customização visual completa** — checkout vira extensão da marca da loja, não da Yampi

## Em que Yampi PERDE (sendo justo)

1. **Não é pra recorrência/SaaS** — modelo é one-shot purchase. Pra assinatura recorrente, Vindi/Stripe são melhores.
2. **Taxa free 2,5%** — Cartpanda/Kiwify competem em preço no plano grátis
3. **Sem mercado internacional** — Hotmart ganha em vendas dolarizadas + afiliados globais
4. **Sem programa de afiliados nativo robusto** — Hotmart é imbatível aqui
5. **Marca menos conhecida** que Hotmart fora do círculo de e-commerce
6. **Sem app marketplace forte** — Shopify ganha em diversidade de extensões
7. **Gateway próprio (Yampi Pay) é jovem** — concorrentes têm gateway próprio mais maduro (Hotmart Pay, Cartpanda Pay)

## Aspecto onde Yampi é melhor que Stripe (pro mercado BR)

| Dimensão | Yampi | Stripe Checkout |
|---|---|---|
| Pix nativo otimizado | Pix em primeiro, QR/copia adaptado por device | Pix funciona, sem otimização visual |
| Microcopy português | Casual, brasileiro | Tradução robótica padrão |
| Order Bump nativo | Sim, sem código | Não nativo — precisa custom |
| Compra Fácil | Magic link integrado ao checkout | Customer Portal é separado |
| Tom humano | Sim | Funcional, frio |
| Trust badges BR | PCI BR, Pix oficial BC | Selos genéricos US |

> **Conclusão estratégica:** Stripe é a INFRA. Yampi é a CAMADA HUMANA. Pro sinapse.club, manter Stripe e replicar a camada Yampi por cima.

## O que sinapse.club deve copiar de cada um

| De Yampi | "Comprar agora", Compra Fácil, Pix em primeiro, Order Bump, tom de voz casual |
|---|---|
| **De Hotmart** | Selos de garantia visíveis, contagem de "X pessoas compraram nas últimas 24h" |
| **De Kiwify** | Mobile-first agressivo, checkout em 1 tela só |
| **De Cartpanda** | Hierarquia visual limpa, espaçamento generoso |
| **De Stripe** | Infraestrutura, segurança, retries automáticos, customer portal |
| **De Vindi** | Modelo de assinatura recorrente, gestão de planos |

## O que sinapse.club deve IGNORAR

| Padrão | Por quê não aplica |
|---|---|
| Frete | SaaS digital |
| Endereço físico | Não precisa (apenas se nota fiscal exigir CPF + CEP) |
| Boleto | Recorrência via boleto é caos operacional — manter Pix + cartão |
| Cupom muito visível | sinapse.club é minimalista, cupom colapsado é o caminho |
| Selos amontoados (Hotmart) | Quebra estética B&W minimalista |
| Cashback (modelo e-com) | Substituir por crédito de indicação |
| Order Bump exagerado | Em SaaS B2B/criativo, agressividade quebra confiança |
| Contagem regressiva fake | Anti-padrão. Sinapse é sobre confiança, não pressão. |

## Fontes

- [Yampi vs Cartpanda — comparativo oficial](https://www.yampi.com.br/blog/yampi-ou-cartpanda/)
- [Hotmart vs Kiwify — Cademí](https://cademi.com.br/blog/hotmart-ou-kiwify/)
- [Tactus — Comparativo plataformas digitais](https://tactus.com.br/qual-a-melhor-plataforma-digital/)
- [Negócios Rápido — Hotmart vs Kiwify 2026](https://negociosrapido.com.br/hotmart-ou-kiwify/)
- [Capterra — Yampi reviews](https://www.capterra.com/p/267675/Yampi/)
- [Kataly — Checkout Transparente 2026](https://www.kataly.com.br/blog/checkout-transparente-vs-pro-qual-melhor)
