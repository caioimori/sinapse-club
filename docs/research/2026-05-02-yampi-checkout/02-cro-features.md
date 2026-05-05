# 02 — Recursos de CRO (Conversion Rate Optimization)

A Yampi não vende um checkout — vende uma **stack de conversão**. Cada feature abaixo é uma alavanca isolada que pode ser ativada/desativada.

## Mapa de alavancas

| Feature | Lift declarado | Custo no plano | Aplicável a SaaS? |
|---|---|---|---|
| Retentativa Transparente | +30% aprovação cartão | Grátis em todos os planos | Sim (Stripe Smart Retries equivalente) |
| Order Bump | +30% faturamento | Grátis | Parcialmente (upgrade plan) |
| Upsell 1-Click | até 30% ticket médio | Grátis | Sim (cross-sell de add-ons) |
| Recuperação carrinho abandonado | 11% dos perdidos | Grátis | Sim (email recovery) |
| Cashback nativo | 14,1% retornam em 11 dias | Grátis | Parcial (créditos pra renovação) |
| Pix Parcelado | Aumenta acessibilidade | Via parceiros | Não (sinapse é cartão) |
| Compra Fácil | Reduz abandono em retorno | Grátis | Sim (magic link) |

## 1. Retentativa Transparente (a alavanca mais subestimada)

**O que é:** quando o cartão é recusado pelo gateway primário, o sistema automaticamente tenta no gateway secundário. Cliente NÃO vê o erro, NÃO digita cartão de novo. Acontece atrás da cena em <2 segundos.

**Resultado:** R$54+ milhões recuperados desde 2021. Até 30% de melhoria na aprovação de cartão.

**Requisito:** lojista precisa ter pelo menos 2 gateways configurados (ex: Mercado Pago + Pagar.me).

**Equivalente Stripe:** Smart Retries + Network Tokens + Adaptive 3DS. Configurável em Settings → Recovery.

> Fonte: [Yampi Releases — Retentativa](https://releases.yampi.com.br/retentativa-transparente:-menos-recusas-de-cartao-38MX60)

## 2. Order Bump

**O que é:** card de oferta complementar exibido NO checkout, após escolha de pagamento e antes do CTA. Checkbox "Adicionar ao pedido".

**Posicionamento psicológico:** o cliente já está com cartão na mão. Adicionar mais um produto barato (R$10-50) tem custo cognitivo mínimo.

**Lift:** até 30% no faturamento (claim Yampi). Caso Always Fit: ticket médio de R$79 → R$120 ao implementar Order Bump.

**Configuração:**
- Lojista escolhe produto complementar
- Define preço especial (vs preço cheio riscado)
- Define microcopy de urgência ("Só nesta compra")
- Order Bump aparece em qualquer plano (gratuito)

**Aplicação SaaS:** "Adicione 12 meses de [feature premium] por mais R$X" no checkout do plano base.

## 3. Upsell 1-Click

**O que é:** APÓS confirmar a compra, antes da página de obrigado, aparece tela com oferta de produto **superior ou complementar**. Cliente clica em "Sim, adicionar" e o sistema **cobra o cartão que ele acabou de usar — sem digitar de novo**.

**Diferença do Order Bump:** Order Bump = ANTES de comprar. Upsell 1-Click = DEPOIS de comprar (mas no mesmo fluxo, sem refazer pagamento).

**Lift:** aumento expressivo no ticket médio (citado +30%).

**Aplicação SaaS:** Após confirmar plano mensal, oferecer "Mude pra anual e ganhe 2 meses grátis" com 1 clique.

## 4. Recuperação de Carrinho Abandonado

**Stack de mensagens:** total de **5 disparos** automáticos:

| # | Canal | Timing após abandono |
|---|---|---|
| 1 | Email | 30 minutos |
| 2 | Email | 4 horas |
| 3 | SMS | 24 horas |
| 4 | Email | 48 horas |
| 5 | Email (último) | 7 dias |

**Personalização por etapa:**
- Cupom de desconto específico por mensagem (escala: 5% → 10% → 15%)
- Microcopy customizável
- CTA com link direto pro checkout pré-preenchido

**Resultado:** +4 milhões de carrinhos recuperados. R$90 milhões em vendas resgatadas. Taxa de recuperação ~11%.

**Aplicação SaaS:** mesma lógica, só que pra "trial expirou sem upgrade" ou "iniciou checkout e não terminou". Cupom progressivo funciona.

> Fontes: [Yampi — Recuperação carrinho](https://help.yampi.com.br/pt-BR/articles/6067044-como-configurar-e-personalizar-o-envio-dos-carrinhos-abandonados), [E-Commerce Brasil — 11%](https://www.ecommercebrasil.com.br/noticias/recurso-da-yampi-recupera-pedidos-que-seriam-perdidos)

## 5. Cashback Nativo

**O que é:** percentual da compra vira crédito na loja. Crédito é usado em compra futura.

**Resultado:** 14,1% dos clientes que recebem cashback voltam pra comprar. Tempo médio de retorno: 11 dias.

**Aplicação SaaS:** crédito de "1 mês grátis na renovação se indicar amigo". Funciona como NPS+retention.

## 6. Compra Fácil (login passwordless)

**O que é:** cliente recorrente digita só email → recebe código 6 dígitos → todos os campos preenchidos.

**Aplicação SaaS:** PERFEITO. Replicar no sinapse.club checkout. Stripe + Resend já fazem isso.

## 7. Pix Parcelado

**O que é:** cliente sem cartão pode parcelar via Pagaleve/Koin. Lojista recebe 100% no D+1.

**Aplicação SaaS:** baixa prioridade, mas considerar se ticket anual for alto (R$300+).

## 8. Outros recursos não-CRO mas relevantes

- **Cupom de desconto:** campo COLAPSADO por padrão ("Tem cupom?" como link). Evita lembrar cliente que existe desconto se ele não tem cupom.
- **Frete grátis acima de X:** progress bar no resumo ("Falta R$50 pra frete grátis")
- **Desconto progressivo:** "Compre 2 e ganhe 10%, compre 3 e ganhe 15%"
- **Retirada em loja:** alternativa a frete (não aplicável a SaaS)
- **Área do Cliente:** histórico, status, segunda via — acessível por email + código (mesmo padrão Compra Fácil)
- **WhatsApp Business integração:** notifica status do pedido pelo Whats
- **E-mail transacional automático:** confirmação, rastreamento, status — zero ação do lojista

## Hierarquia de impacto pra SaaS

Se eu tivesse que ranquear pra sinapse.club (apostando em ROI/esforço):

1. **Compra Fácil (passwordless email)** — alto impacto, baixo esforço (Stripe Customer Portal já tem)
2. **Stripe Smart Retries** — alto impacto, zero esforço (1 toggle)
3. **Recuperação carrinho via email** — alto impacto, médio esforço (Resend + cron)
4. **Order Bump no checkout** — médio impacto, médio esforço (custom UI no Stripe Checkout)
5. **Upsell 1-click pós-compra** — médio impacto, alto esforço (página custom)
6. **Cupom colapsado** — baixo impacto, baixíssimo esforço (1 linha CSS)

## Fontes

- [Yampi Checkout — página oficial](https://www.yampi.com.br/checkout)
- [15 vantagens Checkout Yampi](https://www.yampi.com.br/blog/yampi-checkout/)
- [Order Bump Yampi](https://www.yampi.com.br/blog/order-bump/)
- [Upsell 1-Click](https://help.yampi.com.br/pt-BR/articles/6067059-como-configurar-o-upsell-one-click)
- [Funil de Recuperação](https://www.yampi.com.br/blog/funil-recuperacao-carrinho-abandonado/)
- [Retentativa Transparente](https://www.yampi.com.br/blog/retentativa-transparente/)
- [Always Fit — Case Order Bump](https://www.yampi.com.br/blog/always-fit/)
