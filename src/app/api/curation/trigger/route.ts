import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimiters, checkRateLimit } from "@/lib/rate-limit";

// Manual trigger for curation pipeline (admin only)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as any;

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  // Rate limit: 20 admin trigger requests per minute per user
  const rateLimitResult = await checkRateLimit(rateLimiters.admin, user.id);
  if (rateLimitResult && !rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.reset),
          "Retry-After": String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
        },
      }
    );
  }

  const { step } = await request.json().catch(() => ({ step: "all" }));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const results: Record<string, any> = {};

  const steps = step === "all"
    ? ["curate-rss", "translate-content", "publish-curated"]
    : [step];

  for (const fn of steps) {
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      });
      results[fn] = await res.json();
    } catch (err) {
      results[fn] = { error: (err as Error).message };
    }
  }

  return NextResponse.json({ results });
}
