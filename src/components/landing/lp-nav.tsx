"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#solucao", label: "//solução", id: "solucao" },
  { href: "#mentores", label: "//mentores", id: "mentores" },
  { href: "#comparativo", label: "//comparativo", id: "comparativo" },
  { href: "#precos", label: "//preços", id: "precos" },
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

        {/* Nav links (desktop), scroll-spy */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => {
            const isActive = activeId === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "group relative font-mono text-[15px] tracking-tight opacity-0 transition-colors duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{
                  animation: `fade-in 0.5s ease-out ${0.1 + i * 0.05}s forwards`,
                }}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-[1.5px] bg-foreground transition-all duration-500 ease-out",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* CTAs */}
        <div
          className="flex items-center gap-2 opacity-0"
          style={{ animation: "fade-in 0.6s ease-out 0.35s forwards" }}
        >
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden h-9 px-4 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
            )}
          >
            Entrar
          </Link>
          <Link
            href="#precos"
            className={cn(
              buttonVariants({ size: "sm" }),
              "group h-9 bg-foreground text-background [a]:hover:bg-foreground/90 border-0 px-4 text-[13px] font-semibold shadow-[var(--shadow-xs)] transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
            )}
          >
            Ver planos
          </Link>
        </div>
      </div>
    </header>
  );
}
