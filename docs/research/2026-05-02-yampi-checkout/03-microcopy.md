# 03 — Microcopy do Checkout Yampi

## Princípio geral

Português brasileiro **direto, sem formalidade excessiva, sem corporativês**. Verbos no imperativo positivo. Curta e clara. Brasilidade discreta (não "manolês" infoproduto, não "vossa senhoria").

## Catálogo de microcopy observado

### Botão CTA principal
> **"Comprar agora"**

NÃO usa: "Finalizar pedido", "Confirmar compra", "Concluir", "Próximo".

**Análise:** "Comprar" é o verbo da ação central do site. "Agora" injeta urgência sem ser agressivo. "Finalizar" implicaria que o cliente está em um processo longo — Yampi quer dar sensação de "rápido e direto".

### Bloco de identificação
> **"Já comprou aqui antes?"**
> **"Te enviamos um código pra preencher tudo automaticamente."**

Tom: pessoal, segunda pessoa, contração ("pra"). Sem "Por favor digite seu email" — apenas o campo com label "E-mail".

### Estado do botão (disabled)
> **"Preencha os dados acima"**

NÃO usa: "Campo obrigatório não preenchido", "Erro de validação".

### Loading state
> **"Processando..."**

NÃO usa: "Aguarde, estamos validando seu pedido", "Por favor aguarde".

### Erros de cartão
> **"Cartão recusado. Tente outra forma de pagamento."**
> **"Verifique os dados do cartão."**

Conciso. Sem culpa, sem técnica.

### Order Bump
> **"Oferta exclusiva só nesta compra"**
> **"Adicionar ao pedido"** (label do checkbox)
> **"Aproveite agora"** (subtitle de urgência)

### Recuperação de carrinho (emails)
> Assunto típico: **"{Nome}, você esqueceu algo no carrinho 🛒"**
> Body: **"Olá {nome}! Notamos que você deixou alguns produtos pra trás. Que tal finalizar agora?"**
> CTA do email: **"Voltar ao carrinho"** ou **"Continuar minha compra"**

Tom: casual, segunda pessoa, emoji ocasional. Sem "Prezado cliente, identificamos uma transação não concluída".

### Cupom
> **"Tem cupom de desconto?"** (label colapsado, ação: clique pra abrir)

Não diz "Insira seu código de desconto". Pergunta — assume que muita gente não tem cupom e não quer atrito visual.

### Frete grátis (progress bar)
> **"Falta R$ XX,XX pra frete grátis 🚚"**

Imperativo positivo. Mostra quanto falta, não quanto já tem.

### Pix
> **"Pagamento aprovado em segundos"** (subtitle do método)
> **"Copiar código Pix"** (botão)
> **"Aponte a câmera do seu app pro QR Code"** (instrução desktop)

### Confirmação pós-compra
> **"Pedido confirmado! 🎉"**
> **"Enviamos os detalhes pro seu e-mail."**

### Área do cliente
> **"Acompanhe seu pedido"** (link do email)
> **"Digite o código que enviamos pro seu e-mail"** (login)

## Padrões linguísticos

| Padrão | Exemplo | Por quê |
|---|---|---|
| Contrações coloquiais | "pra" em vez de "para" | Soa humano, brasileiro |
| Segunda pessoa direta | "você", "seu" | Conversacional, próximo |
| Verbos no imperativo | "Adicione", "Copie", "Confirme" | Direção clara, sem ambiguidade |
| Emojis ocasionais | 🛒 🎉 🚚 | Quebra formalidade, contexto visual |
| Frases curtas (<10 palavras) | Toda mensagem | Mobile-friendly, lido rápido |
| Sem ponto final em labels | "E-mail", "CPF" | Limpeza visual |
| Pergunta retórica | "Tem cupom de desconto?" | Reduz fricção (pergunta vs imposição) |

## O que Yampi NUNCA escreve

- "Por favor"
- "Prezado cliente"
- "Identificamos uma inconsistência"
- "Sua transação não pôde ser processada neste momento"
- "Em caso de dúvidas, entre em contato"
- "Política de privacidade" (em destaque — fica no rodapé pequeno)
- "Termos e condições" (idem)
- "Confirme que você não é um robô"

## Comparação com concorrentes (microcopy)

| Plataforma | Botão CTA | Tom geral |
|---|---|---|
| **Yampi** | "Comprar agora" | Direto, casual, ação imediata |
| **Hotmart** | "Comprar agora" / "Pagar com Pix" | Direto mas com mais selos/disclaimers |
| **Kiwify** | "Comprar agora" / "Finalizar compra" | Limpo, levemente mais formal |
| **Cartpanda** | "Comprar agora" | Similar Yampi |
| **Eduzz** | "Finalizar pedido" | Mais formal/corporativo |
| **Stripe Checkout (default)** | "Pagar R$X,XX" | Funcional, frio, sem personalidade |

> Yampi ganha em tom **humano** sem perder em **clareza**. Stripe ganha em clareza mas perde em personalidade. Para SaaS BR, replicar tom Yampi sobre infra Stripe é o sweet spot.

## Recomendações de microcopy pro sinapse.club

### Trocar
| Antes (provável padrão) | Depois (estilo Yampi) |
|---|---|
| "Finalizar assinatura" | **"Assinar agora"** |
| "Confirmar pagamento" | **"Assinar agora"** ou **"Liberar acesso"** |
| "Insira seu e-mail" | **"E-mail"** (sem instrução, label only) |
| "Sua compra está sendo processada, aguarde" | **"Processando..."** |
| "Pagamento não pôde ser concluído" | **"Cartão recusado. Tente outro."** |
| "Possui cupom de desconto?" | **"Tem cupom?"** |
| "Política de privacidade e termos" | **"Política"** + **"Termos"** (rodapé pequeno) |
| "Bem-vindo! Por favor, faça login" | **"Já tem conta? Te enviamos um código."** |

### Manter (estilo Sinapse)
- Brand voice: minimalista, B&W, sem emoji excessivo no produto core
- Emojis OK em emails de recovery, mas evitar no checkout principal
- "Você" mantém, "pra" pode soar muito casual pra audiência B2B/SaaS — testar "para"

## Fontes

- [Yampi Checkout — homepage](https://www.yampi.com.br/checkout)
- [Help Yampi — Configurações](https://help.yampi.com.br/pt-BR/articles/6418330-como-personalizar-o-seu-checkout-da-yampi)
- [Help Yampi — Mensagens carrinho abandonado](https://www.yampi.com.br/blog/mensagem-de-carrinho-abandonado/)
- [Pagaleve — Teste seu checkout](https://docs.pagaleve.com.br/docs/teste-seu-checkout-4) (cita "Comprar agora" como CTA padrão)
