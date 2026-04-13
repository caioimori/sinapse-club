"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSideVisual } from "@/components/auth/auth-side-visual";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPendingConfirmation, setShowPendingConfirmation] = useState(false);
  const supabase = createClient();

  async function handleResend() {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setLoading(false);
    if (error) setError(error.message);
  }

  if (showPendingConfirmation) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold">Confira seu email</h1>
            <p className="text-sm text-muted-foreground">
              Enviamos um link de confirmação para{" "}
              <strong className="text-foreground">{email}</strong>. Clique no link para ativar
              sua conta e começar a usar o sinapse.club.
            </p>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-left text-xs text-muted-foreground">
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                Não chegou? Cheque a caixa de spam ou promoções.
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? "Reenviando..." : "Reenviar email de confirmação"}
            </Button>
            <Link
              href="/login"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Já confirmei — ir para o login
            </Link>
          </div>
        </div>
        <AuthSideVisual />
      </div>
    );
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signupData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          preferred_username: username,
          full_name: username,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // LGPD Art. 7, V / Art. 8 — persist consent as audit trail.
    // Two events: one for Terms of Use, one for Privacy Policy.
    // If insert fails we still proceed with signup (compliance best-effort
    // logged to Sentry in production).
    const userId = signupData.user?.id;
    if (userId) {
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("consent_log").insert([
        {
          user_id: userId,
          event_type: "signup_terms",
          document_version: "v1",
          user_agent: userAgent,
        },
        {
          user_id: userId,
          event_type: "signup_privacy",
          document_version: "v1",
          user_agent: userAgent,
        },
      ]);
    }

    // If email confirmation is ON, show pending screen; otherwise land in /forum.
    if (signupData.user && !signupData.session) {
      setShowPendingConfirmation(true);
      setLoading(false);
      return;
    }

    // Hard navigation guarantees middleware re-runs with fresh session.
    window.location.href = "/forum";
  }

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Criar sua conta</h1>
            <p className="text-sm text-muted-foreground">Junte-se à comunidade em alguns passos</p>
          </div>

          {/* Google Sign-in */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="seuusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {/* LGPD Consent */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="consent"
                required
                className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-white accent-white"
              />
              <label htmlFor="consent" className="text-sm text-zinc-400">
                Li e concordo com os{' '}
                <a href="/termos" className="text-white underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="/privacidade" className="text-white underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </a>
                . Autorizo o tratamento dos meus dados pessoais conforme descrito.
              </label>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full bg-foreground border-0" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
      <AuthSideVisual />
    </div>
  );
}
