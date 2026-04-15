"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";

/**
 * Twitter-style "Edit profile" overlay. Handles only the visual profile
 * fields (avatar, banner, name, bio, location, website). Everything else —
 * username, cargo/role, GitHub, privacy, danger zone — lives on /settings.
 */
export function EditProfileModal({
  open,
  onClose,
  profile,
}: {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editar perfil"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-background shadow-2xl border border-[var(--border-subtle)] my-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-background/95 backdrop-blur px-4 py-3 rounded-t-2xl z-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-[17px] font-bold">Editar perfil</h2>
          </div>
          <Link
            href="/settings"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer"
          >
            Mais configuracoes
          </Link>
        </div>

        {/* Minimal form — avatar, banner, nome, bio, location, website */}
        <div className="px-5 py-5">
          <ProfileEditForm profile={profile} onSaved={onClose} />
        </div>
      </div>
    </div>
  );
}
