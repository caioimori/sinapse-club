-- Migration: Adiciona profile_type 'curator_persona' + atualiza triggers
-- Story: CURATORS-PERSONAS
--
-- Contexto: precisamos separar 3 categorias de perfis:
--   - human            → pessoa real (ranking SIM, pode reagir/comentar)
--   - curator_persona  → bot que finge humano: @rafael.automacao, @ana.ianegocios,
--                        @lucas.growth, @carla.dados
--                        (ranking SIM, NÃO pode reagir/comentar — bot real)
--   - curator_bot      → conta institucional: @sinapse-bot
--                        (ranking NÃO, NÃO pode reagir/comentar)
--
-- Decisão de produto: as personas humanizadas competem normal no leaderboard
-- pra o feed parecer mais vivo. Já @sinapse-bot é a marca, não compete.
--
-- Idempotente.

-- ─────────────────────────────────────────────────────────────────
-- 1. Atualizar CHECK constraint
-- ─────────────────────────────────────────────────────────────────

do $$
begin
  -- Drop antigo
  alter table profiles drop constraint if exists profiles_profile_type_check;
  -- Adiciona novo com 3 valores
  alter table profiles
    add constraint profiles_profile_type_check
    check (profile_type in ('human', 'curator_persona', 'curator_bot'));
end$$;

-- ─────────────────────────────────────────────────────────────────
-- 2. Promover 4 bots de curator_bot → curator_persona
--    (UUIDs determinísticos definidos em 20260417000006)
--    @sinapse-bot (UUID 0...001) FICA como curator_bot
-- ─────────────────────────────────────────────────────────────────

update profiles
set profile_type = 'curator_persona'
where id in (
  '00000000-0000-0000-0000-000000000002'::uuid, -- @rafael.automacao
  '00000000-0000-0000-0000-000000000003'::uuid, -- @ana.ianegocios
  '00000000-0000-0000-0000-000000000004'::uuid, -- @lucas.growth
  '00000000-0000-0000-0000-000000000005'::uuid  -- @carla.dados
)
and profile_type <> 'curator_persona';

-- ─────────────────────────────────────────────────────────────────
-- 3. Atualizar triggers de bloqueio: curator_persona TAMBÉM não
--    pode criar reactions ou comments (são bots, mesmo humanizados)
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

  if v_type in ('curator_bot', 'curator_persona') then
    raise exception 'bot accounts cannot create reactions'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

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

  if v_type in ('curator_bot', 'curator_persona') then
    raise exception 'bot accounts cannot create comments'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 4. Bios humanizadas pros 4 curator_personas
--    (apenas se headline/bio estão vazios — não sobrescreve customização)
-- ─────────────────────────────────────────────────────────────────

update profiles
set
  display_name = coalesce(nullif(display_name, ''), 'Rafael Automação'),
  headline = coalesce(nullif(headline, ''), 'Automação pra times comerciais e operações'),
  bio = coalesce(nullif(bio, ''),
    'Backend e workflows com n8n, Make, Zapier. Ajudo PMEs a tirar do papel automações que economizam horas/semana — CRM, atendimento, follow-up de leads. RJ.')
where id = '00000000-0000-0000-0000-000000000002'::uuid;

update profiles
set
  display_name = coalesce(nullif(display_name, ''), 'Ana — IA pra Negócios'),
  headline = coalesce(nullif(headline, ''), 'IA aplicada pra negócios pequenos e médios'),
  bio = coalesce(nullif(bio, ''),
    'Cansei de ver empresário pagando consultoria só pra ouvir hype de IA. Aqui mostro casos práticos de uso de ChatGPT, Claude e outras ferramentas no dia a dia da operação. SP.')
where id = '00000000-0000-0000-0000-000000000003'::uuid;

update profiles
set
  display_name = coalesce(nullif(display_name, ''), 'Lucas Growth'),
  headline = coalesce(nullif(headline, ''), 'Growth pra produtos B2B de tecnologia'),
  bio = coalesce(nullif(bio, ''),
    'Squad de aquisição em SaaS. Já levei 3 produtos de zero aos primeiros 10k MRR usando experimentos rápidos, SEO programático e funil com IA. POA.')
where id = '00000000-0000-0000-0000-000000000004'::uuid;

update profiles
set
  display_name = coalesce(nullif(display_name, ''), 'Carla Dados'),
  headline = coalesce(nullif(headline, ''), 'Análise de dados pra quem não tem time de BI'),
  bio = coalesce(nullif(bio, ''),
    'Migrei de big tech pra construir dashboards e modelos preditivos pra negócios pequenos. Excel não é o teto — mostro como usar Python + IA mesmo sem programar. Recife.')
where id = '00000000-0000-0000-0000-000000000005'::uuid;

-- ─────────────────────────────────────────────────────────────────
-- 5. Display name + bio institucional pro @sinapse-bot
-- ─────────────────────────────────────────────────────────────────

update profiles
set
  display_name = coalesce(nullif(display_name, ''), 'sinapse.club'),
  headline = coalesce(nullif(headline, ''), 'Conta oficial — curadoria diária do que importa em IA'),
  bio = coalesce(nullif(bio, ''),
    'Conta institucional do sinapse.club. Curo todo dia o que está acontecendo no mundo de IA aplicada a marketing, vendas, automação e empreendedorismo no Brasil.')
where id = '00000000-0000-0000-0000-000000000001'::uuid;
