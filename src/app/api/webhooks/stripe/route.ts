import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { getStripe, getPlanCycleFromPriceId } from "@/lib/stripe";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin-config";
import type { Database } from "@/types/database";
import { rateLimiters, checkRateLimit } from "@/lib/rate-limit";
import { getPlan, type BillingCycle } from "@/lib/plans";

export const runtime = "nodejs";

// Stripe webhook signature verification requires the raw body — Next 16
// App Router gives us request.text() which preserves it.

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

function maskId(id: string): string {
  return `${id.slice(0, 12)}...`;
}

function log(level: "info" | "warn" | "error", message: string, data?: unknown) {
  const prefix = `[Stripe Webhook] [${level.toUpperCase()}]`;
  const payload = data instanceof Error
    ? { name: data.name, message: data.message, stack: data.stack }
    : data;
  if (payload !== undefined) {
    console[level](`${prefix} ${message}`, JSON.stringify(payload));
  } else {
    console[level](`${prefix} ${message}`);
  }
}

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"];
type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"];

function getSupabaseAdmin() {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  return createClient<Database>(url, serviceRoleKey);
}

function profilesTable(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>) {
  return supabaseAdmin.from("profiles") as unknown as {
    update(values: ProfileUpdate): {
      eq(column: string, value: string): Promise<unknown>;
    };
  };
}

function subscriptionsTable(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>) {
  return supabaseAdmin.from("subscriptions") as unknown as {
    select(columns: string): {
      eq(column: string, value: string): {
        maybeSingle(): Promise<{ data: { user_id: string } | null }>;
      };
    };
    upsert(values: SubscriptionInsert, options: { onConflict: string }): Promise<{ error: unknown }>;
    update(values: SubscriptionUpdate): {
      eq(column: string, value: string): Promise<unknown>;
    };
  };
}

async function findUserByEmail(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string,
) {
  let page = 1;
  while (page <= 10) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const users = data.users ?? [];
    const user = users.find((c) => c.email === email) ?? null;
    if (user || users.length < 200) return user;
    page += 1;
  }
  return null;
}

async function createUserFromPayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string,
  fullName: string | null,
) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name: fullName ?? undefined,
      preferred_username: fullName ?? undefined,
      source: "signup-after-payment-stripe",
    },
  });
  if (data?.user) return data.user;
  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return await findUserByEmail(supabaseAdmin, email);
    }
    throw error;
  }
  return null;
}

async function sendMagicLinkAfterPayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string,
) {
  try {
    type AdminWithGenerate = {
      auth: {
        admin: {
          generateLink: (input: { type: "magiclink"; email: string }) => Promise<{
            error: { message?: string } | null;
          }>;
        };
      };
    };
    const { error } = await (supabaseAdmin as unknown as AdminWithGenerate).auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (error) {
      log("warn", "Magic link send failed (non-fatal)", { email: maskEmail(email), error: error.message });
    }
  } catch (err) {
    log("warn", "Magic link send threw (non-fatal)", err);
  }
}

async function recordConsentAfterPayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  email: string,
) {
  try {
    type Table = {
      from: (t: string) => {
        insert: (rows: Record<string, unknown>[]) => Promise<{ error: unknown }>;
      };
    };
    await (supabaseAdmin as unknown as Table).from("consent_log").insert([
      {
        user_id: userId,
        event_type: "signup_after_payment_stripe",
        document_version: "v1",
        user_agent: null,
      },
    ]);
  } catch (err) {
    log("warn", "Consent log insert failed (non-fatal)", { email: maskEmail(email), err });
  }
}

async function activatePlan(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  customerId: string,
  subscriptionId: string,
  cycle: BillingCycle,
  currentPeriodEndIso: string | null,
) {
  const planDef = getPlan(cycle);
  if (!planDef) {
    log("warn", "Unknown plan cycle", { cycle });
    return;
  }

  const now = new Date();
  const computedEnd = currentPeriodEndIso
    ?? new Date(now.getTime() + planDef.periodDays * 24 * 60 * 60 * 1000).toISOString();

  const { error: upsertError } = await subscriptionsTable(supabaseAdmin).upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan: cycle,
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: computedEnd,
    },
    { onConflict: "user_id" },
  );
  if (upsertError) {
    log("error", "subscriptions upsert failed", upsertError);
    throw new Error("subscriptions upsert failed");
  }

  await subscriptionsTable(supabaseAdmin)
    .update({ canceled_at: null })
    .eq("user_id", userId);

  await profilesTable(supabaseAdmin)
    .update({ role: "pro" as Database["public"]["Tables"]["profiles"]["Update"]["role"] })
    .eq("id", userId);

  log("info", `Plan '${cycle}' activated for user ${maskId(userId)}`, {
    subscriptionId,
    currentPeriodEnd: computedEnd,
  });
}

/**
 * Extrai cycle/customerEmail/subscriptionId/customerId/currentPeriodEnd
 * de varios shapes de evento Stripe (subscription.* e invoice.*).
 */
async function extractEventDetails(
  stripe: Stripe,
  event: Stripe.Event,
): Promise<{
  customerEmail: string | null;
  customerName: string | null;
  customerId: string;
  subscriptionId: string;
  cycle: BillingCycle | null;
  currentPeriodEndIso: string | null;
  metadataUserId: string | null;
} | null> {
  let subscription: Stripe.Subscription | null = null;
  let customerId: string | null = null;

  if (event.type.startsWith("customer.subscription.")) {
    subscription = event.data.object as Stripe.Subscription;
    customerId = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  } else if (event.type.startsWith("invoice.")) {
    const invoice = event.data.object as Stripe.Invoice;
    customerId = typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id ?? null;
    // API 2026-04-22 (dahlia): subscription nao mora mais em invoice.subscription —
    // foi pra invoice.parent.subscription_details.subscription.
    const subRef = invoice.parent?.subscription_details?.subscription ?? null;
    const subId = typeof subRef === "string" ? subRef : subRef?.id ?? null;
    if (subId) {
      subscription = await stripe.subscriptions.retrieve(subId);
    }
  }

  if (!subscription || !customerId) {
    return null;
  }

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    log("warn", "Customer is deleted", { customerId });
    return null;
  }

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const cycle = priceId ? getPlanCycleFromPriceId(priceId) : null;

  // current_period_end pode estar no shape antigo ou no items.data[0]
  const periodEndUnix =
    (subscription as unknown as { current_period_end?: number }).current_period_end
    ?? subscription.items.data[0]?.current_period_end
    ?? null;
  const currentPeriodEndIso = periodEndUnix
    ? new Date(periodEndUnix * 1000).toISOString()
    : null;

  return {
    customerEmail: customer.email ?? null,
    customerName: customer.name ?? null,
    customerId,
    subscriptionId: subscription.id,
    cycle,
    currentPeriodEndIso,
    metadataUserId:
      (subscription.metadata?.userId as string | undefined)
      ?? (customer.metadata?.userId as string | undefined)
      ?? null,
  };
}

async function handleSubscriptionActive(
  stripe: Stripe,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  event: Stripe.Event,
) {
  const details = await extractEventDetails(stripe, event);
  if (!details) {
    log("warn", "Could not extract details from event", { type: event.type, id: event.id });
    return;
  }

  if (!details.cycle) {
    log("warn", "Could not map priceId to plan cycle", { subscriptionId: details.subscriptionId });
    return;
  }

  // Resolve user: priorizar metadataUserId (logged-in checkout), fallback
  // pra email (signup-after-payment).
  let userId = details.metadataUserId;
  if (!userId) {
    if (!details.customerEmail) {
      log("warn", "No metadataUserId and no customerEmail", { subscriptionId: details.subscriptionId });
      return;
    }
    let user = await findUserByEmail(supabaseAdmin, details.customerEmail);
    if (!user) {
      log("info", "Creating user from payment (signup-after-payment-stripe)", {
        email: maskEmail(details.customerEmail),
      });
      user = await createUserFromPayment(supabaseAdmin, details.customerEmail, details.customerName);
      if (!user) {
        log("error", "User provision returned null", { email: maskEmail(details.customerEmail) });
        return;
      }
      await recordConsentAfterPayment(supabaseAdmin, user.id, details.customerEmail);
      await sendMagicLinkAfterPayment(supabaseAdmin, details.customerEmail);
    }
    userId = user.id;
  } else if (details.customerEmail) {
    // Cross-check anti-tampering: metadataUserId deve pertencer ao
    // customerEmail. Stripe em geral nao expoe esse vetor (metadata e
    // server-set), mas e barato validar.
    const emailUser = await findUserByEmail(supabaseAdmin, details.customerEmail);
    if (emailUser && emailUser.id !== userId) {
      log("error", "metadataUserId does not match customerEmail owner", {
        metadataUserId: maskId(userId),
        emailUserId: maskId(emailUser.id),
        customerEmail: maskEmail(details.customerEmail),
      });
      return;
    }
  }

  await activatePlan(
    supabaseAdmin,
    userId,
    details.customerId,
    details.subscriptionId,
    details.cycle,
    details.currentPeriodEndIso,
  );
}

async function handleSubscriptionCanceled(
  stripe: Stripe,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  event: Stripe.Event,
) {
  const details = await extractEventDetails(stripe, event);
  if (!details) return;

  // Lookup user_id pela subscription_id
  const { data: sub } = await subscriptionsTable(supabaseAdmin)
    .select("user_id")
    .eq("stripe_subscription_id", details.subscriptionId)
    .maybeSingle();

  let userId: string | null = sub?.user_id ?? null;
  if (!userId && details.customerEmail) {
    const user = await findUserByEmail(supabaseAdmin, details.customerEmail);
    userId = user?.id ?? null;
  }
  if (!userId) {
    log("warn", "Could not find user for canceled subscription", {
      subscriptionId: details.subscriptionId,
    });
    return;
  }

  await subscriptionsTable(supabaseAdmin)
    .update({ status: "canceled", canceled_at: new Date().toISOString() })
    .eq("user_id", userId);

  await profilesTable(supabaseAdmin)
    .update({ role: "free" as Database["public"]["Tables"]["profiles"]["Update"]["role"] })
    .eq("id", userId);

  log("info", `User ${maskId(userId)} downgraded to free (subscription canceled)`, {
    subscriptionId: details.subscriptionId,
  });
}

async function handlePaymentFailed(
  stripe: Stripe,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  event: Stripe.Event,
) {
  const details = await extractEventDetails(stripe, event);
  if (!details) return;

  const { data: sub } = await subscriptionsTable(supabaseAdmin)
    .select("user_id")
    .eq("stripe_subscription_id", details.subscriptionId)
    .maybeSingle();

  if (!sub?.user_id) {
    log("warn", "payment_failed for unknown subscription", { subscriptionId: details.subscriptionId });
    return;
  }

  await subscriptionsTable(supabaseAdmin)
    .update({ status: "past_due" })
    .eq("user_id", sub.user_id);

  log("info", `User ${maskId(sub.user_id)} marked past_due`, {
    subscriptionId: details.subscriptionId,
  });
}

export async function POST(request: NextRequest) {
  // Rate limit (mesmo limit do AbacatePay webhook).
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const rateLimitResult = await checkRateLimit(rateLimiters.webhook, ip);
  if (rateLimitResult && !rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.reset),
          "Retry-After": String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
        },
      },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    log("error", "STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    log("warn", "Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    log("warn", "Invalid signature", { message: msg });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  log("info", `Received event: ${event.type}`, { id: event.id });

  const supabaseAdmin = getSupabaseAdmin();

  // Idempotencia: insert antes de processar; UNIQUE conflict = replay.
  type WebhookEventInsert = {
    from: (t: "stripe_webhook_events") => {
      insert: (rows: Record<string, unknown>) => Promise<{ error: { code?: string; message?: string } | null }>;
    };
  };
  const { error: insertErr } = await (supabaseAdmin as unknown as WebhookEventInsert)
    .from("stripe_webhook_events")
    .insert({
      id: event.id,
      type: event.type,
      payload: event,
    });

  if (insertErr) {
    // Postgres UNIQUE violation = 23505. Se for outro erro, logar mas nao bloquear.
    if (insertErr.code === "23505") {
      log("info", `Idempotent skip: event ${event.id} already processed`);
      return NextResponse.json({ received: true, idempotent: true });
    }
    log("warn", "Failed to insert webhook event row (proceeding)", insertErr);
  }

  try {
    const stripe = getStripe();
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "invoice.payment_succeeded":
      case "invoice.paid":
        await handleSubscriptionActive(stripe, supabaseAdmin, event);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(stripe, supabaseAdmin, event);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(stripe, supabaseAdmin, event);
        break;

      default:
        log("info", `Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    log("error", "Handler threw", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
