import { auth } from "@/auth";
import { LocalityLanding } from "@/components/locality-landing";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true }
      })
    : null;

  return (
    <LocalityLanding
      signedIn={Boolean(session?.user)}
      primaryHref={session?.user ? "/dashboard" : "/login"}
      currentPlan={user?.plan ?? "FREE"}
    />
  );
}
