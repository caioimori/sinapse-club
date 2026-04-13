"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LpNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/70 bg-background/85 backdrop-blur-xl shadow-[var(--shadow-xs)] supports-[backdrop-filter]:bg-background/75"
          : "border-transparent bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/50"
      )}
      style={{ WebkitBackdropFilter: "saturate(1.8) blur(20px)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 text-base font-semibold tracking-tight text-foreground sm:text-[17px]"
        >
          <span>sinapse</span>
          <span className="text-muted-foreground">.club</span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#solucao"
            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Como funciona
          </Link>
          <Link
            href="#mentores"
            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Mentores
          </Link>
          <Link
            href="#pricing"
            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Planos
          </Link>
          <Link
            href="#faq"
            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </Link>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden h-9 px-4 text-[13px] font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
            )}
          >
            Entrar
          </Link>
          <Link
            href="#pricing"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 bg-foreground text-background border-0 px-4 text-[13px] font-semibold hover:bg-foreground/90"
            )}
          >
            Ver planos
          </Link>
        </div>
      </div>
    </header>
  );
}
