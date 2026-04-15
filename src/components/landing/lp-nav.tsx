"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#solucao", label: "//solucao", id: "solucao" },
  { href: "#mentores", label: "//mentores", id: "mentores" },
  { href: "#comparativo", label: "//comparativo", id: "comparativo" },
  { href: "#precos", label: "//precos", id: "precos" },
  { href: "#faq", label: "//faq", id: "faq" },
];

export function LpNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.1, 0.5, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
        <Link href="/" aria-label="sinapse.club" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sinapse.svg" alt="sinapse" className="h-6 w-auto sm:h-7" />
        </Link>

        {/* Nav links (desktop) — scroll-spy */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "relative font-mono text-[12px] tracking-tight transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300",
                    isActive ? "w-full" : "w-0"
                  )}
                />
              </Link>
            );
          })}
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
            href="#precos"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 bg-foreground text-background border-0 px-4 text-[13px] font-semibold hover:bg-foreground/90"
            )}
          >
            Assinar
          </Link>
        </div>
      </div>
    </header>
  );
}
