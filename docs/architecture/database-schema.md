# Database Schema — sinapse.club

> Owner: @data-engineer (Dara) | Reviewed by: @architect (Aria)
> Database: Supabase PostgreSQL 15
> Status: DRAFT v1
> Created: 2026-03-27

---

## 1. Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        sinapse.club Schema                       │
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   profiles    │────→│    posts     │←────│  comments    │    │
│  │              │     │              │     │              │    │
│  │  user data   │     │  forum posts │     │  threaded    │    │
│  └──────┬───────┘     └──────┬───────┘     └──────────────┘    │
│         │                    │                                   │
│         │             ┌──────┴───────┐                          │
│         │             │   spaces     │                          │
│         │             │              │                          │
│         │             │  categories  │                          │
│         │             └──────────────┘                          │
│         │                                                       │
│  ┌──────┴───────┐     ┌──────────────┐     ┌──────────────┐    │
│  │ subscriptions│     │   courses    │────→│   lessons    │    │
│  │              │     │              │     │              │    │
│  │  billing     │     │  course data │     │  video/text  │    │
│  └──────────────┘     └──────┬───────┘     └──────────────┘    │
│                              │                                   │
│                       ┌──────┴───────┐     ┌──────────────┐    │
│                       │  enrollments │     │   progress   │    │
│                       │              │     │              │    │
│                       │  user↔course │     │  per lesson  │    │
│                       └──────────────┘     └──────────────┘    │
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   events     │     │    rsvps     │     │  curated_    │    │
│  │              │     │              │     │  content     │    │
│  │  calendar    │     │  attendance  │     │              │    │
│  └──────────────┘     └──────────────┘     │  EN↔PT feed  │    │
│                                            └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Table Definitions

### 2.1 profiles

Extends Supabase `auth.users`. Public profile data.

```sql
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  role          TEXT NOT NULL DEFAULT 'free'
                CHECK (role IN ('free', 'pro', 'premium', 'admin', 'instructor')),
  locale        TEXT NOT NULL DEFAULT 'pt-BR'
                CHECK (locale IN ('pt-BR', 'en')),
  interests     TEXT[] DEFAULT '{}',
  points        INTEGER NOT NULL DEFAULT 0,
  streak_days   INTEGER NOT NULL DEFAULT 0,
  streak_last   DATE,
  onboarded     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_points ON public.profiles(points DESC);

-- Trigger: auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2.2 spaces

Forum categories / spaces.

```sql
CREATE TABLE public.spaces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,                -- emoji or icon name
  type        TEXT NOT NULL DEFAULT 'ugc'
              CHECK (type IN ('curated', 'ugc', 'mixed')),
  access      TEXT NOT NULL DEFAULT 'free'
              CHECK (access IN ('free', 'pro', 'premium')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed data
INSERT INTO public.spaces (slug, name, icon, type, access, sort_order) VALUES
  ('ai-news',       'AI News',        '📰', 'curated', 'free', 1),
  ('llms-agents',   'LLMs & Agents',  '🤖', 'mixed',   'free', 2),
  ('coding-tools',  'Coding & Tools', '🛠️', 'ugc',     'pro',  3),
  ('carreira-ai',   'Carreira AI',    '💼', 'ugc',     'pro',  4),
  ('show-and-tell', 'Show & Tell',    '🚀', 'ugc',     'free', 5),
  ('off-topic',     'Off-topic',      '💬', 'ugc',     'free', 6);
```

### 2.3 posts

Forum posts (user-generated and curated).

```sql
CREATE TABLE public.posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  space_id        UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  title           TEXT,
  content         TEXT NOT NULL,               -- rich text (HTML from Tiptap)
  content_plain   TEXT,                        -- plain text for search
  type            TEXT NOT NULL DEFAULT 'post'
                  CHECK (type IN ('post', 'curated', 'announcement', 'poll')),
  is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked       BOOLEAN NOT NULL DEFAULT FALSE,
  likes_count     INTEGER NOT NULL DEFAULT 0,
  comments_count  INTEGER NOT NULL DEFAULT 0,
  views_count     INTEGER NOT NULL DEFAULT 0,
  search_vector   TSVECTOR,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_space ON public.posts(space_id, created_at DESC);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_search ON public.posts USING GIN(search_vector);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION public.posts_search_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('portuguese',
    COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content_plain, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_trigger
  BEFORE INSERT OR UPDATE OF title, content_plain ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.posts_search_update();
```

### 2.4 comments

Threaded comments on posts.

```sql
CREATE TABLE public.comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- threading
  content     TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_post ON public.comments(post_id, created_at);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);
```

### 2.5 reactions

Likes/saves on posts and comments.

```sql
CREATE TABLE public.reactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id   UUID NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('like', 'save')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, target_type, target_id, type)
);

-- Indexes
CREATE INDEX idx_reactions_target ON public.reactions(target_type, target_id);
CREATE INDEX idx_reactions_user ON public.reactions(user_id);
```

### 2.6 curated_content

Content ingested from external sources.

```sql
CREATE TABLE public.curated_content (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source            TEXT NOT NULL
                    CHECK (source IN ('x', 'reddit', 'rss', 'docs', 'youtube', 'newsletter')),
  source_id         TEXT,                       -- external ID (tweet ID, reddit post ID)
  source_url        TEXT NOT NULL,
  source_author     TEXT,
  original_text     TEXT NOT NULL,              -- original content (usually EN)
  translated_text   TEXT,                       -- translated content (usually PT-BR)
  original_lang     TEXT NOT NULL DEFAULT 'en',
  translated_lang   TEXT DEFAULT 'pt-BR',
  summary           TEXT,                       -- AI-generated summary
  title             TEXT,
  category          TEXT,                       -- maps to space slug
  tags              TEXT[] DEFAULT '{}',
  relevance_score   FLOAT NOT NULL DEFAULT 0.5, -- 0-1, AI-scored
  translation_status TEXT NOT NULL DEFAULT 'pending'
                    CHECK (translation_status IN ('pending', 'translated', 'failed', 'manual')),
  is_published      BOOLEAN NOT NULL DEFAULT FALSE,
  published_as_post UUID REFERENCES public.posts(id), -- link to forum post if published
  fetched_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  translated_at     TIMESTAMPTZ,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_curated_source ON public.curated_content(source, fetched_at DESC);
CREATE INDEX idx_curated_status ON public.curated_content(translation_status);
CREATE INDEX idx_curated_published ON public.curated_content(is_published, published_at DESC);
CREATE INDEX idx_curated_score ON public.curated_content(relevance_score DESC);
CREATE UNIQUE INDEX idx_curated_source_id ON public.curated_content(source, source_id)
  WHERE source_id IS NOT NULL;
```

### 2.7 courses

Course catalog.

```sql
CREATE TABLE public.courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES public.profiles(id),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  type          TEXT NOT NULL DEFAULT 'perpetual'
                CHECK (type IN ('perpetual', 'launch', 'mini')),
  price_cents   INTEGER NOT NULL DEFAULT 0,     -- price in BRL cents (0 = free)
  currency      TEXT NOT NULL DEFAULT 'BRL',
  stripe_price_id TEXT,                         -- Stripe Price ID
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  total_duration_minutes INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_published ON public.courses(is_published, created_at DESC);
CREATE INDEX idx_courses_type ON public.courses(type);
```

### 2.8 modules

Course modules (sections).

```sql
CREATE TABLE public.modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_modules_course ON public.modules(course_id, sort_order);
```

### 2.9 lessons

Individual lessons within modules.

```sql
CREATE TABLE public.lessons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id       UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT NOT NULL DEFAULT 'video'
                  CHECK (type IN ('video', 'text', 'quiz')),
  video_url       TEXT,                          -- Bunny.net stream URL
  video_duration  INTEGER DEFAULT 0,             -- duration in seconds
  content         TEXT,                          -- text content (for text lessons)
  is_preview      BOOLEAN NOT NULL DEFAULT FALSE, -- free preview
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lessons_module ON public.lessons(module_id, sort_order);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
```

### 2.10 enrollments

User ↔ Course relationship (purchases).

```sql
CREATE TABLE public.enrollments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id           UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  stripe_payment_id   TEXT,
  status              TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'refunded', 'expired')),
  enrolled_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,

  UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
```

### 2.11 lesson_progress

Track progress per lesson per user.

```sql
CREATE TABLE public.lesson_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id       UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'not_started'
                  CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_pct    FLOAT NOT NULL DEFAULT 0,     -- 0-100 for video progress
  last_position   INTEGER DEFAULT 0,            -- video position in seconds
  completed_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_progress_user_course ON public.lesson_progress(user_id, course_id);
```

### 2.12 subscriptions

Subscription records (synced from Stripe).

```sql
CREATE TABLE public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT NOT NULL,
  stripe_subscription_id  TEXT UNIQUE,
  plan                    TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'premium')),
  status                  TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid')),
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at               TIMESTAMPTZ,
  canceled_at             TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
```

### 2.13 events

Calendar events.

```sql
CREATE TABLE public.events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id       UUID NOT NULL REFERENCES public.profiles(id),
  title         TEXT NOT NULL,
  description   TEXT,
  type          TEXT NOT NULL DEFAULT 'live'
                CHECK (type IN ('live', 'office_hours', 'workshop', 'ama')),
  access        TEXT NOT NULL DEFAULT 'pro'
                CHECK (access IN ('free', 'pro', 'premium', 'course')),
  course_id     UUID REFERENCES public.courses(id), -- if course-specific
  start_at      TIMESTAMPTZ NOT NULL,
  end_at        TIMESTAMPTZ NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  meeting_url   TEXT,                               -- Zoom/Meet link
  recording_url TEXT,                               -- post-event recording
  max_attendees INTEGER,
  rsvp_count    INTEGER NOT NULL DEFAULT 0,
  is_recurring  BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence    JSONB,                              -- recurrence rules
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_start ON public.events(start_at);
CREATE INDEX idx_events_host ON public.events(host_id);
CREATE INDEX idx_events_course ON public.events(course_id);
CREATE INDEX idx_events_type ON public.events(type);
```

### 2.14 rsvps

Event attendance.

```sql
CREATE TABLE public.rsvps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'confirmed'
              CHECK (status IN ('confirmed', 'maybe', 'canceled')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX idx_rsvps_event ON public.rsvps(event_id);
CREATE INDEX idx_rsvps_user ON public.rsvps(user_id);
```

---

## 3. Row Level Security (RLS)

### 3.1 Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ═══════════════════════════════════════════
-- SPACES
-- ═══════════════════════════════════════════
CREATE POLICY "Active spaces are viewable by everyone"
  ON public.spaces FOR SELECT
  USING (is_active = true);

-- ═══════════════════════════════════════════
-- POSTS
-- ═══════════════════════════════════════════
-- Helper function: check user subscription tier
CREATE OR REPLACE FUNCTION public.user_has_access(required_access TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();

  IF required_access = 'free' THEN RETURN true; END IF;
  IF required_access = 'pro' AND user_role IN ('pro', 'premium', 'admin', 'instructor') THEN RETURN true; END IF;
  IF required_access = 'premium' AND user_role IN ('premium', 'admin', 'instructor') THEN RETURN true; END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Posts visible based on space access"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.spaces s
      WHERE s.id = space_id
      AND public.user_has_access(s.access)
    )
  );

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- ═══════════════════════════════════════════
-- COURSES & LESSONS
-- ═══════════════════════════════════════════
CREATE POLICY "Published courses visible to all"
  ON public.courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Lessons visible to enrolled users or preview"
  ON public.lessons FOR SELECT
  USING (
    is_preview = true
    OR EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = lessons.course_id
      AND e.user_id = auth.uid()
      AND e.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'instructor')
    )
  );

-- ═══════════════════════════════════════════
-- SUBSCRIPTIONS
-- ═══════════════════════════════════════════
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════
-- LESSON PROGRESS
-- ═══════════════════════════════════════════
CREATE POLICY "Users can view own progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 4. Database Functions

### 4.1 Increment Counters

```sql
-- Increment post likes/comments counts atomically
CREATE OR REPLACE FUNCTION public.increment_post_counter(
  post_id UUID,
  counter_name TEXT,
  amount INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE public.posts SET %I = %I + $1, updated_at = NOW() WHERE id = $2',
    counter_name, counter_name
  ) USING amount, post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.2 Update Streak

```sql
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  last_streak DATE;
  current_streak INTEGER;
BEGIN
  SELECT streak_last, streak_days INTO last_streak, current_streak
  FROM public.profiles WHERE id = user_uuid;

  IF last_streak = CURRENT_DATE THEN
    -- Already updated today
    RETURN;
  ELSIF last_streak = CURRENT_DATE - 1 THEN
    -- Consecutive day
    UPDATE public.profiles
    SET streak_days = current_streak + 1,
        streak_last = CURRENT_DATE,
        points = points + 15
    WHERE id = user_uuid;
  ELSE
    -- Streak broken, reset
    UPDATE public.profiles
    SET streak_days = 1,
        streak_last = CURRENT_DATE,
        points = points + 15
    WHERE id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Migration Strategy

### 5.1 Migration Order

```
001_create_profiles.sql
002_create_spaces.sql
003_create_posts.sql
004_create_comments.sql
005_create_reactions.sql
006_create_curated_content.sql
007_create_courses.sql
008_create_modules_lessons.sql
009_create_enrollments_progress.sql
010_create_subscriptions.sql
011_create_events_rsvps.sql
012_create_rls_policies.sql
013_create_functions_triggers.sql
014_seed_spaces.sql
```

### 5.2 Seed Data

Spaces iniciais, usuario admin, curso de demonstracao.

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-27 | Initial schema design | @data-engineer (Dara) + Imperator |
