-- Migration: Engagement counter triggers
-- Story: FORUM-ENG-FOUNDATION
--
-- Mantem posts.{likes_count, comments_count, reposts_count} e
-- comments.likes_count em sincronia via increment/decrement por trigger.
-- Idempotente (DROP TRIGGER IF EXISTS + CREATE).

-- ─────────────────────────────────────────────────────────────────
-- 1. posts.likes_count / comments.likes_count — reactions
-- ─────────────────────────────────────────────────────────────────

create or replace function sync_likes_count_insert()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if new.type <> 'like' then
    return new;
  end if;

  if new.target_type = 'post' then
    update posts set likes_count = likes_count + 1 where id = new.target_id;
  elsif new.target_type = 'comment' then
    update comments set likes_count = likes_count + 1 where id = new.target_id;
  end if;

  return new;
end;
$$;

create or replace function sync_likes_count_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if old.type <> 'like' then
    return old;
  end if;

  if old.target_type = 'post' then
    update posts set likes_count = greatest(0, likes_count - 1) where id = old.target_id;
  elsif old.target_type = 'comment' then
    update comments set likes_count = greatest(0, likes_count - 1) where id = old.target_id;
  end if;

  return old;
end;
$$;

drop trigger if exists trg_likes_count_insert on reactions;
create trigger trg_likes_count_insert
  after insert on reactions
  for each row execute function sync_likes_count_insert();

drop trigger if exists trg_likes_count_delete on reactions;
create trigger trg_likes_count_delete
  after delete on reactions
  for each row execute function sync_likes_count_delete();

-- ─────────────────────────────────────────────────────────────────
-- 2. posts.comments_count — comments table
-- ─────────────────────────────────────────────────────────────────

create or replace function sync_comments_count_insert()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if new.post_id is not null then
    update posts set comments_count = comments_count + 1 where id = new.post_id;
  end if;
  return new;
end;
$$;

create or replace function sync_comments_count_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if old.post_id is not null then
    update posts set comments_count = greatest(0, comments_count - 1) where id = old.post_id;
  end if;
  return old;
end;
$$;

drop trigger if exists trg_comments_count_insert on comments;
create trigger trg_comments_count_insert
  after insert on comments
  for each row execute function sync_comments_count_insert();

drop trigger if exists trg_comments_count_delete on comments;
create trigger trg_comments_count_delete
  after delete on comments
  for each row execute function sync_comments_count_delete();

-- ─────────────────────────────────────────────────────────────────
-- 3. posts.reposts_count — via posts.repost_of
-- ─────────────────────────────────────────────────────────────────

create or replace function sync_reposts_count_insert()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if new.repost_of is not null then
    update posts set reposts_count = reposts_count + 1 where id = new.repost_of;
  end if;
  return new;
end;
$$;

create or replace function sync_reposts_count_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if old.repost_of is not null then
    update posts set reposts_count = greatest(0, reposts_count - 1) where id = old.repost_of;
  end if;
  return old;
end;
$$;

drop trigger if exists trg_reposts_count_insert on posts;
create trigger trg_reposts_count_insert
  after insert on posts
  for each row execute function sync_reposts_count_insert();

drop trigger if exists trg_reposts_count_delete on posts;
create trigger trg_reposts_count_delete
  after delete on posts
  for each row execute function sync_reposts_count_delete();
