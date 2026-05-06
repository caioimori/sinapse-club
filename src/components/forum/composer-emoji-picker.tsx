"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Lazy-load to keep initial bundle small
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface ComposerEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const MOBILE_BREAKPOINT = 640; // sm

export function ComposerEmojiPicker({ onSelect, onClose }: ComposerEmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Mobile: bottom sheet (full width, ancorado ao viewport, não corta)
  if (isMobile) {
    const width = Math.min(320, typeof window !== "undefined" ? window.innerWidth - 16 : 320);
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-neutral-950/40"
          aria-hidden="true"
          onClick={onClose}
        />
        <div
          ref={ref}
          className="fixed left-1/2 bottom-2 z-50 -translate-x-1/2 shadow-2xl rounded-xl overflow-hidden"
          role="dialog"
          aria-label="Selecionar emoji"
        >
          <EmojiPicker
            onEmojiClick={(data) => {
              onSelect(data.emoji);
              onClose();
            }}
            width={width}
            height={360}
            searchPlaceholder="Buscar emoji..."
            previewConfig={{ showPreview: false }}
          />
        </div>
      </>
    );
  }

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 left-0 z-50 shadow-lg rounded-xl overflow-hidden"
      role="dialog"
      aria-label="Selecionar emoji"
    >
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
