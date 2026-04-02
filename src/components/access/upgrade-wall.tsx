"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TIER_LABELS } from "@/lib/access";

interface UpgradeWallProps {
  requiredTier: "pro" | "premium";
  featureName?: string;
  returnPath?: string;
}

export function UpgradeWall({
  requiredTier,
  featureName,
  returnPath,
}: UpgradeWallProps) {
  const tierLabel = TIER_LABELS[requiredTier] || requiredTier;
  const pricingHref = returnPath
    ? `/pricing?upgrade=${requiredTier}&from=${encodeURIComponent(returnPath)}`
    : `/pricing?upgrade=${requiredTier}`;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--surface-default)",
        }}
      >
        <Lock className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        Conteudo exclusivo para membros {tierLabel}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {featureName
          ? `"${featureName}" esta disponivel a partir do plano ${tierLabel}.`
          : `Faca upgrade para o plano ${tierLabel} para desbloquear este conteudo.`}
      </p>

      <Link href={pricingHref} className="mt-6">
        <Button
          className="rounded-full px-6 font-semibold"
          style={{
            background: "var(--text-primary)",
            color: "var(--surface-base)",
          }}
        >
          Ver planos
        </Button>
      </Link>
    </div>
  );
}
