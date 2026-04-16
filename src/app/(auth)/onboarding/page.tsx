"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CargoSelector } from "@/components/profile/cargo-selector";

export default function OnboardingPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function finish(withRole: boolean) {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Sessao expirada. Faca login novamente.");
        setLoading(false);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any).from("profiles").update({
        locale: "pt-BR",
        interests: [],
        professional_role_id: withRole ? selectedRoleId : null,
        company: withRole && company ? company : null,
        headline: withRole && headline ? headline : null,
        onboarded: true,
      }).eq("id", user.id);
      if (updateError) throw updateError;
      window.location.href = "/forum";
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Erro ao salvar perfil. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="w-full max-w-lg space-y-6 rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sinapse.svg" alt="sinapse" className="h-7 w-auto" />
          <h1 className="text-2xl font-bold">Bem-vindo</h1>
          <p className="text-muted-foreground">
            Conte um pouco sobre voce para a comunidade. E opcional — voce pode preencher depois no perfil.
          </p>
        </div>

        <CargoSelector
          selectedRoleId={selectedRoleId}
          company={company}
          headline={headline}
          onRoleChange={setSelectedRoleId}
          onCompanyChange={setCompany}
          onHeadlineChange={setHeadline}
        />

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => finish(false)}
            disabled={loading}
          >
            Pular por agora
          </Button>
          <Button
            className="flex-1 bg-foreground border-0"
            onClick={() => finish(true)}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Entrar no forum"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
