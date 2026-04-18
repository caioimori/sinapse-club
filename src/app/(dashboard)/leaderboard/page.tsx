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

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, reputation, role, professional_role_id, professional_roles!professional_role_id(name, cluster)")
    .eq("profile_type", "human")
    .gt("reputation", 0)
    .order("reputation", { ascending: false })
    .limit(50) as any;

  const entries: LeaderboardEntry[] = (profiles ?? []).map((p: any, i: number) => ({
    rank: i + 1,
    username: p.username,
    display_name: p.display_name || p.username,
    avatar_url: p.avatar_url,
    cluster: (p.professional_roles?.cluster || "specialist") as ProfessionalCluster,
    role_name: p.professional_roles?.name || "Membro",
    reputation: p.reputation || 0,
    role: p.role || "free",
  }));

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
          <TabsTrigger value="cargo">Por Cargo</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-4">
          {entries.length > 0 ? (
            <LeaderboardTable entries={entries} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
              <Trophy className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Ninguem no ranking ainda
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Participe do forum para ganhar reputacao e aparecer aqui
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="semanal" className="mt-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Trophy className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Ranking semanal em breve
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Acompanhe quem mais contribuiu na ultima semana
            </p>
          </div>
        </TabsContent>

        <TabsContent value="cargo" className="mt-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Trophy className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Ranking por cargo em breve
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Compare seu desempenho com profissionais do mesmo cargo
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
