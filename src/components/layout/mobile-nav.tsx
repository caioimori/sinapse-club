"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, MessageSquare, Plus, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";

type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];

interface MobileNavProps {
  categories?: ForumCategory[];
  className?: string;
}

export function MobileNav({ categories = [], className }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [newThreadOpen, setNewThreadOpen] = useState(false);

  const isHome = pathname === "/forum" || pathname === "/";
  const isForum = pathname.startsWith("/forum");
  const isNotifications = pathname.startsWith("/notifications");
  const isProfile = pathname.startsWith("/profile");

  return (
    <>
      <nav
        className={cn(
          "flex h-16 items-center justify-around border-t border-border bg-background px-2",
          className
        )}
      >
        {/* Home */}
        <Link
          href="/forum"
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors relative",
            isHome && !categoriesOpen ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* Forum categories */}
        <button
          type="button"
          onClick={() => setCategoriesOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
            categoriesOpen ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Forum</span>
        </button>

        {/* New Thread FAB */}
        <button
          type="button"
          onClick={() => setNewThreadOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background -mt-3 shadow-md transition-transform active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors relative",
            isNotifications ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Bell className="h-5 w-5" />
          <span>Notifs</span>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
            isProfile ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span>Perfil</span>
        </Link>
      </nav>

      {/* Categories Sheet */}
      <Sheet open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle>Categorias</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100dvh-60px)]">
            <div className="py-2 px-2">
              {categories.map((category) => {
                const isActive = pathname === `/forum/${category.slug}` || pathname.startsWith(`/forum/${category.slug}/`);
                return (
                  <Link
                    key={category.id}
                    href={`/forum/${category.slug}`}
                    onClick={() => setCategoriesOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <span
                      className="h-[6px] w-[6px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color || "#71717A" }}
                    />
                    <span className="flex-1 truncate">
                      {category.icon && <span className="mr-1.5">{category.icon}</span>}
                      {category.name}
                    </span>
                    {category.threads_count > 0 && (
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {category.threads_count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* New Thread Sheet */}
      <Sheet open={newThreadOpen} onOpenChange={setNewThreadOpen}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader className="pb-2">
            <SheetTitle>Criar</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setNewThreadOpen(false);
                // Determine category from current route
                const segments = pathname.replace(/^\/forum\/?/, "").split("/").filter(Boolean);
                const catSlug = segments.length > 0 && segments[0] !== "thread" && segments[0] !== "new" ? segments[0] : null;
                const href = catSlug ? `/forum/new?category=${catSlug}` : "/forum/new";
                router.push(href);
              }}
            >
              <MessageSquare className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium text-sm">Novo Thread</p>
                <p className="text-xs text-muted-foreground">Iniciar uma discussao no forum</p>
              </div>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
