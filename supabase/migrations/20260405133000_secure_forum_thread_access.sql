-- ============================================================================
-- Migration: Secure Forum Thread Access
-- Story: TIERS-1
-- ============================================================================

CREATE OR REPLACE FUNCTION public.user_has_forum_access(
  category_uuid UUID,
  subcategory_uuid UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role TEXT;
  v_category_access TEXT;
  v_subcategory_access TEXT;
  v_subcategory_category_id UUID;
BEGIN
  IF auth.uid() IS NULL OR category_uuid IS NULL THEN
    RETURN false;
  END IF;

  SELECT role INTO v_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF v_user_role IS NULL THEN
    RETURN false;
  END IF;

  SELECT access INTO v_category_access
  FROM public.forum_categories
  WHERE id = category_uuid
    AND is_active = true;

  IF v_category_access IS NULL THEN
    RETURN false;
  END IF;

  IF public.role_rank(v_user_role) < public.role_rank(COALESCE(v_category_access, 'free')) THEN
    RETURN false;
  END IF;

  IF subcategory_uuid IS NULL THEN
    RETURN true;
  END IF;

  SELECT category_id, access
  INTO v_subcategory_category_id, v_subcategory_access
  FROM public.forum_subcategories
  WHERE id = subcategory_uuid
    AND is_active = true;

  IF v_subcategory_category_id IS NULL OR v_subcategory_category_id <> category_uuid THEN
    RETURN false;
  END IF;

  IF public.role_rank(v_user_role) < public.role_rank(COALESCE(v_subcategory_access, 'free')) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;

DROP POLICY IF EXISTS "Posts visible to authenticated users" ON public.posts;
CREATE POLICY "Posts visible to authenticated users" ON public.posts FOR SELECT USING (
  (category_id IS NOT NULL AND public.user_has_forum_access(category_id, subcategory_id))
  OR
  (space_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.spaces s WHERE s.id = posts.space_id AND public.user_has_access(s.access::text)
  ))
  OR
  (space_id IS NULL AND category_id IS NULL AND auth.uid() IS NOT NULL)
);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (
  auth.uid() = author_id
  AND (
    (type <> 'thread' AND category_id IS NULL)
    OR
    (
      type = 'thread'
      AND category_id IS NOT NULL
      AND public.user_can_create_thread()
      AND public.user_has_forum_access(category_id, subcategory_id)
    )
  )
);
