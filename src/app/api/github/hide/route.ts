import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { repo?: string; hidden?: boolean } | null;
  const repo = body?.repo?.trim();
  const hidden = body?.hidden;
  if (!repo || typeof hidden !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const { data: profile } = await db
    .from("profiles")
    .select("github_hidden_repos")
    .eq("id", user.id)
    .single();

  const current: string[] = profile?.github_hidden_repos ?? [];
  const next = hidden
    ? Array.from(new Set([...current, repo]))
    : current.filter((r) => r !== repo);

  const { error } = await db
    .from("profiles")
    .update({ github_hidden_repos: next })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hidden_repos: next });
}
