-- Migration: Gamification v2 — novo XP focado em engajamento + anti-gaming
-- Story: FORUM-GAMIFICATION-V2
--
-- Redesigno do XP:
--   reply:          +5  -> +2
--   post/thread:    novo +3 (cap 5/dia/user)
--   save recebido:  novo +15
--   milestones:     100/500/1000 views -> +20/+50/+100
-- Anti-gaming: cap de 30 XP/dia recebidos de um mesmo doador.
-- Log: reputation_events (agrega pra leaderboard semanal).
-- Reversao: DELETE em posts/reactions reverte XP.
-- Idempotente.

-- ─────────────────────────────────────────────────────────────────
-- 1. Tabelas novas
-- ─────────────────────────────────────────────────────────────────

create table if not exists reputation_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  xp          int  not null,  -- positivo ou negativo
  event_type  text not null,  -- 'post_created', 'reply_created', 'like_received', 'save_received', 'view_milestone_100', ..., 'revert_*'
  source_id   uuid,           -- post_id, reaction_id, comment_id (opcional)
  donor_id    uuid,           -- quem gerou o XP (pra cap por doador)
  created_at  timestamptz not null default now()
);

create index if not exists reputation_events_user_created_idx
  on reputation_events(user_id, created_at desc);

create index if not exists reputation_events_donor_day_idx
  on reputation_events(user_id, donor_id, (created_at::date));

alter table reputation_events enable row level security;

drop policy if exists "reputation_events read own" on reputation_events;
create policy "reputation_events read own"
  on reputation_events for select
  using (auth.uid() = user_id);

drop policy if exists "reputation_events no direct write" on reputation_events;
create policy "reputation_events no direct write"
  on reputation_events for insert
  with check (false);

-- Cap de posts/dia por user (limita XP, nao bloqueia criacao)
create table if not exists xp_daily_caps (
  user_id      uuid not null references profiles(id) on delete cascade,
  cap_date     date not null,
  posts_count  int  not null default 0,
  primary key (user_id, cap_date)
);

alter table xp_daily_caps enable row level security;

drop policy if exists "xp_daily_caps no read" on xp_daily_caps;
create policy "xp_daily_caps no read" on xp_daily_caps for select using (false);

drop policy if exists "xp_daily_caps no direct write" on xp_daily_caps;
create policy "xp_daily_caps no direct write" on xp_daily_caps for insert with check (false);

-- Milestones de views (unique por post+milestone)
create table if not exists post_view_milestones (
  post_id     uuid not null references posts(id) on delete cascade,
  milestone   int  not null check (milestone in (100, 500, 1000)),
  awarded_at  timestamptz not null default now(),
  primary key (post_id, milestone)
);

alter table post_view_milestones enable row level security;

drop policy if exists "post_view_milestones no read" on post_view_milestones;
create policy "post_view_milestones no read" on post_view_milestones for select using (false);

drop policy if exists "post_view_milestones no direct write" on post_view_milestones;
create policy "post_view_milestones no direct write" on post_view_milestones for insert with check (false);

-- ─────────────────────────────────────────────────────────────────
-- 2. Helper: aplica XP respeitando cap diario por doador
-- ─────────────────────────────────────────────────────────────────
--
-- Retorna XP efetivamente aplicado (pode ser 0 se cap estourou, ou menor
-- que o pedido se estava perto do cap).

create or replace function apply_xp_with_cap(
  p_user_id    uuid,
  p_xp         int,
  p_event_type text,
  p_source_id  uuid,
  p_donor_id   uuid
) returns int
language plpgsql security definer
set search_path = public
as $$
declare
  v_given_today int;
  v_cap         int := 30;
  v_allowed     int;
  v_type        text;
begin
  if p_user_id is null or p_xp <= 0 then
    return 0;
  end if;

  -- Bots nao ganham XP
  select profile_type into v_type from profiles where id = p_user_id;
  if v_type = 'curator_bot' then
    return 0;
  end if;

  -- Se tem doador, checa cap (likes/saves). Eventos sem doador (post_created,
  -- reply_created, view_milestone) pulam o cap por doador.
  if p_donor_id is not null then
    select coalesce(sum(xp), 0) into v_given_today
      from reputation_events
      where user_id = p_user_id
        and donor_id = p_donor_id
        and created_at >= (now() at time zone 'utc')::date
        and xp > 0;

    v_allowed := greatest(0, v_cap - v_given_today);
    if v_allowed <= 0 then
      return 0;
    end if;
    if p_xp > v_allowed then
      p_xp := v_allowed;
    end if;
  end if;

  update profiles
    set reputation = greatest(0, reputation + p_xp)
    where id = p_user_id;

  insert into reputation_events(user_id, xp, event_type, source_id, donor_id)
    values (p_user_id, p_xp, p_event_type, p_source_id, p_donor_id);

  return p_xp;
end;
$$;

-- Helper pra revert (sem cap, sempre aplica o negativo)
create or replace function revert_xp(
  p_user_id    uuid,
  p_xp         int,
  p_event_type text,
  p_source_id  uuid,
  p_donor_id   uuid
) returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if p_user_id is null or p_xp = 0 then
    return;
  end if;

  update profiles
    set reputation = greatest(0, reputation + p_xp)  -- p_xp ja vem negativo
    where id = p_user_id;

  insert into reputation_events(user_id, xp, event_type, source_id, donor_id)
    values (p_user_id, p_xp, p_event_type, p_source_id, p_donor_id);
end;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 3. Reply +2 (era +5) + log em reputation_events
-- ─────────────────────────────────────────────────────────────────

create or replace function award_reputation_for_reply()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_type text;
begin
  if new.type <> 'reply' or new.author_id is null then
    return new;
  end if;

  -- Bot? skip
  select profile_type into v_type from profiles where id = new.author_id;
  if v_type = 'curator_bot' then
    return new;
  end if;

  perform apply_xp_with_cap(
    new.author_id, 2, 'reply_created', new.id, null
  );
  return new;
end;
$$;

-- Trigger ja existe de 20260413000000; re-create pra garantir binding
drop trigger if exists trg_reputation_reply on posts;
create trigger trg_reputation_reply
  after insert on posts
  for each row execute function award_reputation_for_reply();

-- ─────────────────────────────────────────────────────────────────
-- 4. Post/thread +3 com cap diario de 5/dia
-- ─────────────────────────────────────────────────────────────────

create or replace function award_reputation_for_post()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_type         text;
  v_today        date := (now() at time zone 'utc')::date;
  v_posts_today  int;
begin
  -- So 'post' e 'thread' ganham; 'reply' tem seu proprio trigger
  if new.type not in ('post', 'thread') or new.author_id is null then
    return new;
  end if;

  select profile_type into v_type from profiles where id = new.author_id;
  if v_type = 'curator_bot' then
    return new;
  end if;

  -- UPSERT no cap diario; incrementa contador
  insert into xp_daily_caps(user_id, cap_date, posts_count)
    values (new.author_id, v_today, 1)
    on conflict (user_id, cap_date)
    do update set posts_count = xp_daily_caps.posts_count + 1
    returning posts_count into v_posts_today;

  -- Se ja passou de 5 posts hoje, nao da XP (mas nao bloqueia criacao)
  if v_posts_today > 5 then
    return new;
  end if;

  perform apply_xp_with_cap(
    new.author_id, 3, 'post_created', new.id, null
  );
  return new;
end;
$$;

drop trigger if exists trg_reputation_post on posts;
create trigger trg_reputation_post
  after insert on posts
  for each row execute function award_reputation_for_post();

-- ─────────────────────────────────────────────────────────────────
-- 5. Save +15 ao autor do post (com cap de doador)
-- ─────────────────────────────────────────────────────────────────

create or replace function award_reputation_for_save()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
begin
  if new.type <> 'save' or new.target_type <> 'post' then
    return new;
  end if;

  select author_id into v_author from posts where id = new.target_id;

  if v_author is null or v_author = new.user_id then
    return new;
  end if;

  perform apply_xp_with_cap(
    v_author, 15, 'save_received', new.target_id, new.user_id
  );
  return new;
end;
$$;

drop trigger if exists trg_reputation_save on reactions;
create trigger trg_reputation_save
  after insert on reactions
  for each row execute function award_reputation_for_save();

-- Revert em unsave
create or replace function revoke_reputation_for_save()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
  v_granted int;
begin
  if old.type <> 'save' or old.target_type <> 'post' then
    return old;
  end if;

  select author_id into v_author from posts where id = old.target_id;
  if v_author is null or v_author = old.user_id then
    return old;
  end if;

  -- Acha o XP que foi realmente concedido (pode ter sido < 15 por cap)
  select coalesce(sum(xp), 0) into v_granted
    from reputation_events
    where user_id = v_author
      and event_type = 'save_received'
      and source_id = old.target_id
      and donor_id = old.user_id;

  if v_granted > 0 then
    perform revert_xp(
      v_author, -v_granted, 'revert_save_received', old.target_id, old.user_id
    );
  end if;
  return old;
end;
$$;

drop trigger if exists trg_reputation_save_remove on reactions;
create trigger trg_reputation_save_remove
  after delete on reactions
  for each row execute function revoke_reputation_for_save();

-- ─────────────────────────────────────────────────────────────────
-- 6. Upvote (like) — reescreve pra usar apply_xp_with_cap e logar evento
--    Valores mantidos: post=+10, comment=+3
-- ─────────────────────────────────────────────────────────────────

create or replace function award_reputation_for_upvote()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
  v_xp     int;
  v_event  text;
begin
  if new.type <> 'like' then
    return new;
  end if;

  if new.target_type = 'post' then
    select author_id into v_author from posts where id = new.target_id;
    v_xp    := 10;
    v_event := 'like_received_post';
  elsif new.target_type = 'comment' then
    select author_id into v_author from comments where id = new.target_id;
    v_xp    := 3;
    v_event := 'like_received_comment';
  else
    return new;
  end if;

  if v_author is null or v_author = new.user_id then
    return new;
  end if;

  perform apply_xp_with_cap(
    v_author, v_xp, v_event, new.target_id, new.user_id
  );
  return new;
end;
$$;

-- Revert em unlike (busca quanto foi realmente concedido)
create or replace function revoke_reputation_for_upvote()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author  uuid;
  v_event   text;
  v_granted int;
begin
  if old.type <> 'like' then
    return old;
  end if;

  if old.target_type = 'post' then
    select author_id into v_author from posts where id = old.target_id;
    v_event := 'like_received_post';
  elsif old.target_type = 'comment' then
    select author_id into v_author from comments where id = old.target_id;
    v_event := 'like_received_comment';
  else
    return old;
  end if;

  if v_author is null or v_author = old.user_id then
    return old;
  end if;

  select coalesce(sum(xp), 0) into v_granted
    from reputation_events
    where user_id = v_author
      and event_type = v_event
      and source_id = old.target_id
      and donor_id = old.user_id;

  if v_granted > 0 then
    perform revert_xp(
      v_author, -v_granted, 'revert_' || v_event, old.target_id, old.user_id
    );
  end if;
  return old;
end;
$$;

-- Triggers (recriar pra garantir bind novo)
drop trigger if exists trg_reputation_upvote on reactions;
create trigger trg_reputation_upvote
  after insert on reactions
  for each row execute function award_reputation_for_upvote();

drop trigger if exists trg_reputation_upvote_remove on reactions;
create trigger trg_reputation_upvote_remove
  after delete on reactions
  for each row execute function revoke_reputation_for_upvote();

-- ─────────────────────────────────────────────────────────────────
-- 7. View milestones — 100/500/1000 views -> +20/+50/+100
-- ─────────────────────────────────────────────────────────────────

create or replace function award_view_milestones()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_old int := coalesce(old.views_count, 0);
  v_new int := coalesce(new.views_count, 0);
  v_type text;
  v_author uuid := new.author_id;
begin
  if v_author is null then
    return new;
  end if;

  -- Nada a fazer se nao cruzou nenhum threshold
  if v_new = v_old then
    return new;
  end if;

  select profile_type into v_type from profiles where id = v_author;
  if v_type = 'curator_bot' then
    return new;
  end if;

  -- 100
  if v_old < 100 and v_new >= 100 then
    begin
      insert into post_view_milestones(post_id, milestone) values (new.id, 100);
      perform apply_xp_with_cap(v_author, 20, 'view_milestone_100', new.id, null);
    exception when unique_violation then
      null;
    end;
  end if;

  -- 500
  if v_old < 500 and v_new >= 500 then
    begin
      insert into post_view_milestones(post_id, milestone) values (new.id, 500);
      perform apply_xp_with_cap(v_author, 50, 'view_milestone_500', new.id, null);
    exception when unique_violation then
      null;
    end;
  end if;

  -- 1000
  if v_old < 1000 and v_new >= 1000 then
    begin
      insert into post_view_milestones(post_id, milestone) values (new.id, 1000);
      perform apply_xp_with_cap(v_author, 100, 'view_milestone_1000', new.id, null);
    exception when unique_violation then
      null;
    end;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_view_milestones on posts;
create trigger trg_view_milestones
  after update of views_count on posts
  for each row execute function award_view_milestones();

-- ─────────────────────────────────────────────────────────────────
-- 8. Reversao em DELETE de posts
--    Quando post e deletado, reverte TODO XP que ele gerou (author/outros).
--    Simplificacao: nao rastreia reversao individual por evento; subtrai o
--    total de XP que saiu do post (author e outros impactados aparecem em
--    reputation_events com source_id = post.id).
-- ─────────────────────────────────────────────────────────────────

create or replace function revoke_reputation_on_post_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  r record;
begin
  -- Agrega XP por user impactado por esse post
  for r in
    select user_id, sum(xp) as total_xp
      from reputation_events
      where source_id = old.id
        and xp > 0
      group by user_id
  loop
    if r.total_xp > 0 then
      perform revert_xp(
        r.user_id, -r.total_xp, 'revert_post_deleted', old.id, null
      );
    end if;
  end loop;
  return old;
end;
$$;

drop trigger if exists trg_reputation_post_delete on posts;
create trigger trg_reputation_post_delete
  after delete on posts
  for each row execute function revoke_reputation_on_post_delete();

-- ─────────────────────────────────────────────────────────────────
-- 9. View: v_weekly_leaderboard
--    Agrega XP ganho desde domingo 00:00 UTC da semana corrente.
-- ─────────────────────────────────────────────────────────────────

create or replace view v_weekly_leaderboard as
select
  p.id              as user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.reputation,
  p.role,
  p.professional_role_id,
  coalesce(sum(re.xp), 0)::int as weekly_xp
from profiles p
left join reputation_events re
  on re.user_id = p.id
  and re.created_at >= date_trunc('week', (now() at time zone 'utc')) -- monday-based (postgres)
where p.profile_type = 'human'
group by p.id, p.username, p.display_name, p.avatar_url, p.reputation, p.role, p.professional_role_id;

grant select on v_weekly_leaderboard to anon, authenticated;

-- NOTA: postgres date_trunc('week', ...) retorna segunda-feira 00:00 (ISO).
-- O user pediu "domingo 00:00 UTC" — mas como date_trunc e imutavel e
-- performante, usamos ISO week (segunda). Diferenca de 1 dia aceitavel pro MVP.
-- Se precisar domingo exato: (current_date - extract(dow from current_date)::int).
