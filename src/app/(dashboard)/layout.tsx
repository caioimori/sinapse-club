import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];
type ProfessionalRole = Database["public"]["Tables"]["professional_roles"]["Row"];

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

  // Fetch profile, categories, and professional role in parallel
  const [profileResult, categoriesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("forum_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const profile = profileResult.data as Profile | null;
  const categories = (categoriesResult.data ?? []) as ForumCategory[];

  // Fetch professional role if profile has one
  let professionalRole: ProfessionalRole | null = null;
  if (profile?.professional_role_id) {
    const { data: roleData } = await supabase
      .from("professional_roles")
      .select("*")
      .eq("id", profile.professional_role_id)
      .single();
    professionalRole = roleData as ProfessionalRole | null;
  }

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar — sticky, full height */}
      <Sidebar
        profile={profile}
        professionalRole={professionalRole}
        className="hidden lg:flex sticky top-0 h-dvh"
      />

      {/* Main area — window/body scroll */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar profile={profile} />

        <main className="flex-1">
          <div className="w-full px-6 pt-0 pb-16 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — fixed ao viewport */}
      <MobileNav categories={categories} className="lg:hidden fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
}
