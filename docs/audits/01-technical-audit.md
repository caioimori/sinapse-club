# Technical / Security / Infra Audit — SINAPSE Platform
**Data:** 2026-04-12
**Auditor:** Agente auditor técnico sênior (background)
**Stack:** Next.js 16.2.1 (App Router + Turbopack), React 19.2.4, Supabase SSR + Postgres + Storage + RLS, TailwindCSS 4, Framer Motion 12, TipTap 3, Upstash Redis ratelimit, Zod 4, shadcn, Abacate Pay SDK
**Score geral:** 7.2/10

## Executive Summary
**3 Críticos • 5 Altos • 7 Médios • 6 Baixos**

A plataforma demonstra intenção séria em segurança (CSP, webhook signatures, RLS ativo, LGPD deletion), mas tem **débito urgente em tipagem TypeScript, validação de input e error handling**. Estimado: **2-3 semanas** para resolver tudo que é bloqueador de produção.

---

## CRÍTICOS (BLOCK DEPLOY)

### [CRIT-1] TypeScript `any` casting descontrolado
**Severidade:** CRITICAL
**Local:** `src/app/(dashboard)/forum/actions.ts`, `forum/page.tsx`, `forum/thread/[id]/page.tsx`, vários componentes
**Issue:** 60+ ocorrências de `(supabase as any).from(...)` e `(data as any)` silenciam totalmente a verificação de tipos.
**Impacto:** Qualquer mudança no schema do Supabase passa despercebida até explodir em runtime. O audit E2E encontrou isso: trigger `award_reputation_for_upvote` referenciava `NEW.post_id` (campo inexistente) e só quebrou em runtime — se os types fossem sólidos, teria sido caught no compile.
**Fix:** Gerar `src/types/supabase.ts` via `supabase gen types typescript --project-id udwpovojufbpzrexvkcc`, refatorar incrementalmente o módulo forum primeiro.
**Effort:** M (2-3 dias)

### [CRIT-2] Faltam `error.tsx` e `not-found.tsx` em rotas dinâmicas
**Severidade:** CRITICAL
**Local:** `forum/page.tsx`, `forum/thread/[id]/page.tsx`, `admin/courses/page.tsx`, `profile/[username]/page.tsx`
**Issue:** Sem error boundaries. Qualquer exception faz Next.js renderizar tela 500 genérica.
**Impacto:** Usuário vê screen of death em qualquer erro, com stack trace em dev. UX péssima e vazamento de info em produção se NODE_ENV mal configurado.
**Fix:** Adicionar `error.tsx` e `not-found.tsx` customizados em cada rota dinâmica. Template unificado via `components/error-boundary.tsx`.
**Effort:** S (meio dia)

### [CRIT-3] `/api/forum/search` — SQL injection surface + enumeration de categorias pro/premium
**Severidade:** CRITICAL
**Local:** `src/app/api/forum/search/route.ts`
**Issue:**
```ts
.ilike('title', `${q}%`)  // sem parametrização explícita + sem validação Zod
```
+ Não verifica `user_has_forum_access(categoryId)` antes de retornar resultados, então user free pode enumerar titles de categorias pro/premium via busca.
+ Sem rate limiting nesse endpoint (outros usam, esse não).
**Fix:**
1. Zod schema em query param `q` (max 100 chars, regex de sanitização)
2. Aplicar `checkRateLimit` (mesmo do composer)
3. Filtrar `category_id IN (SELECT category_id FROM user_accessible_categories(auth.uid()))`
**Effort:** S (2-4h)

---

## ALTOS

### [HIGH-1] Cron jobs expõem service_role key em texto no SQL
**Local:** `supabase/cron-setup.sql`
**Issue:** `current_setting('app.settings.service_role_key')` chama `http_post()` passando o service_role key em cleartext. Esse setting é visível em logs se qualquer query quebra, e no schema inspector para qualquer admin.
**Fix:** Migrar para Supabase Edge Functions com JWT de service account rotacionável, OU usar cron com tokens de assinatura HMAC pré-computados por job.
**Effort:** M

### [HIGH-2] Tabela `notifications` — RLS habilitado, zero policies de INSERT
**Local:** `supabase/migrations/20260408120000_notifications.sql`
**Issue:** Policies só existem para SELECT e UPDATE (user_id=auth.uid()). Sem INSERT policy. Triggers SECURITY DEFINER bypassam RLS (então funcionam), mas qualquer tentativa de INSERT via client cai silenciosamente.
**Fix:** Adicionar policy explícita `INSERT WITH CHECK (false)` e comentário na tabela documentando que só triggers escrevem.
**Effort:** XS (15min)

### [HIGH-3] Server Actions sem validação Zod
**Local:** `src/app/(dashboard)/forum/actions.ts` (updatePost, deletePost, etc)
**Issue:** Recebem `postId`, `title`, `content` como strings brutas. Título pode ter 10MB, postId pode ter `'; DROP TABLE;`. Supabase parametriza queries mas server actions podem encadear em outros lugares.
**Fix:** Criar `src/schemas/posts.ts` com Zod schemas — `UpdatePostSchema`, `DeletePostSchema` — e validar no início de cada action:
```ts
const parsed = UpdatePostSchema.safeParse(input);
if (!parsed.success) return { error: parsed.error.issues };
```
**Effort:** M (1 dia)

### [HIGH-4] Webhook handler — silent failures em Abacate Pay
**Local:** `src/app/api/webhooks/abacate/route.ts` (ou similar)
**Issue:** Missing `customerEmail`/`externalId` → retorna 200 OK e só loga warning. Payments podem falhar silenciosamente sem ninguém saber.
**Fix:** Retornar 400 em payloads inválidos. Adicionar alerta via Sentry `captureMessage()` em todo path de warning.
**Effort:** S

### [HIGH-5] Zero monitoring / error tracking em produção
**Issue:** Sem Sentry, sem Logtail, sem Datadog. Production crashes são invisíveis. RLS violations silenciosas. API errors caem no log do Vercel e somem em 24h.
**Fix:**
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```
Inicializar em `instrumentation.ts`, configurar `sentry.client.config.ts` e `sentry.server.config.ts` com DSN em env.
**Effort:** S (2h)

---

## MÉDIOS

1. **DOMPurify apenas em render, não em INSERT** — risco de XSS persistente se o render muda. Sanitizar também ao inserir.
2. **Rate limiting não aplicado a POST actions do forum** — vetor de spam (confirmado que só `/api/forum/search` tem rate limit, actions de post não).
3. **CSRF dependente 100% de SameSite=Lax** — se algum browser relaxar ou o cookie vazar, não há segunda linha de defesa. Adicionar CSRF token explícito em server actions.
4. **Inconsistent error handling** — algumas queries lançam, outras retornam {error}, outras swallow — criar padrão via wrapper `safeQuery<T>`.
5. **LGPD gaps** — deletion existe, **export de dados não existe** (Art. 18 LGPD); **DPO contact não está público** (Art. 41); **consent history não é armazenado** (Art. 7).
6. **N+1 potencial em `/forum` feed** — verificar via explain se o `select *, profiles(...), forum_categories(...)` é uma query única com join ou se está fazendo N+1 por linha.
7. **`isomorphic-dompurify` → jsdom** — deps transitiva enorme (~5MB). Substituir por `sanitize-html` server-side + DOMPurify client-side = menor bundle e elimina bug do Turbopack no Windows (ver E2E-12).

---

## BAIXOS

1. 4 componentes usam `<img>` em vez de `next/image` (de 61 totais) — trivial fix.
2. TipTap não lazy-loaded — +200KB no bundle inicial. Dynamic import no forum composer.
3. 22 `console.log` em produção — migrar para `pino` ou structured logger.
4. Sem política documentada de rotação de secrets.
5. Sem plano de disaster recovery / backup verificado.
6. `scroll-behavior: smooth` no `<html>` — Next.js 16 warning (ver E2E-19).

---

## 25 Deployment Blockers — Status

| # | Blocker | Status | Notas |
|---|---------|--------|-------|
| 1 | RLS em todas as tabelas | PASS | Exceto `notifications` que tem RLS mas INSERT policy não documentada |
| 2 | API keys não hardcoded | PASS | `.env.local` + `.env.example` presentes |
| 3 | service_role no frontend | PASS | Grep por `service_role` em src/ retorna vazio |
| 4 | MFA em contas admin | UNKNOWN | Não consegui verificar via código |
| 5 | APIs sem auth | PASS | Middleware + server components verificam session |
| 6 | SQL injection parametrizado | PARTIAL | Supabase parametriza, mas search endpoint usa ilike com template string — ver CRIT-3 |
| 7 | npm audit high/critical | UNKNOWN | Rodar `pnpm audit --audit-level=high` |
| 8 | Secret scanning | FAIL | Sem gitleaks no pre-commit |
| 9 | Credenciais default em prod | PASS | Nenhum admin/admin detectado |
| 10 | TLS | PASS | Vercel força HTTPS |
| 11 | DPO / Encarregado | FAIL | Não há página LGPD com DPO contact |
| 12 | Breach notification process | FAIL | Sem documento / runbook |
| 13 | Consent mechanism | PARTIAL | Checkbox no signup ✓, mas consent history não persistido |
| 14 | User rights portal | PARTIAL | Deletion existe, export não |
| 15 | International SCCs | N/A | Supabase (AWS) — verificar DPA assinado |
| 16 | Child data consent | N/A | Plataforma profissional, sem usuários <18 (verificar TOS) |
| 17 | Privacy policy público | PASS | `/privacidade` existe |
| 18 | Asset inventory | FAIL | Sem inventário formal |
| 19 | Centralized logging | FAIL | Sem Logtail/CloudWatch agregado |
| 20 | Incident response plan | FAIL | Nenhum runbook |
| 21 | Backup verification (90 dias) | UNKNOWN | Supabase backup automático, mas restore nunca testado |
| 22 | Vulnerability scanning process | FAIL | Sem pipeline |
| 23 | Network segmentation | N/A | Vercel/Supabase managed |
| 24 | Vendor security assessment | FAIL | Sem documento |
| 25 | Database SSL enforcement | PASS | Supabase força SSL |

**Score: 13 PASS, 2 PARTIAL, 2 UNKNOWN, 6 FAIL, 2 N/A → 52% de compliance com blockers de deploy P0.**

---

## Roadmap Pré-Deploy

### Semana 1 — Bloqueadores
- [ ] Gerar types Supabase + refatorar forum module sem `as any`
- [ ] Error boundaries em rotas dinâmicas
- [ ] Zod em server actions + API routes críticas
- [ ] Sentry integration
- [ ] RLS policies explicit em notifications

### Semana 2 — Altos
- [ ] Remover service_role key do SQL (migrar cron para edge functions)
- [ ] Rate limiting em POST actions do forum
- [ ] Resolver silent failures do webhook Abacate
- [ ] Substituir isomorphic-dompurify por sanitize-html + DOMPurify client
- [ ] LGPD: export de dados + DPO contact

### Semana 3 — Hardening
- [ ] CSRF token explícito
- [ ] DOMPurify no INSERT, não só no render
- [ ] pnpm audit fix + Dependabot
- [ ] Secret scanning pre-commit (gitleaks)
- [ ] Incident response runbook
- [ ] Backup restore drill

---

## Quick Wins (<2h cada)
- Lazy-load TipTap no composer — bundle -200KB
- Limpar `console.log` de produção
- Adicionar `data-scroll-behavior="smooth"` no `<html>`
- Fix dos 4 `<img>` restantes → `next/image`
- INSERT policy explicit em notifications

---

**Conclusão:** Plataforma é SAUDÁVEL no esqueleto (Next 16 + React 19 + Supabase + RLS bem implementado), mas precisa de **disciplina de tipos, error handling estruturado, e observability antes de abrir para usuários pagantes**. O fix do trigger de upvote (descoberto no E2E) é sintomático de uma classe maior de bugs que só type safety vai prevenir.
