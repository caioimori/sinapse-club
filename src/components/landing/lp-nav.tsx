"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LpNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 backdrop-blur-xl bg-background/80"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-base font-semibold tracking-tight">
          sinapse<span className="text-muted-foreground">.club</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="#solucao"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Como funciona
          </Link>
          <Link
            href="#mentores"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Mentores
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Planos
          </Link>
          <Link
            href="#faq"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-sm">
              Entrar
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              size="sm"
              className="bg-foreground text-background border-0 text-sm"
            >
              Ver planos
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
