import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar profile={profile} className="hidden lg:flex" />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar profile={profile} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-6">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <MobileNav className="lg:hidden" />
      </div>
    </div>
  );
}
