import { auth } from "@/auth";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Pricing } from "@/components/pricing";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Compare Locality Free, Go, and Plus plans for local-first project memory, searchable coding sessions, and private AI coding context.",
  path: "/pricing",
});

export default async function PricingPage() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } })
    : null;

  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-8rem)] bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex rounded-full border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Simple monthly plans
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-6xl">
              Choose how much memory you need.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
              Free stays useful. Go removes limits. Plus connects more of your development setup.
            </p>
          </div>
          <Pricing signedIn={Boolean(session?.user)} currentPlan={user?.plan ?? "FREE"} />
        </div>
      </main>
      <Footer />
    </>
  );
}
