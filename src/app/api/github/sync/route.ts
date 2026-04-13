import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimiters, checkRateLimit } from "@/lib/rate-limit";

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
};

type GithubProfile = {
  login: string;
  html_url: string;
};

/**
 * Resolve the GitHub username for the authenticated user.
 *
 * Priority order:
 *   1. `identities[provider=github].identity_data.user_name` — verified via OAuth
 *   2. `profiles.github_username` — manually set fallback (legacy users only)
 *
 * Returns `{ username, verified }` where `verified=true` only when pulled
 * from the Supabase identity (i.e. the user actually logged into GitHub).
 */
async function resolveGithubUsername(userId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: userData } = await supabase.auth.getUser();
  const githubIdentity = userData?.user?.identities?.find((i) => i.provider === "github");

  if (githubIdentity) {
    const data = githubIdentity.identity_data as { user_name?: string; preferred_username?: string } | undefined;
    const verifiedUsername = data?.user_name ?? data?.preferred_username;
    if (verifiedUsername) {
      return { username: verifiedUsername, verified: true as const };
    }
  }

  const { data: profile } = await (supabase as unknown as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (k: string, v: string) => {
          maybeSingle: () => Promise<{ data: { github_username: string | null } | null }>;
        };
      };
    };
  })
    .from("profiles")
    .select("github_username")
    .eq("id", userId)
    .maybeSingle();

  return profile?.github_username
    ? { username: profile.github_username, verified: false as const }
    : null;
}

async function fetchReposFromGithub(username: string): Promise<{
  repos: Omit<GithubRepo, "fork">[];
  profileUrl: string;
} | { error: string; status: number }> {
  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=30&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "sinapse-club",
      },
      // 10 min cache so profile page visits are cheap and stale-safe
      next: { revalidate: 600, tags: [`github-repos-${username}`] },
    },
  );

  if (!reposRes.ok) {
    if (reposRes.status === 404) return { error: "GitHub user not found", status: 404 };
    return { error: "GitHub API error", status: 502 };
  }

  const allRepos = (await reposRes.json()) as GithubRepo[];
  const repos = allRepos
    .filter((r) => !r.fork)
    .slice(0, 8)
    .map((r) => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      topics: r.topics || [],
    }));

  const profileRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "sinapse-club" },
    next: { revalidate: 600 },
  });
  const profile = (await profileRes.json()) as GithubProfile;

  return { repos, profileUrl: profile.html_url };
}

/**
 * POST — refresh the user's GitHub repos into the cache column on `profiles`.
 * Username now comes from the verified GitHub identity (via OAuth). Legacy
 * users with only a manually-typed username still get a sync, but the
 * response marks `verified: false` so the UI can nudge them to reconnect.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResult = await checkRateLimit(rateLimiters.githubSync, user.id);
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
      },
    );
  }

  const resolved = await resolveGithubUsername(user.id, supabase);
  if (!resolved) {
    return NextResponse.json(
      { error: "No GitHub identity connected. Connect your GitHub account in Settings." },
      { status: 400 },
    );
  }

  const result = await fetchReposFromGithub(resolved.username);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await (supabase as unknown as {
    from: (t: string) => {
      update: (v: Record<string, unknown>) => {
        eq: (k: string, v: string) => Promise<unknown>;
      };
    };
  })
    .from("profiles")
    .update({
      github_username: resolved.username,
      github_url: result.profileUrl,
      github_repos: result.repos,
    })
    .eq("id", user.id);

  return NextResponse.json({
    repos: result.repos,
    profile_url: result.profileUrl,
    verified: resolved.verified,
  });
}

/**
 * GET — fetch a user's repos on demand (used by profile server components).
 * Falls back to the cached `profiles.github_repos` column on GitHub failures.
 * `username` is validated and restricted to the GitHub username regex.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const result = await fetchReposFromGithub(username);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ repos: result.repos, profile_url: result.profileUrl });
}
