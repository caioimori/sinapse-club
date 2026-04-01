"use client";

import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, LogOut, Plus, ChevronRight, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface TopbarProps {
  profile: Profile | null;
}

/**
 * Parse pathname into breadcrumb segments for forum routes.
 * Returns an array of { label, href } objects.
 */
function buildBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [];

  if (!pathname.startsWith("/forum")) return crumbs;

  crumbs.push({ label: "Forum", href: "/forum" });

  const segments = pathname.replace(/^\/forum\/?/, "").split("/").filter(Boolean);

  if (segments.length === 0) return crumbs;

  // /forum/thread/[id] pattern
  if (segments[0] === "thread") {
    crumbs.push({ label: "Thread", href: pathname });
    return crumbs;
  }

  // /forum/new pattern
  if (segments[0] === "new") {
    crumbs.push({ label: "Novo Thread", href: pathname });
    return crumbs;
  }

  // /forum/[category]
  const categorySlug = segments[0];
  const categoryLabel = categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  crumbs.push({ label: categoryLabel, href: `/forum/${categorySlug}` });

  // /forum/[category]/[sub]
  if (segments[1]) {
    const subSlug = segments[1];
    const subLabel = subSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    crumbs.push({ label: subLabel, href: `/forum/${categorySlug}/${subSlug}` });
  }

  return crumbs;
}

export function Topbar({ profile }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const breadcrumbs = buildBreadcrumbs(pathname);
  const isForumRoute = pathname.startsWith("/forum");

  // Determine category context for "New Thread" pre-selection
  const forumSegments = pathname.replace(/^\/forum\/?/, "").split("/").filter(Boolean);
  const currentCategorySlug = forumSegments.length > 0 && forumSegments[0] !== "thread" && forumSegments[0] !== "new"
    ? forumSegments[0]
    : null;
  const newThreadHref = currentCategorySlug
    ? `/forum/new?category=${currentCategorySlug}`
    : "/forum/new";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 lg:px-6 glass-nav"
      style={{
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      {/* Left: Breadcrumb (forum) or Search (other) */}
      <div className="flex flex-1 items-center gap-4 min-w-0">
        {breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1 text-sm min-w-0">
            <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1 min-w-0">
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-foreground truncate">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar conteudo..."
              className="pl-9 bg-muted border-0"
            />
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* New Thread CTA -- visible on forum routes */}
        {isForumRoute && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => router.push(newThreadHref)}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Novo Thread</span>
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-foreground" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white">
              {profile?.display_name?.[0]?.toUpperCase() || profile?.username?.[0]?.toUpperCase() || "?"}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => router.push("/profile")}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/settings")}>
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
