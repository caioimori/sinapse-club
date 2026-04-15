import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";

// The curator bots — also used by publish-curated and the scheduler agent.
const BOT_USER_IDS = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
  "00000000-0000-0000-0000-000000000004",
  "00000000-0000-0000-0000-000000000005",
];

/**
 * GET /api/admin/bots
 * Returns the bot user rows (id, username, display_name, avatar_url).
 * Used by external schedulers to pick which bot will post next.
 */
export async function GET(request: Request) {
  const guard = requireAdminKey(request);
  if (guard) return guard;

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", BOT_USER_IDS)
    .order("username", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bots: data ?? [] });
}
