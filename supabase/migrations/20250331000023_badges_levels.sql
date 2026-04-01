-- Migration 023: Badges, User Badges & Levels
-- Story: FORUM-1 | ADR: ADR-001 Section 2.2, 7.2

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  type TEXT NOT NULL,
  requirement_type TEXT,
  requirement_value INT,
  rarity TEXT DEFAULT 'common',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  awarded_by UUID REFERENCES profiles(id),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE levels (
  level INT PRIMARY KEY,
  name TEXT NOT NULL,
  xp_required INT NOT NULL,
  perks TEXT[],
  badge_id UUID REFERENCES badges(id),
  color TEXT
);

-- Add FK for featured_badge_id now that badges table exists
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_featured_badge FOREIGN KEY (featured_badge_id) REFERENCES badges(id);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage badges" ON badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can read user badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "System/admin can award badges" ON user_badges FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can read levels" ON levels FOR SELECT USING (true);
CREATE POLICY "Admins can manage levels" ON levels FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
