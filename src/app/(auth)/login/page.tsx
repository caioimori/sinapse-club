"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSideVisual } from "@/components/auth/auth-side-visual";

type AuthError =
  | { kind: "unconfirmed"; email: string }
  | { kind: "invalid" }
  | { kind: "other"; message: string };

function mapAuthError(message: string, email: string): AuthError {
  const normalized = message.toLowerCase();
  if (normalized.includes("email not confirmed") || normalized.includes("not_confirmed")) {
    return { kind: "unconfirmed", email };
  }
  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid_credentials")
  ) {
    return { kind: "invalid" };
  }
  return { kind: "other", message };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const redirectTo = searchParams.get("redirect") || "/forum";
  const queryError = searchParams.get("error");
  const queryEmail = searchParams.get("email") ?? "";

  const initialError: AuthError | null =
    queryError === "unconfirmed" && queryEmail
      ? { kind: "unconfirmed", email: queryEmail }
      : queryError === "auth_failed"
        ? { kind: "other", message: "Falha na autenticação. Tente novamente." }
        : null;

  const [email, setEmail] = useState(queryEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(initialError);
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResendStatus("idle");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(mapAuthError(signInError.message, email));
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleResendConfirmation(targetEmail: string) {
    setResendStatus("loading");
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: targetEmail,
    });
    setResendStatus(resendError ? "idle" : "sent");
    if (resendError) {
      setError({ kind: "other", message: resendError.message });
    }
  }

  async function handleGoogleLogin() {
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });
    if (oauthError) setError({ kind: "other", message: oauthError.message });
  }

  async function handleGithubLogin() {
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: callbackUrl, scopes: "read:user user:email public_repo" },
    });
    if (oauthError) setError({ kind: "other", message: oauthError.message });
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-10 lg:px-12">
        <div className="w-full max-w-[clamp(20rem,28vw,26rem)] space-y-7">
          {/* Header — editorial brandbook */}
          <div className="space-y-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              — Bem-vindo de volta
            </p>
            <h1 className="font-display text-[clamp(3rem,4.5vw,3.5rem)] font-light leading-[0.95] tracking-[-0.025em]">
              Entrar.
            </h1>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Acesse sua conta pra continuar onde parou.
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="h-10 w-full rounded-none"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar com Google
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full rounded-none"
              onClick={handleGithubLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Continuar com GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center font-mono text-[10px] uppercase tracking-[0.14em]">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="h-11 text-[14px]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/recuperar-senha"
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Esqueci
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="h-11 text-[14px]"
              />
            </div>

            {/* Erro inline contextual */}
            {error?.kind === "invalid" && (
              <div className="border border-destructive/40 bg-destructive/5 p-3">
                <p className="text-[13px] text-destructive">
                  Email ou senha incorretos. Tente de novo ou{" "}
                  <Link href="/recuperar-senha" className="underline underline-offset-4">
                    recupere sua senha
                  </Link>
                  .
                </p>
              </div>
            )}
            {error?.kind === "unconfirmed" && (
              <div className="border border-foreground/20 bg-foreground/[0.03] p-3 space-y-2">
                <p className="text-[13px] text-foreground">
                  Sua conta ainda não foi confirmada. Verifique o email{" "}
                  <strong className="font-medium">{error.email}</strong>.
                </p>
                {resendStatus === "sent" ? (
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    ✓ Email reenviado
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleResendConfirmation(error.email)}
                    disabled={resendStatus === "loading"}
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:opacity-70 disabled:opacity-40"
                  >
                    {resendStatus === "loading" ? "Reenviando..." : "Reenviar email de confirmação"}
                  </button>
                )}
              </div>
            )}
            {error?.kind === "other" && (
              <p className="text-[13px] text-destructive">{error.message}</p>
            )}

            <Button
              type="submit"
              className="h-11 w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Footer — CTA Criar Conta proeminente, "Ver planos" subordinado */}
          <div className="space-y-3 border-t border-border/60 pt-5">
            <Link
              href="/register"
              className="block w-full border border-foreground py-2.5 text-center text-[14px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Criar conta nova
            </Link>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Sem conta?{" "}
              <Link href="/#precos" className="underline underline-offset-4 hover:text-foreground">
                Ver planos
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthSideVisual />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
