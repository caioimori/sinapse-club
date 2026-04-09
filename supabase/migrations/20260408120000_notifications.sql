-- ─────────────────────────────────────────────────────────────────
-- Notifications — tabela + triggers (like, follow, reply, mention)
-- ─────────────────────────────────────────────────────────────────

create type notification_type as enum (
  'like',
  'follow',
  'reply',
  'mention',
  'repost'
);

create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,  -- quem recebe
  actor_id    uuid not null references profiles(id) on delete cascade,  -- quem causou
  type        notification_type not null,
  entity_id   uuid,            -- post/thread id (null para follows)
  entity_title text,           -- cache do título para exibição rápida
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- índices para queries comuns
create index notifications_user_created on notifications(user_id, created_at desc);
create index notifications_unread on notifications(user_id, read) where read = false;

-- RLS
alter table notifications enable row level security;

create policy "users see own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "users update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- Trigger: like em post → notifica autor
-- ─────────────────────────────────────────────────────────────────
create or replace function notify_on_like()
returns trigger language plpgsql security definer as $$
declare
  v_post_author uuid;
  v_post_title  text;
begin
  -- busca autor e título do post
  select author_id, coalesce(title, left(content_plain, 80))
    into v_post_author, v_post_title
    from posts
    where id = new.post_id;

  -- não notifica a si mesmo
  if v_post_author is not null and v_post_author <> new.user_id then
    insert into notifications(user_id, actor_id, type, entity_id, entity_title)
    values (v_post_author, new.user_id, 'like', new.post_id, v_post_title);
  end if;

  return new;
end;
$$;

create trigger trg_notify_like
  after insert on reactions
  for each row execute function notify_on_like();

-- ─────────────────────────────────────────────────────────────────
-- Trigger: follow → notifica quem foi seguido
-- ─────────────────────────────────────────────────────────────────
create or replace function notify_on_follow()
returns trigger language plpgsql security definer as $$
begin
  if new.following_id <> new.follower_id then
    insert into notifications(user_id, actor_id, type, entity_id, entity_title)
    values (new.following_id, new.follower_id, 'follow', null, null);
  end if;

  return new;
end;
$$;

create trigger trg_notify_follow
  after insert on follows
  for each row execute function notify_on_follow();

-- ─────────────────────────────────────────────────────────────────
-- Trigger: reply em thread → notifica autor do thread original
-- ─────────────────────────────────────────────────────────────────
create or replace function notify_on_reply()
returns trigger language plpgsql security definer as $$
declare
  v_thread_author uuid;
  v_thread_title  text;
begin
  -- apenas respostas (type = 'reply') com parent definido
  if new.type <> 'reply' or new.reply_to is null then
    return new;
  end if;

  -- busca autor do post pai
  select author_id, coalesce(title, left(content_plain, 80))
    into v_thread_author, v_thread_title
    from posts
    where id = new.reply_to;

  if v_thread_author is not null and v_thread_author <> new.author_id then
    insert into notifications(user_id, actor_id, type, entity_id, entity_title)
    values (v_thread_author, new.author_id, 'reply', new.reply_to, v_thread_title);
  end if;

  return new;
end;
$$;

create trigger trg_notify_reply
  after insert on posts
  for each row execute function notify_on_reply();

-- ─────────────────────────────────────────────────────────────────
-- Trigger: repost → notifica autor original
-- ─────────────────────────────────────────────────────────────────
create or replace function notify_on_repost()
returns trigger language plpgsql security definer as $$
declare
  v_original_author uuid;
  v_original_title  text;
begin
  if new.repost_of is null then
    return new;
  end if;

  select author_id, coalesce(title, left(content_plain, 80))
    into v_original_author, v_original_title
    from posts
    where id = new.repost_of;

  if v_original_author is not null and v_original_author <> new.author_id then
    insert into notifications(user_id, actor_id, type, entity_id, entity_title)
    values (v_original_author, new.author_id, 'repost', new.repost_of, v_original_title);
  end if;

  return new;
end;
$$;

create trigger trg_notify_repost
  after insert on posts
  for each row execute function notify_on_repost();
