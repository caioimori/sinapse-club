import { NextResponse } from "next/server";

/**
 * Simple API key guard for admin endpoints used by external schedulers and
 * automation agents. The key lives in `SINAPSE_ADMIN_API_KEY` (env var on
 * Vercel + local .env). Callers send it via:
 *
 *   Authorization: Bearer <key>
 *
 * Returns null when the request is authorized, or a NextResponse 401/500
 * otherwise. Use in every `/api/admin/*` route.
 */
export function requireAdminKey(request: Request): NextResponse | null {
  const expected = process.env.SINAPSE_ADMIN_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "SINAPSE_ADMIN_API_KEY not configured on server" },
      { status: 500 },
    );
  }
  const header = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!header) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  }
  const match = header.match(/^Bearer\s+(.+)$/i);
  const provided = match?.[1]?.trim();
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  }
  return null;
}
