import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/feed/post-card";
import { GitHubRepos } from "@/components/profile/github-repos";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { CalendarDays, MapPin, LinkIcon, GitFork } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export const metadata = {
  title: "Perfil",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*, professional_role:professional_roles(name, cluster)")
    .eq("id", user.id)
    .single() as any;

  if (!data) redirect("/login");
  const profile = data;

  // Get user posts
  const { data: posts } = await (supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role),
      space:spaces!posts_space_id_fkey(name, slug, icon)
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30) as any);

  // Get liked posts
  const { data: likedReactions } = await (supabase as any)
    .from("reactions")
    .select("target_id")
    .eq("user_id", user.id)
    .eq("target_type", "post")
    .eq("type", "like")
    .limit(30);

  let likedPosts: any[] = [];
  if (likedReactions?.length) {
    const { data } = await (supabase
      .from("posts")
      .select(`
        *,
        author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role),
        space:spaces!posts_space_id_fkey(name, slug, icon)
      `)
      .in("id", likedReactions.map((r: any) => r.target_id))
      .order("created_at", { ascending: false }) as any);
    likedPosts = data || [];
  }

  const joinDate = format(new Date(profile.created_at), "MMMM 'de' yyyy", { locale: ptBR });
  const githubRepos = (profile.github_repos || []) as any[];

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

      {/* Edit button */}
      <div className="flex justify-end px-4 pt-3">
        <Link href="/settings">
          <Button variant="outline" size="sm" className="rounded-full font-semibold">
            Editar perfil
          </Button>
        </Link>
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
          <TabsTrigger value="replies" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3 font-semibold">
            Respostas
          </TabsTrigger>
          <TabsTrigger value="likes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3 font-semibold">
            Curtidas
          </TabsTrigger>
          <TabsTrigger value="repos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3 font-semibold">
            <GitFork className="h-4 w-4 mr-1.5" /> Repos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {posts?.length > 0 ? (
            posts.filter((p: any) => p.type !== "reply").map((post: any) => (
              <PostCard key={post.id} {...post} author={post.author} space={post.space} />
            ))
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p>Nenhum post ainda</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="replies" className="mt-0">
          {posts?.filter((p: any) => p.type === "reply").length > 0 ? (
            posts.filter((p: any) => p.type === "reply").map((post: any) => (
              <PostCard key={post.id} {...post} author={post.author} space={post.space} />
            ))
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p>Nenhuma resposta ainda</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          {likedPosts.length > 0 ? (
            likedPosts.map((post: any) => (
              <PostCard key={post.id} {...post} author={post.author} space={post.space} is_liked />
            ))
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p>Nenhuma curtida ainda</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="repos" className="mt-0 p-4">
          {profile.github_username ? (
            <GitHubRepos username={profile.github_username} repos={githubRepos} />
          ) : (
            <div className="py-16 text-center space-y-3">
              <GitFork className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Conecte seu GitHub para mostrar seus repositorios</p>
              <Link href="/settings">
                <Button variant="outline" className="rounded-full">
                  <GitFork className="mr-2 h-4 w-4" /> Conectar GitHub
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
