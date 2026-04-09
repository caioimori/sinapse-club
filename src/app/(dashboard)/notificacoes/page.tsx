import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, UserPlus, MessageSquare, Repeat2, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsMarkRead } from "@/components/notifications/notifications-mark-read";
import { StickySidebar } from "@/components/forum/sticky-sidebar";
import { TrendingUsers } from "@/components/forum/trending-users";

export const metadata = { title: "Notificações — Sinapse" };

type NotifType = "like" | "follow" | "reply" | "mention" | "repost";

interface Notification {
  id: string;
  type: NotifType;
  read: boolean;
  created_at: string;
  entity_id: string | null;
  entity_title: string | null;
  actor: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

function NotifIcon({ type }: { type: NotifType }) {
  switch (type) {
    case "like":    return <Heart className="h-4 w-4 text-red-500" />;
    case "follow":  return <UserPlus className="h-4 w-4 text-blue-500" />;
    case "reply":   return <MessageSquare className="h-4 w-4 text-green-500" />;
    case "repost":  return <Repeat2 className="h-4 w-4 text-emerald-500" />;
    case "mention": return <Bell className="h-4 w-4 text-yellow-500" />;
  }
}

function notifMessage(type: NotifType, actorName: string): string {
  switch (type) {
    case "like":    return `${actorName} curtiu sua publicação`;
    case "follow":  return `${actorName} começou a te seguir`;
    case "reply":   return `${actorName} respondeu sua publicação`;
    case "repost":  return `${actorName} repostou sua publicação`;
    case "mention": return `${actorName} te mencionou`;
  }
}

function groupLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return "Hoje";
  if (isYesterday(d)) return "Ontem";
  return "Anteriores";
}

function notifHref(notif: Notification): string {
  if (notif.type === "follow" && notif.actor) {
    return `/profile/${notif.actor.username}`;
  }
  if (notif.entity_id) {
    return `/forum/thread/${notif.entity_id}`;
  }
  return "/forum";
}

export default async function NotificacoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch notifications + sidebar data in parallel
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [notifRes, trendingDataRes, trendingTopicsRes, suggestionsRes] = await Promise.all([
    (supabase as any)
      .from("notifications")
      .select("id, type, read, created_at, entity_id, entity_title, actor:actor_id(username, display_name, avatar_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("posts")
      .select("author_id, profiles!author_id(id, username, display_name, avatar_url)")
      .gte("created_at", oneWeekAgo.toISOString())
      .eq("type", "thread")
      .limit(100),
    supabase
      .from("posts")
      .select("id, title, replies_count, forum_categories!category_id(icon, name, color)")
      .eq("type", "thread")
      .gte("created_at", oneWeekAgo.toISOString())
      .order("replies_count", { ascending: false })
      .limit(8),
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, headline")
      .neq("id", user.id)
      .neq("username", "sinapse-bot")
      .order("level", { ascending: false })
      .limit(6),
  ]);

  const notifications: Notification[] = (notifRes.data ?? []).map((n: any) => ({
    id: n.id,
    type: n.type as NotifType,
    read: n.read,
    created_at: n.created_at,
    entity_id: n.entity_id,
    entity_title: n.entity_title,
    actor: n.actor ? {
      username: n.actor.username,
      display_name: n.actor.display_name,
      avatar_url: n.actor.avatar_url,
    } : null,
  }));

  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

  // Agrupar por data
  const groups: { label: string; items: Notification[] }[] = [];
  for (const notif of notifications) {
    const label = groupLabel(notif.created_at);
    const group = groups.find((g) => g.label === label);
    if (group) {
      group.items.push(notif);
    } else {
      groups.push({ label, items: [notif] });
    }
  }

  // Build sidebar data
  const authorEngagement: Record<string, { count: number; profile: any }> = {};
  (trendingDataRes.data ?? []).forEach((post: any) => {
    const authorId = post.author_id;
    const profile = post.profiles;
    if (!authorEngagement[authorId]) authorEngagement[authorId] = { count: 0, profile };
    authorEngagement[authorId].count += 1;
  });
  const trendingUsers = Object.entries(authorEngagement)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)
    .map(([authorId, data]) => ({
      id: authorId,
      username: data.profile.username,
      display_name: data.profile.display_name,
      avatar_url: data.profile.avatar_url,
      engagement_score: data.count,
    }));

  const trendingTopics = (trendingTopicsRes.data ?? []).map((t: any) => {
    const cat = t.forum_categories as any;
    return {
      id: t.id as string,
      title: t.title as string | null,
      replies_count: t.replies_count as number,
      category: cat ? { icon: cat.icon as string | null, name: cat.name as string, color: cat.color as string | null } : null,
    };
  });

  const suggestions = (suggestionsRes.data ?? []).map((p: any) => ({
    id: p.id as string,
    username: p.username as string,
    display_name: p.display_name as string | null,
    avatar_url: p.avatar_url as string | null,
    headline: p.headline as string | null,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-5 w-full">
      {/* Main column */}
      <div className="min-w-0 border-l border-r border-[var(--border-subtle)] min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-extrabold">Notificações</h1>
          {unreadIds.length > 0 && (
            <NotificationsMarkRead unreadIds={unreadIds} />
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3 text-center px-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Bell className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-bold text-foreground text-lg">Tudo em dia</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Quando alguém curtir, responder ou começar a te seguir, você verá aqui.
            </p>
          </div>
        ) : (
          <div>
            {groups.map((group) => (
              <div key={group.label}>
                {/* Group header */}
                <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                </div>

                {group.items.map((notif) => {
                  const actorName = notif.actor?.display_name || notif.actor?.username || "Alguém";
                  const timeAgo = formatDistanceToNow(new Date(notif.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  });

                  return (
                    <Link
                      key={notif.id}
                      href={notifHref(notif)}
                      className={`flex gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)] hover:bg-muted/30 transition-colors ${
                        !notif.read ? "bg-muted/20" : ""
                      }`}
                    >
                      {/* Icon badge + avatar */}
                      <div className="relative flex-shrink-0 mt-0.5">
                        <Avatar className="h-10 w-10">
                          {notif.actor?.avatar_url ? (
                            <AvatarImage
                              src={notif.actor.avatar_url}
                              alt={actorName}
                            />
                          ) : null}
                          <AvatarFallback className="text-xs">
                            {actorName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm border border-[var(--border-subtle)]">
                          <NotifIcon type={notif.type} />
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {notifMessage(notif.type, actorName)}
                          </span>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        {notif.entity_title && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {notif.entity_title}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right sidebar — same as feed */}
      <div className="hidden lg:block">
        <StickySidebar topbarHeight={56}>
          <TrendingUsers users={trendingUsers} topics={trendingTopics} suggestions={suggestions} />
        </StickySidebar>
      </div>
    </div>
  );
}
