-- STRIPE-2.1: idempotencia de webhooks Stripe
--
-- Stripe entrega o mesmo evento multiplas vezes em caso de retry/replay.
-- Tabela armazena event.id (PK) pra detectar replays e retornar 200 sem
-- reprocessar. INSERT antes do processamento; UNIQUE conflict = idempotent.
--
-- RLS habilitado sem policies = somente service_role acessa (correto, e
-- server-only — handler usa supabaseAdmin).

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id TEXT PRIMARY KEY,                                  -- Stripe event.id (evt_xxx)
  type TEXT NOT NULL,                                   -- e.g. customer.subscription.created
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL                                -- evento completo (pra debug/replay)
);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Sem policies = sem acesso anon/authenticated. Apenas service_role.

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_processed_at
  ON public.stripe_webhook_events (processed_at DESC);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type
  ON public.stripe_webhook_events (type);

COMMENT ON TABLE public.stripe_webhook_events IS
  'Idempotency log for Stripe webhook events (event.id PK prevents duplicate processing).';
