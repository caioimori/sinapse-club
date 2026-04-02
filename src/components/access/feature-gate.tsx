import type { ReactNode } from "react";
import { hasAccess } from "@/lib/access";
import { UpgradeWall } from "@/components/access/upgrade-wall";

interface FeatureGateProps {
  userRole: string;
  requiredTier: "pro" | "premium";
  featureName?: string;
  returnPath?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Universal access gate wrapper.
 * Renders children if the user's role meets the required tier,
 * otherwise renders an UpgradeWall (or custom fallback).
 *
 * Server-component friendly — no "use client" directive.
 */
export function FeatureGate({
  userRole,
  requiredTier,
  featureName,
  returnPath,
  fallback,
  children,
}: FeatureGateProps) {
  if (hasAccess(userRole, requiredTier)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <UpgradeWall
      requiredTier={requiredTier}
      featureName={featureName}
      returnPath={returnPath}
    />
  );
}
