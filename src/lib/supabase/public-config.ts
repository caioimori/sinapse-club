import { formatMissingConfigError, isMissingConfigValue } from "@/lib/supabase/config-utils";

const PUBLIC_CONFIG_SCOPE = "Supabase public configuration";

export function hasSupabasePublicConfig() {
  return !isMissingConfigValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
    && !isMissingConfigValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabasePublicConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isMissingConfigValue(url)) {
    throw new Error(
      formatMissingConfigError(
        PUBLIC_CONFIG_SCOPE,
        "NEXT_PUBLIC_SUPABASE_URL",
      ),
    );
  }

  if (isMissingConfigValue(anonKey)) {
    throw new Error(
      formatMissingConfigError(
        PUBLIC_CONFIG_SCOPE,
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ),
    );
  }

  return {
    url: url as string,
    anonKey: anonKey as string,
  };
}
