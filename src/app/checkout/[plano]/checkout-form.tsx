"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createCheckoutForVisitor } from "./actions";

interface CheckoutFormProps {
  plano: string;
  planLabel: string;
}

export function CheckoutForm({ plano, planLabel }: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  function buildOAuthRedirect(): string {
    const base = `${window.location.origin}/auth/callback`;
    const next = encodeURIComponent(`/subscribe/${plano}`);
    return `${base}?next=${next}`;
  }

  async function handleGoogle() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: buildOAuthRedirect() },
    });
    if (oauthError) setError(oauthError.message);
  }

  async function handleGithub() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: buildOAuthRedirect(),
        scopes: "read:user user:email",
      },
    });
    if (oauthError) setError(oauthError.message);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutForVisitor({
        plano,
        email,
        name,
        consentTerms: consent,
        consentPrivacy: consent,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <div className="space-y-6">
      {/* OAuth shortcut (flow B) */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
          disabled={isPending}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Ja tenho conta — continuar com Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGithub}
          disabled={isPending}
        >
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Ja tenho conta — continuar com GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ou pague direto
          </span>
        </div>
      </div>

      {/* Direct-pay form (flow A) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Seu nome</Label>
          <Input
            id="name"
            type="text"
            placeholder="Como devemos te chamar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">
            Sua conta sera criada com este email apos o pagamento.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-white accent-white"
          />
          <label
            htmlFor="consent"
            className="text-sm text-muted-foreground"
          >
            Li e concordo com os{" "}
            <Link
              href="/termos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-muted-foreground"
            >
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link
              href="/privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-muted-foreground"
            >
              Politica de Privacidade
            </Link>
            . Autorizo o tratamento dos meus dados pessoais conforme descrito.
          </label>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-foreground text-background hover:bg-foreground/90"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecionando...
            </>
          ) : (
            `Continuar para pagamento — ${planLabel}`
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Pagamento seguro via AbacatePay. Sua conta e criada
          automaticamente apos a confirmacao.
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ja tem conta?{" "}
        <Link
          href={`/login?plan=${plano}`}
          className="font-medium text-foreground hover:underline"
        >
          Fazer login
        </Link>
      </p>
    </div>
  );
}
