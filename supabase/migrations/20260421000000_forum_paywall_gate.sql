-- ============================================================================
-- Migration: Forum Hard Paywall Gate (Opcao A)
-- Story: PAYWALL-1
-- Design doc: docs/architecture/forum-paywall-gate.md
-- ============================================================================
-- Hard paywall: user 'free' e anon NAO podem ler nada do forum via DB.
-- Layer 2 (RLS) — complementa o middleware (layer 1 em PAYWALL-2).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Funcao user_is_paid_member()
-- ----------------------------------------------------------------------------
-- Retorna true se o caller tem role_rank >= 20 (pro/premium/instructor/admin).
-- STABLE (nao IMMUTABLE: depende de auth.uid() + profiles.role).
-- SECURITY DEFINER: precisa ler profiles mesmo que RLS de profiles restrinja.

CREATE OR REPLACE FUNCTION public.user_is_paid_member()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_role TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN false;
  END IF;

  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = v_uid;

  IF v_role IS NULL THEN
    RETURN false;
  END IF;

  RETURN public.role_rank(v_role) >= 20;
END;
$$;

COMMENT ON FUNCTION public.user_is_paid_member() IS
  'Hard paywall gate: true if caller role_rank >= 20 (pro+). Used by forum RLS policies.';

-- ----------------------------------------------------------------------------
-- 2. RLS: posts SELECT (hard paywall em forum threads)
-- ----------------------------------------------------------------------------
-- Mantem compatibilidade com user_has_forum_access (tier per-category), mas
-- adiciona user_is_paid_member() como gate obrigatorio para forum threads.
-- Feed posts (space_id NULL AND category_id NULL) continuam visiveis a
-- autenticados — NAO sao parte do forum.

DROP POLICY IF EXISTS "Posts visible to authenticated users" ON public.posts;

CREATE POLICY "Posts visible to paid members"
  ON public.posts FOR SELECT USING (
    -- Forum threads: PAID ONLY + tier-per-category
    (
      category_id IS NOT NULL
      AND public.user_is_paid_member()
      AND public.user_has_forum_access(category_id, subcategory_id)
    )
    OR
    -- Legacy space posts
    (
      space_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.spaces s
        WHERE s.id = posts.space_id
        AND public.user_has_access(s.access::text)
      )
    )
    OR
    -- Feed posts (sem space, sem category): autenticados
    (
      space_id IS NULL
      AND category_id IS NULL
      AND auth.uid() IS NOT NULL
    )
  );

-- ----------------------------------------------------------------------------
-- 3. RLS: reactions SELECT (gated)
-- ----------------------------------------------------------------------------
-- Remove policy permissiva (using(true)) que vazava contagens publicamente.
-- Reactions em forum posts ficam visiveis apenas para paid members.
-- Reactions em outros contextos (feed) continuam funcionando porque
-- user_is_paid_member() so bloqueia free/anon.
--
-- Decisao: reactions em feed posts ficariam invisiveis para free tambem.
-- Como soft launch, free pode nao usar feed sozinho. Aceitavel.

DROP POLICY IF EXISTS "reactions public read" ON public.reactions;

CREATE POLICY "reactions paid read"
  ON public.reactions FOR SELECT
  USING (public.user_is_paid_member());

-- ----------------------------------------------------------------------------
-- 4. RLS: forum_categories SELECT (gated)
-- ----------------------------------------------------------------------------
-- Anon e free recebem 0 rows.

DROP POLICY IF EXISTS "Anyone can read active categories" ON public.forum_categories;

CREATE POLICY "Paid members read active categories"
  ON public.forum_categories FOR SELECT
  USING (is_active = true AND public.user_is_paid_member());

-- (policy "Admins can manage categories" permanece — admin tem role_rank 100)

-- ----------------------------------------------------------------------------
-- 5. RLS: forum_subcategories SELECT (gated)
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Anyone can read active subcategories" ON public.forum_subcategories;

CREATE POLICY "Paid members read active subcategories"
  ON public.forum_subcategories FOR SELECT
  USING (is_active = true AND public.user_is_paid_member());

-- ----------------------------------------------------------------------------
-- 6. Smoke test (comentarios — executar manualmente apos deploy)
-- ----------------------------------------------------------------------------
-- Como admin/service_role no SQL editor:
--   SELECT public.user_is_paid_member(); -- depende de auth.uid()
--
-- Simular como free user (substitua UUID):
--   SET LOCAL request.jwt.claims = '{"sub":"<free_user_uuid>"}';
--   SELECT public.user_is_paid_member(); -- expect: false
--   SELECT count(*) FROM public.forum_categories; -- expect: 0
--   SELECT count(*) FROM public.posts WHERE category_id IS NOT NULL; -- expect: 0
--   SELECT count(*) FROM public.reactions; -- expect: 0 (ou so contextos nao-forum)
--   RESET request.jwt.claims;
--
-- Simular como pro user:
--   SET LOCAL request.jwt.claims = '{"sub":"<pro_user_uuid>"}';
--   SELECT public.user_is_paid_member(); -- expect: true
--   SELECT count(*) FROM public.forum_categories; -- expect: > 0

-- ============================================================================
-- ROLLBACK (comentado — aplicar manualmente se necessario)
-- ============================================================================
-- DROP POLICY IF EXISTS "Posts visible to paid members" ON public.posts;
-- CREATE POLICY "Posts visible to authenticated users" ON public.posts FOR SELECT USING (
--   (category_id IS NOT NULL AND public.user_has_forum_access(category_id, subcategory_id))
--   OR
--   (space_id IS NOT NULL AND EXISTS (
--     SELECT 1 FROM public.spaces s WHERE s.id = posts.space_id AND public.user_has_access(s.access::text)
--   ))
--   OR
--   (space_id IS NULL AND category_id IS NULL AND auth.uid() IS NOT NULL)
-- );
--
-- DROP POLICY IF EXISTS "reactions paid read" ON public.reactions;
-- CREATE POLICY "reactions public read" ON public.reactions FOR SELECT USING (true);
--
-- DROP POLICY IF EXISTS "Paid members read active categories" ON public.forum_categories;
-- CREATE POLICY "Anyone can read active categories" ON public.forum_categories FOR SELECT USING (is_active = true);
--
-- DROP POLICY IF EXISTS "Paid members read active subcategories" ON public.forum_subcategories;
-- CREATE POLICY "Anyone can read active subcategories" ON public.forum_subcategories FOR SELECT USING (is_active = true);
--
-- DROP FUNCTION IF EXISTS public.user_is_paid_member();
