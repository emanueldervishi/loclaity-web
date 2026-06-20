import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PaidPlan, priceIdForPlan } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  const form = await request.formData();
  const requestedPlan = String(form.get("plan") || "").toUpperCase();

  if (requestedPlan !== "GO" && requestedPlan !== "PLUS") {
    return NextResponse.redirect(new URL("/pricing?error=Invalid+plan", request.url), 303);
  }

  try {
    const stripe = getStripe();
    const plan = requestedPlan as PaidPlan;
    const priceId = priceIdForPlan(plan);

    if (!priceId) {
      throw new Error(`Stripe price for ${plan} is not configured.`);
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) throw new Error("User not found.");

    let customerId = user.stripeCustomerId;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

    if (
      customerId &&
      user.stripeSubscriptionId &&
      ["active", "trialing", "past_due"].includes(user.subscriptionStatus || "")
    ) {
      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`
      });
      return NextResponse.redirect(portal.url, 303);
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: { localityUserId: user.id }
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    const checkoutParams = {
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      branding_settings: {
        display_name: "Locality"
      },
      client_reference_id: user.id,
      metadata: {
        localityUserId: user.id,
        localityPlan: plan
      },
      subscription_data: {
        metadata: {
          localityUserId: user.id,
          localityPlan: plan
        }
      },
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`
    } satisfies Stripe.Checkout.SessionCreateParams & {
      branding_settings: { display_name: string };
    };

    const checkout = await stripe.checkout.sessions.create(checkoutParams);

    if (!checkout.url) throw new Error("Stripe did not return a checkout URL.");
    return NextResponse.redirect(checkout.url, 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent(message)}`, request.url),
      303
    );
  }
}
