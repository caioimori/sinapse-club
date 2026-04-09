CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  reason text NOT NULL DEFAULT 'inappropriate',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert reports" ON reports FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = reporter_id);
CREATE POLICY "Admins can read all reports" ON reports FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
);
CREATE POLICY "Admins can update reports" ON reports FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
);
