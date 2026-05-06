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
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div
        className="w-full space-y-6 rounded-xl border border-border bg-card p-8"
        style={{ maxWidth: "min(32rem, 92vw)" }}
      >
        <div className="flex flex-col items-center space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sinapse.svg" alt="sinapse" className="h-7 w-auto" />
          <h1 className="text-2xl font-bold">Quase lá</h1>
          <p className="text-muted-foreground">
            Membros com cargo + bio recebem <span className="font-semibold text-foreground">3x mais seguidores</span> no
            primeiro mês. Leva 30 segundos.
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

        <div className="flex flex-col gap-2.5">
          <Button
            className="w-full h-11 bg-foreground border-0 text-base font-semibold"
            onClick={() => finish(true)}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Completar perfil e entrar"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <button
            type="button"
            className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
            onClick={() => finish(false)}
            disabled={loading}
          >
            ou pular e completar depois (perde o badge de fundador)
          </button>
        </div>
      </div>
    </div>
  );
}
