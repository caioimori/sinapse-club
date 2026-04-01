-- Migration 022: Professional Roles & Profile Extension
-- Story: FORUM-1 | ADR: ADR-001 Section 2.2, 6.1

CREATE TABLE professional_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cluster TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS professional_role_id UUID REFERENCES professional_roles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS threads_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS replies_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reputation INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS featured_badge_id UUID;

CREATE INDEX idx_professional_roles_cluster ON professional_roles(cluster);

ALTER TABLE professional_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read roles" ON professional_roles FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage roles" ON professional_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
