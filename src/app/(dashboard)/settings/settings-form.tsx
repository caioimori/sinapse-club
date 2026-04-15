"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { LocationAutocomplete } from "@/components/profile/location-autocomplete";

function nanoid(len = 12) {
  return Math.random().toString(36).slice(2, 2 + len);
}

/**
 * `compact` hides the LGPD / danger zone sections when the form is rendered
 * inside the profile edit modal. The settings page renders without it so the
 * legal controls stay discoverable under Settings & privacy (Twitter pattern).
 */
export function SettingsForm({
  profile,
  compact = false,
  onSaved,
}: {
  profile: any;
  compact?: boolean;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [headline, setHeadline] = useState(profile?.headline ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [githubUsername, setGithubUsername] = useState(profile?.github_username ?? "");

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setAvatarUploading(true);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${profile.id}/${nanoid()}.${ext}`;
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (!uploadError && data) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(data.path);
      setAvatarUrl(publicUrl);
      await (supabase as any).from("profiles").update({ avatar_url: publicUrl }).eq("id", profile.id);
      router.refresh();
    }
    setAvatarUploading(false);
    e.target.value = "";
  }

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
      onSaved?.();
      if (githubUsername.trim() && githubUsername.trim() !== profile?.github_username) {
        // Fire and forget — don't block the UX
        fetch("/api/github/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ github_username: githubUsername.trim() }),
        }).then(res => res.json()).then(data => {
          if (data.repos) {
            router.refresh();
          }
        }).catch(() => {
          // Ignore sync errors silently
        });
      }
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Tem certeza? Esta ação é permanente e não pode ser desfeita.')) return;

    const res = await fetch('/api/account/delete', { method: 'DELETE' });
    if (res.ok) {
      window.location.href = '/';
    } else {
      alert('Erro ao excluir conta. Tente novamente ou contate privacidade@sinapse.club');
    }
  }

  async function handleGitHubSync() {
    setSyncLoading(true);
    try {
      const res = await fetch("/api/github/sync", { method: "POST" });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Falha ao sincronizar GitHub");
      }
    } finally {
      setSyncLoading(false);
    }
  }

  async function handleGitHubConnect() {
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/settings")}`;
    const { error: linkError } = await supabase.auth.linkIdentity({
      provider: "github",
      options: {
        redirectTo,
        scopes: "read:user user:email public_repo",
      },
    });
    if (linkError) setError(linkError.message);
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="relative">
          <Avatar className="h-20 w-20 ring-2 ring-border">
            <AvatarImage src={avatarPreview ?? avatarUrl ?? undefined} alt={displayName || username} />
            <AvatarFallback className="text-2xl">
              {(displayName?.[0] || username?.[0] || "?").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background border-2 border-background hover:bg-foreground/80 transition-colors disabled:opacity-50"
          >
            {avatarUploading
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Camera className="h-3.5 w-3.5" />
            }
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <p className="text-xs text-muted-foreground">JPG, PNG ou WebP · máx 2MB</p>
      </div>

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

      {/* Location — autocomplete via Photon (OpenStreetMap) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Localizacao</label>
        <LocationAutocomplete
          value={location}
          onChange={setLocation}
          placeholder="Comece a digitar sua cidade..."
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
        {profile?.github_username ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-default)] bg-background px-3 py-2.5">
            <div className="flex items-center gap-2 text-[15px]">
              <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="text-muted-foreground">github.com/</span>
              <span className="font-medium">{profile.github_username}</span>
            </div>
            <button
              type="button"
              onClick={handleGitHubConnect}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Trocar conta
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGitHubConnect}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-background px-3 py-2.5 text-[15px] font-medium hover:bg-muted/50 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Conectar GitHub
          </button>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Autorize o acesso para sincronizar seus repositórios automaticamente. Ownership verificado via OAuth.
        </p>
      </div>

      {/* Feedback */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-[var(--accent-repost)]">Perfil atualizado!</p>}

      {/* Save */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/85 transition-colors disabled:opacity-40"
      >
        {loading ? "Salvando..." : "Salvar alteracoes"}
      </button>

      {/* Manual GitHub sync */}
      {profile?.github_username && (
        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <p className="text-sm font-medium mb-2">GitHub conectado: <span className="text-muted-foreground">@{githubUsername}</span></p>
          <button
            type="button"
            onClick={handleGitHubSync}
            disabled={syncLoading}
            className="px-4 py-1.5 rounded-full border border-[var(--border-default)] text-sm hover:bg-muted/50 transition-colors disabled:opacity-40"
          >
            {syncLoading ? "Sincronizando..." : "Sincronizar repositórios"}
          </button>
        </div>
      )}

      {/* Privacy & LGPD zone — hidden in compact (modal) mode, only on /settings */}
      {!compact && (
      <div className="mt-12 space-y-6">
        {/* Data export — LGPD Art. 18, II (portabilidade) */}
        <div className="border border-[var(--border-default)] rounded-lg p-6">
          <h3 className="font-semibold mb-2">Baixar meus dados</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Você pode baixar uma cópia completa dos seus dados pessoais armazenados no sinapse.club
            (perfil, posts, comentários, curtidas, follows, notificações e histórico de consentimento)
            em formato JSON. Art. 18, II da LGPD.
          </p>
          <a
            href="/api/user/export"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-default)] text-sm hover:bg-muted/50 transition-colors"
          >
            Baixar dados (JSON)
          </a>
        </div>

        {/* Danger Zone — LGPD Art. 18, VI (deletion) */}
        <div className="border border-red-900/50 rounded-lg p-6">
          <h3 className="text-red-400 font-semibold mb-2">Zona de Perigo</h3>
          <p className="text-zinc-400 text-sm mb-4">
            Excluir sua conta é permanente. Seus dados pessoais serão removidos em até 30 dias
            conforme a{' '}
            <a href="/privacidade" className="text-zinc-300 underline hover:text-white" target="_blank" rel="noopener noreferrer">
              LGPD
            </a>
            . Antes de excluir,{' '}
            <a href="/api/user/export" className="text-zinc-300 underline hover:text-white">
              baixe seus dados
            </a>
            .
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 rounded-lg text-sm transition-colors"
          >
            Excluir minha conta
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Dúvidas sobre privacidade?{' '}
          <a href="/privacidade/dpo" className="underline hover:text-foreground">
            Fale com nosso DPO
          </a>
          .
        </p>
      </div>
      )}
    </form>
  );
}
