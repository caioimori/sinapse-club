import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/feed/post-card";
import { FollowButton } from "@/components/feed/follow-button";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { CalendarDays, MapPin, LinkIcon, GitFork } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get profile by username (with professional role join)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, professional_role:professional_roles(name, cluster)")
    .eq("username", username)
    .single() as any;

  if (!profile) notFound();

  // If viewing own profile, redirect to /profile
  if (user && profile.id === user.id) {
    redirect("/profile");
  }

  // Get user posts
  const { data: posts } = await (supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url, role),
      space:spaces!posts_space_id_fkey(name, slug, icon)
    `)
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(30) as any);

  // Check if current user follows this profile
  let isFollowing = false;
  if (user) {
    const { data } = await (supabase as any)
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", profile.id)
      .maybeSingle();
    isFollowing = !!data;
  }

  // Get user reactions on these posts
  let likedIds = new Set<string>();
  let savedIds = new Set<string>();
  if (user && posts?.length) {
    const postIds = posts.map((p: any) => p.id);
    const { data } = await (supabase as any)
      .from("reactions")
      .select("target_id, type")
      .eq("user_id", user.id)
      .eq("target_type", "post")
      .in("target_id", postIds);
    (data || []).forEach((r: any) => {
      if (r.type === "like") likedIds.add(r.target_id);
      if (r.type === "save") savedIds.add(r.target_id);
    });
  }

  const joinDate = format(new Date(profile.created_at), "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="-mx-4 -my-6">
      {/* Header/Banner */}
      <div className="relative">
        {profile.header_url ? (
          <img src={profile.header_url} alt="" className="h-48 w-full object-cover" />
        ) : (
          <div className="h-48 w-full bg-foreground" />
        )}

        {/* Avatar */}
        <div className="absolute -bottom-16 left-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="h-32 w-32 rounded-full border-4 border-background object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-foreground text-4xl font-bold text-white">
              {profile.display_name?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Follow button */}
      <div className="flex justify-end px-4 pt-3">
        {user ? (
          <FollowButton targetUserId={profile.id} isFollowing={isFollowing} />
        ) : (
          <Link href="/login">
            <button className="rounded-full bg-foreground px-5 py-1.5 text-sm font-semibold text-background">
              Seguir
            </button>
          </Link>
        )}
      </div>

      {/* Profile info */}
      <div className="px-4 pt-8 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{profile.display_name || profile.username}</h1>
          {profile.professional_role && (
            <CargoBadge
              cluster={profile.professional_role.cluster}
              roleName={profile.professional_role.name}
              size="md"
            />
          )}
        </div>
        <p className="text-muted-foreground">@{profile.username}</p>
        {profile.headline && (
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.headline}
            {profile.company && <span> @ {profile.company}</span>}
          </p>
        )}
        {!profile.headline && profile.company && (
          <p className="mt-1 text-sm text-muted-foreground">@ {profile.company}</p>
        )}

        {profile.bio && <p className="mt-3 text-[15px]">{profile.bio}</p>}

        {/* Meta info */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {profile.location}
            </span>
          )}
          {profile.website_url && (
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted-foreground hover:underline">
              <LinkIcon className="h-4 w-4" /> {profile.website_url.replace(/^https?:\/\//, "")}
            </a>
          )}
          {profile.github_username && (
            <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted-foreground hover:underline">
              <GitFork className="h-4 w-4" /> {profile.github_username}
            </a>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> Entrou em {joinDate}
          </span>
        </div>

        {/* Follow counts */}
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span>
            <strong>{profile.following_count || 0}</strong>{" "}
            <span className="text-muted-foreground">seguindo</span>
          </span>
          <span>
            <strong>{profile.followers_count || 0}</strong>{" "}
            <span className="text-muted-foreground">seguidores</span>
          </span>
          <span className="ml-2">
            <Badge variant="outline" className="text-xs">Level {profile.level || 1}</Badge>
          </span>
          <Badge variant="outline" className="text-xs">{profile.xp || 0} XP</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="mt-1">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
          <TabsTrigger value="posts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3 font-semibold">
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {posts?.length > 0 ? (
            posts.filter((p: any) => p.type !== "reply").map((post: any) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                type={post.type}
                author={post.author}
                space={post.space}
                likes_count={post.likes_count}
                comments_count={post.comments_count}
                reposts_count={post.reposts_count}
                replies_count={post.replies_count}
                created_at={post.created_at}
                is_liked={likedIds.has(post.id)}
                is_saved={savedIds.has(post.id)}
                currentUserId={user?.id}
                isFollowingAuthor={isFollowing}
              />
            ))
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p>Nenhum post ainda</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
