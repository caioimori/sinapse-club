"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LocationAutocomplete } from "@/components/profile/location-autocomplete";

/**
 * Minimalist "Edit profile" form used inside the profile modal.
 * Only the visual fields that X/Twitter shows in its own edit modal:
 *   - avatar
 *   - banner (header)
 *   - display name
 *   - bio
 *   - location (with Photon autocomplete)
 *   - website
 *
 * Everything else — username, cargo/role, company, headline, GitHub, privacy,
 * danger zone — lives on /settings. This keeps the modal fast and the
 * settings page discoverable as the "full" control panel.
 */
function nanoid(len = 12) {
  return Math.random().toString(36).slice(2, 2 + len);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileEditForm({ profile, onSaved }: { profile: any; onSaved?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState<string>(profile?.display_name ?? "");
  const [bio, setBio] = useState<string>(profile?.bio ?? "");
  const [location, setLocation] = useState<string>(profile?.location ?? "");
  const [websiteUrl, setWebsiteUrl] = useState<string>(profile?.website_url ?? "");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const [headerUrl, setHeaderUrl] = useState<string | null>(profile?.header_url ?? null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [headerUploading, setHeaderUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadImage(
    file: File,
    bucket: "avatars" | "headers",
    onUrl: (url: string) => void,
    setBusy: (b: boolean) => void,
  ) {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${profile.id}/${nanoid()}.${ext}`;
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError || !data) return;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
      onUrl(publicUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("profiles")
        .update({ [bucket === "avatars" ? "avatar_url" : "header_url"]: publicUrl })
        .eq("id", profile.id);
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        website_url: websiteUrl.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.refresh();
    onSaved?.();
  }

  const initial = (displayName?.[0] || profile?.username?.[0] || "?").toUpperCase();

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Banner */}
      <div className="relative h-32 overflow-hidden rounded-xl bg-muted">
        {headerUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={headerUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <button
          type="button"
          onClick={() => headerInputRef.current?.click()}
          disabled={headerUploading}
          className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
        >
          {headerUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
        </button>
        <input
          ref={headerInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) await uploadImage(f, "headers", setHeaderUrl, setHeaderUploading);
            e.target.value = "";
          }}
        />
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12">
        <div className="relative">
          <Avatar className="h-20 w-20 ring-4 ring-background">
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName || "avatar"} />
            <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background border-2 border-background hover:bg-foreground/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            {avatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await uploadImage(f, "avatars", setAvatarUrl, setAvatarUploading);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Display name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nome de exibicao</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Seu nome"
          maxLength={60}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Fale um pouco sobre voce..."
          maxLength={160}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
      </div>

      {/* Location */}
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
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://seusite.com"
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
