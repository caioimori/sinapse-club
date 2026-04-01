-- Migration 021: Extend Posts Table for Forum Threads
-- Story: FORUM-1 | ADR: ADR-001 Section 2.2

ALTER TABLE posts ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES forum_categories(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES forum_subcategories(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_solved BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_sticky BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS last_reply_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS last_reply_by UUID REFERENCES profiles(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Make space_id nullable (threads won't have space_id)
ALTER TABLE posts ALTER COLUMN space_id DROP NOT NULL;

-- Indexes for forum queries
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_subcategory ON posts(subcategory_id) WHERE subcategory_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_last_reply ON posts(last_reply_at DESC NULLS LAST) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_is_sticky ON posts(is_sticky) WHERE is_sticky = true;
