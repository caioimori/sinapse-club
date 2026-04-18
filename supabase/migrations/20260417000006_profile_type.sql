-- Migration: Add profile_type column to profiles (human vs curator_bot)
-- Story: FORUM-BOT-SEP
--
-- Separa formalmente contas humanas de bots curadores. Base pra bloqueios
-- de interacao (triggers) e filtros de leaderboard. Idempotente.

-- ─────────────────────────────────────────────────────────────────
-- 1. Coluna profile_type + CHECK
-- ─────────────────────────────────────────────────────────────────

alter table profiles
  add column if not exists profile_type text not null default 'human';

-- Garantir check constraint (idempotente via DO block)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_profile_type_check'
  ) then
    alter table profiles
      add constraint profiles_profile_type_check
      check (profile_type in ('human', 'curator_bot'));
  end if;
end$$;

-- ─────────────────────────────────────────────────────────────────
-- 2. Indice (util pra filtros de leaderboard/trending)
-- ─────────────────────────────────────────────────────────────────

create index if not exists profiles_profile_type_idx
  on profiles(profile_type);

-- ─────────────────────────────────────────────────────────────────
-- 3. Marcar os 5 bots curadores conhecidos
-- UUIDs sao determinısticos (000...001 a 000...005) e documentados em
-- src/app/api/admin/bots/route.ts e 20250331000027_seed_sample_threads.sql
-- ─────────────────────────────────────────────────────────────────

update profiles
set profile_type = 'curator_bot'
where id in (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000003'::uuid,
  '00000000-0000-0000-0000-000000000004'::uuid,
  '00000000-0000-0000-0000-000000000005'::uuid
)
and profile_type <> 'curator_bot';
