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

/** Reduce a category name to a single word label */
function toChipLabel(name: string): string {
  const overrides: Record<string, string> = {
    "Inteligência Artificial": "IA",
    "Machine Learning": "ML",
    "Data Science": "Data",
    "Dev Tools": "Tools",
    "Open Source": "Open",
    "Carreira & Negócios": "Carreira",
    "Negócios": "Negócios",
    "Produto": "Produto",
    "Design": "Design",
    "Backend": "Backend",
    "Frontend": "Frontend",
    "DevOps": "DevOps",
    "Segurança": "Segurança",
    "Mobile": "Mobile",
    "Cloud": "Cloud",
    "Blockchain": "Web3",
  };
  if (overrides[name]) return overrides[name];
  const first = name.split(/[\s&\/\-]/)[0];
  return first;
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
