# PERF-1 — Performance Fixes: N+1 Queries, next/image, Error Boundaries

**Status:** Ready  
**Epic:** Performance & Quality  
**Complexity:** Medium  
**Assignee:** @developer (Dex)

---

## Contexto

Auditoria identificou gargalos de performance no fórum e perfil: queries N+1,
imagens não otimizadas (`<img>` em vez de `next/image`) e ausência de error
boundaries por rota no dashboard.

---

## Acceptance Criteria

### AC-1 — Forum: queries consolidadas
- [ ] `forum/page.tsx` busca reposts no mesmo `.select()` inicial (sem query extra pós-fetch)
- [ ] `forum/page.tsx` busca professional_roles junto com os threads (sem query separada por roleIds)

### AC-2 — Profile: likes sem N+1
- [ ] `profile/page.tsx` busca liked threads em query única com join (sem reactions → posts separados)
- [ ] `profile/page.tsx` busca replies sem N+1

### AC-3 — next/image
- [ ] `course-card.tsx` usa `next/image` em vez de `<img>`
- [ ] `profile/page.tsx` usa `next/image` para header_url (remover eslint-disable)
- [ ] Avatar em `create-post.tsx` usa `next/image`

### AC-4 — Error boundaries por rota
- [ ] `src/app/(dashboard)/error.tsx` criado com fallback UI consistente
- [ ] Cobre todas as sub-rotas do dashboard

---

## Scope

**IN:**
- Consolidação de queries N+1 em forum/page.tsx e profile/page.tsx
- Substituição de `<img>` por `next/image` nos 3 componentes identificados
- Error boundary para o grupo `(dashboard)`

**OUT:**
- Refactor de `createClient()` em client components (story separada — PERF-2)
- Video player memoization (story separada — PERF-3)
- Leaderboard tabs stub
- Carousel buttons sem handler

---

## Files Impacted

```
src/app/(dashboard)/forum/page.tsx
src/app/(dashboard)/profile/page.tsx
src/app/(dashboard)/error.tsx          ← NEW
src/components/courses/course-card.tsx
src/components/feed/create-post.tsx
```

---

## Definition of Done

- [ ] Nenhuma regressão nas funcionalidades existentes (likes, reposts, follows, perfil)
- [ ] `npm run build` passa sem erros
- [ ] Queries consolidadas verificadas via Supabase logs (sem duplicatas)
