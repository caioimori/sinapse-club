# LP-2 — Implementacao da Landing Page SINAPSE

**Status:** InProgress
**Epic:** go_to_market
**Owner:** @developer (Dex)
**Data:** 2026-04-08
**Depends on:** LP-1 (DONE)

---

## Objetivo

Implementar a LP de vendas da comunidade SINAPSE em Next.js com base nos 9 documentos de especificacao aprovados.

## Documentos de referencia (todos em docs/prd/lp-comunidade/)

| Doc | Conteudo |
|-----|---------|
| 00-strategy-v3.md | Estrategia, decisoes, regras |
| 01-positioning-icp.md | Posicionamento e ICP |
| 02-brand-voice.md | Tom de voz |
| 03-copy-framework.md (v3) | Copy das 10 secoes |
| 04-lp-structure.md | Wireframe, layout, mobile first |
| 05-animations-spec.md | 46 animacoes especificadas |
| 06-offer-copy.md (v3) | Copy de oferta e pricing |

## Escopo (IN)

- [x] Pagina LP completa em Next.js (rota /lp ou /)
- [x] 10 secoes conforme 03-copy-framework.md
- [x] Layout conforme 04-lp-structure.md (mobile first)
- [x] Animacoes conforme 05-animations-spec.md (Framer Motion + CSS)
- [x] Sticky CTA bar
- [x] Responsivo (mobile, tablet, desktop)
- [x] Acessibilidade (prefers-reduced-motion, contraste, semantica)
- [x] Performance (lazy load, WebP, code splitting)
- [x] CTA do forum linkando para signup/checkout
- [x] CTA da mentoria linkando para agendamento

## Escopo (OUT)

- Checkout/pagamento (Stripe/outro — story separada)
- Blog/artigos (story separada)
- CMS para editar copy (hardcoded por agora)

## Acceptance Criteria

- [x] LP renderiza corretamente em mobile (375px), tablet (768px) e desktop (1440px)
- [x] Todas as 10 secoes implementadas com copy v3
- [x] Animacoes funcionam com scroll triggers
- [x] prefers-reduced-motion desabilita animacoes
- [ ] Lighthouse score >= 90 em Performance, Accessibility, Best Practices
- [x] Zero travessoes na copy renderizada
- [x] Sticky CTA aparece apos hero section
- [x] CTAs funcionais (links corretos)

## Complexidade

- Escopo: 4 (10 secoes, animacoes, responsivo)
- Integracao: 1 (sem APIs)
- Conhecimento: 2 (Next.js + Framer Motion)
- Risco: 2 (LP estatica)
- **Total: 9 — STANDARD**
