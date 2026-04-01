"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Settings,
  Trophy,
  Wrench,
  Gift,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CargoBadge } from "@/components/profile/cargo-badge";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];
type ProfessionalRole = Database["public"]["Tables"]["professional_roles"]["Row"];

const extraItems = [
  { href: "/leaderboard", name: "Leaderboard", icon: Trophy },
  { href: "/tools", name: "Ferramentas AI", icon: Wrench },
  { href: "/benefits", name: "Beneficios", icon: Gift },
];

interface SidebarProps {
  profile: Profile | null;
  categories: ForumCategory[];
  professionalRole?: ProfessionalRole | null;
  className?: string;
}

export function Sidebar({ profile, categories, professionalRole, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-[280px] flex-shrink-0 flex-col border-r bg-sidebar glass",
        className
      )}
      style={{
        borderColor: "var(--glass-border)",
      }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Link href="/forum" className="text-xl font-bold tracking-tight text-gradient">
          sinapse.club
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-9 h-8 bg-muted border-0 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Forum Categories */}
        <div className="px-3 pt-2">
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Forum
          </p>
          <nav className="space-y-0.5">
            {categories.map((category) => {
              const isActive = pathname === `/forum/${category.slug}` || pathname.startsWith(`/forum/${category.slug}/`);
              return (
                <Link
                  key={category.id}
                  href={`/forum/${category.slug}`}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  {/* Color dot -- the ONLY color exception in B&W design */}
                  <span
                    className="h-[6px] w-[6px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color || "#71717A" }}
                  />
                  {/* Icon + Name */}
                  <span className="flex-1 truncate">
                    {category.icon && (
                      <span className="mr-1.5">{category.icon}</span>
                    )}
                    {category.name}
                  </span>
                  {/* PRO badge or thread count */}
                  {category.access === "pro" ? (
                    <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  ) : category.threads_count > 0 ? (
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {category.threads_count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <Separator className="my-3 mx-3" />

        {/* Extras */}
        <div className="px-3">
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Extras
          </p>
          <nav className="space-y-0.5">
            {extraItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Separator className="my-3 mx-3" />

        {/* Settings */}
        <div className="px-3 pb-3">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
              pathname.startsWith("/settings")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Configuracoes</span>
          </Link>
        </div>
      </ScrollArea>

      {/* User card */}
      {profile && (
        <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm hover:bg-sidebar-accent"
            style={{
              borderRadius: "var(--radius-card)",
            }}
          >
            <Avatar size="default" className="ring-1 ring-border">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.display_name || profile.username} />
              ) : null}
              <AvatarFallback>
                {profile.display_name?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-sm leading-tight">
                {profile.display_name || profile.username}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {professionalRole ? (
                  <CargoBadge
                    cluster={professionalRole.cluster}
                    roleName={professionalRole.name}
                    size="sm"
                  />
                ) : (
                  <span className="text-[11px] text-muted-foreground">@{profile.username}</span>
                )}
                {profile.level > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px] font-mono">
                    Lv.{profile.level}
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
