import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { createHmac, timingSafeEqual } from "crypto";

export const metadata = { title: "Descadastrar — sinapse.club" };

interface PageProps {
  searchParams: Promise<{ u?: string; t?: string }>;
}

function verifyUnsubscribeToken(userId: string, token: string, secret: string): boolean {
  try {
    const expected = createHmac("sha256", secret)
      .update(userId)
      .digest("base64url");
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function applyOptOut(userId: string): Promise<{ ok: boolean; alreadyOptedOut: boolean }> {
  const supabase = createServiceClient();
  const { data: existing } = await (supabase as unknown as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (k: string, v: string) => {
          single: () => Promise<{ data: { email_digest_opt_out: boolean } | null }>;
        };
      };
    };
  })
    .from("profiles")
    .select("email_digest_opt_out")
    .eq("id", userId)
    .single();

  if (existing?.email_digest_opt_out === true) {
    return { ok: true, alreadyOptedOut: true };
  }

  const { error } = await (supabase as unknown as {
    from: (t: string) => {
      update: (v: Record<string, unknown>) => {
        eq: (k: string, v: string) => Promise<{ error: unknown }>;
      };
    };
  })
    .from("profiles")
    .update({ email_digest_opt_out: true })
    .eq("id", userId);

  return { ok: !error, alreadyOptedOut: false };
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { u: userId, t: token } = await searchParams;
  const secret = process.env.DIGEST_UNSUBSCRIBE_SECRET;

  let state: "ok" | "already" | "invalid" | "error" | "missing-config" = "invalid";

  if (!secret) {
    state = "missing-config";
  } else if (userId && token && verifyUnsubscribeToken(userId, token, secret)) {
    const result = await applyOptOut(userId);
    state = result.ok ? (result.alreadyOptedOut ? "already" : "ok") : "error";
  }

  const messages: Record<typeof state, { title: string; body: string }> = {
    ok: {
      title: "Pronto.",
      body: "Você não receberá mais emails do digest semanal. As notificações dentro do fórum continuam ativas — você pode ajustar no painel quando quiser.",
    },
    already: {
      title: "Você já estava descadastrado.",
      body: "Não enviamos mais o digest pra esse email. Se você acha que isso é um erro, me chame em contato@sinapse.club.",
    },
    invalid: {
      title: "Link inválido.",
      body: "Esse link de descadastro está corrompido ou expirou. Use o link mais recente no rodapé do email — ou me chame em contato@sinapse.club.",
    },
    error: {
      title: "Algo deu errado.",
      body: "Não conseguimos atualizar agora. Tente daqui a pouco — ou responde o último email com 'descadastrar' que eu faço manualmente.",
    },
    "missing-config": {
      title: "Configuração pendente.",
      body: "O serviço de descadastro está sendo provisionado. Me chame em contato@sinapse.club que faço manualmente agora.",
    },
  };

  const msg = messages[state];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div
        className="w-full space-y-6 rounded-xl border border-border bg-card p-8 text-center"
        style={{ maxWidth: "min(28rem, 92vw)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/sinapse.svg" alt="sinapse" className="mx-auto h-7 w-auto" />
        <h1 className="font-display text-[clamp(2rem,4vw,2.5rem)] font-light leading-[1] tracking-[-0.025em]">
          {msg.title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{msg.body}</p>
        <Link
          href="/forum"
          className="inline-flex h-10 items-center rounded-none bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Voltar pro fórum
        </Link>
      </div>
    </div>
  );
}
