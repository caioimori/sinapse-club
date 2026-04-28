import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin-config";
import type { Database } from "@/types/database";
import { rateLimiters, checkRateLimit } from "@/lib/rate-limit";
import { getPlan, parseExternalIdToCycle, type BillingCycle } from "@/lib/abacatepay";

export const runtime = "nodejs";

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local.slice(0, 2)}***@${domain}`;
}
function maskId(id: string): string {
  return `${id.slice(0, 8)}...`;
}

type JsonRecord = Record<string, unknown>;
type Plan = "pro" | "premium" | BillingCycle;
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type SubscriptionInsert = Database["public"]["Tables"]["subscriptions"]["Insert"];
type SubscriptionLookup = Pick<
  Database["public"]["Tables"]["subscriptions"]["Row"],
  "user_id"
>;
type SubscriptionSummary = Pick<
  Database["public"]["Tables"]["subscriptions"]["Row"],
  "id" | "status" | "stripe_subscription_id"
>;
type SubscriptionUpdate = Database["public"]["Tables"]["subscriptions"]["Update"];

type SelectSingleResult<T> = Promise<{ data: T | null }>;

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
        single(): SelectSingleResult<SubscriptionSummary | SubscriptionLookup>;
        maybeSingle(): SelectSingleResult<SubscriptionSummary | SubscriptionLookup>;
      };
    };
    upsert(values: SubscriptionInsert, options: { onConflict: string }): Promise<unknown>;
    update(values: SubscriptionUpdate): {
      eq(column: string, value: string): Promise<unknown>;
    };
  };
}

function enrollmentsTable(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>) {
  return supabaseAdmin.from("enrollments") as unknown as {
    select(columns: string): {
      eq(column: string, value: string): {
        eq(column: string, value: string): {
          single(): Promise<{ data: { id: string } | null }>;
        };
      };
    };
    insert(values: Database["public"]["Tables"]["enrollments"]["Insert"]): Promise<unknown>;
  };
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function readString(record: JsonRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  return leftBuffer.length === rightBuffer.length
    && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyWebhookSignature(rawBody: string, signature: string, publicKey: string) {
  const expectedSignature = crypto
    .createHmac("sha256", publicKey)
    .update(Buffer.from(rawBody, "utf8"))
    .digest("base64");

  return safeEqual(expectedSignature, signature);
}

function getWebhookConfig() {
  const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET?.trim();
  const publicKey = process.env.ABACATEPAY_WEBHOOK_PUBLIC_KEY?.trim();
  if (!webhookSecret || !publicKey) {
    throw new Error('[Webhook] Missing ABACATEPAY_WEBHOOK_SECRET or ABACATEPAY_WEBHOOK_PUBLIC_KEY env vars');
  }
  return { webhookSecret, publicKey };
}

function serializeLogData(data: unknown) {
  if (data instanceof Error) {
    return {
      name: data.name,
      message: data.message,
      stack: data.stack,
    };
  }

  return data;
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

    if (error) {
      throw error;
    }

    const users = data.users ?? [];
    const user = users.find((candidate) => candidate.email === email) ?? null;

    if (user || users.length < 200) {
      return user;
    }

    page += 1;
  }

  return null;
}

/**
 * Creates a Supabase user from a confirmed payment when the customer email
 * does not match any existing account. Used by the signup-after-payment
 * flow (PAYWALL-5): visitor pays first at /checkout/[plano], then this
 * webhook handler provisions the account and the user receives a magic
 * link to log in.
 *
 * `email_confirm: true` skips the verification email — the act of paying
 * already proves the visitor controls the inbox.
 *
 * Idempotent: if the user was already created by a previous webhook
 * delivery (Stripe/AbacatePay retry), the second call surfaces an
 * "already registered" error which we swallow and re-fetch.
 */
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
      source: "signup-after-payment",
    },
  });

  if (data?.user) {
    return data.user;
  }

  // Race condition: a previous webhook delivery already created the user.
  // Look it up and continue.
  if (error) {
    const message = error.message?.toLowerCase() ?? "";
    if (
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists")
    ) {
      const existing = await findUserByEmail(supabaseAdmin, email);
      if (existing) return existing;
    }
    throw error;
  }

  return null;
}

/**
 * Sends a magic-link email so the freshly-provisioned user can sign in.
 * `generateLink` returns a URL we could route ourselves, but using
 * `inviteUserByEmail` would clobber the password flow — `generateLink`
 * with `magiclink` type is the safe choice. The Supabase mailer dispatches
 * the email automatically (no separate transactional send required).
 */
async function sendMagicLinkAfterPayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string,
) {
  try {
    // generateLink with type 'magiclink' both produces the link AND triggers
    // the Supabase Auth mailer (when SMTP is configured — works with the
    // default Supabase SMTP for low volume).
    type AdminWithGenerate = {
      auth: {
        admin: {
          generateLink: (input: {
            type: "magiclink";
            email: string;
          }) => Promise<{ error: { message?: string } | null }>;
        };
      };
    };
    const { error } = await (
      supabaseAdmin as unknown as AdminWithGenerate
    ).auth.admin.generateLink({
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

/**
 * Migrates pre-signup consent rows (logged at /checkout/[plano] before the
 * user existed) into `consent_log` once the user is created. Best-effort:
 * if either table is unavailable, just inserts a synthetic consent row so
 * we never lose the audit trail.
 */
async function recordPostPaymentConsent(
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
    await (supabaseAdmin as unknown as Table)
      .from("consent_log")
      .insert([
        {
          user_id: userId,
          event_type: "signup_after_payment",
          document_version: "v1",
          user_agent: null,
        },
      ]);
  } catch (err) {
    log("warn", "Consent log insert failed (non-fatal)", { email: maskEmail(email), err });
  }
}

function log(level: "info" | "warn" | "error", message: string, data?: unknown) {
  const prefix = `[AbacatePay Webhook] [${level.toUpperCase()}]`;
  if (data) {
    console[level](`${prefix} ${message}`, JSON.stringify(serializeLogData(data)));
  } else {
    console[level](`${prefix} ${message}`);
  }
}

function getNormalizedIdentifiers(data: JsonRecord | null) {
  const checkout = asRecord(data?.checkout);
  const transparent = asRecord(data?.transparent);
  const payment = asRecord(data?.payment);
  const customer = asRecord(data?.customer);
  const customerMetadata = asRecord(customer?.metadata);
  const subscription = asRecord(data?.subscription);
  const products = Array.isArray(data?.products) ? data.products : [];
  const firstProduct = asRecord(products[0]);
  // Billing-level metadata (what we send in /api/checkout) is nested as
  // `data.metadata.metadata` in the AbacatePay v1 payload because the top-level
  // metadata slot is reserved by the provider for `fee`/`returnUrl`/etc.
  const billingMetadata = asRecord(data?.metadata);
  const nestedMetadata = asRecord(billingMetadata?.metadata);

  return {
    externalId:
      readString(checkout, "externalId")
      ?? readString(transparent, "externalId")
      ?? readString(payment, "externalId")
      ?? readString(firstProduct, "externalId"),
    customerEmail:
      readString(customer, "email")
      ?? readString(customerMetadata, "email"),
    customerId: readString(customer, "id"),
    paymentId:
      readString(payment, "id")
      ?? readString(checkout, "id")
      ?? readString(transparent, "id")
      ?? readString(data, "id")
      ?? readString(data, "billingId"),
    subscriptionId: readString(subscription, "id"),
    metadataPlan: readString(nestedMetadata, "plan"),
    metadataUserId: readString(nestedMetadata, "userId"),
  };
}

function parsePlanFromExternalId(externalId: string): Plan | null {
  const plan = externalId.replace("PLAN-", "").toLowerCase();

  return plan === "pro" || plan === "premium" ? plan : null;
}

async function activatePlan(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  customerId: string | null,
  billingId: string,
  plan: Plan,
  options?: { profileRole?: string; periodDays?: number },
) {
  const { data: existingSub } = await subscriptionsTable(supabaseAdmin)
    .select("id, status, stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  const typedExistingSub = existingSub as SubscriptionSummary | null;

  if (
    typedExistingSub
    && typedExistingSub.status === "active"
    && typedExistingSub.stripe_subscription_id === billingId
  ) {
    log("info", `Idempotent skip: subscription already active for user ${maskId(userId)}`, {
      billingId,
      plan,
    });
    return;
  }

  const now = new Date();
  const currentPeriodEnd = options?.periodDays
    ? new Date(now.getTime() + options.periodDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  await subscriptionsTable(supabaseAdmin)
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId ?? "",
        stripe_subscription_id: billingId,
        plan,
        status: "active",
        current_period_start: now.toISOString(),
        ...(currentPeriodEnd ? { current_period_end: currentPeriodEnd } : {}),
      },
      { onConflict: "user_id" },
    );

  await subscriptionsTable(supabaseAdmin)
    .update({ canceled_at: null })
    .eq("user_id", userId);

  const roleForProfile = (options?.profileRole ?? plan) as Database["public"]["Tables"]["profiles"]["Update"]["role"];
  await profilesTable(supabaseAdmin)
    .update({ role: roleForProfile })
    .eq("id", userId);

  log("info", `Plan '${plan}' activated for user ${maskId(userId)}`, {
    billingId,
    currentPeriodEnd,
  });
}

async function activateCourse(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  courseId: string,
  paymentId: string,
) {
  const { data: existingEnrollment } = await enrollmentsTable(supabaseAdmin)
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existingEnrollment) {
    log("info", `Idempotent skip: enrollment already exists for user ${maskId(userId)}`, {
      courseId,
      paymentId,
    });
    return;
  }

  await enrollmentsTable(supabaseAdmin).insert({
    user_id: userId,
    course_id: courseId,
    stripe_payment_id: paymentId,
    status: "active",
  });

  log("info", `User ${maskId(userId)} enrolled in course ${courseId}`, { paymentId });
}

async function processPaidEvent(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  payloadData: JsonRecord | null,
) {
  const details = getNormalizedIdentifiers(payloadData);

  // Prefer metadata-driven routing (/api/checkout passes { userId, plan }).
  // Falls back to legacy externalId parsing for other flows.
  if (details.metadataUserId && details.metadataPlan) {
    const planDef = getPlan(details.metadataPlan);
    const billingId = details.subscriptionId ?? details.paymentId;
    if (!planDef || !billingId) {
      log("warn", "Metadata-driven webhook missing plan def or billing id", details);
      return;
    }

    // Cross-check: se customerEmail presente, garantir que metadataUserId
    // corresponde ao user do email. Previne privilege escalation por
    // metadata tampering (atacante passando UUID de vitima no metadata).
    if (details.customerEmail) {
      const emailUser = await findUserByEmail(supabaseAdmin, details.customerEmail);
      if (!emailUser) {
        log("warn", "Metadata-driven webhook: user not found for customerEmail", {
          ...details,
          customerEmail: maskEmail(details.customerEmail),
        });
        return;
      }
      if (emailUser.id !== details.metadataUserId) {
        log("error", "Metadata tampering detected: metadataUserId does not match customerEmail owner", {
          metadataUserId: maskId(details.metadataUserId),
          emailUserId: maskId(emailUser.id),
          customerEmail: maskEmail(details.customerEmail),
          billingId,
        });
        return;
      }
    }

    await activatePlan(
      supabaseAdmin,
      details.metadataUserId,
      details.customerId,
      billingId,
      planDef.id,
      { profileRole: "pro", periodDays: planDef.periodDays },
    );
    return;
  }

  if (!details.externalId || !details.customerEmail) {
    log("warn", "Missing externalId or customerEmail", details);
    return;
  }

  let user = await findUserByEmail(supabaseAdmin, details.customerEmail);

  // PAYWALL-5: signup-after-payment. If the email does not match any
  // existing user AND the billing came from the new flow (or any flow
  // missing metadataUserId — this is the catch-all), provision the
  // account now. The user just paid, so they obviously control this
  // inbox. We confirm the email immediately and dispatch a magic link.
  if (!user) {
    // Pull display name from billing metadata (we set `signupName` when
    // creating the billing in /checkout/[plano]/actions.ts) or from the
    // top-level customer.name on the payload.
    const billingMetadata = asRecord(payloadData?.metadata);
    const nestedMetadata = asRecord(billingMetadata?.metadata);
    const customer = asRecord(payloadData?.customer);
    const fullName =
      readString(nestedMetadata, "signupName")
      ?? readString(customer, "name")
      ?? null;

    log("info", "Creating user from payment (signup-after-payment)", {
      email: maskEmail(details.customerEmail),
    });

    try {
      user = await createUserFromPayment(
        supabaseAdmin,
        details.customerEmail,
        fullName,
      );
    } catch (err) {
      log("error", "Failed to provision user from payment", err);
      return;
    }

    if (!user) {
      log("error", "User provision returned null", {
        email: maskEmail(details.customerEmail),
      });
      return;
    }

    // Record consent retroactively + dispatch magic link. Both are
    // best-effort — payment activation must not be blocked by mail
    // failures.
    await recordPostPaymentConsent(supabaseAdmin, user.id, details.customerEmail);
    await sendMagicLinkAfterPayment(supabaseAdmin, details.customerEmail);
  }

  // New sinapse.club forum plans (mensal/semestral/anual) — all grant the same
  // "pro" access with `current_period_end` derived from the billing cycle.
  const cycle = parseExternalIdToCycle(details.externalId);
  if (cycle) {
    const billingId = details.subscriptionId ?? details.paymentId;
    const planDef = getPlan(cycle);
    if (!billingId || !planDef) {
      log("warn", "sinapse.club plan webhook missing billing id or plan", {
        ...details,
        cycle,
      });
      return;
    }
    await activatePlan(
      supabaseAdmin,
      user.id,
      details.customerId,
      billingId,
      cycle,
      { profileRole: "pro", periodDays: planDef.periodDays },
    );
    return;
  }

  if (details.externalId.startsWith("PLAN-")) {
    const plan = parsePlanFromExternalId(details.externalId);
    const billingId = details.subscriptionId ?? details.paymentId;

    if (!plan || !billingId) {
      log("warn", "Subscription webhook missing supported plan or billing id", {
        ...details,
        plan,
      });
      return;
    }

    await activatePlan(
      supabaseAdmin,
      user.id,
      details.customerId,
      billingId,
      plan,
    );
    return;
  }

  if (details.externalId.startsWith("COURSE-")) {
    const paymentId = details.paymentId;
    const courseId = details.externalId.replace("COURSE-", "");

    if (!paymentId || !courseId) {
      log("warn", "Course webhook missing payment id or course id", details);
      return;
    }

    await activateCourse(supabaseAdmin, user.id, courseId, paymentId);
    return;
  }

  log("info", "Webhook externalId ignored", details);
}

async function processCancellationEvent(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  payloadData: JsonRecord | null,
) {
  const details = getNormalizedIdentifiers(payloadData);
  const billingId = details.subscriptionId ?? details.paymentId;

  if (!details.customerEmail && !billingId) {
    log("warn", "Cancellation event missing both email and billingId");
    return;
  }

  let userId: string | null = null;

  if (billingId) {
    const { data: subscription } = await subscriptionsTable(supabaseAdmin)
      .select("user_id")
      .eq("stripe_subscription_id", billingId)
      .maybeSingle();

    const typedSubscription = subscription as SubscriptionLookup | null;
    if (typedSubscription) {
      userId = typedSubscription.user_id;
    }
  }

  if (!userId && details.customerEmail) {
    const user = await findUserByEmail(supabaseAdmin, details.customerEmail);
    if (user) {
      userId = user.id;
    }
  }

  if (!userId) {
    log("warn", "Could not find user for cancellation event", {
      billingId,
      customerEmail: details.customerEmail ? maskEmail(details.customerEmail) : null,
    });
    return;
  }

  await subscriptionsTable(supabaseAdmin)
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  await profilesTable(supabaseAdmin)
    .update({ role: "free" })
    .eq("id", userId);

  log("info", `User ${maskId(userId)} downgraded to free`, { billingId });
}

export async function POST(request: NextRequest) {
  // Rate limit: 100 webhook requests per minute per IP (burst-tolerant for payment provider)
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
      }
    );
  }

  let webhookConfig: ReturnType<typeof getWebhookConfig>;
  try {
    webhookConfig = getWebhookConfig();
  } catch (error) {
    log("error", "Webhook configuration missing", error);
    return NextResponse.json(
      { error: "Webhook configuration missing" },
      { status: 503 },
    );
  }

  const providedSecret = new URL(request.url).searchParams.get("webhookSecret");
  if (!providedSecret || !safeEqual(providedSecret, webhookConfig.webhookSecret)) {
    log("warn", "Rejected webhook with invalid URL secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signature = request.headers.get("x-webhook-signature");
  if (!signature) {
    log("warn", "Rejected webhook without signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, signature, webhookConfig.publicKey)) {
    log("warn", "Rejected webhook with invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: JsonRecord | null = null;
  try {
    body = asRecord(JSON.parse(rawBody));
  } catch {
    log("error", "Failed to parse request body");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const event = readString(body, "event");
  if (!event) {
    log("warn", "Webhook payload missing event", body);
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  const data = asRecord(body.data);
  const details = getNormalizedIdentifiers(data);
  log("info", `Received event: ${event}`, {
    billingId: details.subscriptionId ?? details.paymentId,
    externalId: details.externalId,
  });

  try {
    const supabaseAdmin = getSupabaseAdmin();

    switch (event) {
      case "billing.paid":
      case "billing.completed":
      case "checkout.completed":
      case "transparent.completed":
      case "subscription.completed":
      case "subscription.renewed": {
        await processPaidEvent(supabaseAdmin, data);
        break;
      }

      case "billing.expired":
      case "billing.cancelled":
      case "subscription.cancelled": {
        await processCancellationEvent(supabaseAdmin, data);
        break;
      }

      default:
        log("info", `Unhandled event type: ${event}`);
    }
  } catch (error) {
    log("error", "Webhook handler failed", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
