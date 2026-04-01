"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProfessionalCluster } from "@/types/database";

interface ProfessionalRole {
  id: string;
  slug: string;
  name: string;
  cluster: ProfessionalCluster;
  icon: string | null;
}

const CLUSTER_LABELS: Record<ProfessionalCluster, string> = {
  "c-level": "C-Level",
  management: "Management",
  specialist: "Specialist",
  operational: "Operational",
  freelancer: "Freelancer",
  entrepreneur: "Entrepreneur",
  student: "Student",
};

const CLUSTER_ORDER: ProfessionalCluster[] = [
  "c-level",
  "management",
  "specialist",
  "operational",
  "freelancer",
  "entrepreneur",
  "student",
];

interface CargoSelectorProps {
  selectedRoleId: string | null;
  company: string;
  headline: string;
  onRoleChange: (roleId: string | null) => void;
  onCompanyChange: (company: string) => void;
  onHeadlineChange: (headline: string) => void;
}

export function CargoSelector({
  selectedRoleId,
  company,
  headline,
  onRoleChange,
  onCompanyChange,
  onHeadlineChange,
}: CargoSelectorProps) {
  const [roles, setRoles] = useState<ProfessionalRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      const supabase = createClient();
      const { data } = await supabase
        .from("professional_roles")
        .select("id, slug, name, cluster, icon")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      setRoles((data as ProfessionalRole[]) || []);
      setLoading(false);
    }
    fetchRoles();
  }, []);

  const grouped = CLUSTER_ORDER.reduce(
    (acc, cluster) => {
      const clusterRoles = roles.filter((r) => r.cluster === cluster);
      if (clusterRoles.length > 0) {
        acc.push({ cluster, label: CLUSTER_LABELS[cluster], roles: clusterRoles });
      }
      return acc;
    },
    [] as { cluster: ProfessionalCluster; label: string; roles: ProfessionalRole[] }[],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Role selector — grouped radio buttons */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Seu cargo / papel profissional</Label>
        <div className="max-h-64 space-y-4 overflow-y-auto rounded-xl border border-border p-4">
          {grouped.map(({ cluster, label, roles: clusterRoles }) => (
            <div key={cluster}>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {clusterRoles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() =>
                      onRoleChange(selectedRoleId === role.id ? null : role.id)
                    }
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      selectedRoleId === role.id
                        ? "border-foreground bg-foreground/5 font-medium"
                        : "border-border hover:border-foreground/30",
                    )}
                  >
                    {role.icon && <span className="mr-1.5">{role.icon}</span>}
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium">
          Empresa / Organizacao{" "}
          <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="company"
          placeholder="ex: Google, Startup XYZ, Freelancer"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
        />
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <Label htmlFor="headline" className="text-sm font-medium">
          Headline{" "}
          <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="headline"
          placeholder="ex: AI Engineer @ FAANG"
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
        />
      </div>
    </div>
  );
}
