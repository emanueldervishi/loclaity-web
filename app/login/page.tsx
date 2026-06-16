import { Check, Github, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Sign in",
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
    <main className="min-h-dvh bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary),transparent_82%),transparent_34%),linear-gradient(180deg,var(--background),color-mix(in_oklch,var(--muted),var(--background)_65%))] px-4 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[1160px] items-center justify-center">
        <section className="grid w-full items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden overflow-hidden rounded-[1.75rem] border bg-[#07090c] p-2 text-white shadow-[0_30px_80px_rgba(2,6,23,0.18)] lg:block">
            <div className="flex min-h-[620px] flex-col justify-between rounded-[1.35rem] border border-white/10 bg-[radial-gradient(circle_at_16%_0%,rgba(20,184,166,0.2),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(59,130,246,0.22),transparent_34%),linear-gradient(135deg,#10151d,#050607_68%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Link className="inline-flex" href="/">
                <Logo />
              </Link>
              <div>
                <Badge className="border-white/10 bg-white/10 text-white" variant="outline">
                  Locality account
                </Badge>
                <h1 className="mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-[-0.055em]">
                  Sign in to your private project memory.
                </h1>
                <p className="mt-5 max-w-md text-sm leading-6 text-white/62">
                  Manage billing and devices from the web. Your imported coding history stays on your
                  computer.
                </p>
              </div>
              <div className="grid gap-3">
                {["OAuth account access", "Device approval", "Local memory stays local"].map((item) => (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-sm" key={item}>
                    <Check className="size-4 text-white/70" />
                    <span className="text-white/78">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-md rounded-[1.75rem]">
            <CardHeader className="gap-4">
              <Link className="inline-flex lg:hidden" href="/">
                <Logo />
              </Link>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-muted">
                <LockKeyhole className="size-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-3xl tracking-tight">Welcome back.</CardTitle>
                <CardDescription className="mt-2">
                  Sign in to connect devices, manage your plan, and open the dashboard.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {!githubReady && !googleReady ? (
                <div className="rounded-[1rem] border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Add GitHub or Google OAuth values to <strong className="text-foreground">.env.local</strong> to enable login.
                </div>
              ) : null}

              {githubReady ? (
                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo });
                  }}
                >
                  <Button className="h-11 w-full" type="submit" variant="secondary">
                    <Github data-icon="inline-start" />
                    Continue with GitHub
                  </Button>
                </form>
              ) : null}

              {googleReady ? (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo });
                  }}
                >
                  <Button className="h-11 w-full" type="submit" variant="secondary">
                    <span className="grid size-5 place-items-center rounded-full bg-background text-xs font-semibold ring-1 ring-border">
                      G
                    </span>
                    Continue with Google
                  </Button>
                </form>
              ) : null}
            </CardContent>

            <CardFooter className="flex-col items-start gap-4">
              <p className="text-xs leading-5 text-muted-foreground">
                By continuing, you agree to Locality&apos;s <Link className="text-foreground underline-offset-4 hover:underline" href="/terms">terms</Link> and{" "}
                <Link className="text-foreground underline-offset-4 hover:underline" href="/privacy">privacy policy</Link>.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">OAuth only</Badge>
                <Badge variant="outline">Raw history stays local</Badge>
              </div>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
