import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // In production, verify with: stripe.webhooks.constructEvent(body, signature, webhookSecret)
  // For now, parse directly (setup Stripe SDK when keys are configured)
  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        const courseId = session.metadata?.course_id;

        if (plan && userId) {
          // Subscription purchase
          await supabaseAdmin.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan,
            status: "active",
            current_period_start: new Date().toISOString(),
          }, { onConflict: "user_id" } as any);

          // Update user role
          await supabaseAdmin
            .from("profiles")
            .update({ role: plan })
            .eq("id", userId);
        }

        if (courseId && userId) {
          // Course purchase
          await supabaseAdmin.from("enrollments").insert({
            user_id: userId,
            course_id: courseId,
            stripe_payment_id: session.payment_intent,
            status: "active",
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subId = invoice.subscription;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: new Date(invoice.period_start * 1000).toISOString(),
            current_period_end: new Date(invoice.period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", invoice.subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const { data: subscription } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", sub.id)
          .single();

        if (subscription) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "canceled",
              canceled_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", sub.id);

          // Downgrade to free
          await supabaseAdmin
            .from("profiles")
            .update({ role: "free" })
            .eq("id", subscription.user_id);
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
