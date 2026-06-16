import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { plans } from "@/lib/plans";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      plan: true,
      apiTokens: {
        where: { revokedAt: null },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <DashboardShell
      user={{
        email: user.email,
        name: user.name,
        plan: plans[user.plan].name,
        setupComplete: user.apiTokens.length > 0,
      }}
    >
      {children}
    </DashboardShell>
  );
}
