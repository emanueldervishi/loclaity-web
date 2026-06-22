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
      <main className="page-main app-page pricing-page">
        <div className="shell">
          <div className="page-heading centered-heading">
            <span className="eyebrow">Simple monthly plans</span>
            <h1>Choose how much memory you need.</h1>
            <p>Free stays useful. Go removes limits. Plus connects more of your development setup.</p>
          </div>
          <Pricing signedIn={Boolean(session?.user)} currentPlan={user?.plan ?? "FREE"} />
        </div>
      </main>
      <Footer />
    </>
  );
}
