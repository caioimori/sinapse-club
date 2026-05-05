# 01 — Anatomia do Checkout Yampi

## Estrutura geral

Single-page checkout (uma única URL/tela) com **blocos sequenciais empilhados verticalmente**, não wizard multi-step. Largura fixa de **1200px** (atualizada em 2024 do antigo 1040px). Fundo branco padrão, customizável por marca.

## Sequência de blocos (top → bottom)

| Ordem | Bloco | Campos | Obrigatório? |
|---|---|---|---|
| 1 | **Identificação** | Email + (opcional: código Compra Fácil) | Sim |
| 2 | **Dados pessoais** | Nome completo, CPF/CNPJ, telefone, data nascimento (opcional) | Configurável |
| 3 | **Endereço de entrega** | CEP (autopreenche via API ViaCEP), rua, número, complemento, bairro, cidade, UF | Configurável (pode ocultar pra produto digital) |
| 4 | **Frete** | Lista de opções com prazo + valor | Aparece só se há entrega física |
| 5 | **Pagamento** | Tabs: Pix · Cartão · Boleto · Pix Parcelado | Sim |
| 6 | **Order Bump** | Card de oferta complementar com checkbox | Opcional (visível se configurado) |
| 7 | **Resumo** | Itens, subtotal, desconto, frete, total | Sim (lateral em desktop, embaixo em mobile) |
| 8 | **CTA final** | "Comprar agora" | Sim |

## Bloco 1 — Identificação (Compra Fácil)

O primeiro campo é **email**. Se o cliente já comprou antes, aparece prompt:

> "Já comprou aqui antes? Te enviamos um código pra preencher tudo automaticamente."

Cliente digita email → recebe **código de 6 dígitos** por email → cola no checkout → **todos os campos abaixo (nome, CPF, endereço, etc.) ficam pré-preenchidos**. Zero senha. Zero gestão de conta. É magic-link operando como autopreenchimento.

> Fonte: [Releases Yampi — Compra Fácil](https://releases.yampi.com.br/a-compra-facil-esta-aqui-4muCXK)

## Bloco 5 — Pagamento (hierarquia)

A ordem dos métodos NÃO é alfabética nem padrão Stripe. É:

1. **Pix** (primeiro, com selo de "instantâneo")
2. **Cartão de Crédito**
3. **Boleto**
4. **Pix Parcelado** (via Pagaleve, Yampi Pay, Koin)

Por quê Pix primeiro? Porque tem **80% de conversão** vs ~55% de cartão. Yampi otimiza pelo método que mais converte, não pelo que parece "padrão".

### Apresentação do Pix
- **Desktop:** QR Code grande + botão "Copiar código Pix" embaixo
- **Mobile:** APENAS o botão "Copiar código Pix" (sem QR — o usuário já tá no celular onde abre o app do banco direto)

> Esse detalhe mobile é crítico: mostrar QR no mobile é UX morto. Yampi reconheceu isso.

### Apresentação do Cartão
- Campos em ordem: número → validade → CVV → nome impresso → parcelas
- Bandeira detectada automaticamente após 4 primeiros dígitos
- Parcelas com cálculo de juros visível (ex: "10x de R$50 sem juros" ou "12x de R$55 com juros")

## Bloco 6 — Order Bump

Aparece **após selecionar método de pagamento**, ANTES do botão final. É um card destacado com:
- Imagem do produto complementar
- Nome curto
- Preço com desconto vs preço cheio (riscado)
- Checkbox "Adicionar ao pedido"
- Microcopy de urgência ("Oferta exclusiva só nesta compra")

A posição é estratégica: o cliente já decidiu pagar, está com cartão na mão, custo psicológico de adicionar mais R$X é mínimo.

## Bloco 8 — CTA Final

- **Copy:** "Comprar agora" (não "Finalizar pedido", não "Confirmar")
- **Cor:** customizável pelo lojista (default verde/azul de marca)
- **Tamanho:** ocupa largura total do bloco de pagamento (~50% da viewport desktop, 100% mobile)
- **Estado:** disabled enquanto campos obrigatórios não preenchidos, com microcopy "Preencha os dados acima"
- **Loading:** após click, vira "Processando..." com spinner — NÃO redireciona

## Trust elements (posições visuais)

| Elemento | Posição |
|---|---|
| Selo PCI Compliant | Rodapé do checkout, abaixo do CTA |
| Selo SSL/cadeado | Header próximo ao logo da loja |
| Logos das bandeiras (Visa/Master/Elo) | Junto do tab "Cartão" |
| Selo Pix oficial (Banco Central) | Junto do tab "Pix" |
| Política de devolução | Link no rodapé, em cinza claro |
| Selo "Compra 100% segura" | Próximo ao botão final |

## Mobile vs Desktop

| Aspecto | Desktop | Mobile |
|---|---|---|
| Layout | 2 colunas: campos esquerda, resumo direita (sticky) | 1 coluna, resumo colapsado no topo (expansível) |
| Pix | QR + copia/cola | Apenas copia/cola |
| CTA | Largura do bloco de pagamento | 100% da viewport, sticky no rodapé |
| Order Bump | Card horizontal | Card vertical |
| Largura total | 1200px | Full-width |

## Tipografia e cores (defaults)

Yampi NÃO impõe tipografia/cor — entrega o checkout customizável onde o lojista define:
- Cor primária (botões, links, destaques)
- Cor secundária (estados hover, badges)
- Tipografia (system fonts default ou fonte customizada)
- Logo no header
- Cores de fundo, header, rodapé

> O "design Yampi" é INVISIBILIDADE: parecer continuação da loja, não outra marca. Esse é o core do "transparente".

## Performance

- Uptime declarado: **99,9%**
- Otimização Black Friday explícita (suporta picos de tráfego)
- Mobile-first com botão de compra flutuante e carrinho lateral

## Diferenciais visuais resumidos

1. Sequência sempre: Email → Dados → Endereço → Frete → Pagamento → CTA
2. Compra Fácil colapsa 6 blocos em 1 (email + código)
3. Pix antes de cartão (contra-intuitivo, mas converte mais)
4. CTA "Comprar agora" verbo de ação imediata
5. Order Bump entre pagamento e CTA (timing de menor resistência)
6. Resumo sticky em desktop, colapsável em mobile
7. Trust badges segregados por contexto (junto do método de pagamento, não amontoados)

## Fontes

- [Help Yampi — Checkout Transparente](https://help.yampi.com.br/pt-BR/articles/8429566-o-que-e-o-checkout-transparente-da-yampi)
- [Help Yampi — Compra Fácil](https://help.yampi.com.br/pt-BR/articles/6067047-como-preencher-as-configuracoes-gerais-do-checkout)
- [Help Yampi — Pix](https://help.yampi.com.br/pt-BR/articles/6067638-pix-na-yampi-tudo-que-voce-precisa-saber)
- [Releases — Layout 1200px](https://releases.yampi.com.br/layout-de-loja-checkout-padronizados-3EQfKw)
- [Empreender — Diferenciais Yampi](https://empreender.com.br/como-e-o-checkout-transparente-da-yampi/)
- [SuperFrete — Checkout Yampi](https://superfrete.com/blog/checkout-yampi)
