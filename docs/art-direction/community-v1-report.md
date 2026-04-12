# Sinapse Plataform — Community Surface Art Direction Report v1

> Workflow executado: `saas-platform-art-direction-cycle` (squad-artdir v2.0)
> Squad: Canvas (artdir-orqx) coordenando Vertex, Atlas, Axiom e Aura
> Ecossistema: SINAPSE / Imperator
> Data: 2026-04-12
> Alvo: Feature de Comunidade do `sinapse-plataform` (forum, feed, perfil, notificacoes, onboarding, composer, mobile)

---

## 0. Discovery — Mapa do Terreno

### 0.1 Stack confirmada

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Framework | Next.js | 16.2.1 (App Router, RSC) |
| Runtime | React | 19.2.4 |
| Linguagem | TypeScript | ^5 |
| Estilo | Tailwind CSS | v4 (`@tailwindcss/postcss`) + tw-animate-css |
| UI primitives | shadcn (style `base-nova`, baseColor `neutral`, RSC) + `@base-ui/react` 1.3 | — |
| Icones | lucide-react | ^1.7 |
| Motion | Framer Motion | ^12.38 |
| Editor | TipTap | ^3.21 (com starter-kit, image, link, code-block-lowlight) |
| Auth + DB | Supabase SSR | `@supabase/ssr` ^0.9 |
| Tema | next-themes | ^0.4 |
| State client | Zustand | ^5.0 |
| Pagamentos | Abacate Pay | ^1.2 |
| Markdown | react-markdown + rehype-highlight + remark-gfm | — |

### 0.2 Mapa de superficies da Comunidade

A comunidade nao e uma feature, e o **produto inteiro logado**. O `feed` inclusive redireciona para `/forum` (`src/app/(dashboard)/feed/page.tsx`). O esqueleto:

```
src/app/(dashboard)/
  layout.tsx              # Sidebar 280px + Topbar 56px + main + MobileNav + ComposeModal global
  forum/
    page.tsx              # Feed principal — RSC, paralel queries, paginacao, tabs, ordenacao
    [category]/page.tsx   # Redirect → /forum?categoria={slug}
    [category]/[sub]/page.tsx
    new/page.tsx          # Composer dedicado (rota)
    thread/[id]/page.tsx  # Detalhe + replies
  feed/page.tsx           # Redirect → /forum
  notificacoes/page.tsx   # Inbox de notificacoes (5 tipos)
  notifications/          # rota legacy (PT-BR e a canonica)
  profile/
    page.tsx              # Self-profile
    [username]/page.tsx   # Public profile com ProfileTabs + GitHubRepos
  explore/                # Discovery alternativo
  leaderboard/            # Reputation ranking (Twin do gamification)
  spaces/[slug]/          # Hub thematicos (em uso parcial)
  posts/[id]/             # Permalink legacy de posts
  pricing/                # In-product pricing (Free / Pro / Premium)
  settings/, admin/moderation/

src/components/
  forum/                  # 19 componentes — composer, threads, replies, sidebar sticky, themes-bar, etc
  feed/                   # 5 componentes — post-card, comment-section, follow, rich-editor
  notifications/          # mark-read
  profile/                # tabs, cargo-badge, cargo-selector, github-repos
  layout/                 # sidebar.tsx, topbar.tsx, mobile-nav.tsx
  gamification/, access/, calendar/, courses/, ui/ (shadcn primitives)
```

### 0.3 Design system existente — `caioimori-design-system`

Achado relevante: o projeto **NAO esta em commodity tier**. Ja existe um design system proprio, declarado em `src/app/globals.css` (351 linhas) com:

- **Posicionamento explicito:** "Light-first. B&W. Glass. Premium." (literal no comentario do CSS)
- **Tokens de surface** com nomes semanticos: `void / base / default / raised / overlay / hover / alt / muted / deep`
- **Tokens de text:** `primary / secondary (.65) / tertiary (.45) / muted (.30) / disabled (.15)` — escala consistente em rgba
- **Tokens de border:** `subtle (.04) / default (.08) / strong (.15) / hover (.20)`
- **Glass system:** `--glass-bg`, `--glass-blur`, `--glass-saturate 1.8`, `--glass-shadow` com inset highlights
- **5 easings nomeados:** `precise / craft / spring / decisive / smooth` — vocabulario de motion proprio
- **4 duracoes:** `instant 80ms / fast 200ms / normal 320ms / slow 500ms`
- **Tracking scale:** `tight -.03em / heading -.02em / normal 0 / wide .05em / widest .12em`
- **Dark mode em paridade real** (linhas 191-239) — nao retrofit
- **Bridge shadcn** mapeado token-a-token, nao usa defaults
- **6 animacoes nomeadas** com keyframes (synapse-pulse, fade-in, fade-in-up, slide-up, scale-in, shimmer, text-reveal)

### 0.4 Estado atual

| Sinal | Leitura |
|-------|---------|
| Recent commits | "Em breve" sidebar, gamification MVP, security hardening, LGPD, forum polish, SEO, perf paralelizando queries N+1 |
| Branch atual | tem 7 arquivos modificados (LP + composer-poll + forum/page) — work in progress |
| Auditorias visuais | Existem screenshots em `docs/audits/lp-*.png` (LP coberta, plataforma logada NAO coberta) |
| Pricing | 3 tiers ja desenhados (Free / Pro R$97 / Premium R$197) |
| Soft launch | Sidebar com secao "Em breve" (5 features) — projeto em soft launch, nao hard launch |

**Conclusao do discovery:** Beta avancado / soft launch. Forum funcional, design system maduro, premium positioning ja parcialmente assumido. Nao e exercicio de "primeiro polish" — e exercicio de **subir o teto**.

---

## 1. Diagnosticos por Especialista

### 1.1 Vertex (Platform Aesthetic Director) — Lens canon-fit

**Categoria:** "Community-led SaaS para profissionais de IA / dev". O fit canonico mais forte e **Linear + Discord-mas-com-densidade-de-Twitter + assinatura-tipografica-de-Vercel**. NAO e Circle nem Skool. NAO e Mighty Networks. As 6 referencias do canon mapeiam assim:

| Ref canon | Aplicabilidade aqui | DNA aproveitavel |
|-----------|---------------------|------------------|
| **Linear** | ALTA | Velocity-as-aesthetic, 1 accent forever, product-is-the-hero |
| **Vercel** | MEDIA | Custom typeface (Geist) — sinapse precisa do equivalente proprio |
| **Stripe** | BAIXA | Light-first como trust signal — sinapse JA fez essa escolha (`Light-first` literal no CSS) |
| **Framer** | BAIXA | Empty state IS the product — applicavel apenas no `/explore` |
| **Arc** | BAIXA | Personality como premium — perigoso aqui, audiencia tecnica resiste a whimsy |
| **Raycast** | ALTA | Keyboard-first, dark+light parity, "one accent justifies the price" |

**Veredito de commodity audit:** PASS condicional. O design system proprio salva — mas o **forum esta visualmente identico a um Twitter-light**. Composer com `O que esta acontecendo?`, acoes em fileira (reply / repost / like / views / share) com cores Twitter (rose para like, emerald para repost), sidebar sticky com Trending — e o Twitter playbook exato. Twitter e produto referencial mas e tambem **commodity pattern por excesso de copia**. Para subir o ticket, precisamos **anti-clonar Twitter em pelo menos 1 dimensao visivel**.

**Padroes cross-ref aproveitaveis:**

1. **Custom craft via tipografia ou iconografia** (Vercel/Stripe) — sinapse ainda usa Inter + Lucide, ambos commodity. Este e o **gap #1 de premium signal**.
2. **Empty state como segunda LP** (Linear/Framer) — o composer collapsed mostra "O que esta acontecendo?" em muted/60. E commodity. Linear faz "Press ? for shortcuts" + dica acionavel.
3. **Atalhos de teclado visiveis** (Linear/Raycast) — zero atalhos visiveis no forum. Audiencia tecnica espera isso. Gap.
4. **Pricing como exhibit, nao spreadsheet** (Linear/Vercel) — pricing in-product hoje e uma feature comparison table commodity. Gap.
5. **Light-first como trust signal** (Stripe) — sinapse JA fez essa escolha. Manter.

---

### 1.2 Atlas (Design System Architect) — Auditoria multi-surface

**Inventario das 7 superficies canonicas:**

| # | Surface | Estado | Token alignment |
|---|---------|--------|----------------|
| 1 | Brand identity | EXISTE (`caioimori-design-system` declarado) | Source of truth |
| 2 | Marketing site | EXISTE — `(marketing)/lp` com 19 componentes proprios + lp.css separada | RISCO de drift (auditorias recentes em `docs/audits/lp-*.png` indicam trabalho ativo) |
| 3 | Product UI (forum) | EXISTE | OK — usa tokens consistentemente em maioria dos lugares |
| 4 | Transactional email | **NAO INVENTARIADO** | Gap critico — supabase auth emails sao default Mailchimp-tier |
| 5 | Documentation | NAO EXISTE | N/A no momento |
| 6 | Billing / invoice PDF | **NAO INVENTARIADO** | Gap critico — Abacate Pay envia recibo padrao |
| 7 | Mobile apps | NAO EXISTE (web responsivo apenas) | N/A |

**Tokens canonicos: status real**

PASSA:
- Surface scale (8 niveis), text scale (5 niveis), border scale (4 niveis) — consistentes
- Easings nomeados (5) — boa pratica raramente vista
- Glass system — coerente, com paridade dark
- Bridge shadcn declarativo (nao redeclara shadcn defaults)

NAO PASSA / DRIFT DETECTADO:
- **Cores hardcoded em componentes** Twitter-style: `text-rose-500`, `text-emerald-500`, `text-blue-500`, `text-amber-500`, `text-yellow-500`, `text-green-500` em `thread-list-item.tsx`, `notificacoes/page.tsx`, `sidebar.tsx`. Nenhuma vem do token system. Drift confirmado.
- **`bg-zinc-800`, `border-zinc-800`, `text-zinc-500`** em controles de sort no `forum/page.tsx` (linhas 286-348). Tailwind defaults vazando. Drift.
- **Sticky bar com `bg-background/90 backdrop-blur-sm`** ao inves de usar a utility `.glass-nav` ja definida. Inconsistencia.
- **Nenhum versionamento** de design system. Sem changelog. Sem semver. Nenhum guia de migracao.
- **Sem owner/justificativa por token** no registry — tokens existem mas sao orfaos.
- **Nenhuma auditoria de drift agendada** — sinal de risco para crescimento.

**Veredito Pilar 9:** PARCIAL. Tem foundation forte (raro) mas falta **enforcement**. Cada nova feature adiciona um pouco de drift. Em 6 meses, o premium signal colapsa.

---

### 1.3 Axiom (Product Surface Director) — Auditoria de ergonomia logada (Pilar 8)

**Pilar 8 nas surfaces da comunidade:**

#### Lei da Inhabitacao (decoracao vira ruido na 100a vista)
- **Composer** mostra um botao "Publicar" muted ao colapsar. Em 100 visitas/mes, vira mobilia. **PASSA.**
- **Themes bar** (`themes-bar.tsx`) tem auto-scroll horizontal infinito (chips deslizando). **NAO PASSA.** Movimento perpetuo em surface vista 100x = ruido cognitivo. Disney 12 violado: motion sem propriedade. Gap critico.
- **Synapse-pulse animation** definida em globals.css mas nao identifiquei uso na comunidade — ok.

#### Lei do Fitts Diario
- Sidebar nav: bom — rounded, espacamento 0.5 entre itens, alvos 36px+. **PASSA.**
- Acoes do thread: bom — circulos 32px de hit area com 18px icon. **PASSA.**
- Sort buttons: ruins — `rounded-lg` 28px height, hardcoded zinc colors. **NAO PASSA.**
- Botao "Post" da sidebar: full width, 40px height — generoso. **PASSA.**

#### Promessa do Empty State
- **Forum vazio (sem threads):** "Nenhuma publicacao ainda. Seja o primeiro!" — generic. **NAO PASSA.** Linear/Notion/Raycast trazem call-to-craft especifico, nao apologia.
- **Tab "Seguindo" vazia:** "Ainda nao segue ninguem / Siga pessoas para ver o conteudo delas aqui" — funcional, sem icone, sem CTA acionavel para seguir. **PARCIAL.**
- **Notificacoes vazias:** "Tudo em dia / Quando alguem curtir, responder ou comecar a te seguir, voce vera aqui" + icone Bell em circulo bg-muted. **PASSA** (e o melhor empty state do produto).
- **Profile sem posts:** Nao verifiquei diretamente — a confirmar.

**Achado:** Empty states sao **inconsistentes em qualidade**. O de notificacoes mostra que o time SABE fazer bem. Os outros sao defaults.

#### Balanco de Densidade
- Forum feed: densidade Twitter-tier (alta). Apropriado para feed. **PASSA.**
- Thread detail: nao auditei profundamente. A confirmar.
- Settings: nao auditei. A confirmar.
- **GAP estrutural:** Nao existe surface tipo "dashboard" com KPI hero zone. Para uma comunidade que quer cobrar premium, faltaria uma tela tipo "Sua semana na Sinapse" (impressoes, replies recebidas, novos seguidores, posts em alta) — uma surface densa de retencao. **Gap importante.**

#### Lei do Dark-Mode Mandate
- Dark mode existe via `next-themes`. Tokens dark declarados em paridade. **PASSA estruturalmente.**
- **MAS:** As cores hardcoded `text-rose-500`, `text-blue-500`, etc nao tem variantes dark — funcionam por sorte porque sao saturadas. Drift. **PASSA com concerns.**

#### Atalhos de teclado
- Zero atalhos visiveis na UI. Composer nao tem `Cmd+Enter` documentado. Forum nao tem `j/k` para navegar. **NAO PASSA.** Gap critico para audiencia tecnica que paga premium.

#### Choreography dos primeiros 5 minutos
- Onboarding existe (`(auth)/onboarding/page.tsx`) com 4 steps: locale → interesses → cargo profissional → company/headline. Decente, **PASSA estruturalmente**.
- **MAS:** Onboarding termina com `router.push("/forum")` direto. Zero "ceremony" — sem tela de boas-vindas, sem orientacao do que fazer primeiro, sem prompt para fazer o primeiro post / seguir 3 pessoas / explorar uma categoria. **NAO PASSA o test do Pilar 4 de Aura (Presentation > intrinsic).**

**Veredito Pilar 8:** PARCIAL. A foundation tecnica e boa, mas falta a **camada de cuidado intencional** que separa produto de produto premium.

---

### 1.4 Aura (Premium Packaging Strategist) — As 5 perguntas diagnosticas

**Pricing observado:** Free R$0 / Pro R$97 / Premium R$197. Posicionamento explicito de premium. As 5 perguntas:

#### 1. Qual o ONE custom craft element?
- Tipografia: Inter + JetBrains Mono. **Commodity.** Inter e o Helvetica do SaaS. JetBrains Mono e bom mas nao proprietario.
- Iconografia: Lucide. **Commodity.** Excelente lib mas e a default de qualquer projeto shadcn.
- Motion: existem 5 easings nomeados (`craft`, `spring`, `decisive`...). **Sinal de craft latente** — mas nao tem assinatura visual unica. Ninguem reconheceria sinapse pelo motion.
- Ilustracao: nao identifiquei sistema proprio.
- **VEREDITO:** ZERO custom craft elements em producao. **Aura BLOQUEIA.** Para um produto que cobra R$197/mes, isso e o gap #1.

#### 2. Onde esta a friccao estrategica?
- Cadastro: Supabase auth padrao + onboarding 4-step. Nao ha friccao strategica — e funil padrao "remove friction at all costs".
- Pricing: 3 tiers, comparison table commodity. Sem "Contact us" para Enterprise. Sem waitlist. Sem invite-only para algum tier.
- Posting: aberto para qualquer free user (3 threads/mes). Sem ceremony para o primeiro post.
- **VEREDITO:** ZERO friccoes estrategicas. **Aura BLOQUEIA.** Premium sem friccao = commodity com sticker premium.

#### 3. Choreography dos primeiros 5 minutos?
- Inexistente. Onboarding termina e cospe o usuario no `/forum` cheio de posts de outras pessoas. Sem tela de boas-vindas, sem "primeira acao guiada", sem ceremony.
- **VEREDITO:** **Aura BLOQUEIA.** Pilar 4 (Presentation > intrinsic) violado de forma critica.

#### 4. Design system multi-surface documentado?
- Existe foundation (caioimori-design-system) mas nao tem versionamento, nao tem dialetos por surface declarados, nao tem owner por token, nao cobre email transacional nem invoice PDF.
- **VEREDITO:** **PARCIAL.** Atlas pode operar mas precisa formalizar. Aura aceita condicional.

#### 5. Fatura PDF e emails transacionais casam com o site?
- Email auth Supabase: **default Supabase tier**. Mailchimp-tier visual. Nao casa.
- Recibo Abacate Pay: **default Abacate**. Nao casa.
- **VEREDITO:** **Aura BLOQUEIA.** Principio 5 (consistencia multi-surface) violado de forma terminal. Esse e o vazamento mais facil de tampar e o que mais drena premium.

**Sintese Aura:** **3 dos 5 principios em estado de bloqueio formal.** O preco de R$197/mes esta sustentado hoje **por substancia (comunidade, conteudo, network effect) e nao por packaging**. Isso e perigoso porque:
1. Comoditizadores podem copiar o substrato funcional rapido
2. O proprio preco subjetivo dos usuarios fica vulneravel a comparacao com Discord (free), Skool (pago), Circle (pago)
3. Sem packaging premium, churn por "nao parece valer R$197" e estrutural, nao circunstancial

**Diagnostico Aura:** O produto **merece** o premium pelo conteudo, mas **nao se apresenta** como premium. A apresentacao e que sustenta retencao premium — nao a substancia.

---

## 2. Sintese Canvas — 10 Acoes Prioritarias

Cada acao e classificada por **Impacto** (1-5 estrelas) e **Esforco** (S/M/L). A coluna **Tipo** indica se e quick-win, structural, ou strategic. Ordenado por relacao impacto/esforco.

| # | Acao | Pilar(es) | Owner | Impacto | Esforco | Tipo |
|---|------|-----------|-------|---------|---------|------|
| **1** | Remediar emails transacionais (auth, billing, notificacao) com layout no design system. | 9, 10 | Atlas + Aura | ★★★★★ | M | Structural quick-win |
| **2** | Substituir cores hardcoded (`text-rose-500`, `text-blue-500`, `bg-zinc-800`...) por tokens semanticos do design system. Eliminar drift no forum. | 9 | Atlas | ★★★★ | S | Quick-win |
| **3** | Reformular empty states do forum (sem threads / tab Seguindo / profile vazio) para o nivel do empty state de notificacoes. Cada um e uma mini-LP intencional. | 8 | Axiom | ★★★★ | S | Quick-win |
| **4** | Desenhar `First 5 Minutes Choreography` real: tela de boas-vindas pos-onboarding com 3 acoes guiadas (faca seu primeiro post / siga 5 pessoas / escolha 2 categorias). | 8, 10 | Axiom + Aura | ★★★★★ | M | Strategic |
| **5** | Identificar e produzir o ONE custom craft element. Recomendacao: **iconografia proprietaria de 24-32 icones core** (substituindo Lucide nas areas de heroismo: sidebar, acoes do thread, tabs, badges) — single-stroke, monochrome, alinhada ao tom B&W. Lucide segue para o resto. | 10 | Aura + Kern (squad-artdir) | ★★★★★ | L | Strategic |
| **6** | Adicionar friccao estrategica em 1 lugar: tier "Founders" de R$497/mes invite-only, com badge proprio + acesso a Caio/Matheus. NAO substitui Premium — adiciona como teto. | 10 | Aura + squad-commercial | ★★★★ | M | Strategic |
| **7** | Inventario formal das 7 surfaces + token registry com owner e justificativa por token + versionamento semver inicial v0.1.0. Agendar drift audit trimestral. | 9 | Atlas | ★★★ | M | Structural |
| **8** | Adicionar atalhos de teclado visiveis: `c` para compose, `j/k` para navegar feed, `g+f` para forum, `g+n` para notificacoes, `?` para mostrar todos. Display: tooltip "Press ?" no topbar. | 8 | Axiom + Pulse | ★★★ | M | Structural |
| **9** | Substituir auto-scroll infinito da `themes-bar` por chips fixos com scroll horizontal manual (touch / mouse-wheel hijack). Motion sem proposito = ruido em surface diaria. | 8, 4 | Axiom + Tempo | ★★★ | S | Quick-win |
| **10** | Pricing page in-product: trocar comparison table commodity por **3 cards verticais com retorica narrativa por tier** (Free = "Aprenda olhando" / Pro = "Aprenda fazendo" / Premium = "Aprenda construindo") + tabela comparativa AO FINAL, nao no topo. | 6, 10 | Convert + Aura | ★★★★ | M | Strategic |

### Mapa impacto x esforco

```
                    Esforco S          Esforco M          Esforco L
Impacto ★★★★★      —                 #1 (emails)       #5 (icon system)
                                       #4 (5min choreo)
Impacto ★★★★       #2 (token drift)  #6 (Founders tier)  —
                    #3 (empty states) #10 (pricing)
Impacto ★★★         #9 (themes-bar)   #7 (registry)      —
                                       #8 (atalhos)
```

**Ordem de execucao recomendada (estrategica):**
1. **Sprint 1 (1 semana):** #2, #3, #9 — quick wins de drift + empty states + themes-bar
2. **Sprint 2 (2 semanas):** #1, #7 — remediacao de emails + token registry formal
3. **Sprint 3 (2 semanas):** #4, #10 — choreography 5min + pricing narrativa
4. **Sprint 4 (3+ semanas):** #5, #6 — iconografia proprietaria + Founders tier
5. **Continuous:** #8 — atalhos de teclado conforme rotas estabilizam

---

## 3. Quality Gates do workflow `saas-platform-art-direction-cycle`

| Gate | Status | Justificativa |
|------|--------|---------------|
| `commodity_audit_passed` | **CONCERNS** | Forum visualmente clona Twitter; 0 custom craft em producao |
| `canonical_tokens_defined` | **PASS** | caioimori-design-system declarado e em uso majoritario |
| `billing_pdf_and_email_in_surface_inventory` | **FAIL** | Nao inventariados — Mailchimp-tier e Abacate default |
| `dark_mode_parity` | **CONCERNS** | Dark mode estrutural OK; cores hardcoded comprometem |
| `custom_craft_element_identified` | **FAIL** | Inter + Lucide + Tailwind defaults — nada proprietario |
| `first_5_minutes_choreography_documented` | **FAIL** | Onboarding 4-step termina em redirect cru ao /forum |
| `five_premium_principles_honored` | **FAIL** | 3 dos 5 principios bloqueados por Aura |
| `pillar_8_9_10_validated` | **CONCERNS** | Pilar 8 parcial, Pilar 9 parcial, Pilar 10 falho |

**Verdict consolidado Canvas:** **CONCERNS** — produto tem foundation rara mas precisa de remediation explicita para legitimar premium. As 10 acoes acima sao a remediation list.

---

## 4. Estimativa qualitativa de upside premium

| Cenario | Percepcao "vale R$197/mes" | Risco de churn por commodity |
|---------|---------------------------|------------------------------|
| **Hoje** | 60% — sustentado pelo conteudo, nao pelo packaging | ALTO |
| **Apos sprint 1+2** (acoes 1-3, 7, 9) | 75% — drift removido, emails e empty states elevados | MEDIO |
| **Apos sprint 3** (acoes 4, 10) | 85% — onboarding e pricing viram exhibits | BAIXO |
| **Apos sprint 4** (acoes 5, 6) | 92% — custom craft e Founders tier criam unfakeable signals | MUITO BAIXO |

**Leitura Aura:** O salto mais brutal de percepcao premium acontece com a acao **#5** (iconografia proprietaria). E o unico investimento que cria sinal nao-falsificavel duradouro. Os outros 9 sao saneamento e estrutura — necessarios mas nao suficientes.

---

## 5. Proximos passos praticos

### 5.1 Imediato (esta semana)
- Aprovar este relatorio com Caio
- Abrir epic `epic-art-direction-community-v1` com 4 sub-stories alinhadas aos sprints 1-4
- Sprint 1 vai para @sm criar as stories de drift removal + empty states + themes-bar

### 5.2 Curto prazo (proximas 2 semanas)
- @data-engineer: investigar configuracao de templates de email Supabase (existe override?)
- @analyst (Scope): pesquisar 3-5 referencias de iconografia proprietaria para feed de inputs do icon system (Linear, Vercel Geist Icons, Phosphor custom forks)
- @council-orqx: pressurizacao estrategica sobre o tier Founders (preco, posicionamento, escassez)

### 5.3 Medio prazo (1-2 meses)
- Iconografia proprietaria entregue com 24-32 icones core
- Token registry formalizado com semver e owner
- Choreography de 5 minutos em producao
- Pricing page com narrativa em vez de comparison table

### 5.4 Continuous
- Atlas conduz drift audit trimestral
- Vertex re-benchmarka canon trimestralmente
- Aura faz commodity audit a cada nova feature antes de aprovar

---

## 6. Apendice — Referencias do canon utilizadas

- **Linear:** velocity-as-aesthetic, 1 accent forever, product-is-the-hero, atalhos visiveis no feed (esta em `saas-art-direction-canon.md` - secao 1)
- **Vercel:** custom typeface (Geist) como sinal de craft (canon secao 2)
- **Stripe:** light-first como trust signal (canon secao 3) — sinapse JA fez essa escolha
- **Raycast:** keyboard-first como aesthetic, "one red dot can justify $10/month" (canon secao 6)

KBs consultados:
- `squads/squad-artdir/knowledge-base/saas-art-direction-canon.md`
- `squads/squad-artdir/knowledge-base/premium-packaging-principles.md`
- `squads/squad-artdir/knowledge-base/ten-pillars-framework.md`

---

*Relatorio v1 emitido por Canvas (artdir-orqx) coordenando Vertex, Atlas, Axiom e Aura | squad-artdir v2.0 | sob orquestracao de Imperator (sinapse-orqx) | 2026-04-12*
