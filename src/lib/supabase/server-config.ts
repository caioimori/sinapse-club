import { formatMissingConfigError, isMissingConfigValue } from "@/lib/supabase/config-utils";

const SERVER_CONFIG_SCOPE = "Supabase server configuration";

function readServerPublicUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
}

function readServerAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
}

export function hasSupabaseServerConfig() {
  return !isMissingConfigValue(readServerPublicUrl())
    && !isMissingConfigValue(readServerAnonKey());
}

export function getSupabaseServerConfig(): { url: string; anonKey: string } {
  const url = readServerPublicUrl();
  const anonKey = readServerAnonKey();

  if (isMissingConfigValue(url)) {
    throw new Error(
      formatMissingConfigError(
        SERVER_CONFIG_SCOPE,
        "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL",
      ),
    );
  }

  if (isMissingConfigValue(anonKey)) {
    throw new Error(
      formatMissingConfigError(
        SERVER_CONFIG_SCOPE,
        "NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY",
      ),
    );
  }

  return {
    url: url as string,
    anonKey: anonKey as string,
  };
}
