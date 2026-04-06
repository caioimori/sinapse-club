"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TrendingUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  engagement_score: number;
}

interface TrendingUsersProps {
  users: TrendingUser[];
}

export function TrendingUsers({ users }: TrendingUsersProps) {
  return (
    <div className="sticky top-16 rounded-2xl border border-[var(--border-subtle)] bg-background/50 backdrop-blur-sm p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">O que está em alta</h2>
        <p className="text-sm text-muted-foreground mt-1">Esta semana</p>
      </div>

      {/* Users list */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <Link
            key={user.id}
            href={`/profile/${user.username}`}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Rank badge */}
              <div className="flex-shrink-0 text-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm">
                  #{index + 1}
                </div>
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10 flex-shrink-0">
                {user.avatar_url ? (
                  <AvatarImage src={user.avatar_url} alt={user.display_name || user.username} />
                ) : null}
                <AvatarFallback>{user.display_name?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm group-hover:underline truncate">
                  {user.display_name || user.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
              </div>
            </div>

            {/* Engagement score */}
            <div className="flex-shrink-0 ml-2">
              <span className="text-sm font-bold text-blue-500">{user.engagement_score}</span>
              <p className="text-xs text-muted-foreground">engajamentos</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer link */}
      <Link
        href="/forum/rankings"
        className="block text-center py-3 text-blue-500 hover:bg-muted rounded-lg transition-colors font-medium text-sm"
      >
        Ver ranking completo
      </Link>
    </div>
  );
}
