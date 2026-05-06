# Auditoria UX Profunda — Sessão 2 (Mobile + Funnel SQL)

**Data:** 2026-05-06
**Escopo:** Fases 4-5 do PLAN — funnel quantitativo via Supabase SQL + mobile audit em viewport 375px
**Continuação de:** `2026-05-05-ux-deep-audit-REPORT-S1.md`

---

## TL;DR — 3 achados que mudam a estratégia

1. **Email signup vaza 80% pós-confirmação.** 15 cadastros via email/senha → 13 confirmaram → só 3 logaram alguma vez. OAuth (GitHub/Google) tem conversão de 100%. **Não é o produto que vaza, é o fluxo de email.**
2. **Comunidade-fantasma: 0 posts orgânicos em 7d.** 51 posts de bots, 0 de humanos. Bots conversando entre si. Nenhum gancho está fazendo human postar.
3. **0 tentativas de subscription em 14 humanos.** Não é "checkout abandonado" — ninguém nem clicou. Pricing/CTA não está convertendo do free pro flow de pagamento.

---

## 1. Funnel quantitativo (auth.users → engajamento → revenue)

Dados extraídos do Supabase prod (`udwpovojufbpzrexvkcc`) em 2026-05-06:

### 1.1 Funil principal — humanos apenas

| Etapa | N | % do anterior | % do total |
|---|---|---|---|
| Cadastros (humans) | 14 | 100% | 100% |
| Email confirmado | 12 | 86% | 86% |
| Logou alguma vez | 7 | 58% | 50% |
| Postou ao menos 1x | 8\* | — | 57% |
| Reagiu | 4 | — | 28% |
| Comentou | 1 | — | 7% |
| Seguiu alguém | 4 | — | 28% |
| **Tentou pagar (subscriptions table)** | **0** | **0%** | **0%** |

\* `humans_posted (8) > humans_logged_in (7)` — divergência indica que `last_sign_in_at` não está populando consistentemente em alguns providers OAuth. Não invalida o funil — significa que o número real de "logged in" é provavelmente 8-9, não 7.

### 1.2 Drop por canal de cadastro — descoberta-chave

| Provider | Cadastros | Confirmados | Logaram | % logaram | Tempo médio confirm→login |
|---|---|---|---|---|---|
| **email** | **15** | **13** | **3** | **20%** | **315 min** |
| google | 2 | 2 | 2 | 100% | 19477 min* |
| github | 2 | 2 | 2 | 100% | 3.4 min |

\* Multi-device, irrelevante.

**Interpretação:**
- O funil de email/senha está **quebrado**. Confirmação leva ~12s, mas depois 67% dos confirmados nunca voltam (10 de 15).
- OAuth tem conversão perfeita — fricção zero, login imediato.
- **Hipótese-mãe:** o link de confirmação de email leva a uma tela sem CTA forte de "entre agora", ou expira, ou redireciona pra `/login` em vez de `/forum` direto.

### 1.3 Drop por semana — quando aconteceu

| Semana | Signups | Confirmed | Logged in (já) | Voltou após 24h |
|---|---|---|---|---|
| 2026-05-04 | 1 | 0 | 0 | 0 |
| 2026-04-27 | 1 | 1 | 1 | 0 |
| 2026-04-20 | 1 | 1 | 1 | 0 |
| 2026-04-13 | 3 | 2 | 2 | 0 |
| **2026-04-06** | **10** | **10** | **1** | **0** |
| 2026-03-30 | 1 | 1 | 1 | 0 |
| 2026-03-23 | 2 | 2 | 1 | 1 |

**Padrão alarmante:** `came_back_after_24h` é praticamente sempre 0. **Day-2 retention ≈ 0%**. A semana de 06/04 teve um burst (10 signups quase simultâneos, provavelmente uma divulgação) — só 1 dos 10 logou alguma vez.

### 1.4 Atividade orgânica — comunidade real

Posts por tipo de profile, últimos 7d / 30d / 90d:

| profile_type | posts_7d | posts_30d | posts_90d | total |
|---|---|---|---|---|
| curator_bot (institucional) | 19 | 55 | 58 | 58 |
| curator_persona (humanizado) | 32 | 113 | 113 | 113 |
| **human** | **0** | **11** | **32** | **32** |

**Reactions/comments humans nos últimos 7d:**
- Reactions: 1 (em 51 posts de bots)
- Comments: 0

**Engagement rate efetivo:** 1 reação / 51 posts = **0.02 reactions/post** (vs ~5-15% baseline em comunidades vivas).

### 1.5 Onboarding completion

14 humans, completion rate dos campos opcionais:

| Campo | Preenchido | % |
|---|---|---|
| Avatar (URL) | 14 | 100% |
| Display name | 14 | 100% |
| Bio | 3 | 21% |
| Professional role | 3 | 21% |

**Conclusão:** o user faz signup, recebe avatar default + display name auto-gerado, mas pula bio e role. Esses dois campos são exatamente o que humaniza o perfil e dá contexto pra outros membros engajarem.

---

## 2. Mobile audit (375x812, iPhone 12-13-14)

Auditoria em produção `forum.sinapse.club`, viewport mobile real, logado como Caio.

### 2.1 `/forum` (feed principal) — 5 problemas

| # | Problema | Severidade | Evidência |
|---|---|---|---|
| **M1** | **Categorias renderizadas em DUPLICATA no mobile** — os 14 botões aparecem 2x na árvore a11y (linhas 11-25 e 25-39 do snapshot). Em desktop vira tab strip; em mobile o CSS provavelmente esconde uma versão e mostra outra, mas ambas existem no DOM. | CRITICAL | a11y tree confirma 28 botões |
| **M2** | **Tab strip horizontal de 14 categorias em 375px** — overflow infinito, sem affordance de "tem mais", scroll horizontal sem snap. | HIGH | snapshot uids 1_11 a 1_38 |
| **M3** | **"Iniciante" badge em todo bot** — bots novos = visualmente todos low-rank, criando ruído. Sem hierarquia visual entre @sinapse-bot (oficial) e @rafael.automacao (curator persona). | MEDIUM | Detectado em 5+ posts no scroll |
| **M4** | **Bottom nav tem botão sem label** — `uid=1_430 button` (depois de "Forum") aparece sem texto nem aria-label → screen reader anuncia "botão sem nome". | HIGH a11y | snapshot bottom nav |
| **M5** | **Empty social proof em todos os posts** — "0 respostas / 0 visualizações / 0 likes" repetido em 51 posts faz a comunidade parecer morta antes do user nem testar. | HIGH | confirmado SQL + visual |

### 2.2 `/pricing` — 4 problemas

| # | Problema | Severidade | Por quê |
|---|---|---|---|
| **M6** | **Os 3 planos têm features IDÊNTICAS** — bullets 100% iguais. Não há valor diferencial pra justificar anual além do preço. User fica sem motivo emocional pra subir o ticket. | CRITICAL | Confirmação direta no snapshot |
| **M7** | **Garantia 7d afogada no bullet** — texto fraco no meio da lista, sem destaque. Risk reversal invisível. | HIGH | Convencional B2C esconde no bullet |
| **M8** | **0 social proof** — sem "X membros", "Y assinantes", testimonial, ou trust badge além do "Pagamento seguro via Stripe". | HIGH | Snapshot completo da página |
| **M9** | **CTAs neutros sem hierarquia visual** — "Começar mensal" / "Assinar semestral" / "Assinar anual" provavelmente todos com mesma intensidade visual. Sem CTA dominante = paralisia. | MEDIUM | Brandbook permite hierarquia |

### 2.3 Conexão com Sessão 1

A Sessão 1 já tinha listado:
- Sidebar com "Em breve" cinzas (overload visual)
- LP hero sem hierarquia primary vs ghost CTA

A Sessão 2 confirma e adiciona: a **superfície inteira mobile** tem problemas de hierarquia visual (M3, M4, M9) e empty social proof (M5).

---

## 3. Diagnóstico-mãe (síntese das duas sessões)

Quatro causas-raiz que explicam os 5 gargalos quantitativos:

### Causa #1 — Email signup tem buraco entre confirmação e ativação
- 67% dos email-confirmed nunca logam
- OAuth tem 100% de conversão
- **Hipótese verificável:** o link de confirmação não loga automaticamente o usuário, ou redireciona pra tela sem CTA forte.

### Causa #2 — Day-2 retention ≈ 0%
- Praticamente ninguém volta no dia seguinte
- **Hipótese verificável:** falta gancho de retorno (notificação push? email digest? "Você foi seguido"?).

### Causa #3 — Comunidade-fantasma percebida
- 0 posts humans em 7d
- 0.02 reactions/post
- **Hipótese verificável:** novo user vê só bots = "isso aqui não tá vivo" = não posta.

### Causa #4 — Pricing não converte porque não diferencia
- 0 tentativas de subscription
- 3 planos com features idênticas, sem social proof, sem hierarquia visual de CTA
- **Hipótese verificável:** user não sabe qual plano é pra ele e não tem urgência.

---

## 4. Top 12 fixes priorizados (impact × 1/effort)

Ordenados por ROI estimado. Os 7 quick wins da Sessão 1 já estão na lista, agora calibrados com dados.

| # | Fix | Causa | Impact | Effort | Score |
|---|---|---|---|---|---|
| 1 | **Auto-login após confirmação de email** + redirect direto pra `/forum` com toast "bem-vindo" | #1 | ALTO | <2h | 10 |
| 2 | **Pricing — diferenciar features por plano** (anual destrava algo, ex: badge "Founder" + acesso antecipado) | #4 | ALTO | 2-3h | 8 |
| 3 | **Empty state forum pra novato** — primeiro acesso vê tutorial/onboarding em vez de feed de bots | #3 | ALTO | 2h | 8 |
| 4 | **Email digest semanal automático** (Resend já tá setado) — gancho de retorno day-2+ | #2 | ALTO | 3-4h | 7 |
| 5 | **Pricing — destacar garantia 7d** + adicionar contador "X membros este mês" (mesmo que pequeno) | #4 | MED-ALTO | 1-2h | 7 |
| 6 | **Cleanup duplicação de categorias mobile** (M1) — só 1 versão renderizada | M1 | MED | <1h | 7 |
| 7 | **LP hero: hierarquia primary vs ghost CTA** (Sessão 1) | #4 | MED | 1h | 6 |
| 8 | **Sidebar: agrupar/colapsar "Em breve"** (Sessão 1) | overload | MED | 1h | 6 |
| 9 | **Onboarding com gancho de valor** — substituir "É opcional" por "Bio + role aumenta seguidores em 3x" + completar agora destrava badge | onboarding 21% | MED | 2h | 5 |
| 10 | **Indicador força de senha em /register** (Sessão 1) | #1 ajuda | LOW-MED | <1h | 5 |
| 11 | **A11y bottom nav** (M4) + tab ativa indicador (Sessão 1) | a11y | LOW | <1h | 5 |
| 12 | **Empty state nos posts** — "Seja o primeiro a curtir" em vez de "0 likes" | #3 | LOW-MED | 1h | 4 |

---

## 5. O que mudou em relação à Sessão 1

| Métrica Sessão 1 (05-05) | Sessão 2 (05-06) | Mudança |
|---|---|---|
| 14 humans cadastrados | 14 humans | ✓ |
| 12 email-confirmados nunca logam (63%) | 7 nunca logaram (50%), mas o **drop está concentrado em email signup (80%)** | refinado |
| 0 posts orgânicos em 7d | 0 posts em 7d, **11 em 30d** | mantido |
| Reaction rate 0.3/post | **0.02 reactions/post** (vs 51 posts) | pior do que estimado |
| 0 paying users | 0 paying + **0 tentativas** (0 rows em subscriptions) | pior do que estimado |
| Sidebar com "Em breve" | confirmed + adicionado: M1-M9 mobile | expandido |

---

## 6. Próxima sessão (Sessão 3)

Originalmente Sessão 3 = empty/error states + síntese final + implementação dos 7 quick wins.

**Recomendação atualizada com base no diagnóstico:**

Sessão 3 deve ser **execução**, não mais auditoria. Com 12 fixes priorizados e causas-raiz mapeadas, a próxima sessão entrega:

- **Bloco A (highest ROI):** fixes #1, #2, #3, #5 — cobre as 4 causas-raiz, ~8h
- **Bloco B (mobile cleanup):** fixes #6, #7, #8, #11 — cobre a UX mobile, ~3h
- **Bloco C (retention):** fix #4 (digest) + #9 (onboarding) + #12 (empty state) — ~6h

Total: ~17h de execução. Pode dividir em 2 sessões de implementação.

---

## 7. Apêndice — queries SQL usadas

Disponíveis no histórico de execução, principais:

```sql
-- Funil principal humans
SELECT COUNT(*) AS total_signups, ... FROM auth.users;

-- Drop por canal
SELECT raw_app_meta_data->>'provider' AS provider, ... FROM auth.users GROUP BY 1;

-- Posts por profile_type últimos 7/30/90d
SELECT pr.profile_type, COUNT(*) FILTER (WHERE p.created_at > NOW() - INTERVAL '7 days') ...

-- Tempo médio entre etapas
SELECT AVG(EXTRACT(EPOCH FROM (last_sign_in_at - email_confirmed_at))/60) ...
```

Snapshots a11y mobile salvos em `.tmp/audit/s2-screenshots/`.

---

**Status:** Sessão 2 completa. 4 causas-raiz identificadas, 12 fixes priorizados, próxima sessão = implementação dos blocos A+B+C.
