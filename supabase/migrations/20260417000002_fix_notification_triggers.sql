-- Migration: Fix notification trigger for likes (uses target_id/target_type)
-- Story: FORUM-ENG-FOUNDATION
--
-- A migration 20260408120000_notifications.sql usa NEW.post_id mas o schema
-- real de reactions usa target_id + target_type. Aqui corrigimos notify_on_like.
-- Comentario likes tambem notificam (autor do comentario).

create or replace function notify_on_like()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_author uuid;
  v_title  text;
  v_entity uuid;
begin
  -- So 'like' gera notificacao (saves sao silenciosos)
  if new.type <> 'like' then
    return new;
  end if;

  if new.target_type = 'post' then
    select author_id, coalesce(title, left(content_plain, 80))
      into v_author, v_title
      from posts
      where id = new.target_id;
    v_entity := new.target_id;
  elsif new.target_type = 'comment' then
    -- Pra comentario, usa o content truncado como titulo e aponta pro post pai
    select c.author_id, left(c.content, 80), c.post_id
      into v_author, v_title, v_entity
      from comments c
      where c.id = new.target_id;
  else
    return new;
  end if;

  -- Nao notifica a si mesmo
  if v_author is not null and v_author <> new.user_id then
    insert into notifications(user_id, actor_id, type, entity_id, entity_title)
    values (v_author, new.user_id, 'like', v_entity, v_title);
  end if;

  return new;
end;
$$;

-- Recria o trigger (idempotente)
drop trigger if exists trg_notify_like on reactions;
create trigger trg_notify_like
  after insert on reactions
  for each row execute function notify_on_like();
