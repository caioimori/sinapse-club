-- ════════════════════════════════════════════════
-- Media Support: Storage buckets + post columns
-- ════════════════════════════════════════════════

-- Add media columns to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url   text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS poll_options jsonb;

-- ── Storage Buckets ───────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('posts',   'posts',   true, 5242880,  ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('avatars', 'avatars', true, 2097152,  ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ── RLS: posts bucket ────────────────────────────
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read posts images"        ON storage.objects;
  DROP POLICY IF EXISTS "Auth users upload posts images"  ON storage.objects;
  DROP POLICY IF EXISTS "Auth users delete posts images"  ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public read posts images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

CREATE POLICY "Auth users upload posts images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Auth users delete posts images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── RLS: avatars bucket ──────────────────────────
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read avatars"             ON storage.objects;
  DROP POLICY IF EXISTS "Auth users manage own avatar"    ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Auth users manage own avatar"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
