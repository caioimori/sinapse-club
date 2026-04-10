"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

// Lazy-load to keep initial bundle small
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface ComposerEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ComposerEmojiPicker({ onSelect, onClose }: ComposerEmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute bottom-full mb-2 left-0 z-50 shadow-lg rounded-xl overflow-hidden">
      <EmojiPicker
        onEmojiClick={(data) => {
          onSelect(data.emoji);
          onClose();
        }}
        width={320}
        height={380}
        searchPlaceholder="Buscar emoji..."
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
}
