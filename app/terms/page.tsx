import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms",
  description:
    "Review Locality terms for subscriptions, account access, and ownership of imported coding history and project memory.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-8rem)] bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex rounded-full border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Terms
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-5xl">Clear rules for a developer tool.</h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated June 15, 2026.</p>
          </div>
          <section className="rounded-[1.75rem] border bg-card/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
            <div className="space-y-7">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Service</h2>
                <p className="text-sm leading-6 text-muted-foreground">Locality organizes supported coding-agent history and provides account-based access to paid features.</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Subscriptions</h2>
                <p className="text-sm leading-6 text-muted-foreground">Go and Plus renew monthly until canceled. Customers can manage billing through the Stripe Customer Portal.</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Your data</h2>
                <p className="text-sm leading-6 text-muted-foreground">You retain ownership of your source code, notes and imported agent history.</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Before launch</h2>
                <p className="text-sm leading-6 text-muted-foreground">Have these terms reviewed for the company jurisdiction, refund policy, liability limits and support contact.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
