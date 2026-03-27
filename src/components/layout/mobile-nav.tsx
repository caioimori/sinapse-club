"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calendar, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/courses", label: "Cursos", icon: BookOpen },
  { href: "/calendar", label: "Agenda", icon: Calendar },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/profile", label: "Perfil", icon: User },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex h-16 items-center justify-around border-t border-border bg-background px-2",
        className
      )}
    >
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
              isActive ? "text-sinapse-purple-400" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-sinapse-purple-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
