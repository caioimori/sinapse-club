# Story: Forum Engagement Foundation

- **ID:** FORUM-ENG-FOUNDATION
- **Status:** Ready
- **Owner:** @developer (Dex)
- **Phase:** 1 de 3 (Foundation — antes de gamificacao)

## Contexto

Auditoria do sinapse.club identificou que o sistema de engajamento (likes, saves, shares, comentarios, views, reposts) esta ~30% funcional. Existem referencias a `reactions.post_id` em triggers, mas o schema real (via types) usa `target_type/target_id`. Muitos contadores nao sao atualizados, views nao tem RPC, likes em comentarios sao apenas estado local, shares nao persistem, e a aba "Salvos" do perfil nao existe.

Antes de construir qualquer camada de gamificacao, precisamos consertar a fundacao.

## Acceptance Criteria

### AC1 — Tabela `reactions` existe e bate com types
Given que o frontend usa `reactions(target_type, target_id, type)`
When qualquer INSERT/DELETE roda
Then a tabela existe com schema compativel, RLS ativa, indices corretos e unique constraint evitando duplicatas.

### AC2 — Triggers de reputacao funcionam
Given um like em post ou comentario
When a reaction e inserida
Then o autor do conteudo recebe XP (+10 post, +3 comentario), sem self-upvote, com busca via `target_id`+`target_type`. Idempotente.

### AC3 — Trigger de notificacao funciona
Given um like em post
When a reaction e inserida
Then uma notification `type='like'` e criada para o autor, usando `target_id/target_type` corretamente.

### AC4 — RPC `increment_post_views` persistido
Given chamada RPC com `post_id` (viewer anonimo ou autenticado)
When a pagina da thread carrega
Then `posts.views_count` incrementa apenas 1x por (viewer, post, dia). Viewer anon incrementa so o contador.

### AC5 — Contadores mantidos via trigger
Given INSERT/DELETE em reactions, comments ou reposts
When a operacao roda
Then `posts.likes_count`, `comments_count`, `reposts_count`, `shares_count` e `comments.likes_count` refletem o estado real, via increment/decrement (nao full COUNT).

### AC6 — Like em comentario persiste
Given usuario logado clica no coracao do comentario
When o clique acontece
Then insere/deleta reaction com `target_type='comment'`, `target_id=comment.id`, `type='like'`, com otimistic UI e rollback em erro.

### AC7 — Aba "Salvos" no perfil proprio
Given user autenticado em /profile (proprio)
When troca pra tab `salvos`
Then ve posts onde tem reaction `type='save'`. Contador do bookmark na thread reflete estado persistido.

### AC8 — Share persiste
Given clique em compartilhar
When link e copiado
Then cria reaction `type='share'` (ou increment em `shares_count`). Contador visivel se > 0.

## Scope

### IN
- Migration criando `reactions` (se ausente) + RLS + indices
- Migration corrigindo triggers de reputacao e notificacao
- Migration criando RPC `increment_post_views` + tabela `post_views` pra dedup
- Migration criando triggers de contador (likes/comments/reposts/shares)
- Migration adicionando `shares_count` em posts + type 'share' em reactions
- Backend do like em comentario (`comment-section.tsx`)
- Aba Salvos em profile (`profile-tabs.tsx` + `/profile/[username]/page.tsx`)
- Persistencia de share em `thread-actions.tsx`

### OUT (proxima fase)
- Nova gamificacao (badges, streaks, quests)
- Sistema de reposts/quotes completo
- Trending algoritmo
- Polls
- Gamification UI (progress bars, level up animations)

## Dependencies

- Tabelas existentes: `posts`, `comments`, `profiles`, `follows`, `notifications`, `levels`
- Migrations anteriores: `20260408120000_notifications.sql`, `20260413000000_reputation_triggers.sql`
- Types: `src/types/database.ts`

## Complexity

- **Scope:** 3 (multi-file, multi-migration)
- **Integration:** 2 (so Supabase interno)
- **Infrastructure:** 2 (novas migrations DDL)
- **Knowledge:** 2 (time familiar)
- **Risk:** 4 (mexer em triggers em prod precisa idempotencia rigorosa)
- **Total:** 13 → STANDARD

## Test Plan

- Rodar `npx tsc --noEmit` e `npm run lint` apos cada arquivo
- Migration: verificar idempotencia (rodar 2x sem erro)
- Manual: like persiste, unlike remove, save aparece em Salvos, share incrementa contador, view conta so 1x/dia

## File List (preenchido pelo dev)

- `supabase/migrations/20260417000000_reactions_table.sql`
- `supabase/migrations/20260417000001_fix_reputation_triggers.sql`
- `supabase/migrations/20260417000002_fix_notification_triggers.sql`
- `supabase/migrations/20260417000003_post_views_rpc.sql`
- `supabase/migrations/20260417000004_engagement_counters.sql`
- `supabase/migrations/20260417000005_shares_support.sql`
- `src/components/feed/comment-section.tsx`
- `src/components/profile/profile-tabs.tsx`
- `src/app/(dashboard)/profile/[username]/page.tsx`
- `src/components/forum/thread-actions.tsx`
- `src/types/database.ts`

## Tasks

- [x] Criar story (auto)
- [ ] Migration: reactions table + RLS
- [ ] Migration: fix reputation triggers (post + comment)
- [ ] Migration: fix notification trigger
- [ ] Migration: post_views + RPC
- [ ] Migration: engagement counter triggers
- [ ] Fix like em comentario
- [ ] Aba Salvos no perfil
- [ ] Persistencia de share
