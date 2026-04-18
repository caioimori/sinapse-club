# Story: Forum Bot/User Separation

**ID:** FORUM-BOT-SEP
**Status:** Ready
**Epic:** Forum Engagement & Integrity
**Depends on:** FORUM-ENG-FOUNDATION

## Contexto

Os bots curadores (`00000000-0000-0000-0000-000000000001..005`) alimentam o forum
com posts `type='curated'`. Hoje eles aparecem no leaderboard e poderiam tecnicamente
curtir/salvar/comentar — quebrando a integridade da comunidade humana.

Esta story separa formalmente bots de humanos no schema e bloqueia interacoes
indesejadas em camadas (DB triggers + filtros em queries + UI badge).

## Acceptance Criteria

**Given** um bot curador (`profile_type='curator_bot'`)
**When** tenta inserir em `reactions` (like/save/share/comment_like)
**Then** o INSERT deve falhar com `RAISE EXCEPTION`.

**Given** um bot curador
**When** tenta inserir em `comments`
**Then** o INSERT deve falhar com `RAISE EXCEPTION`.

**Given** o leaderboard global ou trending users
**When** a query e executada
**Then** bots NUNCA devem aparecer na lista.

**Given** um post cujo autor e bot
**When** o post e renderizado
**Then** um badge "Curador" aparece ao lado do nome (neutro, nao gamificado).

**Given** um bot recebe um like em um post/comentario (caso raro)
**When** o trigger de reputacao executa
**Then** o bot NAO deve ganhar XP (guard em award_reputation_for_upvote).

## Scope

### IN
- Coluna `profiles.profile_type` com CHECK `IN ('human', 'curator_bot')` (default `'human'`).
- Indice em `profile_type`.
- Marcar os 5 bot UUIDs conhecidos como `'curator_bot'`.
- Trigger BEFORE INSERT em `reactions` rejeitando bots.
- Trigger BEFORE INSERT em `comments` rejeitando bots.
- Guard em `award_reputation_for_upvote` pra nao dar XP a bots.
- Filtro `profile_type = 'human'` em queries de leaderboard + trending users + suggested users.
- Badge "Curador" em `post-card.tsx` quando autor e bot.
- Atualizacao de `src/types/database.ts`.

### OUT
- Nova gamificacao, novos tiers, novos XP events.
- Bloqueio no frontend via context de auth (bots nao logam no app, defesa em backend basta).
- Leaderboards especificos pra bots (fora de escopo).

## Files Touched

- `supabase/migrations/20260417000006_profile_type.sql` (novo)
- `supabase/migrations/20260417000007_bot_interaction_blocks.sql` (novo)
- `src/types/database.ts`
- `src/app/(dashboard)/leaderboard/page.tsx`
- `src/app/(dashboard)/forum/page.tsx` (trending + suggestions)
- `src/components/feed/post-card.tsx` (badge)

## Non-Goals

- Impedir que bots apareçam em busca geral (aparecem como autores de conteudo, ok).
- Migrar posts antigos.
