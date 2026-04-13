"use client";

import { useState } from "react";
import { EditProfileModal } from "./edit-profile-modal";

/**
 * Client-side trigger for the EditProfileModal. Lets the profile server
 * component render a normal-looking button without needing to convert the
 * whole page into a client component.
 */
export function EditProfileTrigger({
  profile,
  className,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "px-4 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted/50 transition-colors inline-block"
        }
      >
        {children ?? "Editar perfil"}
      </button>
      <EditProfileModal open={open} onClose={() => setOpen(false)} profile={profile} />
    </>
  );
}
