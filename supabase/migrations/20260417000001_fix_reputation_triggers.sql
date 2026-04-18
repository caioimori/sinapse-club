-- Migration: Fix reputation triggers — use target_id/target_type
-- Story: FORUM-ENG-FOUNDATION
--
-- A migration anterior (20260413000000_reputation_triggers.sql) usa
-- NEW.post_id, mas o schema real de reactions usa target_id + target_type.
-- Esta migration substitui as funcoes pra funcionar com o schema real,
-- adiciona suporte a likes em comentarios (+3 XP) e e idempotente.

-- ─────────────────────────────────────────────────────────────────
-- 1. award_reputation_for_upvote — post (+10) e comment (+3)
-- ─────────────────────────────────────────────────────────────────

create or replace function award_reputation_for_upvote()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
  v_xp     int;
begin
  -- So lida com 'like'. Saves e outros tipos nao dao XP.
  if new.type <> 'like' then
    return new;
  end if;

  if new.target_type = 'post' then
    select author_id into v_author from posts where id = new.target_id;
    v_xp := 10;
  elsif new.target_type = 'comment' then
    select author_id into v_author from comments where id = new.target_id;
    v_xp := 3;
  else
    return new;
  end if;

  -- No self-upvote
  if v_author is not null and v_author <> new.user_id then
    -- TODO: quando profiles.profile_type existir, filtrar pra nao dar XP a bots.
    -- Por enquanto permite (bots nao deveriam receber likes normalmente).
    update profiles
    set    reputation = greatest(0, reputation + v_xp)
    where  id = v_author;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_reputation_upvote on reactions;
create trigger trg_reputation_upvote
  after insert on reactions
  for each row execute function award_reputation_for_upvote();

-- ─────────────────────────────────────────────────────────────────
-- 2. revoke_reputation_for_upvote — mesmo rationale no DELETE
-- ─────────────────────────────────────────────────────────────────

create or replace function revoke_reputation_for_upvote()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
  v_xp     int;
begin
  if old.type <> 'like' then
    return old;
  end if;

  if old.target_type = 'post' then
    select author_id into v_author from posts where id = old.target_id;
    v_xp := 10;
  elsif old.target_type = 'comment' then
    select author_id into v_author from comments where id = old.target_id;
    v_xp := 3;
  else
    return old;
  end if;

  if v_author is not null and v_author <> old.user_id then
    update profiles
    set    reputation = greatest(0, reputation - v_xp)
    where  id = v_author;
  end if;

  return old;
end;
$$;

drop trigger if exists trg_reputation_upvote_remove on reactions;
create trigger trg_reputation_upvote_remove
  after delete on reactions
  for each row execute function revoke_reputation_for_upvote();
