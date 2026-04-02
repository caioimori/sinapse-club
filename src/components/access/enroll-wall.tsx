"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPriceBRL } from "@/lib/access";

interface EnrollWallProps {
  courseTitle: string;
  coursePrice: number;
  courseSlug: string;
  includedInPremium?: boolean;
}

export function EnrollWall({
  courseTitle,
  coursePrice,
  courseSlug,
  includedInPremium = false,
}: EnrollWallProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--surface-default)",
        }}
      >
        <Play className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        {courseTitle}
      </h3>

      <p className="mt-2 text-2xl font-bold tabular-nums">
        {coursePrice > 0 ? formatPriceBRL(coursePrice) : "Gratuito"}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Acesso completo a todas as aulas e materiais.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Link href={`/courses/${courseSlug}/checkout`}>
          <Button
            className="rounded-full px-8 font-semibold"
            style={{
              background: "var(--text-primary)",
              color: "var(--surface-base)",
            }}
          >
            Comprar curso
          </Button>
        </Link>

        {includedInPremium && (
          <Link
            href="/pricing?upgrade=premium"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Ou assine Premium
          </Link>
        )}
      </div>
    </div>
  );
}
