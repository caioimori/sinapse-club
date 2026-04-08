import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";

export const metadata = {
  title: "Notificacoes",
};

export default async function NotificacoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5" />
        <h1 className="text-xl font-bold">Notificacoes</h1>
      </div>
      <div className="border border-[var(--border-subtle)] rounded-2xl p-12 text-center">
        <Bell className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
        <p className="font-medium text-foreground">Tudo em dia por aqui</p>
        <p className="text-sm text-muted-foreground mt-1">Suas notificacoes aparecerao aqui em breve</p>
      </div>
    </div>
  );
}
