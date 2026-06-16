import { auth } from "@/auth";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Pricing } from "@/components/pricing";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Pricing"
};

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
