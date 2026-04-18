import { createClient } from "@/lib/supabase/server";
import { LeaderboardTable, type LeaderboardEntry } from "@/components/gamification/leaderboard-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import type { ProfessionalCluster } from "@/types/database";

export const metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // All-time (reputation total)
  const { data: allTimeProfiles } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, avatar_url, reputation, role, professional_role_id, professional_roles!professional_role_id(name, cluster)",
    )
    .eq("profile_type", "human")
    .gt("reputation", 0)
    .order("reputation", { ascending: false })
    .limit(50) as any;

  const allTimeEntries: LeaderboardEntry[] = (allTimeProfiles ?? []).map(
    (p: any, i: number) => ({
      rank: i + 1,
      username: p.username,
      display_name: p.display_name || p.username,
      avatar_url: p.avatar_url,
      cluster: (p.professional_roles?.cluster || "specialist") as ProfessionalCluster,
      role_name: p.professional_roles?.name || "Membro",
      reputation: p.reputation || 0,
      role: p.role || "free",
    }),
  );

  // Weekly (XP ganho na semana) — via view v_weekly_leaderboard + join em professional_roles
  const { data: weeklyRows } = await supabase
    .from("v_weekly_leaderboard")
    .select(
      "user_id, username, display_name, avatar_url, reputation, role, professional_role_id, weekly_xp",
    )
    .gt("weekly_xp", 0)
    .order("weekly_xp", { ascending: false })
    .limit(50) as any;

  // Busca cluster/nome dos cargos em batch (view nao faz join)
  const roleIds = Array.from(
    new Set(
      (weeklyRows ?? [])
        .map((r: any) => r.professional_role_id)
        .filter((id: string | null) => !!id),
    ),
  ) as string[];

  let rolesById: Record<string, { name: string; cluster: ProfessionalCluster }> = {};
  if (roleIds.length > 0) {
    const { data: roles } = await supabase
      .from("professional_roles")
      .select("id, name, cluster")
      .in("id", roleIds) as any;
    rolesById = Object.fromEntries(
      (roles ?? []).map((r: any) => [r.id, { name: r.name, cluster: r.cluster }]),
    );
  }

  const weeklyEntries: LeaderboardEntry[] = (weeklyRows ?? []).map(
    (r: any, i: number) => {
      const role = r.professional_role_id ? rolesById[r.professional_role_id] : undefined;
      return {
        rank: i + 1,
        username: r.username,
        display_name: r.display_name || r.username,
        avatar_url: r.avatar_url,
        cluster: (role?.cluster || "specialist") as ProfessionalCluster,
        role_name: role?.name || "Membro",
        reputation: r.reputation || 0,
        role: r.role || "free",
        weekly_xp: r.weekly_xp || 0,
      };
    },
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Leaderboard</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Ranking dos membros mais ativos da comunidade
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="geral">
        <TabsList variant="line">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="semanal">Semanal</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-4">
          {allTimeEntries.length > 0 ? (
            <LeaderboardTable entries={allTimeEntries} mode="all-time" />
          ) : (
            <EmptyState
              title="Ninguem no ranking ainda"
              subtitle="Participe do forum para ganhar reputacao e aparecer aqui"
            />
          )}
        </TabsContent>

        <TabsContent value="semanal" className="mt-4">
          {weeklyEntries.length > 0 ? (
            <LeaderboardTable entries={weeklyEntries} mode="weekly" />
          ) : (
            <EmptyState
              title="Ninguem pontuou essa semana"
              subtitle="XP reseta toda semana — poste, comente e curta pra aparecer aqui"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      <Trophy className="h-10 w-10 text-muted-foreground/50" />
      <p className="mt-3 text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground/70">{subtitle}</p>
    </div>
  );
}
