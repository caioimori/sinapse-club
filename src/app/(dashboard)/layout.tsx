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
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar
        profile={profile}
        categories={categories}
        professionalRole={professionalRole}
        className="hidden lg:flex"
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar profile={profile} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <MobileNav categories={categories} className="lg:hidden" />
      </div>
    </div>
  );
}
