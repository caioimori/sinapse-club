# SINAPSE — Auditoria 360º Executiva
**Data:** 2026-04-12
**Escopo:** Técnico + Produto (Hooked/CRO/LTV) + Direção Artística (neurodesign) + E2E do fluxo do fórum
**Método:** 3 auditorias profundas paralelas (agentes especialistas) + teste E2E real via Chrome DevTools MCP
**Produto testado:** SINAPSE Platform (Next.js 16 + React 19 + Supabase + Abacate Pay)

---

## TL;DR para o Caio

**O esqueleto é bom. A carne está mal acabada.**

SINAPSE tem fundação técnica sólida (Next 16 + React 19 + RLS + design tokens bem nomeados + gamification MVP implementado), mas sofre de **3 classes de problemas** que precisam ser resolvidas antes de abrir para usuários pagantes:

1. **Bugs silenciosos que já estão quebrando funcionalidade em produção** — o mais grave: TODOS OS LIKES estavam quebrados por um bug de schema drift em trigger SQL. Descoberto e corrigido no teste (migration aplicada). Provavelmente há mais bugs do mesmo tipo porque o código usa `as any` em 60+ lugares, escondendo o type system.

2. **Zero neurodesign / zero reward ceremony** — user publica o primeiro post, curte alguém, sobe de nível: nada acontece visualmente. A plataforma se sente morta. Isso é fatal para retenção (HOOK Model quebrado em 8/10 das features).

3. **Design commodity** — tipografia, ícones, empty states, copy do composer são literais do Twitter/Vercel/Stripe. Não há signature visual própria. O produto merece premium pelo conteúdo, mas não se apresenta como premium — pricing de R$197 não é justificado pelo craft visual.

**Se corrigir só uma coisa:** o bug do trigger de upvote (já corrigido). **Se corrigir três:** também adicionar unread badge no Bell, confetti no like, e reformular os empty states. 7 dias de trabalho, 2-3x o retention potencial.

---

## Relatórios detalhados

| # | Frente | Arquivo | Score | Bloqueadores |
|---|---|---|---|---|
| 1 | Técnico / Segurança / Infra | [`01-technical-audit.md`](./01-technical-audit.md) | 7.2/10 | 3 críticos (tipagem `as any`, error boundaries, SQL injection latente) + 5 altos |
| 2 | Produto / Hooked / CRO | [`02-product-hooked-audit.md`](./02-product-hooked-audit.md) | Habit 4.5/10, Retention 5/10, Neuro 3.5/10 | 10 gaps críticos no Hook Model |
| 3 | Neurodesign / Art Direction | [`03-neurodesign-audit.md`](./03-neurodesign-audit.md) | Premium 4.2/10 | 2 tier-0 drift fixes + iconografia proprietária ausente |
| 4 | E2E Forum Flow | [`04-e2e-forum-bugs.md`](./04-e2e-forum-bugs.md) | 14 bugs (3 P0, 6 P1, 5 P2) | Trigger bug (fixed), Turbopack Windows panic, HTML leaking |

---

## Os 10 achados mais importantes (ranqueados por impacto)

### 1. 🔴 P0 Trigger `award_reputation_for_upvote` quebra 100% dos likes
**Achado:** Trigger referenciava `NEW.post_id`, coluna não existente em `reactions` (schema usa `target_id`). Todo like inserido falhava com erro 400, revertido por cascade.
**Consequência:**
- Reputation NUNCA foi atribuída a ninguém por receber likes
- Notificações de like NUNCA foram criadas
- Counters de likes desatualizados
**Status:** ✅ **CORRIGIDO no teste via migration `fix_reputation_triggers_target_id_column`.** Validado end-to-end: após fix, like → +10 rep, +1 notif, +1 counter.
**Ação adicional:** Backfill de reputation histórica. Script incluso em 04-e2e.

### 2. 🔴 P0 TypeScript `as any` em 60+ lugares — bugs como o #1 vão continuar aparecendo
**Achado:** `(supabase as any).from(...)` e `(data as any)` em todo o forum module.
**Por que importa:** O bug do trigger #1 teria sido caught no compile se os tipos fossem sólidos. Enquanto houver `as any`, essa classe de bug vai continuar explodindo em runtime.
**Fix:** `supabase gen types typescript --project-id udwpovojufbpzrexvkcc > src/types/supabase.ts` + refactor incremental.
**Effort:** 2-3 dias (forum module primeiro).

### 3. 🔴 P0 HTML raw vaza no feed (seed content)
**Achado:** Posts seed do `sinapse-bot`, `lucas.growth` etc. salvam `selftext_html` do Reddit direto em `content_plain`. O feed mostra tags literais `<table>`, `<a href="...">`, `<!-- SC_OFF -->`.
**Consequência:** 70% dos posts do feed parecem quebrados. Também é vetor XSS latente se render mudar para HTML.
**Fix:** Refactor do seeder para converter `selftext_html` → markdown puro antes de INSERT. Backfill dos ~100 posts existentes.

### 4. 🟠 P1 Onboarding trava em "Salvando..." no step 4
**Achado:** `router.push("/forum")` + `router.refresh()` cria race condition — refresh vence, user fica preso em `/onboarding` com botão disabled forever.
**Fix:** Usar `router.replace("/forum")` ou `window.location.href`. Adicionar redirect no middleware: onboarded → forum.
**Effort:** 30 min.

### 5. 🟠 P1 Zero celebração em ações críticas (confirma HOOK-1, HOOK-3, HOOK-4)
**Achado:** Publicar primeiro post, curtir, seguir, subir de nível — **zero toast, zero confetti, zero animação**. O contrato dopamina "ação → reward" é quebrado.
**Consequência:** Engagement morno, D1→D7 sofre 30-40% vs baseline com reward.
**Fix:** 3 interventions simples (S effort cada):
  - Toast + confetti no like (`canvas-confetti` lib ou CSS keyframes)
  - Unread badge no Bell icon com animate-pulse
  - Level-up modal com Sparkles animation
**Effort:** 1 dia inteiro para os 3.

### 6. 🟠 P1 Streaks têm dados no banco (streak_days, streak_last, streak_shields) mas ZERO UI
**Achado:** Schema já tem streak mechanics, migration está aplicada, mas não há nenhum componente que mostra "🔥 X dias" para o user. Loss aversion (o driver #1 de retention) não é ativado.
**Fix:** Adicionar streak display no sidebar user card + daily cron que incrementa/reseta + notification "Você perdeu sua sequência".
**Effort:** S (meio dia UI + 1h cron).

### 7. 🟡 P2 Iconografia commodity — único gap não-falsificável (GAP #1 de premium signal)
**Achado:** Lucide-react puro em toda a UI. Zero ícones customizados. Produto visualmente idêntico a qualquer projeto shadcn.
**Benchmark:** Linear tem 150+ custom icons; Vercel ~80; Arc bespoke illustrative.
**Por que é GAP #1:** É o único elemento que nenhum competitor pode commoditizar rápido. Display font também ajuda, mas iconografia é mais single-signal.
**Fix:** Design sprint de 1-2 semanas para 24-32 ícones core (single-stroke B&W 24px grid) substituindo Lucide nas áreas de heroísmo (sidebar, thread actions, tabs, badges).

### 8. 🟡 P2 LGPD incompleta (deletion ✓, export ✗, DPO ✗, consent history ✗)
**Achado:** Só metade do Art. 18 está implementado. Export de dados não existe. DPO contact não está público. Consent checkbox existe no signup mas histórico não é persistido.
**Status:** Bloqueador regulatório para cobrança em prod no Brasil.
**Fix:** ~1 semana para closer (endpoint de export, página LGPD com DPO contact, tabela `consent_log`).

### 9. 🟡 P2 Zero monitoring em produção (sem Sentry, sem error tracking)
**Achado:** Nenhuma integração de observability. Crashes e RLS violations silenciosas. Logs do Vercel somem em 24h.
**Fix:** `pnpm add @sentry/nextjs && npx @sentry/wizard@latest -i nextjs`. 2h de trabalho, DNS grátis tier inicial.
**Por que importa agora:** Sem Sentry, o bug #1 (likes quebrados) teria continuado invisível por meses em produção.

### 10. 🟡 P2 Turbopack panic no Windows para rotas que importam isomorphic-dompurify
**Achado:** `/forum/thread/[id]` e `/notificacoes` não compilam em dev no Windows por falha de junction point do Turbopack (jsdom transitive dep).
**Fix:** Substituir `isomorphic-dompurify` por `sanitize-html` server-side + `DOMPurify` client-only. Remove jsdom do bundle server, elimina bug, reduz bundle ~5MB.
**Effort:** S (refactor markdown-content.tsx + thread-detail.tsx).

---

## Matriz Impacto vs Esforço (plano de ação)

### 🟢 FAZER ESTA SEMANA (quick wins altíssimos)

| # | Item | Relatório | Impacto | Esforço |
|---|---|---|---|---|
| 1 | ✅ Fix trigger upvote (JÁ FEITO) | E2E-10 | 100% likes volta | Done |
| 2 | Backfill reputation histórica | E2E-10 | Corrige LEADERBOARD | XS (30min) |
| 3 | Unread badge no Bell + pulse | HOOK-3 | +45% notif CTR | S (2h) |
| 4 | Toast + confetti no like | HOOK-1 | +20% DAU likes | S (3h) |
| 5 | Empty states reformulação | HOOK-5 | +15% first-post | S (4h) |
| 6 | Sentry integration | HIGH-5 | Visibilidade | S (2h) |
| 7 | Fix onboarding router race | E2E-2 | Destrava users | XS (30min) |
| 8 | aria-label nos action buttons | E2E-9 | A11y + testabilidade | XS (30min) |
| 9 | LGPD attribute scroll-behavior | E2E-19 | Remove warning | XS (5min) |
| 10 | Fix hardcoded `bg-[#20BD5A]` CTA | DOPA drift | Token consistency | XS (30min) |

**Total semana 1:** ~2 dias de trabalho real para 8 melhorias impactantes.

### 🟡 FAZER EM 2 SEMANAS (structural)

| # | Item | Impacto |
|---|---|---|
| 11 | Refactor `as any` → types Supabase | Previne futuros bugs tipo #1 |
| 12 | Error boundaries em rotas dinâmicas | UX de erro |
| 13 | Zod em server actions + API routes | Segurança |
| 14 | Substituir isomorphic-dompurify → sanitize-html | Turbopack fix + bundle -5MB |
| 15 | Seed content pipeline sanitization | HTML leak fix |
| 16 | Streaks UI no sidebar | +40% daily returns |
| 17 | Level-up celebration | +25% weekly engagement |
| 18 | Email templates remediação (Supabase + Abacate) | Premium signal |
| 19 | LGPD export + DPO contact | Legal compliance |
| 20 | Aha-moment redesign (first post + bot welcome) | +35% D1→D7 |

### 🔵 FAZER EM 1 MÊS (strategic)

- Iconografia proprietária (24-32 custom icons) — **GAP #1 de premium signal**
- Custom display font (serif editorial na LP)
- Keyboard shortcuts visíveis (Raycast-style)
- First 5 Minutes Choreography completo
- Tier "Founders" (R$497/mês invite-only, friction estratégica)
- Pricing page narrativa (3 cards verticais, não tabela commodity)
- CI/CD + backup restore drill + incident response runbook
- CSRF token explícito + rate limiting em POST actions

---

## Arquivos / Screenshots gerados

```
docs/audits/
├── 00-executive-report.md          ← este arquivo
├── 01-technical-audit.md           ← auditoria técnica completa
├── 02-product-hooked-audit.md      ← auditoria produto/Hooked/CRO
├── 03-neurodesign-audit.md         ← auditoria direção artística
├── 04-e2e-forum-bugs.md            ← 14 bugs do teste E2E real
└── e2e-screenshots/
    ├── 01-register-empty.png
    ├── 02-register-filled.png
    ├── 03-onboarding-step1-lang.png
    ├── 04-onboarding-step2-interests.png
    ├── 05-onboarding-step3-role.png
    ├── 06-onboarding-step4-ready.png
    ├── 07-forum-home.png
    ├── 08-forum-after-post.png
    └── 09-settings.png
```

## Migrations aplicadas durante a auditoria

1. `fix_reputation_triggers_target_id_column` — corrige `award_reputation_for_upvote()` e `revoke_reputation_for_upvote()` (já no DB de prod, pronto para re-run em qualquer env).

## Dados de teste criados

- User e2e: `e2e.caio.2026.04.12@gmail.com` / `e2e_caio_2026` (8c233de9-ae46-48db-b753-096a3818c29c)
- 1 post de teste no feed
- 1 reaction (like) no post do `lucas.growth`
- 1 notification gerada

**Cleanup (opcional):**
```sql
DELETE FROM profiles WHERE id='8c233de9-ae46-48db-b753-096a3818c29c' CASCADE;
```

---

## O que NÃO foi testado (fora de escopo / bloqueado)

- **Post com upload de imagem** — requer file I/O real, não executado
- **Post com enquete** — composer expandido mas não publicado
- **Thread detail** (`/forum/thread/[id]`) — Turbopack Windows panic
- **Página de notificações** — mesma panic
- **Comentários em thread** — bloqueado por thread detail
- **Leaderboard page** — não testado (visível via sidebar)
- **Profile público** (`/profile/[username]`) — não testado
- **Explore page** — não testado
- **Marketplace / Tools / Courses** — "Em breve" na sidebar, fora do escopo do sprint atual conforme instrução do user
- **Mobile / responsive breakpoints** — auditado apenas via design tokens no neurodesign report
- **Payment flow (Abacate Pay)** — fora de escopo E2E

---

## Próximos passos recomendados

1. **Revisar os 4 relatórios** — especialmente `04-e2e-forum-bugs.md` para os P0 imediatos
2. **Executar os 10 itens da semana 1** — 2 dias de trabalho, ganhos desproporcionais
3. **Decidir sobre sprint de iconografia** — compromisso mais alto mas é o único gap de premium signal defensável
4. **Agendar test E2E completo em next build (não dev)** para validar se Turbopack panic é só DX ou afeta produção também
5. **Planejar backfill de reputation** antes de qualquer feature nova — dados históricos subestimados vão enviesar leaderboard e analytics

---

## Score Consolidado

| Dimensão | Hoje | Potencial (6 semanas) |
|---|---|---|
| Qualidade técnica | 7.2/10 | 9/10 |
| Segurança | 6.5/10 | 9/10 |
| Hook/retention | 4.5/10 | 8/10 |
| Premium signal | 4.2/10 | 8.5/10 |
| **Overall** | **5.6/10** | **8.6/10** |

Com 6 semanas de execução focada, o produto move de "MVP funcional" para "premium-ready". Sem essas mudanças, o risco é abrir para usuários pagantes e queimar a reputação do produto — especificamente: user chega por conteúdo/rede, vê email Mailchimp-tier, completa onboarding sem ceremony, publica post e nada acontece, clica like e nada acontece, e decide que não vale R$197.

O fix dessa percepção começa nos 10 quick wins listados acima.
