import Stripe from "stripe";
import { NextResponse } from "next/server";
import { syncSubscription } from "@/lib/billing";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription, {
        userId: subscription.metadata.localityUserId,
        fallbackPlan: subscription.metadata.localityPlan
      });
    }

    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object as Stripe.Checkout.Session;
      const userId = checkout.metadata?.localityUserId || checkout.client_reference_id;
      if (userId && checkout.subscription) {
        const subscriptionId =
          typeof checkout.subscription === "string"
            ? checkout.subscription
            : checkout.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await syncSubscription(subscription, {
          userId,
          fallbackPlan: checkout.metadata?.localityPlan
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
