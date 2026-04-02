"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createCheckout } from "./actions";

interface CheckoutButtonProps {
  plan: "pro" | "premium";
  highlighted?: boolean;
}

export function CheckoutButton({ plan, highlighted = false }: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createCheckout(plan);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      // Redirect to AbacatePay checkout
      window.location.href = result.url;
    });
  }

  return (
    <div className="space-y-2">
      <Button
        className={`w-full ${
          highlighted
            ? "bg-foreground text-background hover:bg-foreground/90"
            : ""
        }`}
        variant={highlighted ? "default" : "outline"}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecionando...
          </>
        ) : (
          "Assinar agora"
        )}
      </Button>
      {error && (
        <p className="text-xs text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
