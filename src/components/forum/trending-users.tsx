"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MessageSquare, UserPlus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface TrendingUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  engagement_score: number;
}

interface TrendingTopic {
  id: string;
  title: string | null;
  replies_count: number;
  category: {
    icon: string | null;
    name: string;
    color: string | null;
  } | null;
}

interface SuggestedUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  headline: string | null;
}

interface TrendingUsersProps {
  users: TrendingUser[];
  topics?: TrendingTopic[];
  suggestions?: SuggestedUser[];
}

const RANKING_INITIAL = 5;
const TOPICS_INITIAL = 3;
const SUGGESTIONS_INITIAL = 3;

export function TrendingUsers({ users, topics = [], suggestions = [] }: TrendingUsersProps) {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [rankingExpanded, setRankingExpanded] = useState(false);
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadFollows() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as any)
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);
      if (data) {
        setFollowingIds(new Set(data.map((f: any) => f.following_id)));
      }
    }
    loadFollows();
  }, []);

  async function handleFollow(userId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === userId) return;

    setFollowLoading(prev => new Set(prev).add(userId));

    const isFollowing = followingIds.has(userId);

    if (isFollowing) {
      setFollowingIds(prev => { const s = new Set(prev); s.delete(userId); return s; });
      await supabase.from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", userId);
    } else {
      setFollowingIds(prev => new Set(prev).add(userId));
      await (supabase as any).from("follows").insert({
        follower_id: user.id,
        following_id: userId,
      });
    }

    setFollowLoading(prev => { const s = new Set(prev); s.delete(userId); return s; });
  }

  const visibleRanking = rankingExpanded ? users : users.slice(0, RANKING_INITIAL);
  const visibleTopics = topicsExpanded ? topics : topics.slice(0, TOPICS_INITIAL);
  const visibleSuggestions = suggestionsExpanded ? suggestions : suggestions.slice(0, SUGGESTIONS_INITIAL);

  return (
    <div className="space-y-3 pb-8">
      {/* Search bar */}
      <div className="py-4 bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar no Sinapse"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted/70 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Ranking da semana */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-card shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-base font-extrabold text-foreground">Ranking da semana</h2>
        </div>

        <div>
          {users.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 px-4">
              Sem dados ainda esta semana
            </p>
          ) : (
            visibleRanking.map((user, index) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group"
              >
                <span className="flex-shrink-0 w-5 text-center text-xs font-mono text-muted-foreground">
                  {index + 1}
                </span>
                <Avatar className="h-9 w-9 flex-shrink-0">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={user.display_name || user.username} />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    {(user.display_name?.[0] || user.username[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate group-hover:underline leading-tight">
                    {user.display_name || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
                <span className="flex-shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
                  {user.engagement_score} posts
                </span>
              </Link>
            ))
          )}
        </div>

        {users.length > RANKING_INITIAL && (
          <button
            onClick={() => setRankingExpanded(!rankingExpanded)}
            className="w-full px-4 py-3 text-sm text-left text-[var(--accent-primary,hsl(var(--primary)))] hover:bg-muted/40 transition-colors border-t border-[var(--border-subtle)]"
          >
            {rankingExpanded ? "Mostrar menos" : `Mostrar mais`}
          </button>
        )}
      </div>

      {/* O que está em alta */}
      {topics.length > 0 && (
        <div className="rounded-2xl border border-[var(--border-default)] bg-card shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-base font-extrabold text-foreground">O que está em alta</h2>
          </div>

          <div>
            {visibleTopics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/forum/thread/${topic.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                    {topic.category?.name && (
                      <span>{topic.category.icon && `${topic.category.icon} `}{topic.category.name}</span>
                    )}
                    <span>· Em alta</span>
                  </div>
                  <p className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:underline">
                    {topic.title || "Sem título"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{topic.replies_count} respostas</span>
                  </div>
                </div>
                <span className="flex-shrink-0 text-xs text-muted-foreground mt-0.5">
                  #{index + 1}
                </span>
              </Link>
            ))}
          </div>

          {topics.length > TOPICS_INITIAL && (
            <button
              onClick={() => setTopicsExpanded(!topicsExpanded)}
              className="w-full px-4 py-3 text-sm text-left text-[var(--accent-primary,hsl(var(--primary)))] hover:bg-muted/40 transition-colors border-t border-[var(--border-subtle)]"
            >
              {topicsExpanded ? "Mostrar menos" : "Mostrar mais"}
            </button>
          )}
        </div>
      )}

      {/* Quem seguir */}
      {suggestions.length > 0 && (
        <div className="rounded-2xl border border-[var(--border-default)] bg-card shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-base font-extrabold text-foreground">Quem seguir</h2>
          </div>

          <div>
            {visibleSuggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <Link href={`/profile/${user.username}`} className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    {user.avatar_url ? (
                      <AvatarImage src={user.avatar_url} alt={user.display_name || user.username} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {(user.display_name?.[0] || user.username[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.username}`} className="hover:underline block">
                    <p className="text-sm font-bold text-foreground truncate leading-tight">
                      {user.display_name || user.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                  </Link>
                  {user.headline && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user.headline}</p>
                  )}
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  disabled={followLoading.has(user.id)}
                  className={cn(
                    "flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                    followingIds.has(user.id)
                      ? "bg-muted text-foreground border border-[var(--border-default)] hover:border-destructive hover:text-destructive"
                      : "bg-foreground text-background hover:bg-foreground/85"
                  )}
                >
                  {followingIds.has(user.id) ? "Seguindo" : "Seguir"}
                </button>
              </div>
            ))}
          </div>

          {suggestions.length > SUGGESTIONS_INITIAL && (
            <button
              onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
              className="w-full px-4 py-3 text-sm text-left text-[var(--accent-primary,hsl(var(--primary)))] hover:bg-muted/40 transition-colors border-t border-[var(--border-subtle)]"
            >
              {suggestionsExpanded ? "Mostrar menos" : "Mostrar mais"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
