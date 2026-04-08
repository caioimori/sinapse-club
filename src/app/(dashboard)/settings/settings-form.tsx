"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm({ profile }: { profile: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [headline, setHeadline] = useState(profile?.headline ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [githubUsername, setGithubUsername] = useState(profile?.github_username ?? "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await (supabase as any)
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        username: username.trim(),
        location: location.trim() || null,
        website_url: websiteUrl.trim() || null,
        company: company.trim() || null,
        github_username: githubUsername.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Display Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nome de exibicao</label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Seu nome"
          maxLength={60}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Username</label>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-[15px]">@</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
            placeholder="username"
            maxLength={30}
            required
            className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
          />
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          placeholder="Ex: AI Engineer @ Startup"
          maxLength={100}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Fale um pouco sobre voce..."
          maxLength={300}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
      </div>

      {/* Company */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Empresa</label>
        <input
          type="text"
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Onde voce trabalha"
          maxLength={80}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Localizacao</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Ex: Sao Paulo, Brasil"
          maxLength={80}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* Website */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Website</label>
        <input
          type="url"
          value={websiteUrl}
          onChange={e => setWebsiteUrl(e.target.value)}
          placeholder="https://seusite.com"
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* GitHub */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">GitHub</label>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-[15px]">github.com/</span>
          <input
            type="text"
            value={githubUsername}
            onChange={e => setGithubUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
            placeholder="seu-usuario"
            maxLength={39}
            className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
          />
        </div>
      </div>

      {/* Feedback */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">Perfil atualizado!</p>}

      {/* Save */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/85 transition-colors disabled:opacity-40"
      >
        {loading ? "Salvando..." : "Salvar alteracoes"}
      </button>
    </form>
  );
}
