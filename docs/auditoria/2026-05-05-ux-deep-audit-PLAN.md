# Plano — Auditoria UX Profunda do Forum

**Data:** 2026-05-05
**Escopo:** TODAS as jornadas do usuário em forum.sinapse.club, do primeiro contato à retenção
**Diferença da auditoria de 2026-05-05 manhã:** aquela validou regressão de PRs recentes; **esta** identifica gargalos UX sistêmicos pra elevar conversão e retenção.

---

## Por quê agora

Plataforma está estável (auditoria anterior PASS). Próximo bloco de valor não é "o que quebrou", é **"o que está abaixo do potencial"**: friction points, micro-frustrações, padrões anti-conversão, cognitive overload. Esses gargalos não aparecem em test funcional — só num percorrer literal de cada tela com lente crítica.

---

## 7 fases (ordem de execução)

### Fase 1 — Mapa completo de jornadas (1h)
Listar TODAS as jornadas possíveis no produto, marcar status. Output: `docs/auditoria/journey-map.md`.

| Jornada | Persona | Trigger | Outcome esperado |
|---|---|---|---|
| Anônimo descobre forum | tráfego orgânico/ads | LP ou link compartilhado | clica CTA cadastro |
| Cadastro Google/GitHub OAuth | curioso | clicou cadastro | confirmou email + completou onboarding |
| Cadastro email/senha | privacidade-cético | preferiu não OAuth | confirmou email |
| Free tenta postar/reagir | cadastrado free | tocou em ação gateada | converteu pra paid OU desistiu |
| Free vê thread paywall | navegando feed | bateu em thread premium | viu paywall + conversão |
| Free upgrade pra pro | gostou do conteúdo | clicou pricing | concluiu Stripe checkout |
| Paid first post | recém-pagou | quis publicar | postou + reação |
| Paid descobre features | onboarded | navegando | usou bookmark/follow/etc |
| Paid recebe notif | atividade da comunidade | alguém curtiu/respondeu | abriu notif + reciprocou |
| Admin modera | role=admin | viu post problemático | ação tomada |
| Cancelamento | unhappy | cancelou Stripe | exit interview ideal |

### Fase 2 — Heuristic evaluation Nielsen+ (2-3h)
Avaliar cada tela contra 10 heurísticas de Nielsen + 5 modernas (mobile, dark mode, motion, a11y, performance). Output: `docs/auditoria/nielsen-eval.md` com score 1-5 por heurística por tela.

Telas a avaliar:
- `/` (homepage forum logado)
- `/forum` (feed)
- `/forum/thread/:id` (detail)
- `/explore`
- `/leaderboard`
- `/notificacoes`
- `/profile/:username`
- `/settings`
- `/checkout/:plano`
- `/login` + `/register`
- `/recuperar-senha`
- `/admin/moderation` (admin only)

15 heurísticas:
1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize/diagnose/recover from errors
10. Help and documentation
11. **Mobile-first** (touch targets >= 44px, no hover-only)
12. **Dark mode parity** (contraste em ambos)
13. **Motion respect** (prefers-reduced-motion)
14. **A11y básico** (semantic HTML, ARIA, keyboard nav, screen reader)
15. **Performance** (LCP < 2.5s, no jank em scroll)

### Fase 3 — Cognitive load audit (1h)
Pra cada tela principal contar:
- Número de elementos interativos visíveis ao mesmo tempo (>9 = overload)
- Número de decisões a tomar (>3 = paralisia)
- Tempo médio de leitura do above-the-fold
- Densidade de informação (info bytes / pixel)

Output: `docs/auditoria/cognitive-load.md`

### Fase 4 — Conversion funnel deep dive (1-2h)
Tracking funnel real via SQL Supabase:
- visitas LP → cadastros (taxa)
- cadastros → email confirmados (taxa)
- email confirmados → primeira sessão (taxa)
- primeira sessão → 7d retention (taxa)
- 7d retention → primeira reação (taxa)
- primeira reação → primeira publicação (taxa)
- free → paid (taxa)
- paid 30d retention

Onde cada etapa "vaza" mais que a média de SaaS B2C (>50% drop entre etapas críticas), aprofundar com hipótese.

Output: `docs/auditoria/funnel-bottlenecks.md` com gargalos numéricos rankeados.

### Fase 5 — Mobile audit dedicado (1h)
Forum é uso mobile-heavy mas o brandbook é built desktop-first. Auditar especificamente:
- Touch targets (devem ser >= 44px)
- Sticky elements (não devem cobrir conteúdo crítico)
- Modal/sheet patterns (devem fechar com swipe)
- Form inputs (autofocus inteligente, keyboard correto)
- Performance em 3G fast (LCP)

Output: `docs/auditoria/mobile-bottlenecks.md`

### Fase 6 — Empty states + error states (45min)
A maioria de SaaS quebra em estados não-default. Auditar:
- Toda tela quando user tem 0 dados (zero notifs, zero follows, zero posts)
- Toda action que pode falhar (rede caiu, auth expirou, RLS bloqueou)
- Loading skeletons (existem? coerentes?)

Output: `docs/auditoria/edge-states.md`

### Fase 7 — Síntese + ranqueamento por impacto (1h)
Pegar tudo achado, classificar por:
- **Impact:** alto (bloqueia conversão/retenção) / médio (frustração) / baixo (cosmético)
- **Effort:** baixo (<1h fix) / médio (1-4h) / alto (>1 dia)
- **Score:** Impact × (5 / Effort) — ordenar do maior pro menor

Output final: `docs/auditoria/2026-05-05-ux-deep-audit-REPORT.md` com:
- Top 20 fixes priorizados
- 5 quick wins (alto impacto, baixo esforço — fix imediato)
- Roadmap UX por sprint (próximas 4 semanas)

---

## Tooling

| Ferramenta | Pra quê |
|---|---|
| chrome-devtools MCP | Percorrer jornadas, screenshot, console, lighthouse |
| Supabase MCP | Funnel SQL, contagem de eventos |
| Vercel logs MCP | Errors em prod últimas 7d |
| Análise crítica humana | Heurísticas (LLM faz bem, mas Caio valida final) |
| BrowserStack/Lighthouse | Mobile real (não emulado) |

---

## Tempo total estimado
- Mínimo (sem fixes): **8-10h** distribuído em 2-3 sessões
- Com quick wins implementados durante: **+4-6h**

## Como executar
Recomendo dividir em **3 sessões**:
1. **Sessão 1 (4h):** Fases 1-3 (mapping + heuristic + cognitive load) → entrega já permite ver maioria dos gargalos
2. **Sessão 2 (3h):** Fases 4-5 (funnel + mobile) → dados quantitativos validam qualitativos
3. **Sessão 3 (3h):** Fases 6-7 + implementação dos 5 quick wins → entrega valor imediato

## Output final
Um único doc consolidado `2026-05-05-ux-deep-audit-REPORT.md` com:
- Resumo executivo (tabela top 20 fixes)
- 5 quick wins implementados
- Roadmap das próximas 4 semanas
- Apêndices: journey map, nielsen scores, funnel SQL queries, screenshots

---

## Decisão pendente

Confirma o plano? Se sim, eu já começo a Sessão 1 (Fases 1-3) agora. Vai consumir ~4h da próxima sessão, mas você ganha o mapa completo de gargalos UX no fim.

Alternativamente: se preferir focar em outras frentes, eu deixo este plano salvo e retomo quando você quiser disparar.
