-- Migration: Forum Engagement Foundation — reactions table
-- Story: FORUM-ENG-FOUNDATION
--
-- Cria tabela reactions compativel com src/types/database.ts:438-454.
-- Idempotente: usa IF NOT EXISTS + DO blocks pra poder rodar multiplas vezes.

-- ─────────────────────────────────────────────────────────────────
-- 1. Tabela reactions
-- ─────────────────────────────────────────────────────────────────

create table if not exists reactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment')),
  target_id   uuid not null,
  type        text not null check (type in ('like', 'save')),
  created_at  timestamptz not null default now(),
  unique (user_id, target_type, target_id, type)
);

-- Indices pra queries comuns (like count por post, saved by user, etc)
create index if not exists reactions_target_idx on reactions(target_type, target_id);
create index if not exists reactions_user_idx on reactions(user_id);
create index if not exists reactions_user_type_idx on reactions(user_id, type);

-- ─────────────────────────────────────────────────────────────────
-- 2. RLS
-- ─────────────────────────────────────────────────────────────────

alter table reactions enable row level security;

-- SELECT publico (contagem de likes deve ser visivel)
drop policy if exists "reactions public read" on reactions;
create policy "reactions public read"
  on reactions for select
  using (true);

-- INSERT so o proprio user
drop policy if exists "reactions insert own" on reactions;
create policy "reactions insert own"
  on reactions for insert
  with check (auth.uid() = user_id);

-- DELETE so o proprio user
drop policy if exists "reactions delete own" on reactions;
create policy "reactions delete own"
  on reactions for delete
  using (auth.uid() = user_id);

-- Nao existe UPDATE (types = Update: never)
