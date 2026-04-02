import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Helpers ───

async function findUserByEmail(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string
) {
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  return users?.users?.find((u) => u.email === email) ?? null;
}

function log(level: "info" | "warn" | "error", message: string, data?: unknown) {
  const prefix = `[AbacatePay Webhook] [${level.toUpperCase()}]`;
  if (data) {
    console[level](`${prefix} ${message}`, JSON.stringify(data));
  } else {
    console[level](`${prefix} ${message}`);
  }
}

// ─── Route handler ───

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    log("error", "Failed to parse request body");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { event, data } = body;

  log("info", `Received event: ${event}`, {
    billingId: data?.id,
    externalId: data?.products?.[0]?.externalId,
  });

  try {
    switch (event) {
      case "billing.paid":
      case "billing.completed": {
        const billing = data;
        const externalId = billing?.products?.[0]?.externalId;
        const customerEmail = billing?.customer?.metadata?.email;

        if (!externalId || !customerEmail) {
          log("warn", "Missing externalId or customerEmail", { externalId, customerEmail });
          break;
        }

        const user = await findUserByEmail(supabaseAdmin, customerEmail);
        if (!user) {
          log("warn", `User not found for email: ${customerEmail}`);
          break;
        }

        if (externalId.startsWith("PLAN-")) {
          // ─── Subscription payment ───
          const plan = externalId.replace("PLAN-", "").toLowerCase();
          const billingId = billing.id || billing.billingId;

          // Idempotency check: skip if already active with same billing ID
          const { data: existingSub } = await (supabaseAdmin as any)
            .from("subscriptions")
            .select("id, status, stripe_subscription_id")
            .eq("user_id", user.id)
            .single();

          if (
            existingSub &&
            existingSub.status === "active" &&
            existingSub.stripe_subscription_id === billingId
          ) {
            log("info", `Idempotent skip: subscription already active for user ${user.id}, billing ${billingId}`);
            break;
          }

          log("info", `Activating plan '${plan}' for user ${user.id}`);

          await (supabaseAdmin as any)
            .from("subscriptions")
            .upsert(
              {
                user_id: user.id,
                stripe_customer_id: billing.customer?.id || "",
                stripe_subscription_id: billingId,
                plan,
                status: "active",
                current_period_start: new Date().toISOString(),
                canceled_at: null,
              } as any,
              { onConflict: "user_id" } as any
            );

          await supabaseAdmin
            .from("profiles")
            .update({ role: plan })
            .eq("id", user.id);

          log("info", `Plan '${plan}' activated for user ${user.id}`);
        } else if (externalId.startsWith("COURSE-")) {
          // ─── Course purchase ───
          const courseId = externalId.replace("COURSE-", "");

          // Idempotency check: skip if enrollment already exists
          const { data: existingEnrollment } = await (supabaseAdmin as any)
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();

          if (existingEnrollment) {
            log("info", `Idempotent skip: enrollment already exists for user ${user.id}, course ${courseId}`);
            break;
          }

          log("info", `Enrolling user ${user.id} in course ${courseId}`);

          await supabaseAdmin.from("enrollments").insert({
            user_id: user.id,
            course_id: courseId,
            stripe_payment_id: billing.id || billing.billingId,
            status: "active",
          });

          log("info", `User ${user.id} enrolled in course ${courseId}`);
        }
        break;
      }

      case "billing.expired":
      case "billing.cancelled": {
        const billing = data;
        const customerEmail = billing?.customer?.metadata?.email;
        const billingId = billing?.id || billing?.billingId;

        if (!customerEmail && !billingId) {
          log("warn", "Cancellation event missing both email and billingId");
          break;
        }

        let userId: string | null = null;

        // Try to find user by billing ID in subscriptions first
        if (billingId) {
          const { data: sub } = await (supabaseAdmin as any)
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", billingId)
            .single();

          if (sub) {
            userId = sub.user_id;
          }
        }

        // Fall back to email lookup
        if (!userId && customerEmail) {
          const user = await findUserByEmail(supabaseAdmin, customerEmail);
          if (user) {
            userId = user.id;
          }
        }

        if (!userId) {
          log("warn", `Could not find user for cancellation event`, {
            billingId,
            customerEmail,
          });
          break;
        }

        log("info", `Processing cancellation for user ${userId} (event: ${event})`);

        // Update subscription status — do NOT touch enrollments
        await (supabaseAdmin as any)
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        // Downgrade role to free
        await supabaseAdmin
          .from("profiles")
          .update({ role: "free" })
          .eq("id", userId);

        log("info", `User ${userId} downgraded to free (enrollments preserved)`);
        break;
      }

      default:
        log("info", `Unhandled event type: ${event}`);
    }
  } catch (err) {
    log("error", "Webhook handler failed", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
