import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ThreadListItem } from "@/components/forum/thread-list-item";
import { GitHubRepos } from "@/components/profile/github-repos";
import { FollowButton } from "@/components/feed/follow-button";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { TierBadge } from "@/components/access/tier-badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarDays, MapPin, LinkIcon, GitFork, FileText, MessageCircle, Heart, Briefcase } from "lucide-react";
import { BackButton } from "@/components/layout/back-button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { normalizeWebsiteUrl, displayDomain } from "@/lib/url";
import { hydrateReposts, mapRowToThreadData } from "@/app/(dashboard)/forum/_thread-query";
import type { ThreadData } from "@/components/forum/thread-list-item";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return { title: `@${username}` };
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return String(n);
}

type CachedRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
};

/**
 * Fetches live repos from GitHub with a 10-minute edge cache. On any failure
 * (rate limit, network, 404) falls back to the cached column we persisted
 * via `/api/github/sync` so the profile never looks broken.
 */
async function fetchGithubReposLive(
  username: string,
  fallback: CachedRepo[],
): Promise<CachedRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=30&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "sinapse-club",
        },
        next: { revalidate: 600, tags: [`github-repos-${username}`] },
      },
    );
    if (!res.ok) return fallback;
    const all = (await res.json()) as (CachedRepo & { fork: boolean })[];
    return all
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
  } catch {
    return fallback;
  }
}

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get profile by username (with professional role join)
  const { data: profile } = (await supabase
    .from("profiles")
    .select("*, professional_role:professional_roles(name, cluster)")
    .eq("username", username)
    .single()) as any;

  if (!profile) notFound();

  // If viewing own profile, redirect to /profile
  if (user && profile.id === user.id) {
    redirect("/profile");
  }

  // Use the same THREAD_SELECT shape as the main feed so mapRowToThreadData +
  // hydrateReposts work identically.
  const postSelect = "id, title, content_plain, image_url, repost_of, is_sticky, is_solved, replies_count, views_count, reposts_count, tags, created_at, last_reply_at, author_id, category_id, subcategory_id, profiles!author_id(username, display_name, avatar_url, reputation, role, professional_role_id, professional_role:professional_roles(name, cluster)), forum_categories!category_id(slug, name, icon, color), forum_subcategories!subcategory_id(slug, name)";

  // Run threads, replies, liked reactions and follow check in parallel
  const [threadsRes, repliesRes, likedReactionsRes, followRes] = await Promise.all([
    (supabase.from("posts").select(postSelect).eq("author_id", profile.id).eq("type", "thread").order("created_at", { ascending: false }).limit(30)) as any,
    (supabase.from("comments").select("id, content, created_at, post_id, posts!post_id(id, title, content_plain)").eq("author_id", profile.id).order("created_at", { ascending: false }).limit(20)) as any,
    (supabase as any).from("reactions").select("target_id").eq("user_id", profile.id).eq("target_type", "post").eq("type", "like").limit(30),
    user
      ? (supabase as any).from("follows").select("id").eq("follower_id", user.id).eq("following_id", profile.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const threadsData = threadsRes.data;
  const repliesData = repliesRes.data;
  const likedReactions = likedReactionsRes.data;
  const isFollowing = !!followRes.data;

  // Fetch liked posts only if there are reactions (1 conditional round-trip)
  let likedRaw: Record<string, unknown>[] = [];
  if (likedReactions?.length) {
    const { data: lt } = await (supabase
      .from("posts")
      .select(postSelect)
      .in("id", likedReactions.map((r: any) => r.target_id))
      .order("created_at", { ascending: false })) as any;
    likedRaw = lt || [];
  }

  const { tab: rawTab } = await searchParams;
  const activeTab =
    rawTab === "respostas" || rawTab === "curtidas" || rawTab === "github"
      ? rawTab
      : "posts";

  const rawThreads = (threadsData || []) as Record<string, unknown>[];
  const mappedThreads: ThreadData[] = rawThreads.map((r) => mapRowToThreadData(r, new Set()));
  const threads: ThreadData[] = await hydrateReposts(supabase, mappedThreads);

  const likedMapped: ThreadData[] = likedRaw.map((r) => mapRowToThreadData(r, new Set()));
  const likedThreads: ThreadData[] = await hydrateReposts(supabase, likedMapped);

  const replies: any[] = repliesData || [];
  const cachedRepos = (profile.github_repos || []) as CachedRepo[];
  const githubRepos = profile.github_username
    ? await fetchGithubReposLive(profile.github_username, cachedRepos)
    : cachedRepos;

  const joinDate = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(profile.created_at));

  const displayName = profile.display_name || profile.username;
  const initial = displayName[0]?.toUpperCase() || "?";
  const baseHref = `/profile/${username}`;

  return (
    <div className="w-full">
      {/* Header with back arrow — Twitter-style sticky bar */}
      <div className="sticky top-0 z-30 backdrop-blur bg-background/85 border-b border-[var(--border-subtle)] px-4 py-2 flex items-center gap-3">
        <BackButton fallbackHref="/forum" />
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold truncate">{displayName}</h1>
          <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
        </div>
      </div>
      {/* Banner */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {profile.header_url ? (
          <Image
            src={profile.header_url}
            fill
            className="object-cover"
            alt=""
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-foreground/10" />
        )}
      </div>

      {/* Avatar + Action row */}
      <div
        className="px-4 flex items-start justify-between"
        style={{ marginTop: "-48px" }}
      >
        <Avatar className="h-24 w-24 ring-4 ring-background">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={displayName} />
          ) : null}
          <AvatarFallback className="text-2xl font-bold">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="mt-14">
          {user ? (
            <FollowButton targetUserId={profile.id} isFollowing={isFollowing} />
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors inline-block"
            >
              Seguir
            </Link>
          )}
        </div>
      </div>

      {/* Profile info — LinkedIn-style prominence for name / cargo / empresa */}
      <div className="px-4 mt-3 space-y-3">
        {/* Name line */}
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-2xl font-extrabold leading-tight">{displayName}</h1>
            <TierBadge tier={profile.role} size="sm" />
          </div>
          <p className="text-muted-foreground text-sm">@{profile.username}</p>
        </div>

        {/* Cargo + Empresa — destaque LinkedIn-style */}
        {(profile.professional_role || profile.company || profile.headline) && (
          <div className="flex items-start gap-2">
            <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="space-y-0.5 min-w-0">
              {profile.professional_role && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <CargoBadge
                    cluster={profile.professional_role.cluster}
                    roleName={profile.professional_role.name}
                    size="sm"
                  />
                  {profile.company && (
                    <span className="text-[15px] font-semibold text-foreground truncate">
                      @ {profile.company}
                    </span>
                  )}
                </div>
              )}
              {!profile.professional_role && profile.company && (
                <p className="text-[15px] font-semibold text-foreground truncate">
                  {profile.company}
                </p>
              )}
              {profile.headline && (
                <p className="text-sm text-muted-foreground">{profile.headline}</p>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {profile.bio && <p className="text-[15px]">{profile.bio}</p>}

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </span>
          )}
          {profile.website_url && (() => {
            const href = normalizeWebsiteUrl(profile.website_url);
            return href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-foreground hover:underline"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                {displayDomain(href)}
              </a>
            ) : null;
          })()}
          {profile.github_username && (
            <a
              href={`https://github.com/${profile.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <GitFork className="h-3.5 w-3.5" />
              {profile.github_username}
            </a>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            Entrou em {joinDate}
          </span>
        </div>

        {/* Following / Followers */}
        <div className="flex gap-4 text-sm">
          <span>
            <strong className="font-bold">{profile.following_count || 0}</strong>{" "}
            <span className="text-muted-foreground">Seguindo</span>
          </span>
          <span>
            <strong className="font-bold">
              {formatCount(profile.followers_count || 0)}
            </strong>{" "}
            <span className="text-muted-foreground">Seguidores</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <ProfileTabs baseHref={baseHref} />
      </Suspense>

      {/* Tab content */}
      {activeTab === "posts" && (
        <div>
          {threads.length > 0 ? (
            threads.map((thread: any) => (
              <ThreadListItem key={thread.id} thread={thread} showCategory />
            ))
          ) : (
            <EmptyState
              icon={FileText}
              title="Nenhum post ainda"
              description={`@${profile.username} ainda não publicou nada.`}
            />
          )}
        </div>
      )}

      {activeTab === "respostas" && (
        <div>
          {replies.length > 0 ? (
            replies.map((reply: any) => (
              <Link
                key={reply.id}
                href={`/forum/thread/${reply.post_id}`}
                className="block px-4 py-3 border-b border-[var(--border-subtle)] hover:bg-accent/30 transition-colors"
              >
                {reply.posts?.title && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Em resposta a:{" "}
                    <span className="font-medium">{reply.posts.title}</span>
                  </p>
                )}
                <p className="text-[15px] text-foreground leading-relaxed">
                  {reply.content?.substring(0, 200)}
                  {(reply.content?.length ?? 0) > 200 ? "…" : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(reply.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </Link>
            ))
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="Nenhuma resposta ainda"
              description={`@${profile.username} ainda não respondeu a nenhum post.`}
            />
          )}
        </div>
      )}

      {activeTab === "curtidas" && (
        <div>
          {likedThreads.length > 0 ? (
            likedThreads.map((thread: any) => (
              <ThreadListItem key={thread.id} thread={thread} showCategory />
            ))
          ) : (
            <EmptyState
              icon={Heart}
              title="Nenhuma curtida ainda"
              description={`@${profile.username} ainda não curtiu nenhum post.`}
            />
          )}
        </div>
      )}

      {activeTab === "github" && (
        <div className="px-4 py-4">
          {profile.github_username ? (
            <GitHubRepos
              username={profile.github_username}
              repos={githubRepos}
              hiddenRepos={(profile.github_hidden_repos as string[]) ?? []}
              isOwner={false}
            />
          ) : (
            <div className="py-16 text-center space-y-3">
              <GitFork className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                Este usuário não conectou seu GitHub ainda
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
