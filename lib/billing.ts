import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { PaidPlan, planFromPriceId } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

function subscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0] as Stripe.SubscriptionItem & {
    current_period_end?: number;
  };
  return item.current_period_end ? new Date(item.current_period_end * 1000) : null;
}

function paidPlanFromSubscription(
  subscription: Stripe.Subscription,
  fallbackPlan?: string | null
): "FREE" | PaidPlan {
  const pricePlan = planFromPriceId(subscription.items.data[0]?.price.id);
  if (pricePlan !== "FREE") return pricePlan;
  if (fallbackPlan === "GO" || fallbackPlan === "PLUS") return fallbackPlan;
  return "FREE";
}

export async function syncSubscription(
  subscription: Stripe.Subscription,
  options: {
    userId?: string | null;
    fallbackPlan?: string | null;
  } = {}
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const active = ["active", "trialing", "past_due"].includes(subscription.status);
  const plan = active
    ? paidPlanFromSubscription(subscription, options.fallbackPlan)
    : "FREE";

  const where = options.userId
    ? { id: options.userId }
    : { stripeCustomerId: customerId };

  return prisma.user.updateMany({
    where,
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscriptionPeriodEnd(subscription),
      plan
    }
  });
}

export async function reconcileCheckoutSession(checkoutSessionId: string, userId: string) {
  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
    expand: ["subscription"]
  });
  const checkoutUserId = checkout.metadata?.localityUserId || checkout.client_reference_id;

  if (checkoutUserId !== userId) {
    throw new Error("This checkout does not belong to the signed-in account.");
  }

  if (!checkout.subscription) {
    throw new Error("Stripe did not attach a subscription to this checkout.");
  }

  const subscription =
    typeof checkout.subscription === "string"
      ? await stripe.subscriptions.retrieve(checkout.subscription)
      : checkout.subscription;

  await syncSubscription(subscription, {
    userId,
    fallbackPlan: checkout.metadata?.localityPlan
  });
}
