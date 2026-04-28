-- PAYWALL-5: signup-after-payment flow
--
-- When a visitor accepts the LGPD checkbox at /checkout/[plano] BEFORE
-- creating an account, we need somewhere to log that consent so we have
-- an audit trail even if the payment never completes (visitor abandons).
--
-- This table holds those pre-signup consent events keyed by email. Once
-- the user is created (in the AbacatePay webhook handler), we leave these
-- rows in place as the legal record of when the visitor consented — they
-- are NOT migrated into `consent_log` (which is keyed by user_id) because
-- that would create a chicken-and-egg circular constraint.

CREATE TABLE IF NOT EXISTS public.pre_signup_consent (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    event_type text NOT NULL CHECK (event_type IN ('checkout_terms', 'checkout_privacy')),
    document_version text NOT NULL DEFAULT 'v1',
    ip text,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pre_signup_consent_email
    ON public.pre_signup_consent (email);
CREATE INDEX IF NOT EXISTS idx_pre_signup_consent_created_at
    ON public.pre_signup_consent (created_at DESC);

-- RLS: only service_role can read/write. Anonymous public inserts go
-- through a SECURITY DEFINER function so we don't expose the table to
-- anon directly.
ALTER TABLE public.pre_signup_consent ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated — service_role bypasses RLS.
-- The /checkout/[plano] server action runs in node runtime with the
-- anon key (the visitor is not logged in), so we need a permissive
-- INSERT policy for anon, scoped to this table only.
CREATE POLICY "anon_can_log_pre_signup_consent"
    ON public.pre_signup_consent
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

COMMENT ON TABLE public.pre_signup_consent IS
    'LGPD consent events captured at /checkout before user account exists (PAYWALL-5).';
