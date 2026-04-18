-- Migration: Share persistence
-- Story: FORUM-ENG-FOUNDATION
--
-- 1. Adiciona posts.shares_count
-- 2. Estende CHECK em reactions.type pra aceitar 'share'
-- 3. Trigger mantendo posts.shares_count em sincronia
-- Idempotente.

-- ─────────────────────────────────────────────────────────────────
-- 1. Coluna shares_count
-- ─────────────────────────────────────────────────────────────────

alter table posts add column if not exists shares_count int not null default 0;

-- ─────────────────────────────────────────────────────────────────
-- 2. Estender CHECK de reactions.type pra incluir 'share'
-- ─────────────────────────────────────────────────────────────────

-- Remove o check antigo (nome gerado pelo postgres). Usamos DO block pra
-- localizar qualquer constraint de check que restrinja reactions.type.
do $$
declare
  r record;
begin
  for r in
    select conname
    from pg_constraint
    where conrelid = 'public.reactions'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%type%=%'
  loop
    execute format('alter table reactions drop constraint %I', r.conname);
  end loop;
end $$;

-- Adiciona o novo check (named pra facilitar futuras alteracoes)
alter table reactions
  add constraint reactions_type_check
  check (type in ('like', 'save', 'share'));

-- ─────────────────────────────────────────────────────────────────
-- 3. Trigger mantendo shares_count
-- ─────────────────────────────────────────────────────────────────

create or replace function sync_shares_count_insert()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if new.type = 'share' and new.target_type = 'post' then
    update posts set shares_count = shares_count + 1 where id = new.target_id;
  end if;
  return new;
end;
$$;

create or replace function sync_shares_count_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if old.type = 'share' and old.target_type = 'post' then
    update posts set shares_count = greatest(0, shares_count - 1) where id = old.target_id;
  end if;
  return old;
end;
$$;

drop trigger if exists trg_shares_count_insert on reactions;
create trigger trg_shares_count_insert
  after insert on reactions
  for each row execute function sync_shares_count_insert();

drop trigger if exists trg_shares_count_delete on reactions;
create trigger trg_shares_count_delete
  after delete on reactions
  for each row execute function sync_shares_count_delete();
