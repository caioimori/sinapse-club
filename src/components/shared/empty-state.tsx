import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateBaseProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional CTA slot: pass a Link via `href` or a button via `action` (client wrapper) */
  cta?: ReactNode;
}

/**
 * Shared empty state surface.
 *
 * Mirrors the "Tudo em dia" empty state in `/notificacoes` — circulo 56px +
 * title bold + description muted + optional CTA. Keeps every empty state
 * visually identical across the community surfaces (Pilar 8 — Promessa do
 * empty state).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  cta,
}: EmptyStateBaseProps) {
  return (
    <div className="flex flex-col items-center py-20 gap-3 text-center px-4">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-bold text-foreground text-lg">{title}</p>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {cta ? <div className="mt-2">{cta}</div> : null}
    </div>
  );
}

interface EmptyStateLinkCtaProps {
  href: string;
  label: string;
}

/**
 * Standard CTA pill used inside `EmptyState` — mirrors the sidebar "Post"
 * button style (`bg-foreground text-background`, rounded-full).
 */
export function EmptyStateLinkCta({ href, label }: EmptyStateLinkCtaProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/85 transition-colors"
    >
      {label}
    </Link>
  );
}
