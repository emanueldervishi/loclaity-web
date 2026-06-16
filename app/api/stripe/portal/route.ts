import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.stripeCustomerId) {
      throw new Error("No Stripe customer exists for this account.");
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard`
    });

    return NextResponse.redirect(portal.url, 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to open billing.";
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent(message)}`, request.url),
      303
    );
  }
}
