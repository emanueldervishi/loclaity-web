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
      <main className="min-h-[calc(100dvh-8rem)] bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8">
            <span className="inline-flex rounded-full border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Privacy
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-5xl">Local first means local first.</h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated June 15, 2026.</p>
          </div>
          <section className="rounded-[1.75rem] border bg-card/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
            <div className="space-y-7">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">What the website stores</h2>
                <p className="text-sm leading-6 text-muted-foreground">Your account identity, subscription state, authorized devices and billing identifiers.</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">What stays local</h2>
                <p className="text-sm leading-6 text-muted-foreground">Locality does not require the website to receive your raw coding-agent history, source files, imported Obsidian notes or AI provider keys.</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Payments</h2>
                <p className="text-sm leading-6 text-muted-foreground">Stripe processes payment details. Locality stores Stripe customer and subscription identifiers, not card numbers.</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">Account deletion</h2>
                <p className="text-sm leading-6 text-muted-foreground">Before public launch, add the support address and formal deletion process for your company.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
