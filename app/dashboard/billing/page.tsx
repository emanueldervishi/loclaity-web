import { CheckCircle2, CreditCard, ReceiptText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireDashboardSetup } from "@/lib/dashboard-setup";
import { plans } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Billing",
};

export default async function DashboardBillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  await requireDashboardSetup(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  const plan = plans[user.plan];
  const status = user.subscriptionStatus || (user.plan === "FREE" ? "No subscription" : "Processing");

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <Badge className="h-6 rounded-full px-2.5" variant="outline">
          Subscription
        </Badge>
        <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">Billing and plan.</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Review your current plan, renewal state, and subscription actions.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>Your workspace tier and monthly rate.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-medium tracking-tight">{plan.name}</div>
            <p className="mt-2 text-sm text-muted-foreground">${plan.price} per month</p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Subscription status</CardTitle>
            <CardDescription>Billing state as reported for this account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium tracking-tight">{status}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Renewal date: {user.currentPeriodEnd?.toLocaleDateString() || "Not scheduled"}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Portal access</CardTitle>
            <CardDescription>Stripe handles invoices, payment methods, and subscription changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Use the billing portal for payment changes. Use pricing when you need to compare plans.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card className="rounded-[1.5rem]">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{plan.name} plan</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <Badge variant="secondary">Current</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-medium tracking-tight">${plan.price}</span>
              <span className="pb-1 text-sm text-muted-foreground">per month</span>
            </div>

            <div className="rounded-[1.15rem] border">
              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium">{status}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-muted-foreground">Renews</span>
                <span className="text-sm font-medium">
                  {user.currentPeriodEnd?.toLocaleDateString() || "Not scheduled"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {user.stripeCustomerId ? (
              <form action="/api/stripe/portal" method="POST">
                <Button type="submit">
                  <ReceiptText data-icon="inline-start" />
                  Manage billing
                </Button>
              </form>
            ) : (
              <Button render={<Link href="/pricing" />}>
                <ReceiptText data-icon="inline-start" />
                Compare plans
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Included features</CardTitle>
            <CardDescription>What your workspace can use right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {plan.features.map((feature) => (
                <div className="flex items-center gap-3 rounded-[1rem] border bg-muted/20 p-3" key={feature}>
                  <CheckCircle2 className="size-4 text-muted-foreground" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button render={<Link href="/pricing" />} variant="secondary">
              See all plans
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Card className="rounded-[1.5rem]" size="sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
              <CreditCard className="size-4" />
            </div>
            <div>
              <CardTitle>Billing portal</CardTitle>
              <CardDescription>
                Stripe handles invoices, payment methods, subscription changes, and cancellation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
