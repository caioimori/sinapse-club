"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
}

interface ThemesBarProps {
  categories: Category[];
  activeCategory?: string;
}

/**
 * Reduce a category name to a short chip label.
 * Priority: explicit override → "AI para X" → drop connectors → 2 words max.
 * Important: several categories start with "AI para ..." — using the first
 * word alone would collapse all of them to "AI", which is what E2E-4 caught.
 */
function toChipLabel(name: string): string {
  const overrides: Record<string, string> = {
    "AI para Ads": "Ads",
    "AI para E-commerce": "E-com",
    "AI para Infoprodutos": "Infoprod",
    "AI para Afiliados": "Afiliados",
    "AI Copywriting": "Copy",
    "AI para SEO & Conteúdo": "SEO",
    "LLMs & Agentes": "LLMs",
    "Automação & No-Code": "Automação",
    "AI Generativa": "Generativa",
    "Negócios & Estratégia": "Negócios",
    "Carreira em AI": "Carreira",
    "Marketplace": "Marketplace",
    "Ferramentas & Reviews": "Ferramentas",
    "Off-topic & Networking": "Off",
  };
  if (overrides[name]) return overrides[name];
  // Fallback: drop parentheticals, drop "AI" prefix, take up to 2 words.
  const cleaned = name
    .replace(/\([^)]*\)/g, "")
    .replace(/^AI\s+/i, "")
    .trim();
  const words = cleaned.split(/[\s&\/\-]+/).filter(Boolean);
  return words.slice(0, 2).join(" ") || name;
}

export function ThemesBar({ categories, activeCategory }: ThemesBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-marquee: chips slide rightward, new ones emerge from behind "Todos".
  // CSS `:hover` on `.themes-marquee-wrapper` handles the instant pause;
  // `resumeDelayed` keeps the pause active for an extra 3s after the cursor
  // leaves so readers have time to aim before the track starts moving again.
  const [resumeDelayed, setResumeDelayed] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  function handleMouseLeave() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setResumeDelayed(true);
    resumeTimer.current = setTimeout(() => setResumeDelayed(false), 3000);
  }

  function handleSelect(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("categoria", slug);
    } else {
      params.delete("categoria");
    }
    router.push(`/forum?${params.toString()}`);
  }

  const isTodosActive = !activeCategory;

  return (
    <div className="relative flex items-center border-b border-[var(--border-subtle)] py-2">
      {/* Fixed "Todos" anchor */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-4 pr-2 bg-background">
        <button
          onClick={() => handleSelect(null)}
          className={cn(
            "flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap",
            isTodosActive
              ? "bg-foreground text-background"
              : "bg-muted/60 text-foreground hover:bg-[var(--surface-default)]"
          )}
        >
          Todos
        </button>
      </div>

      {/* Left fade mask — sits between Todos and the scrollable track */}
      <div
        className="absolute top-0 bottom-0 w-8 pointer-events-none z-[5]"
        style={{
          left: "80px",
          background:
            "linear-gradient(to right, var(--background), transparent)",
        }}
      />

      {/* Marquee track — chips auto-scroll rightward, duplicated for seamless loop.
          CSS `:hover` handles instant pause; `data-resume-delay` extends the
          pause 3s after the cursor leaves so readers keep control of the bar. */}
      <div
        className="themes-marquee-wrapper flex-1 overflow-hidden ml-[88px]"
        data-resume-delay={resumeDelayed ? "true" : undefined}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-2 w-max animate-themes-marquee">
          {[...categories, ...categories].map((c, i) => {
            const isActive = activeCategory === c.slug;
            return (
              <button
                key={`${c.id}-${i}`}
                onClick={() => handleSelect(c.slug)}
                className={cn(
                  "flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[var(--surface-default)]"
                )}
              >
                {c.icon && (
                  <span className="text-[11px] leading-none">{c.icon}</span>
                )}
                <span>{toChipLabel(c.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right fade mask — affordance for overflow content */}
      <div
        className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none z-[5]"
        style={{
          background:
            "linear-gradient(to left, var(--background), transparent)",
        }}
      />
    </div>
  );
}
