import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Authorize CLI"
};

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
      <main className="page-main">
        <div className="shell">
          <div className="activate-box state-card">
            <span className="icon-box activate-icon"><ShieldCheck size={19} /></span>
            <span className="panel-label">Secure device approval</span>
            <h1>Authorize Locality CLI</h1>

            {params.approved === "1" ? (
              <>
                <p className="message">Device approved. You can return to the terminal.</p>
                <Link className="button" href="/dashboard">Open dashboard</Link>
              </>
            ) : valid ? (
              <>
                <p>
                  Confirm that the code below matches the one shown in your terminal.
                  This grants the device access to your plan status, not your private notes.
                </p>
                <span className="activate-code">{request.userCode}</span>
                <p className="mb-3"><strong>{request.deviceName}</strong></p>
                <form action="/api/cli/device/approve" method="POST">
                  <input name="code" type="hidden" value={request.userCode} />
                  <button className="button accent full" type="submit">Authorize device</button>
                </form>
              </>
            ) : (
              <>
                <p className="message">
                  {params.error || "This device code is invalid or has expired."}
                </p>
                <p>Run <strong>locality login</strong> again to generate a new code.</p>
                <Link className="button secondary" href="/dashboard">Back to dashboard</Link>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
