import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy",
  description:
    "Read how Locality handles account data, billing identifiers, and local-first project memory for Codex users.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="page-main app-page legal-page">
        <div className="shell">
          <div className="page-heading">
            <span className="eyebrow">Privacy</span>
            <h1>Local first means local first.</h1>
            <p>Last updated June 15, 2026.</p>
          </div>
          <section className="panel legal-document">
            <h2>What the website stores</h2>
            <p>Your account identity, subscription state, authorized devices and billing identifiers.</p>
            <h2>What stays local</h2>
            <p>Locality does not require the website to receive your raw coding-agent history, source files, imported Obsidian notes or AI provider keys.</p>
            <h2>Payments</h2>
            <p>Stripe processes payment details. Locality stores Stripe customer and subscription identifiers, not card numbers.</p>
            <h2>Account deletion</h2>
            <p>Before public launch, add the support address and formal deletion process for your company.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
