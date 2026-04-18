-- Migration: Block bot interactions + guard reputation XP
-- Story: FORUM-BOT-SEP
--
-- Bots curadores alimentam o forum com posts type='curated' mas NAO podem:
-- - Curtir, salvar, compartilhar (reactions INSERT)
-- - Comentar (comments INSERT)
-- - Ganhar XP em likes recebidos (defesa em camadas)
--
-- Idempotente (drop + create).

-- ─────────────────────────────────────────────────────────────────
-- 1. BEFORE INSERT em reactions — rejeita bots
-- ─────────────────────────────────────────────────────────────────

create or replace function block_bot_reactions()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_type text;
begin
  select profile_type into v_type
    from profiles
    where id = new.user_id;

  if v_type = 'curator_bot' then
    raise exception 'curator_bot accounts cannot create reactions'
      using errcode = '42501'; -- insufficient_privilege
  end if;

  return new;
end;
$$;

drop trigger if exists trg_block_bot_reactions on reactions;
create trigger trg_block_bot_reactions
  before insert on reactions
  for each row execute function block_bot_reactions();

-- ─────────────────────────────────────────────────────────────────
-- 2. BEFORE INSERT em comments — rejeita bots
-- ─────────────────────────────────────────────────────────────────

create or replace function block_bot_comments()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_type text;
begin
  select profile_type into v_type
    from profiles
    where id = new.author_id;

  if v_type = 'curator_bot' then
    raise exception 'curator_bot accounts cannot create comments'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_block_bot_comments on comments;
create trigger trg_block_bot_comments
  before insert on comments
  for each row execute function block_bot_comments();

-- ─────────────────────────────────────────────────────────────────
-- 3. Guard em award_reputation_for_upvote — bot nao ganha XP
-- (recria a funcao com o guard adicional; mantém toda logica anterior)
-- ─────────────────────────────────────────────────────────────────

create or replace function award_reputation_for_upvote()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
  v_xp     int;
  v_type   text;
begin
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

  if v_author is null or v_author = new.user_id then
    return new;
  end if;

  -- Guard: bots nao recebem XP mesmo se receberem like (defesa em camadas)
  select profile_type into v_type from profiles where id = v_author;
  if v_type = 'curator_bot' then
    return new;
  end if;

  update profiles
  set    reputation = greatest(0, reputation + v_xp)
  where  id = v_author;

  return new;
end;
$$;

-- revoke_reputation_for_upvote — mesmo guard (saida ja existia; idempotente)
create or replace function revoke_reputation_for_upvote()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
  v_xp     int;
  v_type   text;
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

  if v_author is null or v_author = old.user_id then
    return old;
  end if;

  select profile_type into v_type from profiles where id = v_author;
  if v_type = 'curator_bot' then
    return old;
  end if;

  update profiles
  set    reputation = greatest(0, reputation - v_xp)
  where  id = v_author;

  return old;
end;
$$;

-- Triggers ja existem (criados em 20260417000001); apenas re-create pra garantir
drop trigger if exists trg_reputation_upvote on reactions;
create trigger trg_reputation_upvote
  after insert on reactions
  for each row execute function award_reputation_for_upvote();

drop trigger if exists trg_reputation_upvote_remove on reactions;
create trigger trg_reputation_upvote_remove
  after delete on reactions
  for each row execute function revoke_reputation_for_upvote();
