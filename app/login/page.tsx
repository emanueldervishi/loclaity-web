import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { BrandMark } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign in",
  description:
    "Sign in to Locality to access your private workspace, manage imports, and keep Codex project memory connected.",
  path: "/login",
  noIndex: true,
});

type LoginProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

function LocalityLogo() {
  return (
    <Link href="/" aria-label="Locality home" className="inline-flex text-foreground">
      <BrandMark className="size-8" />
    </Link>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default async function LoginPage({ searchParams }: LoginProps) {
  const session = await auth();
  const params = await searchParams;

  const redirectTo =
    params.callbackUrl?.startsWith("/") && !params.callbackUrl.startsWith("//")
      ? params.callbackUrl
      : "/dashboard";

  if (session?.user) redirect(redirectTo);

  const googleReady = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 pt-10 pb-8 md:items-center md:py-10 ">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(circle_at_50%_10%,black,transparent_72%)] dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.22),transparent_54%)] blur-2xl" />

      <div className="relative w-full max-w-md font-sfpro">
        <div className="rounded-3xl border-0 bg-transparent shadow-none backdrop-blur-0 md:border md:border-border/60 md:bg-card/70 md:backdrop-blur-xl md:shadow-[0_30px_90px_rgba(0,0,0,0.10)] dark:md:shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="p-0 md:p-7">
            <div className="mb-7 flex flex-col items-start gap-4">
              <LocalityLogo />

              <div className="text-left">
                <h1 className="text-[44px] leading-[1.02] tracking-[-0.04em] font-semibold">
                  <span className="block text-foreground/95">Sign in</span>
                  <span className="block">
                    <span className="text-muted-foreground">to </span>
                    <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 bg-clip-text text-transparent dark:from-white dark:via-sky-200 dark:to-blue-400">
                      Locality
                    </span>
                  </span>
                </h1>

                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Your local memory layer for AI work. Sign in to manage your
                  workspace, connect your tools, and keep project context close.
                </p>
              </div>
            </div>

            {!googleReady ? (
              <div className="mb-4 rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                Add <strong className="text-foreground">AUTH_GOOGLE_ID</strong>{" "}
                and{" "}
                <strong className="text-foreground">
                  AUTH_GOOGLE_SECRET
                </strong>{" "}
                to enable Google login.
              </div>
            ) : null}

            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo });
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full h-11 rounded-2xl"
                disabled={!googleReady}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
            </form>
          </div>
        </div>

    
      </div>
    </div>
  );
}
