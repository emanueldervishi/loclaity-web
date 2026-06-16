import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, Github, LockKeyhole, Network, Search, Sparkles } from "lucide-react";
import { auth, signIn } from "@/auth";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "Sign in"
};

type LoginProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginProps) {
  const session = await auth();
  const params = await searchParams;
  const redirectTo =
    params.callbackUrl?.startsWith("/") && !params.callbackUrl.startsWith("//")
      ? params.callbackUrl
      : "/dashboard";

  if (session?.user) redirect(redirectTo);

  const githubReady = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
  const googleReady = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className="auth-shell">
      <section className="auth-copy">
        <div className="auth-aurora" />
        <div className="auth-copy-inner">
          <Link className="auth-logo" href="/"><Logo /></Link>
          <div className="auth-statement">
            <span className="eyebrow"><Sparkles size={14} />Private by design</span>
            <h1>Your agents forget. Your workspace does not have to.</h1>
            <p>One account connects billing and devices. Your raw coding history stays on your computer.</p>
          </div>
          <div className="auth-memory-card">
            <div className="auth-memory-top"><Network size={15} /> locality / authentication <span>local</span></div>
            <div className="auth-memory-search"><Search size={15} /> Why did we choose database sessions?</div>
            <div className="auth-memory-answer">
              <Sparkles size={16} />
              <p>Shared web and CLI authentication made device approval, plan checks, and token revocation consistent.</p>
            </div>
            <div className="auth-memory-sources"><span>3 sources</span><span>auth.ts</span><span>device/approve</span></div>
          </div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-box">
          <Link className="auth-mobile-logo" href="/"><Logo /></Link>
          <span className="auth-kicker">Account access</span>
          <h2>Welcome back.</h2>
          <p>Sign in to download the CLI, connect devices and manage your plan.</p>

          {!githubReady && !googleReady && (
            <div className="message">
              Add GitHub or Google OAuth values to <strong>.env.local</strong> to enable login.
            </div>
          )}

          <div className="auth-buttons">
            {githubReady && (
              <form
                action={async () => {
                  "use server";
                  await signIn("github", { redirectTo });
                }}
              >
                <button className="button secondary full" type="submit">
                  <Github size={18} />
                  Continue with GitHub
                </button>
              </form>
            )}

            {googleReady && (
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo });
                }}
              >
                <button className="button secondary full" type="submit">
                  <span className="google-mark">G</span>
                  Continue with Google
                </button>
              </form>
            )}
          </div>

          <p className="auth-disclaimer">
            By continuing, you agree to Locality&apos;s <Link href="/terms">terms</Link> and{" "}
            <Link href="/privacy">privacy policy</Link>.
            Your imported coding history is not uploaded by the website.
          </p>
          <div className="auth-trust">
            <span><LockKeyhole size={13} /> OAuth only</span>
            <span><Check size={13} /> Raw history stays local</span>
          </div>
        </div>
      </section>
    </main>
  );
}
