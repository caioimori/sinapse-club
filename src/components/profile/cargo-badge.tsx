import { cn } from "@/lib/utils";
import type { ProfessionalCluster } from "@/types/database";

const CLUSTER_STYLES: Record<ProfessionalCluster, { border: string; text: string }> = {
  "c-level": { border: "border-yellow-500/60", text: "text-yellow-600 dark:text-yellow-400" },
  management: { border: "border-zinc-400/60", text: "text-zinc-500 dark:text-zinc-400" },
  specialist: { border: "border-blue-500/60", text: "text-blue-600 dark:text-blue-400" },
  operational: { border: "border-zinc-500/60", text: "text-zinc-500 dark:text-zinc-400" },
  freelancer: { border: "border-green-500/60", text: "text-green-600 dark:text-green-400" },
  entrepreneur: { border: "border-purple-500/60", text: "text-purple-600 dark:text-purple-400" },
  student: { border: "border-teal-500/60", text: "text-teal-600 dark:text-teal-400" },
};

interface CargoBadgeProps {
  cluster: ProfessionalCluster;
  roleName: string;
  size?: "sm" | "md";
  className?: string;
}

export function CargoBadge({ cluster, roleName, size = "sm", className }: CargoBadgeProps) {
  const styles = CLUSTER_STYLES[cluster];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-transparent font-mono whitespace-nowrap",
        styles.border,
        styles.text,
        size === "sm" && "px-1.5 py-0 text-[10px] leading-4",
        size === "md" && "px-2 py-0.5 text-xs leading-4",
        className,
      )}
    >
      {roleName}
    </span>
  );
}
