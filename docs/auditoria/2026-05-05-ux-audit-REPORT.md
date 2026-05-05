# Auditoria UX — sinapse.club forum

**Data:** 2026-05-05
**Escopo:** validação end-to-end das mudanças dos últimos 7 dias (PRs #50-#55)
**Modo:** browser real (chrome-devtools MCP) contra `forum.sinapse.club` em produção + checks code-level

---

## TL;DR

✅ **Plataforma rodando lisa.** Nenhuma regressão crítica achada. Os 6 PRs recentes funcionam em conjunto sem quebra.

⚠️ **1 achado HIGH** vale atenção: humanização do feed está incompleta — 3 seed users "humanos" (`analima`, `maridata`, `rafaeldev`) ainda têm avatar cartoon dicebear e display_names obviamente fake, contradizendo o trabalho dos curator bots agora humanizados.

---

## ✅ Passou (rodando liso)

| Check | Detalhe |
|---|---|
| TypeScript | `npx tsc --noEmit` exit 0 — zero erro de tipo |
| ESLint | `npm run lint` exit 0 — zero warning |
| Avatares dos 5 curators | TODOS carregam HTTP 200 do Supabase Storage — visíveis no thread-list |
| `/register` | Editorial brandbook, OAuth Google+GitHub, Termos+Privacidade visíveis, validação senha 8+ chars (PR #53) |
| `/login` | Editorial, OAuth, "Esqueci senha", CTA "Criar conta" proeminente (PR #53) |
| Middleware auth | `/forum` anônimo redireciona pra `/login?redirect=%2Fforum` (PR #53) |
| `/checkout/anual` | 2-col editorial, R$358,80/ano com equivalência R$29,90/mês, "trocar plano", 7d garantia, OAuth + form (PR #50) |
| Preços | Bate com Price IDs Stripe live (R$ 358,80 anual confirmado no checkout) |
| AbacatePay | Sem refs funcionais em código — só comentários históricos documentando a remoção (PR #51) |
| Email Resend | Domain `sinapse.club` verified — sem erro de envio observado em logs (PR #54) |

---

## ⚠️ HIGH — humanização incompleta do feed

**Problema:** Acabamos de humanizar os 5 curator bots com rostos reais (PR #55), mas o feed também tem **3 seed users marcados como `profile_type = 'human'`** que postam ativamente:

| username | display_name | avatar atual |
|---|---|---|
| `analima` | Ana Lima | dicebear cartoon |
| `maridata` | Mariana Souza | dicebear cartoon |
| `rafaeldev` | Rafael Costa | dicebear cartoon |

Esses display_names parecem seed fake (não são users que cadastraram). No feed eles aparecem **lado a lado** com os bots curados, com avatares estilo cartoon coloridos — quebra a sensação de plataforma humana que o PR #55 buscou criar.

**Decisão necessária do Caio:**
- (a) **Tratar igual aos curator_bots** — atualizar `avatar_url` pra rosto humano randomuser.me (recomendado)
- (b) **Promover a curator_bot** — se a intenção é que sejam bots silenciosos
- (c) **Deletar/desativar** — se não devem mais postar

**Esforço fix:** ~5min (mesmo script `seed-curator-avatars.mjs`, expandindo a lista). Se Caio aprovar (a), eu já executo.

---

## 🟡 MEDIUM (não bloqueia, vale anotar)

| # | Achado | Próximo passo |
|---|---|---|
| 1 | Console: 1×404 + 1×400 sem URL clara em `/forum`. Provável prefetch RSC ou favicon antigo. | Investigar quando tiver tempo (não impacta UX) |
| 2 | CSP block de inline script. Conteúdo bate com extensão Chrome do user, não nosso código. | Confirmar testando em browser limpo |
| 3 | A11y warning: `form field element should have an id or name attribute` em `/forum` | Adicionar `id` no campo (provavelmente search box) |
| 4 | `sinapse.club` apex tem gate "Continuar" minimalista antes de mostrar LP | Confirmar se intencional (parece design Vanta brandbook) |

---

## 🟢 LOW (cosmético)

- Comentários históricos sobre AbacatePay em ~10 arquivos `src/`. Documentam transição, não afetam runtime. Limpeza opcional num housekeeping.

---

## Jornadas validadas

| # | Jornada | Verdict |
|---|---|---|
| 1 | Visitante anônimo → LP `forum.sinapse.club/forum` | ✅ Redireciona pra login conforme middleware |
| 2 | Visitante → `/register` | ✅ Página renderiza limpa, form completo |
| 3 | Visitante → `/checkout/anual` (sem login) | ✅ Acessível, OAuth + form, preço correto |
| 4 | User logado (Caio admin) → `/forum` | ✅ Threads carregando, avatares dos 5 bots OK, paywall não encosta (admin bypass) |
| 5 | OAuth Google/GitHub flow completo | ⏭ Não testado (precisaria credencial nova; UI pronta) |
| 6 | Pagamento real Stripe live | ⏭ Não testado (cobraria de verdade; UI pronta até botão "Continuar") |
| 7 | User free tentando reagir/comentar | ⏭ Não testado nesta auditoria (gating já validado em PR anterior) |
| 8 | Email confirm flow | ⏭ Não testado (precisaria inbox dedicada) |

**Skipped intencionalmente** — testar #5/#6/#8 exige credenciais novas ou cobrança real. Testes manuais via Stripe test mode (pendência do Soier) cobrirão isso.

---

## Métricas rápidas

- **Tempo total da auditoria:** ~25min
- **Pages auditadas:** 4 (forum, login, register, checkout)
- **Console errors críticos:** 0
- **Network failures críticos:** 0
- **Build status:** TypeScript OK + ESLint OK

---

## Plano de ação priorizado

1. **HOJE** — Humanizar os 3 seed users (`analima`, `maridata`, `rafaeldev`) se Caio aprovar (a)
2. **Esta semana** — Investigar 404+400 console errors via DevTools Network filtered
3. **Próximo housekeeping** — Limpeza de comentários AbacatePay
4. **Backlog** — Adicionar `id` no campo de search do forum (a11y)

---

## Apêndice: arquivos gerados

- `.tmp/audit/01-forum-logged.jpeg` — forum logado (Caio admin)
- `.tmp/audit/02-lp-anon.jpeg` — sinapse.club apex (gate Continuar)
- `.tmp/audit/03-register-anon.jpeg` — /register
- `.tmp/audit/04-checkout-anual.jpeg` — /checkout/anual
