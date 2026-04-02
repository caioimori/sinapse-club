-- ============================================================================
-- Migration: Access Control & Tiers (ADR-002)
-- Story: TIERS-1
-- ============================================================================

-- 1. role_rank() function
CREATE OR REPLACE FUNCTION public.role_rank(user_role TEXT)
RETURNS INT AS $$
BEGIN
  RETURN CASE user_role
    WHEN 'admin' THEN 100
    WHEN 'instructor' THEN 90
    WHEN 'premium' THEN 30
    WHEN 'pro' THEN 20
    WHEN 'free' THEN 10
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. courses.included_in_premium column
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS included_in_premium BOOLEAN DEFAULT false;

-- 3. free_tier_limits table
CREATE TABLE IF NOT EXISTS public.free_tier_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL DEFAULT date_trunc('month', now())::date,
  threads_created INT DEFAULT 0,
  UNIQUE(user_id, period_start)
);

ALTER TABLE public.free_tier_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own limits"
  ON public.free_tier_limits FOR SELECT
  USING (auth.uid() = user_id);

-- 4. user_has_course_access() function
CREATE OR REPLACE FUNCTION public.user_has_course_access(course_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_role TEXT;
  v_has_enrollment BOOLEAN;
  v_is_premium_course BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;

  SELECT role INTO v_user_role FROM public.profiles WHERE id = auth.uid();

  -- Admin/instructor always has access
  IF v_user_role IN ('admin', 'instructor') THEN RETURN true; END IF;

  -- Check direct enrollment
  SELECT EXISTS(
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid()
    AND course_id = course_uuid
    AND status = 'active'
  ) INTO v_has_enrollment;
  IF v_has_enrollment THEN RETURN true; END IF;

  -- Premium users get courses marked as included_in_premium
  IF v_user_role = 'premium' THEN
    SELECT included_in_premium INTO v_is_premium_course
    FROM public.courses WHERE id = course_uuid;
    IF v_is_premium_course THEN RETURN true; END IF;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. user_can_create_thread() function
CREATE OR REPLACE FUNCTION public.user_can_create_thread()
RETURNS BOOLEAN AS $$
DECLARE
  v_user_role TEXT;
  v_current_count INT;
  v_max_threads INT := 3;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;

  SELECT role INTO v_user_role FROM public.profiles WHERE id = auth.uid();

  -- Pro+ can always create
  IF public.role_rank(v_user_role) >= 20 THEN RETURN true; END IF;

  -- Free: check monthly limit
  SELECT threads_created INTO v_current_count
  FROM public.free_tier_limits
  WHERE user_id = auth.uid()
  AND period_start = date_trunc('month', now())::date;

  IF v_current_count IS NULL THEN RETURN true; END IF;
  RETURN v_current_count < v_max_threads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger to increment free tier thread count
CREATE OR REPLACE FUNCTION public.increment_free_thread_count()
RETURNS TRIGGER AS $$
DECLARE
  v_user_role TEXT;
BEGIN
  IF NEW.type = 'thread' AND NEW.category_id IS NOT NULL THEN
    SELECT role INTO v_user_role FROM public.profiles WHERE id = NEW.author_id;
    IF public.role_rank(v_user_role) < 20 THEN
      INSERT INTO public.free_tier_limits (user_id, period_start, threads_created)
      VALUES (NEW.author_id, date_trunc('month', now())::date, 1)
      ON CONFLICT (user_id, period_start)
      DO UPDATE SET threads_created = public.free_tier_limits.threads_created + 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_free_thread_count ON public.posts;
CREATE TRIGGER trg_increment_free_thread_count
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_free_thread_count();

-- ============================================================================
-- 7. Updated RLS Policies
-- ============================================================================

-- 7a. Posts SELECT: tier-gated by forum_categories.access
DROP POLICY IF EXISTS "Posts visible to authenticated users" ON public.posts;
CREATE POLICY "Posts visible to authenticated users" ON public.posts FOR SELECT USING (
  -- Forum threads: check category access vs user role
  (category_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.forum_categories fc
    WHERE fc.id = posts.category_id
    AND fc.is_active = true
    AND public.role_rank((SELECT role FROM public.profiles WHERE id = auth.uid()))
        >= public.role_rank(fc.access::text)
  ))
  OR
  -- Legacy space posts
  (space_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.spaces s WHERE s.id = posts.space_id AND public.user_has_access(s.access::text)
  ))
  OR
  -- Posts without space or category (feed posts)
  (space_id IS NULL AND category_id IS NULL AND auth.uid() IS NOT NULL)
);

-- 7b. Posts INSERT: thread creation enforces user_can_create_thread()
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (
  auth.uid() = author_id
  AND (
    -- Non-thread posts: always allowed
    (type != 'thread' OR category_id IS NULL)
    OR
    -- Threads: check limit
    public.user_can_create_thread()
  )
);

-- 7c. Marketplace: pro+ only
DROP POLICY IF EXISTS "Authenticated can read listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Anyone can read active listings" ON public.marketplace_listings;
CREATE POLICY "Pro+ can read listings" ON public.marketplace_listings FOR SELECT USING (
  public.role_rank((SELECT role FROM public.profiles WHERE id = auth.uid())) >= 20
  AND is_active = true
);

DROP POLICY IF EXISTS "Authenticated can create listings" ON public.marketplace_listings;
CREATE POLICY "Pro+ can create listings" ON public.marketplace_listings FOR INSERT WITH CHECK (
  auth.uid() = author_id
  AND public.role_rank((SELECT role FROM public.profiles WHERE id = auth.uid())) >= 20
);

-- 7d. Benefits: pro+ only
DROP POLICY IF EXISTS "Authenticated can read benefits" ON public.benefits;
DROP POLICY IF EXISTS "Anyone can read active benefits" ON public.benefits;
CREATE POLICY "Pro+ can read benefits" ON public.benefits FOR SELECT USING (
  public.role_rank((SELECT role FROM public.profiles WHERE id = auth.uid())) >= 20
  AND is_active = true
);

-- 7e. Subscriptions: user can only see own
DROP POLICY IF EXISTS "Users can read own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can read own subscription" ON public.subscriptions FOR SELECT USING (
  auth.uid() = user_id
);
