"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SettingsForm } from "@/app/(dashboard)/settings/settings-form";

/**
 * Twitter-style "Edit profile" overlay. Opens from the profile page and
 * reuses the existing SettingsForm in `compact` mode so legal/danger
 * controls stay on /settings and we don't duplicate the save logic.
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(open), [open]);

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

  if (!mounted) return null;

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
        <div className="sticky top-0 flex items-center gap-4 border-b border-[var(--border-subtle)] bg-background/95 backdrop-blur px-4 py-3 rounded-t-2xl z-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-[17px] font-bold">Editar perfil</h2>
        </div>

        {/* Form (compact — sem LGPD/danger zone) */}
        <div className="px-5 py-5">
          <SettingsForm profile={profile} compact onSaved={onClose} />
        </div>
      </div>
    </div>
  );
}
