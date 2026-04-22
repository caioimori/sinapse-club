-- ============================================================================
-- PAYWALL-4: Smoke test RLS — executar no SQL editor do Supabase
-- ============================================================================
-- PRE-REQ: substitua os UUIDs abaixo pelos reais do seu ambiente:
--   :free_user_uuid  — um profile com role='free'
--   :pro_user_uuid   — um profile com role='pro' (ou premium/admin/instructor)
-- Exemplo de como pegar:
--   SELECT id, role FROM profiles LIMIT 10;
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Teste 1: user_is_paid_member() como anon
-- ---------------------------------------------------------------------------
-- Esperado: false
RESET request.jwt.claims;
SELECT public.user_is_paid_member() AS anon_is_paid; -- expect: false

-- ---------------------------------------------------------------------------
-- Teste 2: user_is_paid_member() como free
-- ---------------------------------------------------------------------------
-- Esperado: false
-- SET LOCAL request.jwt.claims = '{"sub":"<free_user_uuid>","role":"authenticated"}';
-- SELECT public.user_is_paid_member() AS free_is_paid; -- expect: false

-- ---------------------------------------------------------------------------
-- Teste 3: user_is_paid_member() como pro
-- ---------------------------------------------------------------------------
-- SET LOCAL request.jwt.claims = '{"sub":"<pro_user_uuid>","role":"authenticated"}';
-- SELECT public.user_is_paid_member() AS pro_is_paid; -- expect: true

-- ---------------------------------------------------------------------------
-- Teste 4: forum_categories visibility
-- ---------------------------------------------------------------------------
-- Como free: expect 0
-- SET LOCAL request.jwt.claims = '{"sub":"<free_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS free_categories_count FROM public.forum_categories;

-- Como pro: expect > 0
-- SET LOCAL request.jwt.claims = '{"sub":"<pro_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS pro_categories_count FROM public.forum_categories;

-- ---------------------------------------------------------------------------
-- Teste 5: forum_subcategories visibility
-- ---------------------------------------------------------------------------
-- Como free: expect 0
-- SET LOCAL request.jwt.claims = '{"sub":"<free_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS free_subcategories_count FROM public.forum_subcategories;

-- ---------------------------------------------------------------------------
-- Teste 6: posts (forum threads) visibility
-- ---------------------------------------------------------------------------
-- Como free: expect 0 em forum threads
-- SET LOCAL request.jwt.claims = '{"sub":"<free_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS free_forum_posts FROM public.posts WHERE category_id IS NOT NULL;

-- Como pro: expect > 0
-- SET LOCAL request.jwt.claims = '{"sub":"<pro_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS pro_forum_posts FROM public.posts WHERE category_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Teste 7: reactions visibility
-- ---------------------------------------------------------------------------
-- Como free: expect 0
-- SET LOCAL request.jwt.claims = '{"sub":"<free_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS free_reactions FROM public.reactions;

-- Como pro: expect >= 0 (pode ser 0 se nao ha reactions ainda, mas query deve funcionar)
-- SET LOCAL request.jwt.claims = '{"sub":"<pro_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS pro_reactions FROM public.reactions;

-- ---------------------------------------------------------------------------
-- Teste 8: feed posts (sem category_id) NAO sao bloqueados
-- ---------------------------------------------------------------------------
-- Como free: expect pode ser > 0 (feed posts sao diferentes de forum)
-- SET LOCAL request.jwt.claims = '{"sub":"<free_user_uuid>","role":"authenticated"}';
-- SELECT count(*) AS free_feed_posts FROM public.posts
--   WHERE category_id IS NULL AND space_id IS NULL;

-- ---------------------------------------------------------------------------
-- Cleanup
-- ---------------------------------------------------------------------------
RESET request.jwt.claims;
