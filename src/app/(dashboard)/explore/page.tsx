import { Suspense } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExploreSearch } from "@/components/forum/explore-search";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExploreFollowButton } from "@/components/forum/explore-follow-button";

export const metadata = { title: "Explore — Sinapse" };

interface ExplorePageProps {
  searchParams: Promise<{ q?: string }>;
}

// ─── Search Results ────────────────────────────────────────────────
async function SearchResults({ query }: { query: string }) {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, title, content_plain, replies_count, created_at, type, profiles!author_id(username, display_name, avatar_url), forum_categories!category_id(name, icon, color)"
    )
    .eq("type", "thread")
    .or(`title.ilike.%${query}%,content_plain.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(30);

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center px-4 gap-2">
        <p className="font-semibold text-foreground">Nenhum resultado para "{query}"</p>
        <p className="text-sm text-muted-foreground">Tente palavras diferentes ou termos mais gerais</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post: any) => {
        const profile = post.profiles as any;
        const cat = post.forum_categories as any;
        const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR });
        return (
          <Link
            key={post.id}
            href={`/forum/thread/${post.id}`}
            className="flex gap-3 px-4 py-4 border-b border-[var(--border-subtle)] hover:bg-muted/30 transition-colors group"
          >
            <Avatar className="h-10 w-10 flex-shrink-0 mt-0.5">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.display_name || profile.username} />
              ) : null}
              <AvatarFallback className="text-xs">
                {(profile?.display_name?.[0] || profile?.username?.[0] || "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground mb-0.5">
                <span className="font-semibold text-foreground">{profile?.display_name || profile?.username}</span>
                <span>·</span>
                <span>{timeAgo}</span>
                {cat && (
                  <>
                    <span>·</span>
                    <span>{cat.icon} {cat.name}</span>
                  </>
                )}
              </div>
              {post.title && (
                <p className="font-bold text-sm text-foreground leading-snug mb-1 group-hover:underline line-clamp-2">
                  {post.title}
                </p>
              )}
              {post.content_plain && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.content_plain}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span>{post.replies_count} respostas</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Trending Topics ───────────────────────────────────────────────
async function TrendingSection() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [trendingRes, suggestionsRes] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, content_plain, replies_count, created_at, author_id, profiles!author_id(username, display_name, avatar_url), forum_categories!category_id(name, icon, color, slug)")
      .eq("type", "thread")
      .gte("created_at", oneWeekAgo.toISOString())
      .order("replies_count", { ascending: false })
      .limit(10),
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, headline, level")
      .neq("id", user?.id ?? "00000000-0000-0000-0000-000000000000")
      .neq("username", "sinapse-bot")
      .order("level", { ascending: false })
      .limit(8),
  ]);

  const trending = trendingRes.data ?? [];
  const suggestions = suggestionsRes.data ?? [];

  return (
    <div className="space-y-0">
      {/* O que está em alta */}
      <div className="border-b border-[var(--border-subtle)] px-4 py-3">
        <h2 className="text-base font-extrabold">O que está em alta</h2>
      </div>

      {trending.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          Sem posts em alta esta semana
        </div>
      ) : (
        trending.map((post: any) => {
          const cat = post.forum_categories as any;
          const profile = post.profiles as any;
          const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR });
          return (
            <Link
              key={post.id}
              href={`/forum/thread/${post.id}`}
              className="flex gap-3 px-4 py-4 border-b border-[var(--border-subtle)] hover:bg-muted/30 transition-colors group"
            >
              <Avatar className="h-10 w-10 flex-shrink-0 mt-0.5">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.display_name || profile.username} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {(profile?.display_name?.[0] || profile?.username?.[0] || "?").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground mb-0.5">
                  <span className="font-semibold text-foreground">{profile?.display_name || profile?.username}</span>
                  <span>·</span>
                  <span>{timeAgo}</span>
                  {cat && <><span>·</span><span>{cat.icon} {cat.name}</span></>}
                </div>
                {post.title && (
                  <p className="font-bold text-sm text-foreground leading-snug mb-1 group-hover:underline line-clamp-2">
                    {post.title}
                  </p>
                )}
                {post.content_plain && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.content_plain}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.replies_count} respostas</span>
                </div>
              </div>
            </Link>
          );
        })
      )}

      {/* Quem seguir */}
      {suggestions.length > 0 && (
        <>
          <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
            <h2 className="text-base font-extrabold">Quem seguir</h2>
          </div>
          {suggestions.map((person: any) => (
            <div
              key={person.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)] hover:bg-muted/30 transition-colors"
            >
              <Link href={`/profile/${person.username}`} className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  {person.avatar_url ? (
                    <AvatarImage src={person.avatar_url} alt={person.display_name || person.username} />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    {(person.display_name?.[0] || person.username[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${person.username}`} className="hover:underline block">
                  <p className="text-sm font-bold text-foreground truncate leading-tight">
                    {person.display_name || person.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">@{person.username}</p>
                </Link>
                {person.headline && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{person.headline}</p>
                )}
              </div>
              <ExploreFollowButton userId={person.id} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="max-w-2xl mx-auto border-l border-r border-[var(--border-subtle)] min-h-screen">
      <Suspense fallback={null}>
        <ExploreSearch initialQuery={query} />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex flex-col gap-4 px-4 py-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        {query ? <SearchResults query={query} /> : <TrendingSection />}
      </Suspense>
    </div>
  );
}
