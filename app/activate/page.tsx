import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Authorize CLI",
  description:
    "Approve a Locality CLI device code and connect this machine to your account for local-first project memory.",
  path: "/activate",
  noIndex: true,
});

type ActivateProps = {
  searchParams: Promise<{
    code?: string;
    approved?: string;
    error?: string;
  }>;
};

export default async function ActivatePage({ searchParams }: ActivateProps) {
  const params = await searchParams;
  const code = (params.code || "").trim().toUpperCase();
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/activate?code=${code}`)}`);
  }

  const request = code
    ? await prisma.deviceCode.findUnique({ where: { userCode: code } })
    : null;

  const valid =
    request &&
    request.status === "PENDING" &&
    // Server-rendered expiry checks intentionally use the current request time.
    // eslint-disable-next-line react-hooks/purity
    request.expiresAt.getTime() > Date.now();

  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-9rem)] bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border bg-card/95 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur xl:p-10">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={19} />
            </span>
            <span className="mt-5 inline-flex rounded-full border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Secure device approval
            </span>
            <h1>Authorize Locality CLI</h1>

            {params.approved === "1" ? (
              <>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">Device approved. You can return to the terminal.</p>
                <Link
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90"
                  href="/dashboard"
                >
                  Open dashboard
                </Link>
              </>
            ) : valid ? (
              <>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Confirm that the code below matches the one shown in your terminal.
                  This grants the device access to your plan status, not your private notes.
                </p>
                <span className="mt-6 inline-flex items-center rounded-2xl border bg-muted/35 px-5 py-3 font-mono text-2xl font-semibold tracking-[0.32em] text-foreground">
                  {request.userCode}
                </span>
                <p className="mb-3 mt-5 text-sm text-muted-foreground"><strong className="text-foreground">{request.deviceName}</strong></p>
                <form action="/api/cli/device/approve" method="POST">
                  <input name="code" type="hidden" value={request.userCode} />
                  <button
                    className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    type="submit"
                  >
                    Authorize device
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {params.error || "This device code is invalid or has expired."}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Run <strong className="text-foreground">locality login</strong> again to generate a new code.</p>
                <Link
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
                  href="/dashboard"
                >
                  Back to dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
