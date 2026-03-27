"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  Bot,
  Code,
  Briefcase,
  Rocket,
  MessageCircle,
  BookOpen,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const spaces = [
  { slug: "ai-news", name: "AI News", icon: Newspaper, emoji: "📰" },
  { slug: "llms-agents", name: "LLMs & Agents", icon: Bot, emoji: "🤖" },
  { slug: "coding-tools", name: "Coding & Tools", icon: Code, emoji: "🛠️" },
  { slug: "carreira-ai", name: "Carreira AI", icon: Briefcase, emoji: "💼" },
  { slug: "show-and-tell", name: "Show & Tell", icon: Rocket, emoji: "🚀" },
  { slug: "off-topic", name: "Off-topic", icon: MessageCircle, emoji: "💬" },
];

const navItems = [
  // { href: "/courses", name: "Cursos", icon: BookOpen },     // MVP: forum-only, courses later
  // { href: "/calendar", name: "Calendario", icon: Calendar }, // MVP: forum-only, calendar later
  { href: "/settings", name: "Configuracoes", icon: Settings },
];

interface SidebarProps {
  profile: Profile | null;
  className?: string;
}

export function Sidebar({ profile, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-[280px] flex-shrink-0 flex-col border-r border-border bg-sidebar",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-6 border-b border-border">
        <Link href="/feed" className="text-xl font-bold text-gradient">
          sinapse.club
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        {/* Spaces */}
        <div className="px-3">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Spaces
          </p>
          <nav className="space-y-1">
            {spaces.map((space) => {
              const isActive = pathname === `/feed` && space.slug === "ai-news"
                || pathname === `/spaces/${space.slug}`;
              return (
                <Link
                  key={space.slug}
                  href={space.slug === "ai-news" ? "/feed" : `/spaces/${space.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sinapse-purple-600"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <span className="text-base">{space.emoji}</span>
                  <span>{space.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Separator className="my-4" />

        {/* Nav items */}
        <div className="px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
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
      </ScrollArea>

      {/* User */}
      {profile && (
        <div className="border-t border-border p-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sinapse-purple-600 text-xs font-medium text-white">
              {profile.display_name?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate font-medium text-sm">{profile.display_name || profile.username}</p>
              <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
