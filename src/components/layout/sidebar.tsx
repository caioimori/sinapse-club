"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Search,
  Bell,
  Settings,
  Trophy,
  Wrench,
  Gift,
  Lock,
  BookOpen,
  ShoppingBag,
  Calendar,
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
import { hasAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfessionalRole = Database["public"]["Tables"]["professional_roles"]["Row"];

const platformItems = [
  { href: "/courses",     name: "Cursos",        icon: BookOpen,    requiredTier: null },
  { href: "/marketplace", name: "Marketplace",   icon: ShoppingBag, requiredTier: "pro" as const },
  { href: "/calendar",    name: "Calendário",    icon: Calendar,    requiredTier: null },
];

const extraItems = [
  { href: "/leaderboard", name: "Leaderboard",    icon: Trophy, requiredTier: null },
  { href: "/tools",       name: "Ferramentas AI", icon: Wrench, requiredTier: "pro" as const },
  { href: "/benefits",    name: "Benefícios",     icon: Gift,   requiredTier: "pro" as const },
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

  const isForumRoute = pathname.startsWith("/forum");

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
          <Link href="/notificacoes" className={navItemCls(pathname.startsWith("/notificacoes"))}>
            <Bell className="h-4 w-4 flex-shrink-0" />
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

          {/* ── Plataforma ────────────────────────────────── */}
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Plataforma
          </p>
          {platformItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const locked = item.requiredTier && profile && !hasAccess(profile.role, item.requiredTier);
            return (
              <Link key={item.href} href={item.href} className={navItemCls(active)}>
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {locked && <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
              </Link>
            );
          })}

          <Separator className="my-3" />

          {/* ── Extras ───────────────────────────────────── */}
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Extras
          </p>
          {extraItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const locked = item.requiredTier && profile && !hasAccess(profile.role, item.requiredTier);
            return (
              <Link key={item.href} href={item.href} className={navItemCls(active)}>
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {locked && <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
              </Link>
            );
          })}

          <Separator className="my-3" />

          {/* ── Admin ─────────────────────────────────── */}
          {(profile as any)?.role === "admin" && (
            <Link href="/admin/moderation" className={navItemCls(pathname.startsWith("/admin"))}>
              <Shield className="h-4 w-4 flex-shrink-0 text-amber-500" />
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
        <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
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
        </div>
      )}
    </aside>
  );
}
