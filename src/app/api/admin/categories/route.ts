import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * GET /api/admin/categories
 * Returns all active forum categories + subcategories.
 */
export async function GET(request: Request) {
  const guard = requireAdminKey(request);
  if (guard) return guard;

  const supabase = createServiceClient();

  const [catsRes, subsRes] = await Promise.all([
    supabase
      .from("forum_categories")
      .select("id, slug, name, icon, color")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("forum_subcategories")
      .select("id, category_id, slug, name"),
  ]);

  if (catsRes.error) {
    return NextResponse.json({ error: catsRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    categories: catsRes.data ?? [],
    subcategories: subsRes.data ?? [],
  });
}
