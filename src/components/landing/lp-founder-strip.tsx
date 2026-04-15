"use client";

/* eslint-disable @next/next/no-img-element */
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export function LpFounderStrip() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.3,
  });

  return (
    <section
      aria-label="Fundadores"
      className="border-t border-border bg-card py-10 sm:py-12"
    >
      <div
        ref={ref}
        className={cn(
          "mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center transition-all duration-700 ease-out sm:flex-row sm:justify-center sm:gap-6 sm:text-left",
          inView ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="group flex -space-x-3">
          <img
            src="/matheus-soier.png"
            alt="Matheus Soier"
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-card object-cover transition-all duration-500 group-hover:-translate-x-1"
          />
          <img
            src="/caio-imori.png"
            alt="Caio Imori"
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-card object-cover transition-all duration-500 group-hover:translate-x-1"
          />
        </div>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Construído por quem opera IA em produção todo dia, não por quem
          escreve post sobre.
        </p>
      </div>
    </section>
  );
}
