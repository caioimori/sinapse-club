import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const metadata = {
  title: "Perfil",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;
  if (!profile) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sinapse-purple-600 text-2xl font-bold text-white">
          {profile.display_name?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.display_name || profile.username}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          <div className="mt-2 flex gap-2">
            <Badge className="bg-sinapse-purple-600">{profile.role}</Badge>
            {profile.streak_days > 0 && (
              <Badge variant="outline">🔥 {profile.streak_days} dias</Badge>
            )}
            <Badge variant="outline">{profile.points} pts</Badge>
          </div>
        </div>
      </div>

      {profile.bio && (
        <p className="text-muted-foreground">{profile.bio}</p>
      )}

      {profile.interests.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Interesses</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} variant="outline">{interest}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
