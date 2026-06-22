import { ArrowUpRight, CheckCircle2, Clock3, KeyRound, Laptop, ShieldCheck, Terminal } from "lucide-react";
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
import { requireDashboardSetup } from "@/lib/dashboard-setup";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Devices",
  description:
    "Review authorized Locality devices and control which computers can import project memory from the CLI.",
  path: "/dashboard/devices",
  noIndex: true,
});

export default async function DashboardDevicesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  await requireDashboardSetup(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      apiTokens: {
        where: { revokedAt: null },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const latestToken = user.apiTokens[0];
  const latestActivity =
    latestToken?.lastUsedAt?.toLocaleDateString() ||
    latestToken?.createdAt.toLocaleDateString() ||
    "No activity yet";

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5">
      <section className="grid items-stretch gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="overflow-hidden rounded-[1.75rem] border bg-[#07090c] p-2 text-white shadow-[0_30px_80px_rgba(2,6,23,0.18)]">
          <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-white/10 bg-[radial-gradient(circle_at_16%_0%,rgba(20,184,166,0.2),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(59,130,246,0.22),transparent_34%),linear-gradient(135deg,#10151d,#050607_68%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:p-8">
            <div>
              <Badge className="border-white/10 bg-white/10 text-white" variant="outline">
                Access control
              </Badge>
              <h1 className="mt-5 max-w-2xl text-4xl font-medium leading-[0.95] tracking-[-0.055em] md:text-6xl">
                Trusted devices.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/62 md:text-base">
                Review every computer that can import memory, build local brain context, or use this
                account from the CLI.
              </p>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {[
                { label: "Devices", value: String(user.apiTokens.length), detail: "authorized", icon: Laptop },
                { label: "Latest", value: latestActivity, detail: latestToken?.name || "waiting", icon: Clock3 },
                { label: "Storage", value: "Local", detail: "device-owned", icon: ShieldCheck },
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
              <CardTitle>Device authorization</CardTitle>
              <CardDescription>Only approved machines can use account-scoped CLI access.</CardDescription>
            </div>
            <Badge variant={user.apiTokens.length ? "secondary" : "outline"}>
              {user.apiTokens.length ? "Active" : "Setup needed"}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            {[
              { title: "Run CLI login", copy: "Authorize a machine from the setup flow.", icon: Terminal },
              { title: "Keep tokens current", copy: "Reconnect stale machines when access changes.", icon: KeyRound },
              { title: "Review activity", copy: latestToken ? `Last seen: ${latestActivity}` : "No device has checked in yet.", icon: CheckCircle2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div className="flex items-center justify-between gap-4 rounded-[1rem] border bg-muted/20 p-4" key={item.title}>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.copy}</p>
                  </div>
                  <Icon className="size-5 shrink-0 text-muted-foreground" />
                </div>
              );
            })}
          </CardContent>
          <CardFooter>
            <Button className="w-full" render={<Link href="/setup" />}>
              <KeyRound data-icon="inline-start" />
              Add device
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Card className="rounded-[1.5rem]">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Device inventory</CardTitle>
            <CardDescription>Devices appear after completing locality login.</CardDescription>
          </div>
          <Badge variant={user.apiTokens.length ? "secondary" : "outline"}>
            {user.apiTokens.length ? `${user.apiTokens.length} active` : "None connected"}
          </Badge>
        </CardHeader>
        <CardContent>
          {user.apiTokens.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {user.apiTokens.map((token, index) => (
                <div className="flex items-center gap-3 rounded-[1rem] border bg-muted/20 p-4" key={token.id}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background ring-1 ring-border">
                    <Laptop className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{token.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Added {token.createdAt.toLocaleDateString()}
                      {token.lastUsedAt ? ` - Last used ${token.lastUsedAt.toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <Badge variant={index === 0 ? "secondary" : "outline"}>
                    {token.lastUsedAt ? "active" : "authorized"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.15rem] border border-dashed p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <ShieldCheck className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">No authorized devices</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                Install the CLI and run locality login on your first computer.
              </p>
              <Button className="mt-4" render={<Link href="/setup" />} variant="secondary">
                Open setup
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
