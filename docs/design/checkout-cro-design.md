# Checkout CRO Design — Stripe Custom Checkout

**Story:** STRIPE-2.1
**Data:** 2026-04-27
**Brandbook:** SINAPSE 12 regras (B&W absoluto, grain, assimetria)

---

## Objetivo CRO

Maximizar conversao do `/checkout/[plano]` mantendo identidade SINAPSE pura — sem logo Stripe dominando, sem domain externo no fluxo principal, sem cantos arredondados shadcn-default.

## Trade-off aceito

- **PIX nao existe nessa Fase.** Cartao only. Caio aceita perda ~30-50% conversao BR em troca de UX 100% branded e renovacao automatica nativa.
- Footer "Powered by Stripe" no Payment Element nao pode ser removido (politica Stripe). Aceitavel — pequeno, embaixo, nao compete com headline.

## Layout (split-pane existente, refinado)

Mantemos o grid de 2 colunas atual (`max-w-5xl` -> trocar pra `max-w-screen-2xl px-8`). Esquerda = plano + features. Direita = form Stripe.

### Esquerda (resumo do plano)

```
[← Trocar de plano]               (12px Inter, hover: foreground)

SINAPSE — Acesso anual            (clamp(2.5rem, 5vw, 4.5rem), Sora, tracking-tight)
Cobrado uma vez por ano. Maior economia.

R$ 358,80   por ano               (60px Sora bold + 12px uppercase)

✓ Acesso completo ao forum
✓ Curadoria diaria IA + negocios
✓ Ferramentas e marketplace
✓ Gamificacao, ranks e leaderboard
✓ 7 dias de garantia incondicional

[Selo: GARANTIA 7 DIAS]            (frame com crosshair, JetBrains 11px uppercase)
```

DS notes:
- Headline em Sora, fora da dead-zone (32-48px) — `clamp(2.5rem, 5vw, 4.5rem)` cai entre 40-72px conforme viewport. **Verificacao:** em mobile pequeno (320px), 5vw = 16px -> clamp puxa pra 2.5rem = 40px = dead-zone. **Fix:** mudar pra `clamp(2.75rem, 5vw, 4.5rem)` -> minimo 44px (ainda dead-zone). **Fix correto:** `clamp(3rem, 6vw, 5rem)` -> minimo 48px+. Aplicar.
- Preco em 60px Sora bold (acima da dead-zone) com periodo em 12px uppercase JetBrains
- Selo de garantia em frame com crosshair (regra 11)

### Direita (form Stripe)

```
COMECE SEU ACESSO              (12px uppercase JetBrains, letterspacing 0.1em)

[Continuar com Google] (outline)
[Continuar com GitHub] (outline)

  ──── ou pague direto ────

NOME
[input fluido, border 1px #27272A, no rounded]
EMAIL
[input fluido, border 1px #27272A, no rounded]
"Sua conta sera criada com este email apos o pagamento"
                              (11px muted)

[Stripe Payment Element renderiza aqui]
   - Card number, exp, cvc — todos branded B&W
   - Sem nome banner Stripe (Appearance API esconde quando possivel)
   - Footer "Powered by Stripe" pequeno embaixo

[ ] Li e concordo com Termos e Privacidade
                              (12px muted, links underlined foreground)

[PAGAR R$ 358,80]              (foreground bg, background text, no rounded)
                              (full-width, height 48px, Sora 14px uppercase)

Pagamento seguro processado por Stripe.
Sua conta e criada automaticamente.
                              (11px muted, centro)
```

DS notes:
- Inputs com `borderRadius: 0` — Appearance API forca isso no Stripe Element tambem
- Cor de focus: `borderColor: #FAFAFA, boxShadow: none` (sem glow padrao Stripe)
- Botao primario: B&W invertido (foreground bg), no rounded, hover: 80% opacity
- Erro Stripe inline aparece em vermelho `colorDanger: #EF4444` mas com border 1px so (sem fundo vermelho enchendo o card)

## Stripe Appearance API — config final

```ts
const appearance: StripeElementsOptions['appearance'] = {
  theme: 'night',
  variables: {
    colorPrimary: '#FAFAFA',
    colorBackground: '#0A0A0A',
    colorText: '#FAFAFA',
    colorTextSecondary: '#A1A1AA',
    colorDanger: '#EF4444',
    colorSuccess: '#22C55E',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSizeBase: '14px',
    borderRadius: '0px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid #27272A',
      backgroundColor: '#0A0A0A',
      padding: '12px 14px',
      boxShadow: 'none',
      transition: 'border-color 150ms ease',
    },
    '.Input:focus': {
      borderColor: '#FAFAFA',
      boxShadow: 'none',
      outline: 'none',
    },
    '.Input--invalid': {
      borderColor: '#EF4444',
    },
    '.Label': {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: '500',
      marginBottom: '6px',
      color: '#A1A1AA',
    },
    '.Tab': {
      border: '1px solid #27272A',
      backgroundColor: 'transparent',
      borderRadius: '0px',
    },
    '.Tab--selected': {
      borderColor: '#FAFAFA',
      backgroundColor: '#0A0A0A',
    },
    '.Error': {
      fontSize: '12px',
      color: '#EF4444',
      marginTop: '4px',
    },
  },
};
```

## Estados / loading / erros

| Estado | Comportamento | DS |
|---|---|---|
| `idle` | Form interativo | Default |
| `loading` (apos submit, esperando confirmPayment) | Botao mostra "PROCESSANDO..." + spinner Loader2 (reversivel) + form disabled | `disabled` no botao + `pointer-events-none` no form |
| `success` | Browser redireciona pra return_url. Antes do redirect, botao mostra "REDIRECIONANDO..." | Mesmo que loading |
| `error` (cartao recusado, etc) | Mensagem inline em vermelho + form re-habilita | `<p role="alert" className="text-destructive text-xs">` |
| `error_fatal` (no client_secret, network down) | Redireciona `/pagamento/falhou?error=...` | Pagina dedicada |

## /pagamento/falhou

```
[crosshair frame]

PAGAMENTO NAO COMPLETOU       (clamp(3rem, 6vw, 5rem) Sora)

{error message do Stripe}     (16px Inter)

O que pode ter acontecido:
- Cartao recusado pela operadora
- Limite insuficiente
- Dados incorretos

[TENTAR NOVAMENTE] -> /checkout/[plano]    (botao primario)
[Voltar pro inicio] -> /                    (link muted)

Precisa de ajuda?
contato@sinapse.club                        (link foreground underline)
```

DS: layout assimetrico, headline a esquerda, lista de motivos abaixo, CTAs verticalmente empilhadas com gap-3.

## Validacao Brandbook 12 regras (gate)

- [x] regra 01 — B&W absoluto
- [x] regra 02 — preto #0A0A0A
- [x] regra 03 — grain herdado do layout
- [x] regra 04 — Sora + Inter + JetBrains, max 2 pesos
- [x] regra 05 — tipografia fora da dead-zone (preco 60px, headline clamp 48px+)
- [x] regra 06 — assimetria no plano (esquerda) + form (direita)
- [x] regra 07 — animacoes reversiveis (spinner reversivel, transicoes border-color 150ms)
- [x] regra 08 — `prefers-reduced-motion` respeitado (Framer nao usado aqui)
- [x] regra 09 — tokens semanticos (`bg-background`, `text-foreground`)
- [x] regra 10 — menos componentes, mais lei (reusar Button, Input, Label existentes)
- [x] regra 11 — crosshair em selo de garantia + frame em /pagamento/falhou
- [x] regra 12 — Payment Element customizado, nao parece padrao Stripe

## Metricas pra instrumentar (post-launch)

- Taxa de submit do form (page view -> click pagar)
- Taxa de confirmPayment success (click pagar -> webhook payment_succeeded)
- Drop-off por etapa: nome -> email -> cartao preenchido -> submit
- Tempo medio de checkout
- Taxa de retry pos-falha
