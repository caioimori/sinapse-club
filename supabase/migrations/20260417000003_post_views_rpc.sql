-- Migration: post_views dedup + increment_post_views RPC
-- Story: FORUM-ENG-FOUNDATION
--
-- thread/[id]/page.tsx chama supabase.rpc('increment_post_views', { post_id }).
-- Antes nao existia — agora incrementa views_count com dedup 1x/viewer/dia.
-- Viewers anonimos (auth.uid() null) incrementam o contador mas nao persistem
-- linha em post_views (impossivel dedupe sem identidade).

-- ─────────────────────────────────────────────────────────────────
-- 1. Tabela post_views (dedup diaria)
-- ─────────────────────────────────────────────────────────────────

create table if not exists post_views (
  post_id     uuid not null references posts(id) on delete cascade,
  viewer_id   uuid not null references profiles(id) on delete cascade,
  viewed_date date not null default (now() at time zone 'utc')::date,
  created_at  timestamptz not null default now(),
  primary key (post_id, viewer_id, viewed_date)
);

create index if not exists post_views_post_date_idx on post_views(post_id, viewed_date);

alter table post_views enable row level security;

-- Leitura opcional (pode virar dashboard no futuro). Por enquanto bloqueia leitura.
drop policy if exists "post_views no read" on post_views;
create policy "post_views no read"
  on post_views for select
  using (false);

-- INSERT so via SECURITY DEFINER (RPC). Bloqueia insert direto.
drop policy if exists "post_views no direct insert" on post_views;
create policy "post_views no direct insert"
  on post_views for insert
  with check (false);

-- ─────────────────────────────────────────────────────────────────
-- 2. RPC increment_post_views
-- ─────────────────────────────────────────────────────────────────

create or replace function increment_post_views(post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_viewer uuid := auth.uid();
  v_today  date := (now() at time zone 'utc')::date;
  v_rows   int  := 0;
begin
  if post_id is null then
    return;
  end if;

  if v_viewer is null then
    -- Viewer anonimo: incrementa contador (sem dedup fino possivel sem identidade).
    -- Debounce fica na camada de app se necessario.
    update posts set views_count = views_count + 1 where id = post_id;
    return;
  end if;

  -- Tenta registrar a view de hoje. ON CONFLICT DO NOTHING => dedup 1x/dia.
  insert into post_views(post_id, viewer_id, viewed_date)
  values (post_id, v_viewer, v_today)
  on conflict (post_id, viewer_id, viewed_date) do nothing;

  -- Checa se foi uma insercao nova (nao dedupada)
  get diagnostics v_rows = row_count;

  if v_rows > 0 then
    update posts set views_count = views_count + 1 where id = post_id;
  end if;
end;
$$;

-- Permite qualquer autenticado + anon chamar
grant execute on function increment_post_views(uuid) to anon, authenticated;
