# LP v2 — Reference Teardown

## Summary
- **Stripe BR** teaches structural authority: stat anchors, accordion case studies, segmented dual-CTAs (self-serve + sales), logo-wall as opening proof.
- **AbacatePay** teaches BR-native trust: founder avatars above the fold, dev-tone testimonials with profanity-light authenticity ("qualquer idiota consegue usar"), price transparency as headline benefit.
- **Nyo.ia** teaches motion-as-product: scroll-pinned reveals, scramble text, comparison tables, and a 6-anchor sticky nav (`//solucao`, `//beneficios`...) — a UX that mirrors the product's promise.

---

## 1. Stripe BR

### Section order observed
1. Sticky nav (Produtos, Solucoes, Devs, Recursos, Precos, Entrar + dual CTA)
2. Hero (headline + sub + dual CTA)
3. Logo wall carousel (Amazon, Shopify, Figma, Anthropic, Uber)
4. Solution grid (4 cards)
5. Stat block ("$1.9T processado", "99.999% uptime", "200M+ assinaturas")
6. Enterprise case studies (accordion: Hertz, URBN, Instacart, Le Monde)
7. Servicos & parceiros certificados
8. Startup program (Lovable, Runway, Supabase, Linear, ElevenLabs)
9. Plataforma/SaaS use-cases com depoimentos nomeados
10. Dev infra (API + transaction volume vivo)
11. News carousel
12. Editorial (Book of the Week)
13. CTA final
14. Footer mega-menu

### Visual language
Navy + white + soft gradients; custom sans (Stripe Sans-like); huge hero type (~48px+); generous vertical rhythm; 2-3 col feature grids; full-bleed mobile sections.

### Motion patterns
- Logo wall: auto-rotate fade carousel (scroll-independent)
- Sticky nav with subtle background blur on scroll
- Hero parallax: bg shifts vs text
- Accordion case studies: stagger row expand
- Card hover: lift + shadow
- Dev infra: live-updating numerical counters

### Copy framework
Hero promise -> stat-driven proof -> case studies -> dev/scale objection -> dual CTA. Hero quote: *"Infraestrutura financeira para aumentar suas receitas"* / sub: *"Aceite pagamentos... desde a primeira transacao ate a bilionesima."* Authority anchor: *"50% das empresas da Fortune 100 usaram a Stripe"*.

### CRO tactics
Stat anchors as quantitative proof; accordion case studies (low scroll cost, high depth); dual-CTA segmentation ("Comece ja" vs "Fale com vendas"); logo wall above the fold; "Registre-se com Google" lowers form friction; pricing link visible in nav.

### Navigation UX
Sticky top, blur on scroll, dual CTA persists. Mega-menu on hover desktop. Mobile: full-screen drawer (hamburger). Footer is a 5-column mega-menu acting as sitemap.

---

## 2. AbacatePay

### Section order observed
1. Sticky nav (Precos, Docs, Blog + "Acessar Plataforma")
2. Founder avatars + community line
3. Hero (headline + sub + dual CTA)
4. Payment methods grid (Pix, Cartao, Boleto, Link/QR)
5. Pricing teaser ("Ver taxas")
6. Integration / API showcase
7. Feature suite (4 cards: antifraude, checkout, assinaturas, preco)
8. Twitter testimonial carousel (5+ quotes)
9. Suporte + FAQ
10. Footer

### Visual language
Verde abacate + branco + preto; sans moderna; grid centralizado, card-based; muito whitespace; tom playful mas preciso.

### Motion patterns
- Testimonial carousel auto-cycle
- Card hover (lift)
- Sticky nav simples
- Sem parallax detectado

### Copy framework
Promessa direta -> metodos -> preco -> dev proof -> social proof. Hero: *"Receba facil. Cresca rapido."* / sub: *"Infraestrutura de pagamentos sem complicacoes. Orquestre, processe e otimize."* Objection killer: *"Menos do que voce imagina. Sem taxa mensal, sem surpresas."* Killer testimonial: *"Qualquer idiota (eu) consegue usar. Ficou nivel stripe de facilidade."*

### CRO tactics
Founder avatars como primeira prova (humaniza antes de logos); preco transparente como heroi (R$0.80/Pix); testimonials com voz autentica de dev BR; tom *"feita de devs, pra devs"*; CTA primaria sempre "Comecar agora", soft-CTA "Ver taxas".

### Navigation UX
Sticky simples, sem mega-menu. CTA "Acessar Plataforma" persiste. Mobile: hamburger padrao.

---

## 3. Nyo.ia

### Section order observed
1. Nav + hero animado scroll-linked ("AI AGENTS NEVER SLEEP")
2. Value prop ("Reduza folha salarial...")
3. Problema ("Seu negocio gera dados o tempo todo. Voce so nao esta vendo.")
4. Framework 3 pilares (Identify -> Educate -> Develop)
5. Como funciona (5 blocos pinned)
6. Carousel de 10 agentes
7. Recap beneficios (3 colunas)
8. Tabela comparativa (Humanos vs Agentes)
9. Grid de detalhes dos agentes (modais)
10. Depoimentos (2 case studies cruzados)
11. FAQ (8 perguntas)
12. CTA + form de contato
13. Footer

### Visual language
Vermelho/laranja accent (#E8402D) + off-white + charcoal. Sans geometrico, display headings pesadas. Vertical rhythm generoso, conteudo center-aligned.

### Motion patterns
- Hero: 61-frame WebP sincronizado ao scroll progress
- Sticky pin com text reveals stagger (thresholds 30%/70%)
- Marquee carousel de agentes (direcao inverte no upscroll)
- Clip-path mask reveal entre secoes (bottom->top)
- Scramble text char-a-char no load/hover
- Modal: overlay fade 0.3s + row expand 0.6-1.2s + content stagger 0.08s
- Hover button scale 0.85, overlay scale 1.4
- `prefers-reduced-motion` respeitado

### Copy framework
Hook poetico -> reframe do problema -> framework -> proof -> objection FAQ -> form. Hero: *"AI AGENTS NEVER SLEEP"* / sub: *"Reduza sua folha salarial e aumente a produtividade"*. Filosofia: *"Nao e sobre substituir pessoas. E sobre eliminar ineficiencia."* Beneficio nucleo: *"Trabalham 24/7. Atendem 100 ou 10.000 demandas com a mesma qualidade."*

### CRO tactics
Tabela comparativa (anchoring direto contra o status quo); FAQ caca-objection com 8 perguntas; testimonials cruzados (2 pessoas se elogiam mutuamente = peer proof); 10 agentes pre-feitos como menu de opcoes (reduz decision paralysis); form embedado mid-page + final; trust signals locais (GMT-3, data atual).

### Navigation UX
Sticky com 6 jump links estilo `//solucao`, `//beneficios`, `//como-funciona`, `//agentes`, `//depoimentos`, `//faq` + botao "fale com nosso time". Mobile hamburger. Estetica de nav "diferente" reforca branding.

---

## Transferability matrix

| Pattern | From | Adopt? | Adapted how to our DS |
|---|---|---|---|
| Sticky nav com jump links anchor (`#solucao`, `#mentores`, `#precos`, `#faq`) | Nyo | YES | Reuse `lp-nav.tsx`, add scroll-spy ativo via IntersectionObserver, sem cor nova |
| Estetica de jump link `//label` | Nyo | YES | Texto puro, mono space ja disponivel? Se nao, regular com `--tracking-tight`, sem fonte nova |
| Stat block como segunda secao (numeros grandes) | Stripe | YES | Tipo display preto sobre `--surface-base`, sem gradient |
| Logo wall auto-rotate como prova inicial | Stripe | DEFER | Soft launch nao tem logos suficientes; reservar para v2.1 |
| Founder avatars acima da hero | Abacate | YES | Caio + Matheus + 1 mentor avatar antes do hero — humaniza antes de prometer |
| Dual-CTA segmentado (self-serve vs sales) | Stripe | NO | Sinapse e produto unico de comunidade; uma CTA primaria + uma secundaria de preview, nao dois caminhos |
| Stat counter ao vivo (API requests) | Stripe | NO | Nao temos dado publico relevante; soaria fake |
| Accordion case studies | Stripe | YES | Usar `<details>` nativo + `--ease-craft` para height transition, sem libs |
| Testimonials estilo Twitter card | Abacate | YES | Card flat, borda 1px sutil ja no DS, foto + handle, sem cores novas |
| Tom de voz autentico ("qualquer idiota consegue") | Abacate | YES | Adaptar pra voz Caio/SINAPSE — informal, BR, sem corporate-speak |
| FAQ 8+ perguntas como objection killer | Nyo | YES | Ja existe `lp-faq.tsx`, expandir pra 8-10 itens cobrindo precos, refund, mentores, AI tools |
| Tabela comparativa (Sinapse vs alternativas) | Nyo | YES | "Sinapse vs curso vs comunidade generica vs Twitter" — texto preto, divisores sutis |
| Hero scroll-linked WebP frame animation | Nyo | NO | Custo de producao alto + perf risk em mobile BR; usar SVG/CSS leve |
| Clip-path mask transitions entre secoes | Nyo | NO | Quebra DS limpa; usar fade + translate sutil com `--ease-spring` |
| Scramble text on hover/load | Nyo | DEFER | Legal mas distrativo; talvez no logo do nav apenas |
| Stagger reveal de cards on scroll | Stripe + Nyo | YES | Usar `useInView` (Framer broken em whileInView) ou `IntersectionObserver` puro + CSS transition |
| Sticky pinning de secao | Nyo | YES | `position: sticky` puro, sem JS, para "como funciona" |
| Pricing teaser "Ver taxas" antes da pricing real | Abacate | YES | Mini-preview em hero ou problem, link suave pra `#precos` |
| Carousel marquee infinito | Nyo | NO | Quebra com Next 16 + Framer; se necessario, CSS keyframes puro |
| Mega-menu desktop | Stripe | NO | Sinapse tem 5-6 secoes apenas; flat nav e suficiente |
| Form de contato embedado mid-page | Nyo | NO | Soft launch usa Discord/AbacatePay checkout, nao form |
| Modal expand para detalhes (mentores/agentes) | Nyo | YES | Para `lp-mentores`: card -> modal com bio completa, usar `<dialog>` nativo |
| "Local time GMT-3" trust signal | Nyo | NO | Gimmicky pra produto BR domestico |
| Footer mega-menu | Stripe | NO | Footer enxuto basta no v2 |

---

## Section ordering recommendation

1. **Nav (sticky, scroll-spy)** — orientacao constante, seis jump links.
2. **Hero** — promessa + dual visual (texto + 1 visual leve), CTA primaria.
3. **Founder/mentores avatar strip** — humaniza imediatamente (Abacate move).
4. **Problema** — reframe doloroso, 1 frase grande (Nyo move).
5. **Solucao + 3 pilares** — framework visual claro.
6. **Stat block / proof numerica** — 3 numeros grandes (Stripe move).
7. **Para quem** — segmentacao rapida de audiencia.
8. **Como funciona (sticky pinned)** — passo-a-passo com scroll pinning.
9. **Mentores (cards -> modal)** — bio expandivel sem sair da pagina.
10. **Tabela comparativa (Sinapse vs alternativas)** — anchoring (Nyo move).
11. **Depoimentos** — 5+ Twitter-style cards (Abacate move).
12. **Pricing** — 2 cards lado a lado, popular dark, semestral anchor (per CRO preferences memory).
13. **Garantia** — risk reversal antes da decisao final.
14. **FAQ expandida (8-10)** — caca-objection (Nyo move).
15. **CTA final** — forte, single primary.
16. **Footer enxuto** — links essenciais + social.

---

## Motion budget

| # | Primitive | Tech | DS token |
|---|---|---|---|
| 1 | Fade-in + 12px translate-y on enter view | `useInView` (manual) + CSS transition | `--ease-craft` |
| 2 | Stagger reveal de cards (delay 60-80ms) | `useInView` per card + `transition-delay` inline | `--ease-craft` |
| 3 | Sticky section pinning (como funciona) | `position: sticky` puro CSS, zero JS | n/a |
| 4 | Hover lift em cards (translate-y -2px + shadow) | CSS `:hover` puro | `--ease-spring` |
| 5 | Accordion height (FAQ + case studies) | `<details>` nativo ou Radix Accordion + CSS grid trick | `--ease-craft` |
| 6 | Nav blur on scroll (backdrop-filter) | `IntersectionObserver` no top sentinel + class toggle | `--ease-craft` |
| 7 | Modal open (mentor bio) | `<dialog>` nativo + CSS keyframe fade+scale | `--ease-spring` |

**Framer Motion necessario apenas se:** scroll-linked progress real (e.g. parallax) — caso contrario, tudo CSS+IO. Evitar `whileInView` (broken em Next 16+React 19, conforme memory). Se Framer for usado, sempre `useInView` hook + `animate` controlado.

---

## Risks & notes for the team

- **Framer `whileInView` broken** — qualquer reveal scroll-driven precisa de `useInView` manual ou IntersectionObserver+CSS. Documentar no PR pra evitar regressao.
- **CTA nesting** — todo CTA em LP usa `buttonVariants({...})` aplicado via `className` no `<Link>`, nunca `<Link><Button>`.
- **Mobile motion budget** — Nyo carrega 61 frames WebP no hero; nao copiar. Mobile BR tem rede instavel; tudo deve ser CSS puro ou IO+transform/opacity (GPU only).
- **Sem cores novas** — DS e flat `--surface-base #FAFAFA` + preto. Stripe/Nyo dependem de gradientes/accent vivido; nossa diferenciacao vem de tipografia + ritmo, nao cor.
- **Soft launch reality** — sem logos de empresas e sem dado publico; logo wall e stat counter ao vivo ficam pra v2.1.
- **Founder strip exige fotos** — confirmar com Caio se ja temos avatares Caio+Matheus+mentores em qualidade.
- **Tabela comparativa exige posicionamento** — quem sao os "concorrentes"? Definir antes do copy (curso pago tradicional? Twitter? Discord generico?).
- **Scroll-spy nav** — IntersectionObserver com rootMargin negativo pra ativar so quando secao esta no centro do viewport.
- **Reduce motion** — respeitar `prefers-reduced-motion` em todo IO reveal (Nyo faz, devemos fazer).
- **Pricing memory** — manter cards lado a lado, popular dark, semestral anchor (CRO preferences memory).
