"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";
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

const SPEED_PX_PER_MS = 20 / 1000; // 20px/s — defined outside to avoid dep warning

export function ThemesBar({ categories, activeCategory }: ThemesBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // DOM refs
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Animation state — all in refs to avoid re-renders on every frame
  const offsetXRef = useRef(0);            // current translateX value (negative = moved left)
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singleWidthRef = useRef(0);        // width of one copy of the chips list

  // Touch drag state
  const touchStartXRef = useRef(0);
  const touchStartOffsetRef = useRef(0);

  // Apply transform directly to DOM node — no setState, no re-render
  const applyTransform = useCallback((x: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translateX(${x}px)`;
  }, []);

  // startScroll stored in a ref so scheduleResume can call it without circular deps
  const startScrollRef = useRef<() => void>(() => {});

  const startScroll = useCallback(() => {
    if (animFrameRef.current !== null) return;

    function step(timestamp: number) {
      if (isPausedRef.current) {
        lastTimestampRef.current = null;
        animFrameRef.current = null;
        return;
      }

      const singleWidth = singleWidthRef.current;

      if (lastTimestampRef.current !== null && singleWidth > 0) {
        const delta = timestamp - lastTimestampRef.current;
        offsetXRef.current -= delta * SPEED_PX_PER_MS;

        // Seamless loop: when first copy has fully scrolled out, snap back to start
        if (Math.abs(offsetXRef.current) >= singleWidth) {
          offsetXRef.current = 0;
        }

        applyTransform(offsetXRef.current);
      }

      lastTimestampRef.current = timestamp;
      animFrameRef.current = requestAnimationFrame(step);
    }

    animFrameRef.current = requestAnimationFrame(step);
  }, [applyTransform]);

  // Keep the ref in sync
  useEffect(() => {
    startScrollRef.current = startScroll;
  }, [startScroll]);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      startScrollRef.current();
    }, 3000);
  }, []);

  const pauseScroll = useCallback(() => {
    isPausedRef.current = true;
    lastTimestampRef.current = null;
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const pauseAndScheduleResume = useCallback(() => {
    pauseScroll();
    scheduleResume();
  }, [pauseScroll, scheduleResume]);

  // Measure single-copy width after mount/update
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      // scrollWidth covers both copies; divide by 2 = single copy width
      singleWidthRef.current = el.scrollWidth / 2;
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [categories]);

  // rAF loop lifecycle
  useEffect(() => {
    const startTimer = setTimeout(() => {
      startScroll();
    }, 1200);

    return () => {
      clearTimeout(startTimer);
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [startScroll]);

  // Mouse / touch interactions on the moving track wrapper
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onEnter = () => pauseAndScheduleResume();

    const onTouchStart = (e: TouchEvent) => {
      pauseScroll();
      touchStartXRef.current = e.touches[0].clientX;
      touchStartOffsetRef.current = offsetXRef.current;
    };

    const onTouchMove = (e: TouchEvent) => {
      const delta = e.touches[0].clientX - touchStartXRef.current;
      const newOffset = touchStartOffsetRef.current + delta;
      const singleWidth = singleWidthRef.current;
      // Clamp so user can't over-drag
      const clamped = Math.max(-singleWidth, Math.min(0, newOffset));
      offsetXRef.current = clamped;
      applyTransform(clamped);
    };

    const onTouchEnd = () => {
      scheduleResume();
    };

    wrapper.addEventListener("mouseenter", onEnter);
    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: true });
    wrapper.addEventListener("touchend", onTouchEnd);

    return () => {
      wrapper.removeEventListener("mouseenter", onEnter);
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
    };
  }, [applyTransform, pauseAndScheduleResume, pauseScroll, scheduleResume]);

  function handleSelect(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("categoria", slug);
    } else {
      params.delete("categoria");
    }
    router.push(`/forum?${params.toString()}`);
    pauseAndScheduleResume();
  }

  const chips = categories.map((c) => ({ ...c, slug: c.slug as string | null }));
  const isTodosActive = !activeCategory;

  return (
    <div className="relative flex items-center border-b border-[var(--border-subtle)] py-2 overflow-hidden">

      {/* ── Layer 1: Fixed "Todos" anchor — always on top ───────────────── */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-4">
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

        {/* Fade mask — chips slide behind this gradient as they pass "Todos" */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: "100%",
            width: "64px",
            background: "linear-gradient(to right, var(--background) 40%, transparent)",
          }}
        />
      </div>

      {/* ── Layer 2: Moving track — GPU-animated via translateX ─────────── */}
      {/* ml-[88px] = Todos button (~68px) + left padding (16px) + a few px gap */}
      <div
        ref={wrapperRef}
        className="flex-1 overflow-hidden ml-[88px]"
      >
        <div
          ref={trackRef}
          className="flex items-center gap-2 will-change-transform"
          style={{ transform: "translateX(0px)" }}
        >
          {/* Two identical copies of the chips list for seamless infinite loop */}
          {[...chips, ...chips].map((chip, i) => {
            const isActive = activeCategory === chip.slug;
            return (
              <button
                key={`${chip.id}-${i}`}
                onClick={() => handleSelect(chip.slug)}
                className={cn(
                  "flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[var(--surface-default)]"
                )}
              >
                {chip.icon && (
                  <span className="text-[11px] leading-none">{chip.icon}</span>
                )}
                <span>{toChipLabel(chip.name)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
