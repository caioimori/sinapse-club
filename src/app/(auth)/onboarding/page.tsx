"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Code, Briefcase, Brain, Sparkles, Cpu, ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CargoSelector } from "@/components/profile/cargo-selector";
import { cn } from "@/lib/utils";

const INTERESTS = [
  { id: "llms", label: "LLMs & Agents", icon: Bot, description: "GPT, Claude, Gemini, agents autonomos" },
  { id: "coding", label: "Coding & Tools", icon: Code, description: "Frameworks, SDKs, ferramentas de AI" },
  { id: "career", label: "Carreira em AI", icon: Briefcase, description: "Vagas, transicao, portfolio" },
  { id: "research", label: "Research", icon: Brain, description: "Papers, novos modelos, breakthroughs" },
  { id: "generative", label: "AI Generativa", icon: Sparkles, description: "Imagens, video, audio, 3D" },
  { id: "mlops", label: "MLOps & Infra", icon: Cpu, description: "Deploy, fine-tuning, infra de AI" },
];

const LOCALES = [
  { id: "pt-BR", label: "Portugues (BR)", flag: "\u{1F1E7}\u{1F1F7}" },
  { id: "en", label: "English", flag: "\u{1F310}" },
];

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [locale, setLocale] = useState("pt-BR");
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function handleComplete() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("profiles").update({
        locale,
        interests,
        professional_role_id: selectedRoleId,
        company: company || null,
        headline: headline || null,
        onboarded: true,
      }).eq("id", user.id);
    }
    router.push("/forum");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center ">
      <div className="w-full max-w-lg space-y-8 rounded-xl border border-border bg-card p-8">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s <= step ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step 1: Locale */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Bem-vindo ao sinapse.club!</h1>
              <p className="mt-2 text-muted-foreground">Qual idioma voce prefere?</p>
            </div>
            <div className="grid gap-3">
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLocale(l.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                    locale === l.id
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-border/80"
                  )}
                >
                  <span className="text-3xl">{l.flag}</span>
                  <div>
                    <p className="font-medium">{l.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.id === "pt-BR" ? "Conteudo traduzido + original" : "Original content + translations"}
                    </p>
                  </div>
                  {locale === l.id && <Check className="ml-auto h-5 w-5 text-muted-foreground" />}
                </button>
              ))}
            </div>
            <Button className="w-full bg-foreground border-0" onClick={() => setStep(2)}>
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">O que te interessa em AI?</h1>
              <p className="mt-2 text-muted-foreground">Selecione pelo menos 1 para personalizar seu feed</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                    interests.includes(interest.id)
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-border/80"
                  )}
                >
                  <interest.icon className={cn(
                    "h-5 w-5 mt-0.5 shrink-0",
                    interests.includes(interest.id) ? "text-muted-foreground" : "text-muted-foreground"
                  )} />
                  <div>
                    <p className="text-sm font-medium">{interest.label}</p>
                    <p className="text-xs text-muted-foreground">{interest.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button
                className="flex-1 bg-foreground border-0"
                onClick={() => setStep(3)}
                disabled={interests.length === 0}
              >
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Professional Role */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Qual seu cargo?</h1>
              <p className="mt-2 text-muted-foreground">
                Isso ajuda a comunidade a te conhecer melhor. Voce pode pular se preferir.
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
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
              <Button
                variant="outline"
                onClick={() => setStep(4)}
              >
                Pular
              </Button>
              <Button
                className="flex-1 bg-foreground border-0"
                onClick={() => setStep(4)}
              >
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Ready */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="text-6xl">{"\u{1F680}"}</div>
            <div>
              <h1 className="text-2xl font-bold">Tudo pronto!</h1>
              <p className="mt-2 text-muted-foreground">
                Seu feed esta personalizado. Explore o conteudo curado, participe do forum e conecte-se com a comunidade.
              </p>
            </div>
            <div className="space-y-2 text-left rounded-xl border border-border p-4">
              <p className="text-sm"><span className="font-medium">Idioma:</span> {LOCALES.find(l => l.id === locale)?.label}</p>
              <p className="text-sm"><span className="font-medium">Interesses:</span> {interests.map(i => INTERESTS.find(x => x.id === i)?.label).join(", ")}</p>
              {selectedRoleId && (
                <p className="text-sm"><span className="font-medium">Cargo:</span> Selecionado{company ? ` @ ${company}` : ""}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>Voltar</Button>
              <Button
                className="flex-1 bg-foreground border-0"
                onClick={handleComplete}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Explorar o feed"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
