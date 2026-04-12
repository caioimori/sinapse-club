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
import { CalendarDays, MapPin, LinkIcon, GitFork, FileText, MessageCircle, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return { title: `@${username}` };
}

function displayDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return String(n);
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

  const postSelect = `
    id,
    title,
    content_plain,
    image_url,
    is_sticky,
    is_solved,
    replies_count,
    views_count,
    likes_count,
    tags,
    created_at,
    last_reply_at,
    author:profiles!posts_author_id_fkey(
      username,
      display_name,
      avatar_url,
      professional_role:professional_roles(name, cluster)
    ),
    subcategory:forum_subcategories(slug, name),
    category:forum_categories(slug, name, icon, color)
  `;

  // Run threads, replies, liked reactions and follow check in parallel
  const [threadsRes, repliesRes, likedReactionsRes, followRes] = await Promise.all([
    (supabase.from("posts").select(postSelect).eq("author_id", profile.id).is("parent_id", null).order("created_at", { ascending: false }).limit(30)) as any,
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
  let likedThreads: any[] = [];
  if (likedReactions?.length) {
    const { data: lt } = await (supabase
      .from("posts")
      .select(postSelect)
      .in("id", likedReactions.map((r: any) => r.target_id))
      .order("created_at", { ascending: false })) as any;
    likedThreads = lt || [];
  }

  const { tab: rawTab } = await searchParams;
  const activeTab =
    rawTab === "respostas" || rawTab === "curtidas" || rawTab === "github"
      ? rawTab
      : "posts";

  const threads: any[] = threadsData || [];
  const replies: any[] = repliesData || [];
  const githubRepos = (profile.github_repos || []) as any[];

  const joinDate = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(profile.created_at));

  const displayName = profile.display_name || profile.username;
  const initial = displayName[0]?.toUpperCase() || "?";
  const baseHref = `/profile/${username}`;

  return (
    <div className="w-full">
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

      {/* Profile info */}
      <div className="px-4 mt-3 space-y-3">
        {/* Name + badges */}
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xl font-bold">{displayName}</h1>
            <TierBadge tier={profile.role} size="sm" />
            {profile.professional_role && (
              <CargoBadge
                cluster={profile.professional_role.cluster}
                roleName={profile.professional_role.name}
                size="sm"
                className="mt-0.5"
              />
            )}
          </div>
          <p className="text-muted-foreground text-sm">@{profile.username}</p>
        </div>

        {/* Headline */}
        {(profile.headline || profile.company) && (
          <p className="text-sm text-muted-foreground">
            {profile.headline}
            {profile.headline && profile.company ? ` @ ${profile.company}` : ""}
            {!profile.headline && profile.company ? `@ ${profile.company}` : ""}
          </p>
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
          {profile.website_url && (
            <a
              href={profile.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-foreground hover:underline"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              {displayDomain(profile.website_url)}
            </a>
          )}
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
        <div>
          {profile.github_username ? (
            <GitHubRepos
              username={profile.github_username}
              repos={githubRepos}
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
