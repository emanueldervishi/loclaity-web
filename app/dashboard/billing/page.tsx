import { ArrowUpRight, CheckCircle2, Clock3, CreditCard, ReceiptText, ShieldCheck } from "lucide-react";
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
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Billing",
  description:
    "View your Locality plan, subscription status, and Stripe billing controls for local-first project memory.",
  path: "/dashboard/billing",
  noIndex: true,
});

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
  const renewal = user.currentPeriodEnd?.toLocaleDateString() || "Not scheduled";

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5">
      <section className="grid items-stretch gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="overflow-hidden rounded-[1.75rem] border bg-[#07090c] p-2 text-white shadow-[0_30px_80px_rgba(2,6,23,0.18)]">
          <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-white/10 bg-[radial-gradient(circle_at_16%_0%,rgba(20,184,166,0.2),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(59,130,246,0.22),transparent_34%),linear-gradient(135deg,#10151d,#050607_68%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:p-8">
            <div>
              <Badge className="border-white/10 bg-white/10 text-white" variant="outline">
                Billing
              </Badge>
              <h1 className="mt-5 max-w-2xl text-4xl font-medium leading-[0.95] tracking-[-0.055em] md:text-6xl">
                Plan and payment controls.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/62 md:text-base">
                Keep your subscription state, renewal date, and billing actions in one place.
              </p>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {[
                { label: "Plan", value: plan.name, detail: `$${plan.price}/month`, icon: CreditCard },
                { label: "Status", value: status, detail: "Stripe source", icon: ShieldCheck },
                { label: "Renews", value: renewal, detail: "current period", icon: Clock3 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4" key={item.label}>
                    <div className="mb-6 flex items-center justify-between text-white/55">
                      <span className="text-xs">{item.label}</span>
                      <Icon className="size-4" />
                    </div>
                    <div className="truncate text-lg font-medium tracking-tight">{item.value}</div>
                    <div className="mt-1 truncate text-xs text-white/48">{item.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Card className="flex h-full rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{plan.name} plan</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <Badge variant="secondary">Current</Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-6">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-medium tracking-[-0.055em]">${plan.price}</span>
                <span className="pb-2 text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Renews: {renewal}</p>
            </div>

            <div className="rounded-[1.15rem] border bg-muted/20">
              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-muted-foreground">Subscription</span>
                <span className="text-sm font-medium">{status}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-muted-foreground">Billing source</span>
                <span className="text-sm font-medium">{user.stripeCustomerId ? "Stripe portal" : "Pricing checkout"}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
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
            <Button render={<Link href="/dashboard" />} variant="secondary">
              Overview
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Included right now</CardTitle>
            <CardDescription>Features available on your current workspace plan.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {plan.features.map((feature) => (
              <div className="flex items-center gap-3 rounded-[1rem] border bg-muted/20 p-3" key={feature}>
                <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <CreditCard className="size-4" />
            </div>
            <CardTitle>Invoices and payment methods</CardTitle>
            <CardDescription>
              Stripe handles invoices, card changes, subscription updates, and cancellation.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" render={<Link href="/pricing" />} variant="secondary">
              See all plans
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
