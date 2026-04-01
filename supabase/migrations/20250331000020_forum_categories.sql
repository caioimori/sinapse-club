-- Migration 020: Forum Categories & Subcategories
-- Story: FORUM-1 | ADR: ADR-001 Section 2.2

-- forum_categories table
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INT DEFAULT 0,
  access TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  threads_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  last_thread_id UUID,
  last_thread_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- forum_subcategories table
CREATE TABLE forum_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  access TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  threads_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  last_thread_id UUID,
  last_thread_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Indexes
CREATE INDEX idx_forum_categories_slug ON forum_categories(slug);
CREATE INDEX idx_forum_categories_sort ON forum_categories(sort_order);
CREATE INDEX idx_forum_subcategories_category ON forum_subcategories(category_id);
CREATE INDEX idx_forum_subcategories_slug ON forum_subcategories(category_id, slug);

-- RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active categories" ON forum_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON forum_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can read active subcategories" ON forum_subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage subcategories" ON forum_subcategories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
