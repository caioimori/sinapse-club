"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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

// Cache do role do usuário atual em memória pra não fazer round-trip
// a cada click. Vive enquanto a aba estiver aberta.
let cachedUserRole: { userId: string; role: string } | null = null;

async function getUserRole(supabase: ReturnType<typeof createClient>): Promise<{ userId: string; role: string } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  if (cachedUserRole?.userId === user.id) return cachedUserRole;

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (profile?.role as string) ?? "free";
  cachedUserRole = { userId: user.id, role };
  return cachedUserRole;
}

export function FollowButton({ targetUserId, isFollowing: initial, className }: FollowButtonProps) {
  const [following, setFollowing] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Detecta touch device — em mobile não usamos hover; tap mostra confirmação
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      setIsTouch(true);
    }
  }, []);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const auth = await getUserRole(supabase);
      if (!auth) {
        toast.error("Faça login para seguir pessoas.");
        return;
      }

      if (!PAID_ROLES.has(auth.role)) {
        showPaywallToast("seguir pessoas");
        return;
      }

      // Tap em mobile pra unfollow → pede confirmação simples via toast
      if (following && isTouch) {
        const ok = window.confirm("Deixar de seguir?");
        if (!ok) return;
      }

      if (following) {
        const { error } = await (supabase as any)
          .from("follows")
          .delete()
          .match({ follower_id: auth.userId, following_id: targetUserId });
        if (error) throw error;
        setFollowing(false);
      } else {
        const { error } = await (supabase as any)
          .from("follows")
          .insert({ follower_id: auth.userId, following_id: targetUserId });
        if (error) throw error;
        setFollowing(true);
      }
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível atualizar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (following) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "rounded-full font-semibold min-w-[100px] transition-colors",
          hover && !isTouch && "border-red-500/50 text-red-500 hover:bg-red-500/10",
          className
        )}
        onClick={toggle}
        disabled={loading}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {loading ? "..." : hover && !isTouch ? "Deixar de seguir" : "Seguindo"}
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
