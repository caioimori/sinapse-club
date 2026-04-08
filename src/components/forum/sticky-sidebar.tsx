"use client";

import { useRef, useEffect } from "react";

interface StickySidebarProps {
  children: React.ReactNode;
  topbarHeight?: number;
  className?: string;
}

/**
 * Twitter-style sticky sidebar.
 *
 * When the sidebar content is taller than the available viewport height it
 * starts at a negative `top` so the page can scroll it into view naturally.
 * Once its bottom edge reaches the bottom of the viewport it sticks there.
 *
 * When the sidebar is shorter than the viewport it simply sticks to the top
 * (below the topbar).
 */
export function StickySidebar({
  children,
  topbarHeight = 56, // h-14 = 3.5rem = 56px
  className = "",
}: StickySidebarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    function recalculate() {
      const viewportHeight = window.innerHeight;
      const sidebarHeight = el.offsetHeight;
      const available = viewportHeight - topbarHeight;

      if (sidebarHeight > available) {
        // Sidebar taller than visible area:
        // start with negative top so it scrolls up naturally until
        // the bottom is flush with the viewport bottom.
        el.style.top = `${-(sidebarHeight - available)}px`;
      } else {
        // Sidebar fits: pin below the topbar.
        el.style.top = `${topbarHeight}px`;
      }
    }

    recalculate();

    const resizeObserver = new ResizeObserver(recalculate);
    resizeObserver.observe(el);
    window.addEventListener("resize", recalculate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", recalculate);
    };
  }, [topbarHeight]);

  return (
    <div
      ref={ref}
      style={{ position: "sticky" }}
      className={className}
    >
      {children}
    </div>
  );
}
