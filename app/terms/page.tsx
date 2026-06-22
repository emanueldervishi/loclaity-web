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
      <main className="page-main app-page legal-page">
        <div className="shell">
          <div className="page-heading">
            <span className="eyebrow">Terms</span>
            <h1>Clear rules for a developer tool.</h1>
            <p>Last updated June 15, 2026.</p>
          </div>
          <section className="panel legal-document">
            <h2>Service</h2>
            <p>Locality organizes supported coding-agent history and provides account-based access to paid features.</p>
            <h2>Subscriptions</h2>
            <p>Go and Plus renew monthly until canceled. Customers can manage billing through the Stripe Customer Portal.</p>
            <h2>Your data</h2>
            <p>You retain ownership of your source code, notes and imported agent history.</p>
            <h2>Before launch</h2>
            <p>Have these terms reviewed for the company jurisdiction, refund policy, liability limits and support contact.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
