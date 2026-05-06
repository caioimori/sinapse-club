"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Detecta `?welcome=1` na URL (set pelo /auth/callback após confirmar email)
 * e dispara toast de boas-vindas. Limpa o query string depois pra não disparar
 * de novo se user navegar back/forward.
 */
export function WelcomeToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome");

  useEffect(() => {
    if (welcome !== "1") return;
    toast.success("Bem-vindo ao SINAPSE.club", {
      description: "Email confirmado. Você já está logado — comece explorando o feed ou faça sua primeira pergunta.",
      duration: 6000,
    });

    // Remove ?welcome=1 do query string sem recarregar
    const params = new URLSearchParams(searchParams.toString());
    params.delete("welcome");
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [welcome, router, pathname, searchParams]);

  return null;
}
