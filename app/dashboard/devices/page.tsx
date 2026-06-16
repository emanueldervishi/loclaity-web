import { KeyRound, Laptop, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireDashboardSetup } from "@/lib/dashboard-setup";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Devices",
};

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Badge className="h-6 rounded-full px-2.5" variant="outline">
            Access control
          </Badge>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            Authorized devices.
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Review every computer that can import memory or use this Locality account.
          </p>
        </div>
        <Button render={<Link href="/setup" />}>
          <KeyRound data-icon="inline-start" />
          Add device
        </Button>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Connected devices</CardTitle>
            <CardDescription>Every computer allowed to use your Locality workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-medium tracking-tight">{user.apiTokens.length}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {user.apiTokens.length ? "Authorized and ready." : "No devices connected yet."}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Latest check-in</CardTitle>
            <CardDescription>Most recent device activity inside this workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium tracking-tight">
              {latestToken?.lastUsedAt?.toLocaleDateString() || latestToken?.createdAt.toLocaleDateString() || "No activity yet"}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {latestToken ? latestToken.name : "Connect your first machine from setup."}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem]">
          <CardHeader>
            <CardTitle>Local-first security</CardTitle>
            <CardDescription>Device authorization controls who can import or query private memory.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Remove unknown devices from your CLI flow and re-authorize the computers you trust.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[1.5rem]">
        <CardHeader className="flex flex-row items-start justify-between">
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
            <div className="rounded-[1.15rem] border">
              {user.apiTokens.map((token, index) => (
                <div
                  className="flex items-center gap-3 border-b p-4 last:border-b-0"
                  key={token.id}
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
                    <Laptop className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{token.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Added {token.createdAt.toLocaleDateString()}
                      {token.lastUsedAt ? ` · Last used ${token.lastUsedAt.toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <Badge variant={index === 0 ? "secondary" : "outline"}>
                    {token.lastUsedAt ? "active" : "authorized"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-[1.15rem] border border-dashed p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <ShieldCheck className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">No authorized devices</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                Install the CLI and run locality login on your first computer.
              </p>
              <Button className="mt-4" render={<Link href="/setup" />} variant="secondary">
                Open setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
