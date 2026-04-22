# PAYWALL-1: RLS Hard Gate — user_is_paid_member + posts/reactions/categories

> **Status:** Done
> **Epic:** Forum Hard Paywall (Opcao A — gate total)
> **Assigned to:** @data-engineer (Dara) -> @developer (Dex)
> **Complexity:** M
> **Created:** 2026-04-21
> **Design doc:** `docs/architecture/forum-paywall-gate.md`

---

## Objective

Criar a funcao SQL `user_is_paid_member()` (role_rank >= 20) e aplicar RLS de hard paywall em 4 tabelas: `posts`, `reactions`, `forum_categories`, `forum_subcategories`. Zero visibilidade de qualquer conteudo do forum para users `free` ou anon via query direta (defense layer 2).

## Acceptance Criteria

### AC-1: funcao user_is_paid_member()
- [ ] Funcao SQL `public.user_is_paid_member()` existe, SECURITY DEFINER, IMMUTABLE nao (depende de auth.uid()), STABLE sim
- [ ] Retorna `false` se `auth.uid() IS NULL` (anon)
- [ ] Retorna `false` se profile do user nao existe
- [ ] Retorna `true` se `role_rank(profile.role) >= 20` (pro, premium, instructor, admin)
- [ ] Retorna `false` para role `free`
- [ ] `search_path = public` setado (hardening)

### AC-2: RLS posts SELECT gated
- [ ] Policy `"Posts visible to authenticated users"` atualizada para exigir `user_is_paid_member()` no branch de forum threads (category_id IS NOT NULL)
- [ ] Free logado NAO ve nenhum post com category_id
- [ ] Pro+ ve posts respeitando ainda `user_has_forum_access(category_id, subcategory_id)` (compatibilidade com tier por categoria)
- [ ] Feed posts sem category (space_id IS NULL AND category_id IS NULL) continuam visiveis para autenticados (nao faz parte do gate — sao do feed, nao forum)

### AC-3: RLS reactions gated
- [ ] Policy `"reactions public read"` removida
- [ ] Nova policy `"reactions paid read"` com `USING (user_is_paid_member())`
- [ ] Counts de likes/saves nao vazam mais para anon/free
- [ ] Contagem propria do user free em posts do feed (se aplicavel) nao quebra — apenas forum reactions ficam gated via join com posts

### AC-4: RLS forum_categories gated
- [ ] Policy `"Anyone can read active categories"` removida
- [ ] Nova policy `"Paid members read categories"` com `USING (is_active = true AND user_is_paid_member())`
- [ ] Policy de admin manter para CRUD
- [ ] Anon e free recebem 0 rows em `SELECT * FROM forum_categories`

### AC-5: RLS forum_subcategories gated
- [ ] Mesma policy de categories aplicada
- [ ] Anon e free recebem 0 rows

### AC-6: Migration idempotente + rollback
- [ ] Arquivo `supabase/migrations/20260421000000_forum_paywall_gate.sql` criado
- [ ] Usa `CREATE OR REPLACE FUNCTION`, `DROP POLICY IF EXISTS` + `CREATE POLICY`
- [ ] Seccao `-- ROLLBACK` (comentada) com comandos para reverter

### AC-7: Teste manual via SQL
- [ ] Executar como user free: `SELECT count(*) FROM forum_categories` retorna 0
- [ ] Executar como user free: `SELECT count(*) FROM posts WHERE category_id IS NOT NULL` retorna 0
- [ ] Executar como user pro: queries acima retornam > 0

## Scope

### IN
- Funcao SQL `user_is_paid_member`
- RLS em posts (SELECT), reactions (SELECT), forum_categories (SELECT), forum_subcategories (SELECT)
- Migration com rollback documentado
- Smoke test SQL

### OUT
- Middleware (PAYWALL-2)
- Server defense (PAYWALL-3)
- E2E tests (PAYWALL-4)
- View `public_forum_teaser` (nao faz parte do MVP — opcao A e gate total)
- Webhook kill-session imediato (fora de escopo, webhook atual ja atualiza profile.role)

## Dependencies

- Existe: `role_rank()`, `user_has_forum_access()` (nao removidos, apenas complementados)
- Schema: `profiles.role`, `forum_categories.is_active`, `posts.category_id`

## Technical Notes

- Funcao retorna `false` em caso de auth.uid() null (safe default)
- `SECURITY DEFINER` necessario porque `profiles` tem RLS que restringe leitura ao proprio user; a funcao precisa olhar o proprio profile do caller mas via bypass
- Ordem das policies importa: adicionar ANTES de remover a antiga para evitar janela sem RLS permissiva
- Migration NAO usa `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` em nenhum momento

## File List

- `supabase/migrations/20260421000000_forum_paywall_gate.sql` (novo)

## Progress

- [ ] AC-1: user_is_paid_member()
- [ ] AC-2: posts RLS gated
- [ ] AC-3: reactions RLS gated
- [ ] AC-4: forum_categories RLS gated
- [ ] AC-5: forum_subcategories RLS gated
- [ ] AC-6: migration idempotente + rollback
- [ ] AC-7: smoke test SQL

## Change Log

- 2026-04-21: Draft criado (@sprint-lead)
- 2026-04-21: Validada 10/10 (@product-lead) -> Ready
