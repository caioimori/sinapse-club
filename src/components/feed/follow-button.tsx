"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { showPaywallToast } from "@/components/access/paywall-toast";

const PAID_ROLES = new Set(["pro", "premium", "instructor", "admin"]);

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  className?: string;
}

export function FollowButton({ targetUserId, isFollowing: initial, className }: FollowButtonProps) {
  const [following, setFollowing] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const supabase = createClient();

  async function toggle() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Cenario B: free nao pode seguir pessoas.
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = (profile?.role as string) ?? "free";
    if (!PAID_ROLES.has(role)) {
      setLoading(false);
      showPaywallToast("seguir pessoas");
      return;
    }

    if (following) {
      await (supabase as any)
        .from("follows")
        .delete()
        .match({ follower_id: user.id, following_id: targetUserId });
      setFollowing(false);
    } else {
      await (supabase as any)
        .from("follows")
        .insert({ follower_id: user.id, following_id: targetUserId });
      setFollowing(true);
    }
    setLoading(false);
  }

  if (following) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "rounded-full font-semibold min-w-[100px] transition-colors",
          hover && "border-red-500/50 text-red-500 hover:bg-red-500/10",
          className
        )}
        onClick={toggle}
        disabled={loading}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {loading ? "..." : hover ? "Deixar de seguir" : "Seguindo"}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className={cn("rounded-full font-semibold min-w-[100px] bg-foreground", className)}
      onClick={toggle}
      disabled={loading}
    >
      {loading ? "..." : "Seguir"}
    </Button>
  );
}
