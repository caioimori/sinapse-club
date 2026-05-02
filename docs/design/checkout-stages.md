# Checkout — Stages & Wireframes

Refinamento minimalista (Vignelli) de todo o fluxo de checkout. Hierarquia 100% tipografica, zero cards aninhados, zero bordas redundantes. Brandbook regras 04, 05, 06, 09, 10, 11.

Preview ao vivo (dev only): `http://localhost:3001/dev/checkout-stages`

---

## Filosofia

> "If you can design one thing, you can design everything. There's only one way to design — and it's the right way." — Massimo Vignelli

- **Tipografia carrega a hierarquia.** Nao usamos cor, sombra, ou borda como hierarquia primaria.
- **Zero card-em-card.** Bordas existem para separar grandes regioes (sidebar | form), nao para empacotar conteudo dentro de regioes.
- **Microcopy em mono uppercase tracking 0.14em.** Substitui icones decorativos.
- **Preco grande.** Anchor visual da pagina inteira.
- **Faixa proibida 32-48px** (regra 05). Headlines vao a 60-180px ou ficam em 11-28px.

---

## Etapa 1 — Identidade + plano

```
┌─────────────────────────┬───────────────────────────────────┐
│ TROCAR PLANO            │ PAGAMENTO                         │
│                         │                                   │
│ PLANO                   │ Crie sua conta e pague            │
│ Anual                   │                                   │
│ (60-120px Inter         │ ┌─ Continuar com Google ─┐        │
│  semibold)              │ ┌─ Continuar com GitHub ─┐        │
│                         │                                   │
│ Cobrado uma vez         │ ───────── ou ─────────            │
│ por ano.                │                                   │
│                         │ Nome  [_______________]           │
│ TOTAL                   │ Email [_______________]           │
│ R$ 358,80 / ano         │                                   │
│ (preco gigante,         │ ☐ Concordo com Termos e Priv.    │
│  tipografia rege)       │                                   │
│ R$718,80 (riscado)      │ [    Pagar — Anual    ]          │
│                         │                                   │
│ ─ Acesso completo       │ STRIPE · 7 DIAS DE GARANTIA       │
│ ─ Curadoria diaria      │                                   │
│ ─ Ferramentas           │ Ja tem conta? Fazer login         │
│ ─ Gamificacao           │                                   │
│ ─ 7 dias de garantia    │                                   │
│                         │                                   │
│ 7 DIAS · CANCELE        │                                   │
│  QUANDO QUISER          │                                   │
└─────────────────────────┴───────────────────────────────────┘
```

**Microcopy chave:**
- `PLANO` (mono uppercase) → label
- `Anual` (60-120px) → titulo
- `TOTAL` (mono uppercase) → label
- `R$ 358,80 / ano` (60-90px) → preco
- `7 DIAS · CANCELE QUANDO QUISER` → unico trust signal (substitui 3 icones)

---

## Etapa 2 — Pagamento (Stripe inline)

Mesmo shell da etapa 1. O bloco do form e substituido por:

```
CARTAO · ANUAL

[ Stripe Payment Element renderiza aqui ]
[ tabs: Cartao | (futuras opcoes)        ]
[                                         ]
[ Numero    [____________________]        ]
[ Validade  [______]  CVV  [______]       ]

[      Pagar R$ 358,80      ]    (h-12, mono uppercase)

TROCAR DADOS  (link voltar)
```

Nota: AbacatePay redirect-flow nao tem etapa 2 nossa — vai direto pra hosted page externa.

---

## Etapa 3 — Processando

Estado transiente (~200-2000ms). Nao tem rota propria — substitui o submit button por:

```
[ spinner ]
PROCESSANDO PAGAMENTO

Aguarde — confirmando com a operadora.
Nao feche essa janela.
```

---

## Etapa 4 — /welcome (sucesso)

```
TROCAR PLANO

PAGAMENTO CONFIRMADO

Bem-vindo.
(60-120px, leading 0.95)

Plano anual ativo. Enviamos um link de
acesso para caio@sinapse.club. Clique
nele pra entrar.

────────────────────────────────────
[ Reenviar link magico ]
NAO CHEGOU? VERIFIQUE SPAM OU PROMOCOES.

────────────────────────────────────
Prefere criar uma senha?
Ja tenho conta — fazer login
SUPORTE · contato@sinapse.club
```

**Removido:** circulo `rounded-full` com checkmark, card de email com border + bg, estrutura `text-center`.
**Mantido:** reenvio de link, fallbacks (criar senha / login), suporte por email.

---

## Etapa 5 — /pagamento/falhou (erro)

```
STATUS · TRANSACAO

Pagamento
nao completou.
(60-120px)

│ Cartao recusado pela operadora.   (border-l destructive)

────────────────────────────────────
O QUE PODE TER ACONTECIDO

Cartao recusado pela operadora
Limite insuficiente ou bloqueio pra compras online
Dados incorretos (numero, validade ou CVV)
Antifraude do banco bloqueou a transacao

[      Tentar novamente      ]
VOLTAR PRO INICIO

SUPORTE · contato@sinapse.club
```

---

## O que foi removido (antes → depois)

| # | Removido | Razao |
|---|----------|-------|
| 1 | Trust block 3-icones (Lock + RefreshCw + ShieldCheck) | Substituido por 1 microcopy: `7 dias de garantia · cancele quando quiser`. Brandbook regra 10 (Vignelli). |
| 2 | Linha `Subtotal` + `Total` quando so tem 1 item | Item unico → so `Total`. Subtotal era ruido cognitivo. |
| 3 | `bg-card/40` na sidebar do checkout | Hierarquia ja vem da linha vertical (`border-r`). Fundo extra era redundante. |
| 4 | Card aninhado em `/welcome` (rounded-lg + border + bg-muted) | Tipografia gigante carrega a hierarquia. Card era cinto-e-suspensorio. |
| 5 | Circulo decorativo `h-14 w-14 rounded-full` com CheckCircle | Decoracao sem funcao informacional. |
| 6 | "Sua conta sera criada com este email apos o pagamento" | Microcopy redundante — o botao ja diz `Pagar — Anual`, o consentimento ja diz tudo. |
| 7 | "Pagamento seguro via AbacatePay. Sua conta e criada automaticamente apos a confirmacao" | Substituido por 1 linha mono: `AbacatePay · 7 dias de garantia`. |
| 8 | "Ja tenho conta — continuar com Google/GitHub" (label longo) | Reduzido pra `Continuar com Google/GitHub`. Contexto da pagina ja deixa claro. |
| 9 | Placeholders `Como devemos te chamar` e `seu@email.com` | Labels acima do input ja informam. Placeholder duplicava. |
| 10 | Double-divider (`h-px h-px`) antes do total | Um divider so. Vignelli: nao multiplique elementos. |

---

## O que foi mantido

| Item | Justificativa |
|------|---------------|
| Resumo persistente sticky (desktop) + accordion (mobile) | Padrao mercado (Stripe Checkout, Lemon Squeezy). Reduz ansiedade do usuario. |
| Preco gigante 60-120px | Anchor visual. Brandbook regra 05. |
| Garantia 7 dias visivel | Reduz friccao de conversao. |
| OAuth shortcut (Google + GitHub) | 60% dos usuarios brasileiros logam por OAuth. |
| Form 2 campos (nome + email) | Minimo legal pra LGPD + criar conta. |
| Consent checkbox | LGPD compliance (artigo 7). |
| Fluxo de fallback (criar senha / login / suporte) em /welcome | Magic link nem sempre chega. Sempre da uma saida. |
| Reenviar link inline em /welcome | Feature concreta, util. |

---

## Comparacao conceitual antes vs depois

**Antes (`v1` — padrao mercado generico):**
- Card-em-card (`bg-card` dentro de `bg-card/40`)
- 3 icones de trust com 3 labels (Lock / RefreshCw / ShieldCheck)
- Subtotal + Total mesmo com 1 item
- Tipografia padrao (24-28px headlines)
- Padding 32-48px abundante
- Welcome com circulo decorativo + card de email

**Depois (`v2` — Vignelli minimalism):**
- Borda hairline so onde separa grandes regioes
- 1 microcopy mono uppercase substitui 3 icones
- So `Total` quando ha 1 item
- Tipografia em 2 escalas extremas: 11-28px ou 60-180px
- Padding fluido com clamp()
- Welcome com hierarquia 100% tipografica

---

## Compliance brandbook (12 regras)

| Regra | Status | Como |
|-------|--------|------|
| 04 — Inter · JetBrains, max 2 pesos por tela | ✓ | Inter regular + semibold; JetBrains so em microcopy |
| 05 — Tamanhos 11-14px ou 60-180px (faixa 32-48 PROIBIDA) | ✓ | Headlines em clamp(3rem, 7vw, 7.5rem). Microcopy em 11-15px. Form labels 13-15. |
| 06 — Assimetria obrigatoria | ✓ | /welcome e /falhou usam grid 12-col, conteudo em col-start-2 col-span-7. Checkout e 5fr/7fr. |
| 09 — Semantic sobre primitive | ✓ | tokens `bg-background`, `text-muted-foreground`, etc. Sem hex hardcoded fora de Stripe appearance. |
| 10 — Menos componentes, mais lei (Vignelli) | ✓ | OrderSummary unifica desktop+mobile com 1 SummaryBody. Removidos 10 elementos redundantes. |
| 11 — Grain · crosshair · frame | parcial | Border hairline divide regioes (frame). Grain e responsabilidade do layout global, nao do checkout. |

---

## Arquivos tocados

- `src/components/checkout/order-summary.tsx`
- `src/app/checkout/[plano]/page.tsx`
- `src/app/checkout/[plano]/checkout-form.tsx`
- `src/app/checkout/[plano]/stripe-checkout-form.tsx`
- `src/app/welcome/page.tsx`
- `src/app/pagamento/falhou/page.tsx`
- `src/app/dev/checkout-stages/page.tsx` (novo — preview gated)
- `docs/design/checkout-stages.md` (novo — este doc)

Logica de pagamento (server actions, Stripe API, AbacatePay webhook) intacta. Refactor 100% visual.
