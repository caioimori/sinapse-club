import "server-only";

import { formatMissingConfigError, isMissingConfigValue } from "@/lib/supabase/config-utils";
import { getSupabaseServerConfig } from "@/lib/supabase/server-config";

const ADMIN_CONFIG_SCOPE = "Supabase admin configuration";

export function getSupabaseAdminConfig(): { url: string; serviceRoleKey: string } {
  const { url } = getSupabaseServerConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (isMissingConfigValue(serviceRoleKey)) {
    throw new Error(
      formatMissingConfigError(
        ADMIN_CONFIG_SCOPE,
        "SUPABASE_SERVICE_ROLE_KEY",
      ),
    );
  }

  return {
    url,
    serviceRoleKey: serviceRoleKey as string,
  };
}
