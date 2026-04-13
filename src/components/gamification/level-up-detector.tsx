"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { getRankFromRep } from "@/lib/reputation";
import { publishBurst } from "@/lib/celebration";

const STORAGE_KEY = "sinapse:last-known-level";

interface LevelUpDetectorProps {
  reputation: number;
}

/**
 * Silent observer component that detects when the user's rank goes up
 * between renders (e.g. after gaining reputation from a like/reply) and
 * fires a celebratory toast + confetti burst exactly once per transition.
 *
 * We persist the last-known level in localStorage so the celebration
 * survives a hard reload — important because the user's next navigation
 * after getting the XP is usually a refresh of the feed.
 */
export function LevelUpDetector({ reputation }: LevelUpDetectorProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined") return;

    const rank = getRankFromRep(reputation);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const lastLevel = stored ? parseInt(stored, 10) : rank.level;

    if (rank.level > lastLevel) {
      fired.current = true;
      // Delay a beat so the sidebar finishes mounting before the toast anchors.
      setTimeout(() => {
        publishBurst();
        toast.success(`Bem-vindo ao nível ${rank.level}!`, {
          description: `Você alcançou ${rank.name}. Seu trabalho na comunidade está sendo reconhecido.`,
          duration: 6000,
          icon: <Sparkles className="h-4 w-4" style={{ color: rank.color }} aria-hidden="true" />,
        });
      }, 120);
    }

    // Always persist the current level so future jumps are detected from here.
    window.localStorage.setItem(STORAGE_KEY, String(rank.level));
  }, [reputation]);

  return null;
}
