"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse wheel hijack: convert vertical scroll into horizontal scroll when
  // hovering the chip bar. Keeps trackpad 2D gestures unchanged.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

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

      {/* Scrollable chip track — native horizontal scroll, no animation */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden ml-[88px] scrollbar-none"
      >
        <div className="flex items-center gap-2 pr-8">
          {categories.map((c) => {
            const isActive = activeCategory === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.slug)}
                className={cn(
                  "flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap",
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
