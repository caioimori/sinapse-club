-- Migration 025: Tools & Benefits (placeholder)
-- Story: FORUM-1 | ADR: ADR-001 Section 2.2

CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  url TEXT,
  access TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_logo TEXT,
  description TEXT,
  discount_text TEXT,
  url TEXT,
  coupon_code TEXT,
  access TEXT DEFAULT 'pro',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tools" ON tools FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage tools" ON tools FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Pro+ can read benefits" ON benefits FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('pro', 'premium', 'admin'))
);
CREATE POLICY "Admins can manage benefits" ON benefits FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
