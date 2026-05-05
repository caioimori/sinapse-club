# Pesquisa Yampi Checkout — Sumário Executivo

**Data:** 2026-05-02
**Squad:** research
**Profundidade:** DEEP DIVE
**Output:** 6 documentos
**Aplicação:** sinapse.club checkout (Stripe-only, SaaS recorrente)

---

## Contexto

A Yampi é a plataforma brasileira que se posiciona como "checkout transparente líder em vendas no Brasil." Não é gateway, é a CAMADA DE EXPERIÊNCIA em cima do gateway (Mercado Pago, Pagar.me, PagBank, AppMax). É onde mora o aprendizado: tudo que eles fazem é otimização de UX e psicologia de conversão sobre infra que já existe.

## Métricas-âncora declaradas

| Métrica | Valor |
|---|---|
| Conversão checkout (média) | 61% |
| Conversão acesso → pedido (com loja Yampi) | 40% |
| Conversão Pix | 80% |
| Carrinhos abandonados recuperados | +4 milhões / +R$ 90 milhões |
| Pix processado | +R$ 4 bilhões |
| Pedidos totais processados | +100 milhões |
| Retentativa Transparente recuperou | +R$ 54 milhões (até 30% de aprovação a mais) |
| Recuperação carrinho ativa | 11% dos pedidos perdidos |
| Lift Order Bump | até 30% no faturamento |
| Cashback retorno | 14,1% dos clientes voltam em 11 dias |

> Fontes: yampi.com.br/checkout, yampi.com.br/blog/yampi-checkout/, releases.yampi.com.br

## Os 5 insights mais surpreendentes

### 1. Não é o checkout que converte — é a INFRA INVISÍVEL atrás dele
A maior alavanca da Yampi não é o layout, é a **Retentativa Transparente**: quando o cartão é recusado pelo gateway primário, o sistema TENTA SOZINHO em um secundário, sem o cliente saber. Recuperou R$54 milhões. Isso é arquitetura de pagamento, não UX. Lição: **o melhor checkout é aquele onde o cliente nunca vê o erro**.

### 2. "Compra Fácil" é login por email + código de 6 dígitos — sem senha
O cliente recorrente digita o email, recebe código de 6 dígitos, e **todos os dados são preenchidos automaticamente**. Zero senha, zero atrito, zero "esqueci minha senha". Isso é magic link disfarçado de checkout. Para SaaS recorrente, é praticamente o ideal.

### 3. Pix em 80% de conversão domina cartão
Pix tem conversão de 80% no checkout Yampi vs ~50-60% típico de cartão. Eles tratam Pix como **método primário** — QR Code grande no desktop, copia-e-cola direto no mobile (sem QR porque o usuário já tá no celular onde abre o app do banco). Isso muda a hierarquia visual do checkout inteiro.

### 4. O botão CTA é "Comprar agora" — não "Finalizar pedido"
Yampi usa "**Comprar agora**" como CTA primário no botão final. É verbo de **ação imediata**, não de **conclusão de processo**. "Finalizar" implica que o trabalho duro foi do cliente. "Comprar agora" implica que a recompensa é imediata.

### 5. O checkout é DESENHADO PRA SER COPIADO PELO LOJISTA
Yampi não vende layout fixo — vende **um sistema customizável** onde o lojista coloca a marca dele. O checkout "transparente" significa visualmente transparente à marca da loja, não tecnicamente sem redirect. Lição: **não há "checkout Yampi" único — há um framework de checkout que cada loja vira sua versão.**

## As 3 mudanças concretas pro sinapse.club

### Mudança 1: Magic-link de email no checkout (alta prioridade)
Replicar a lógica de "Compra Fácil": ao invés de obrigar criar conta com senha ANTES de pagar, pedir só email → enviar código de 6 dígitos → autocompletar tudo. Para SaaS de assinatura, isso colapsa fricção de signup+checkout em um fluxo só. Stripe Checkout já suporta isso via Stripe Customer Portal + email link.

### Mudança 2: CTA "Assinar agora" + Pix em destaque (média prioridade)
Trocar "Finalizar assinatura" / "Confirmar pagamento" por "**Assinar agora**" (verbo de ação imediata). E mesmo sendo Stripe-only, oferecer Pix como método primário (Stripe BR suporta Pix desde 2023). Posicionar Pix ANTES do cartão na hierarquia visual.

### Mudança 3: Trust badge "pagamento seguro" + retry transparente de cartão (baixa prioridade)
- Adicionar selo discreto de PCI/SSL próximo ao botão final.
- Configurar Stripe Smart Retries (equivalente da Retentativa Transparente): se cartão falha, tenta de novo em 1h e 24h sem ação do cliente. Recupera 10-20% de pagamentos.

## Estrutura desta pesquisa

| Doc | O que tem |
|---|---|
| `01-anatomia-checkout.md` | Layout, sequência de campos, hierarquia visual, mobile vs desktop |
| `02-cro-features.md` | Order bump, upsell 1-click, retentativa, recovery, cashback |
| `03-microcopy.md` | Copy de botões, mensagens, tom, brasilidade |
| `04-comparacao-concorrentes.md` | Yampi vs Hotmart vs Kiwify vs Cartpanda vs Eduzz |
| `recommendations-sinapse.md` | Aplicação direta pro nosso checkout, com priorização |

## Fontes principais

- [Yampi Checkout — página oficial](https://www.yampi.com.br/checkout)
- [15 vantagens do Checkout Yampi](https://www.yampi.com.br/blog/yampi-checkout/)
- [O que é Checkout Transparente — Help Yampi](https://help.yampi.com.br/pt-BR/articles/8429566-o-que-e-o-checkout-transparente-da-yampi)
- [Compra Fácil — Yampi Releases](https://releases.yampi.com.br/a-compra-facil-esta-aqui-4muCXK)
- [Retentativa Transparente — Yampi](https://www.yampi.com.br/blog/retentativa-transparente/)
- [Yampi vs Cartpanda](https://www.yampi.com.br/blog/yampi-ou-cartpanda/)
- [Pix na Yampi](https://help.yampi.com.br/pt-BR/articles/6067638-pix-na-yampi-tudo-que-voce-precisa-saber)
- [Recuperação carrinho — E-Commerce Brasil](https://www.ecommercebrasil.com.br/noticias/recurso-da-yampi-recupera-pedidos-que-seriam-perdidos)

— Prism, iluminando o caminho 🔮
