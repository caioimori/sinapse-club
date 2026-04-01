import { createClient } from "@/lib/supabase/server";
import { LeaderboardTable, type LeaderboardEntry } from "@/components/gamification/leaderboard-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import type { ProfessionalCluster } from "@/types/database";

export const metadata = {
  title: "Leaderboard",
};

// Fallback mock data in case the DB query returns < 10 entries
const MOCK_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, username: "rafadev", display_name: "Rafael Costa", avatar_url: null, cluster: "specialist", role_name: "Full-Stack Dev", level: 6, xp: 5120, streak_days: 42 },
  { rank: 2, username: "ana.ai", display_name: "Ana Beatriz", avatar_url: null, cluster: "entrepreneur", role_name: "Founder", level: 5, xp: 4350, streak_days: 38 },
  { rank: 3, username: "lucasops", display_name: "Lucas Mendes", avatar_url: null, cluster: "specialist", role_name: "DevOps Engineer", level: 5, xp: 3890, streak_days: 31 },
  { rank: 4, username: "marina.ux", display_name: "Marina Silva", avatar_url: null, cluster: "specialist", role_name: "UX Designer", level: 4, xp: 3200, streak_days: 27 },
  { rank: 5, username: "thiago.ml", display_name: "Thiago Rocha", avatar_url: null, cluster: "specialist", role_name: "ML Engineer", level: 4, xp: 2800, streak_days: 22 },
  { rank: 6, username: "camila.pm", display_name: "Camila Nunes", avatar_url: null, cluster: "management", role_name: "Product Manager", level: 3, xp: 2100, streak_days: 19 },
  { rank: 7, username: "pedro.cloud", display_name: "Pedro Alves", avatar_url: null, cluster: "specialist", role_name: "Cloud Architect", level: 3, xp: 1750, streak_days: 15 },
  { rank: 8, username: "julia.data", display_name: "Julia Ferreira", avatar_url: null, cluster: "specialist", role_name: "Data Analyst", level: 3, xp: 1400, streak_days: 12 },
  { rank: 9, username: "bruno.sec", display_name: "Bruno Santos", avatar_url: null, cluster: "freelancer", role_name: "Security Consultant", level: 2, xp: 800, streak_days: 8 },
  { rank: 10, username: "carol.jr", display_name: "Carolina Lima", avatar_url: null, cluster: "student", role_name: "Estudante", level: 2, xp: 350, streak_days: 4 },
];

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Try to fetch real data ordered by XP
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, xp, level, streak_days, professional_role_id, professional_roles!professional_role_id(name, cluster)")
    .order("xp", { ascending: false })
    .limit(10) as any;

  let entries: LeaderboardEntry[];

  if (profiles && profiles.length >= 3) {
    entries = profiles.map((p: any, i: number) => ({
      rank: i + 1,
      username: p.username,
      display_name: p.display_name || p.username,
      avatar_url: p.avatar_url,
      cluster: (p.professional_roles?.cluster || "specialist") as ProfessionalCluster,
      role_name: p.professional_roles?.name || "Membro",
      level: p.level || 1,
      xp: p.xp || 0,
      streak_days: p.streak_days || 0,
    }));
  } else {
    // Use mock data if not enough real profiles
    entries = MOCK_ENTRIES;
  }

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
          <LeaderboardTable entries={entries} />
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
