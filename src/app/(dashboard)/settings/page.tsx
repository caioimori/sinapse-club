import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { BackButton } from "@/components/layout/back-button";

export const metadata = {
  title: "Configurações e privacidade",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <BackButton fallbackHref="/profile" />
        <h1 className="text-xl font-bold">Configurações e privacidade</h1>
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}
