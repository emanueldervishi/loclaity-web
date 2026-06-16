import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getDashboardSetupStatus(userId: string) {
  const activeDevice = await prisma.apiToken.findFirst({
    where: {
      userId,
      revokedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  return {
    complete: Boolean(activeDevice),
    activeDevice,
  };
}

export async function requireDashboardSetup(userId: string) {
  const setup = await getDashboardSetupStatus(userId);

  if (!setup.complete) {
    redirect("/setup");
  }

  return setup;
}
