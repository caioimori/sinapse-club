-- Migration: Cleanup orphan reactions when post/comment is deleted
-- Story: FORUM-ENG-FOUNDATION (follow-up)
--
-- reactions.target_id e um uuid sem FK (polymorfico: aponta pra posts ou comments).
-- Quando um post/comment e deletado, as reactions ficam orfas. Trigger abaixo faz
-- cleanup explicito. Idempotente.
--
-- IMPORTANTE: usamos SET session_replication_role='replica' localmente NAO — em vez
-- disso, executamos DELETE direto. Os triggers de delete em reactions (revoke_*,
-- sync_*) VAO rodar. Isso e OK porque:
--   - revoke_reputation_for_upvote: busca posts.id do target_id -> null -> skip.
--   - revoke_reputation_for_save: idem.
--   - sync_likes_count_delete: busca posts.id do target -> nao existe -> 0 rows.
-- Ou seja, triggers sao no-ops em target ja deletado.

create or replace function cleanup_reactions_on_post_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  delete from reactions
    where target_type = 'post' and target_id = old.id;
  return old;
end;
$$;

drop trigger if exists trg_cleanup_reactions_on_post_delete on posts;
create trigger trg_cleanup_reactions_on_post_delete
  before delete on posts
  for each row execute function cleanup_reactions_on_post_delete();

create or replace function cleanup_reactions_on_comment_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  delete from reactions
    where target_type = 'comment' and target_id = old.id;
  return old;
end;
$$;

drop trigger if exists trg_cleanup_reactions_on_comment_delete on comments;
create trigger trg_cleanup_reactions_on_comment_delete
  before delete on comments
  for each row execute function cleanup_reactions_on_comment_delete();
