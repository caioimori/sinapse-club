-- ─────────────────────────────────────────────────────────────────
-- Fix: v_weekly_leaderboard com SECURITY DEFINER bypassa RLS
--
-- Linter Supabase (0010_security_definer_view) reporta como ERROR.
-- View agrega reputation_events + profiles; com SECURITY DEFINER ela
-- executa com privilegios do owner (postgres), ignorando RLS do caller.
--
-- Fix: ALTER VIEW ... SET (security_invoker = on) — view passa a rodar
-- com permissoes de quem consulta, respeitando RLS. Idempotente.
-- ─────────────────────────────────────────────────────────────────

alter view public.v_weekly_leaderboard set (security_invoker = on);

-- Fix adicional: sinapse_sanitize_text sem search_path (linter WARN
-- 0011_function_search_path_mutable). Setar search_path imutavel
-- previne hijack via schema search.
alter function public.sinapse_sanitize_text(text)
  set search_path = public, pg_catalog;
