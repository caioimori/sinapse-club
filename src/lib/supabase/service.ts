import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for admin endpoints. Bypasses RLS. NEVER
 * import this file from any client component — it must stay server-only.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase service credentials missing");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
