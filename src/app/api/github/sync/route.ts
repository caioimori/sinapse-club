import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimiters, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 1 GitHub sync per 60 seconds per user
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
      }
    );
  }

  const { github_username } = await request.json();

  if (!github_username || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(github_username)) {
    return NextResponse.json({ error: "Invalid github_username" }, { status: 400 });
  }

  try {
    // Fetch repos from GitHub API (public, no auth needed)
    const res = await fetch(
      `https://api.github.com/users/${github_username}/repos?sort=stars&direction=desc&per_page=12&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "sinapse-club",
        },
        next: { revalidate: 3600 }, // Cache 1 hour
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const allRepos = await res.json();

    // Map to only the fields we need
    const repos = allRepos
      .filter((r: any) => !r.fork) // Exclude forks
      .slice(0, 8) // Top 8 repos
      .map((r: any) => ({
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        language: r.language,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        topics: r.topics || [],
      }));

    // Fetch GitHub profile for URL
    const profileRes = await fetch(`https://api.github.com/users/${github_username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "sinapse-club",
      },
    });
    const githubProfile = await profileRes.json();

    // Update profile
    await (supabase as any).from("profiles").update({
      github_username,
      github_url: githubProfile.html_url,
      github_repos: repos,
    }).eq("id", user.id);

    return NextResponse.json({ repos, profile_url: githubProfile.html_url });
  } catch (err) {
    console.error("GitHub sync error:", err);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
