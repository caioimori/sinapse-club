"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  Bell,
  Settings,
  Trophy,
  BookOpen,
  ShoppingBag,
  Calendar,
  Wrench,
  Gift,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import { TierBadge } from "@/components/access/tier-badge";
import { UserRankBadge } from "@/components/user-rank-badge";
import { StreakBadge } from "@/components/gamification/streak-badge";
import { XpProgressBar } from "@/components/gamification/xp-progress-bar";
import { LevelUpDetector } from "@/components/gamification/level-up-detector";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfessionalRole = Database["public"]["Tables"]["professional_roles"]["Row"];

const comingSoonItems = [
  { name: "Cursos",        icon: BookOpen },
  { name: "Marketplace",   icon: ShoppingBag },
  { name: "Calendário",    icon: Calendar },
  { name: "Ferramentas AI", icon: Wrench },
  { name: "Benefícios",    icon: Gift },
];

const navItemCls = (active: boolean) =>
  cn(
    "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  );

interface SidebarProps {
  profile: Profile | null;
  professionalRole?: ProfessionalRole | null;
  className?: string;
}

export function Sidebar({ profile, professionalRole, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const isForumRoute = pathname.startsWith("/forum");
  const isOnNotifs = pathname.startsWith("/notificacoes");

  useEffect(() => {
    if (!profile?.id) return;

    let active = true;

    async function fetchUnread() {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile!.id)
        .eq("is_read", false);
      if (active && typeof count === "number") setUnreadCount(count);
    }

    fetchUnread();

    // Poll every 30s — cheap and avoids realtime complexity for now
    const interval = setInterval(fetchUnread, 30_000);

    // Clear when user visits the notifications page
    if (isOnNotifs && unreadCount > 0) {
      setUnreadCount(0);
    }

    return () => {
      active = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, isOnNotifs]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={cn("w-[280px] flex-shrink-0 flex-col border-r bg-sidebar", className)}
      style={{ borderColor: "var(--glass-border)" }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Link href="/forum" className="text-xl font-bold tracking-tight text-gradient">
          sinapse.club
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-3 space-y-0.5">

          {/* ── Feed ─────────────────────────────────────── */}
          <Link href="/forum" className={navItemCls(isForumRoute)}>
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            <span>Feed</span>
          </Link>

          {/* ── Explore ───────────────────────────────────── */}
          <Link href="/explore" className={navItemCls(pathname.startsWith("/explore"))}>
            <Search className="h-4 w-4 flex-shrink-0" />
            <span>Explore</span>
          </Link>

          {/* ── Notificações ──────────────────────────────── */}
          <Link
            href="/notificacoes"
            aria-label={unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : "Notificações"}
            className={cn(navItemCls(isOnNotifs), "relative")}
          >
            <span className="relative flex-shrink-0">
              <Bell className="h-4 w-4" aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent-like)] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-sidebar"
                  aria-hidden="true"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {unreadCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-[var(--accent-like)]/70"
                  aria-hidden="true"
                />
              )}
            </span>
            <span>Notificações</span>
          </Link>

          {/* ── Botão Publicar — Twitter-style ────────────── */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-compose-modal"))}
            className="mt-2 w-full flex items-center justify-center rounded-full bg-foreground text-background py-2.5 px-4 text-sm font-bold hover:bg-foreground/85 transition-colors"
          >
            Post
          </button>

          <Separator className="my-3" />

          {/* ── Comunidade ────────────────────────────── */}
          <Link href="/leaderboard" className={navItemCls(pathname.startsWith("/leaderboard"))}>
            <Trophy className="h-4 w-4 flex-shrink-0" />
            <span>Leaderboard</span>
          </Link>

          <Separator className="my-3" />

          {/* ── Em breve ──────────────────────────────── */}
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Em breve
          </p>
          {comingSoonItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground/40 cursor-default select-none"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
            </div>
          ))}

          <Separator className="my-3" />

          {/* ── Admin ─────────────────────────────────── */}
          {(profile as any)?.role === "admin" && (
            <Link href="/admin/moderation" className={navItemCls(pathname.startsWith("/admin"))}>
              <Shield className="h-4 w-4 flex-shrink-0 text-[var(--accent-warn)]" />
              <span>Moderação</span>
            </Link>
          )}

          {/* ── Settings + Sair ──────────────────────────── */}
          <Link href="/settings" className={navItemCls(pathname.startsWith("/settings"))}>
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span>Configurações</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Sair</span>
          </button>

        </div>
      </ScrollArea>

      {/* ── User card ─────────────────────────────────────── */}
      {profile && (
        <div className="p-3 space-y-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <LevelUpDetector reputation={profile.reputation ?? 0} />
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-sidebar-accent transition-colors"
          >
            <Avatar size="default" className="ring-1 ring-border flex-shrink-0">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.display_name || profile.username} />
              ) : null}
              <AvatarFallback>
                {profile.display_name?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-medium text-sm leading-tight">
                  {profile.display_name || profile.username}
                </p>
                <TierBadge tier={profile.role} size="sm" />
                <StreakBadge days={profile.streak_days ?? 0} compact className="ml-auto" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {professionalRole ? (
                  <CargoBadge cluster={professionalRole.cluster} roleName={professionalRole.name} size="sm" />
                ) : (
                  <span className="text-[11px] text-muted-foreground">@{profile.username}</span>
                )}
                <UserRankBadge
                  reputation={profile.reputation ?? 0}
                  role={profile.role}
                  showRep
                />
              </div>
            </div>
          </Link>
          <div className="px-2.5">
            <XpProgressBar reputation={profile.reputation ?? 0} compact />
          </div>
        </div>
      )}
    </aside>
  );
}
