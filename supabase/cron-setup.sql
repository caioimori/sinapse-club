-- Cron jobs for sinapse.club curation pipeline
-- Run this in Supabase SQL Editor after deploying Edge Functions

-- Enable pg_cron extension (if not already)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Curate RSS feeds every 1 hour
SELECT cron.schedule(
  'curate-rss',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/curate-rss',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Translate pending content every 15 minutes
SELECT cron.schedule(
  'translate-content',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/translate-content',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Publish curated content every 30 minutes
SELECT cron.schedule(
  'publish-curated',
  '*/30 * * * *', -- Every 30 minutes
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/publish-curated',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
