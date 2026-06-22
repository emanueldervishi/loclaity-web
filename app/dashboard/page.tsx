import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  CreditCard,
  Database,
  HardDrive,
  KeyRound,
  MonitorDown,
  Terminal,
} from "lucide-react";
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
import { reconcileCheckoutSession } from "@/lib/billing";
import { requireDashboardSetup } from "@/lib/dashboard-setup";
import { plans } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dashboard",
  description:
    "Manage your Locality workspace, billing, authorized devices, and private AI coding memory from one dashboard.",
  path: "/dashboard",
  noIndex: true,
});

type DashboardProps = {
  searchParams: Promise<{
    checkout?: string;
    session_id?: string;
    error?: string;
  }>;
};

const setupSteps = [
  {
    title: "Install CLI",
    icon: MonitorDown,
  },
  {
    title: "Authorize device",
    icon: KeyRound,
  },
  {
    title: "Import sessions",
    icon: Database,
  },
  {
    title: "Ask memory",
    icon: Bot,
  },
];

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  await requireDashboardSetup(session.user.id);

  const params = await searchParams;
  let checkoutMessage = "";

  if (params.checkout === "success" && params.session_id) {
    try {
      await reconcileCheckoutSession(params.session_id, session.user.id);
      checkoutMessage = "Payment confirmed. Your new plan is active.";
    } catch (error) {
      checkoutMessage =
        error instanceof Error
          ? `Payment succeeded, but activation needs another check: ${error.message}`
          : "Payment succeeded, but activation needs another check.";
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      apiTokens: {
        where: { revokedAt: null },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  if (!user) redirect("/login");

  const plan = plans[user.plan];
  const firstName = user.name?.split(" ")[0] || "there";
  const activeDevices = user.apiTokens.length;
  const renewalLabel = user.currentPeriodEnd?.toLocaleDateString() || "Not scheduled";
  const status = user.subscriptionStatus || (user.plan === "FREE" ? "No subscription" : "Processing");
  const lastDevice = user.apiTokens[0]?.lastUsedAt || user.apiTokens[0]?.createdAt;

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5">
      {params.checkout === "success" ? (
        <Card className="border-primary/20 bg-primary/5" size="sm">
          <CardContent className="flex items-center gap-2 py-3 text-sm">
            <CheckCircle2 className="size-4 text-primary" />
            <span>{checkoutMessage || "Payment received. Checking your subscription now."}</span>
          </CardContent>
        </Card>
      ) : null}

      {params.error ? (
        <Card size="sm">
          <CardContent className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
            <Clock3 className="size-4" />
            <span>{params.error}</span>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid items-stretch gap-5 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="flex overflow-hidden rounded-[1.75rem] border bg-[#07090c] p-2 text-white shadow-[0_30px_80px_rgba(2,6,23,0.18)]">
          <div className="relative flex min-h-[430px] w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.22),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(59,130,246,0.24),transparent_34%),linear-gradient(135deg,#10151d,#050607_68%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:p-8">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="relative flex h-full min-h-[370px] w-full flex-col justify-between gap-10">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <Badge className="border-white/10 bg-white/10 text-white" variant="outline">
                    Locality command center
                  </Badge>
                  <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-[0.95] tracking-[-0.055em] md:text-6xl">
                    Welcome back, {firstName}.
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-6 text-white/62 md:text-base">
                    Keep project memory, device access, billing, and local AI in one controlled
                    workspace.
                  </p>
                </div>
            
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { label: "Plan", value: plan.name, detail: `$${plan.price}/month`, icon: CreditCard },
                  { label: "Devices", value: String(activeDevices), detail: "authorized", icon: KeyRound },
                  { label: "Renewal", value: renewalLabel, detail: status, icon: Clock3 },
                  { label: "Storage", value: "Local", detail: "vault-backed", icon: HardDrive },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      key={item.label}
                    >
                      <div className="mb-8 flex items-center justify-between text-white/55">
                        <span className="text-xs">{item.label}</span>
                        <Icon className="size-4" />
                      </div>
                      <div className="text-xl font-medium leading-tight tracking-tight">{item.value}</div>
                      <div className="mt-1 truncate text-xs text-white/48">{item.detail}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Card className="flex h-full min-h-[430px] flex-col overflow-hidden rounded-[1.75rem] bg-card">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Workspace state</CardTitle>
              <CardDescription>
                The next best action is based on connected devices and bridge status.
              </CardDescription>
            </div>
            <Badge variant={activeDevices ? "secondary" : "outline"}>
              {activeDevices ? "Active" : "Setup needed"}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <div className="flex-1 rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Local bridge</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start locality web before using private AI chat.
                  </p>
                </div>
                <Terminal className="size-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Latest device activity</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lastDevice ? lastDevice.toLocaleDateString() : "No device has checked in yet."}
                  </p>
                </div>
                <KeyRound className="size-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <span className="text-sm text-muted-foreground">Private memory remains local.</span>
            <Button render={<Link href="/setup" />} variant="secondary">
              Setup
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="grid items-stretch gap-5 lg:grid-cols-3">
        <Card className="flex h-full rounded-[1.5rem]">
          <CardHeader className="pb-4">
            <CardTitle>Setup</CardTitle>
            <CardDescription>Four quick steps to finish the local workflow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            {setupSteps.map((step, index) => {
              const Icon = step.icon;
              const complete = activeDevices > 0 && index < 2;
              return (
                <div
                  className={`flex flex-1 items-center justify-between rounded-[1rem] border px-4 py-3 ${
                    complete
                      ? "border-emerald-500/20 bg-emerald-500/10"
                      : "bg-muted/20"
                  }`}
                  key={step.title}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 items-center justify-center rounded-xl ring-1 ${
                        complete
                          ? "bg-emerald-500 text-white ring-emerald-500/20"
                          : "bg-background ring-border"
                      }`}
                    >
                      {complete ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  <Badge
                    className={
                      complete
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : ""
                    }
                    variant={complete ? "outline" : "secondary"}
                  >
                    {complete ? "Done" : `0${index + 1}`}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
          <CardFooter>
            <Button className="h-11 w-full" render={<Link href="/setup" />}>
              Open setup
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full rounded-[1.5rem]">
          <CardHeader className="pb-4">
            <CardTitle>AI chat</CardTitle>
            <CardDescription>Ask against imported project history.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            {["Local answers", "Saved threads", "Memory prompts"].map((item) => (
              <div
                className="flex flex-1 items-center justify-between rounded-[1rem] border bg-muted/20 px-4 py-3"
                key={item}
              >
                <span className="text-sm font-medium">{item}</span>
                <Bot className="size-4 text-muted-foreground" />
              </div>
            ))}
            <div className="rounded-[1rem] border bg-muted/20 px-4 py-4">
              <p className="text-2xl font-medium tracking-tight">{activeDevices ? "Ready" : "Waiting"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeDevices ? "Bridge available for private chat." : "Finish setup to unlock chat."}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" render={<Link href="/dashboard/chat" />} variant="secondary">
              Open AI chat
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full rounded-[1.5rem]">
          <CardHeader className="pb-4">
            <CardTitle>Plan</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div>
              <div className="text-5xl font-medium tracking-tight">${plan.price}</div>
              <p className="mt-1 text-sm text-muted-foreground">per month</p>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3">
              {plan.features.slice(0, 4).map((feature) => (
                <div className="flex items-center gap-2 text-sm" key={feature}>
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" render={<Link href="/dashboard/billing" />} variant="secondary">
              Billing details
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
