import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabaseAdmin = getSupabaseAdmin();

  // AbacatePay webhook payload
  const { event, data } = body;

  try {
    switch (event) {
      case "billing.paid":
      case "billing.completed": {
        const billing = data;
        const externalId = billing?.products?.[0]?.externalId;
        const customerEmail = billing?.customer?.metadata?.email;

        if (!externalId || !customerEmail) break;

        // Find user by email
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const user = users?.users?.find((u) => u.email === customerEmail);
        if (!user) break;

        // Check if it's a subscription or course purchase
        if (externalId.startsWith("PLAN-")) {
          // Subscription: PLAN-pro or PLAN-premium
          const plan = externalId.replace("PLAN-", "").toLowerCase();

          await supabaseAdmin
            .from("subscriptions")
            .upsert({
              user_id: user.id,
              stripe_customer_id: billing.customer?.id || "",
              stripe_subscription_id: billing.id,
              plan,
              status: "active",
              current_period_start: new Date().toISOString(),
            } as any, { onConflict: "user_id" } as any);

          await supabaseAdmin
            .from("profiles")
            .update({ role: plan })
            .eq("id", user.id);

        } else if (externalId.startsWith("COURSE-")) {
          // Course purchase: COURSE-{courseId}
          const courseId = externalId.replace("COURSE-", "");

          await supabaseAdmin.from("enrollments").insert({
            user_id: user.id,
            course_id: courseId,
            stripe_payment_id: billing.id,
            status: "active",
          });
        }
        break;
      }

      case "billing.expired":
      case "billing.cancelled": {
        // Handle subscription cancellation if needed
        break;
      }
    }
  } catch (err) {
    console.error("AbacatePay webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
