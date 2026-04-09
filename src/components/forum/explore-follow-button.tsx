"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ExploreFollowButtonProps {
  userId: string;
}

export function ExploreFollowButton({ userId }: ExploreFollowButtonProps) {
  const supabase = createClient();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setCurrentUserId(user.id);
      const { data } = await (supabase as any)
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", userId)
        .maybeSingle();
      setIsFollowing(!!data);
      setLoading(false);
    }
    init();
  }, [userId]);

  async function toggle() {
    if (!currentUserId || currentUserId === userId) return;
    setLoading(true);
    if (isFollowing) {
      setIsFollowing(false);
      await supabase.from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", userId);
    } else {
      setIsFollowing(true);
      await (supabase as any).from("follows").insert({
        follower_id: currentUserId,
        following_id: userId,
      });
    }
    setLoading(false);
  }

  if (!currentUserId || currentUserId === userId) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
        isFollowing
          ? "bg-muted text-foreground border border-[var(--border-default)] hover:border-destructive hover:text-destructive"
          : "bg-foreground text-background hover:bg-foreground/85"
      )}
    >
      {isFollowing ? "Seguindo" : "Seguir"}
    </button>
  );
}
