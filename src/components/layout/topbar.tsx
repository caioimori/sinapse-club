"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

function getSectionTitle(pathname: string): string {
  if (pathname.startsWith("/notificacoes")) return "Notificações";
  if (pathname.startsWith("/explore")) return "Explore";
  if (pathname.startsWith("/forum/thread")) return "Thread";
  if (pathname.startsWith("/forum")) return "Fórum";
  if (pathname.startsWith("/courses")) return "Cursos";
  if (pathname.startsWith("/marketplace")) return "Marketplace";
  if (pathname.startsWith("/leaderboard")) return "Leaderboard";
  if (pathname.startsWith("/profile")) return "Perfil";
  if (pathname.startsWith("/settings")) return "Configurações";
  return "Sinapse";
}

export function Topbar({ profile }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const title = getSectionTitle(pathname);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 lg:px-6 glass-nav"
      style={{ borderBottom: "1px solid var(--glass-border)" }}
    >
      {/* Left: section title (mobile) / logo (mobile only) */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile: show logo */}
        <Link href="/forum" className="lg:hidden text-lg font-bold tracking-tight text-gradient">
          sinapse.club
        </Link>
        {/* Desktop: section title */}
        <span className="hidden lg:block text-base font-bold text-foreground">
          {title}
        </span>
      </div>

      {/* Right: avatar dropdown (mobile only — desktop has sidebar user card) */}
      <div className="flex items-center gap-1">
        {/* Avatar dropdown — primarily useful on mobile (desktop has sidebar user card) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
              {profile?.display_name?.[0]?.toUpperCase() || profile?.username?.[0]?.toUpperCase() || "?"}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => router.push("/profile")}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
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
