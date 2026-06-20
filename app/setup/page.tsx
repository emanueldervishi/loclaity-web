import {
  ArrowRight,
  CloudUpload,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CopyCommand } from "@/components/setup/copy-command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardSetupStatus } from "@/lib/dashboard-setup";

export const metadata = {
  title: "Setup",
};

const setupSteps = [
  {
    title: "Install the CLI",
    copy: "Get started with Locality",
    command: "npm install -g locality-ai",
    helper: "Download and run the npm installer.",
    icon: "terminal" as const,
  },
  {
    title: "Authorize this device",
    copy: "Secure this computer",
    command: "locality login",
    helper: "Approve the browser code to unlock the dashboard.",
    icon: ShieldCheck,
  },
  {
    title: "Import recent sessions",
    copy: "Bring in your history",
    command: "locality import --all",
    helper: "Index your latest Codex and agent sessions.",
    icon: CloudUpload,
  },
  {
    title: "Ask project memory",
    copy: "Start searching locally",
    command: "locality web",
    helper: "Start the bridge for local AI chat.",
    icon: Search,
  },
];

export default async function SetupPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const setup = await getDashboardSetupStatus(session.user.id);
  const downloadUrl = process.env.NEXT_PUBLIC_CLI_DOWNLOAD_URL || "#download";
  const completedSteps = setup.complete ? 2 : 0;

  return (
    <main className="setup-page min-h-dvh overflow-hidden bg-[linear-gradient(135deg,var(--background),var(--muted)_48%,var(--background))] p-3 text-foreground md:p-5">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(circle_at_50%_10%,black,transparent_72%)] dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.22),transparent_54%)] blur-2xl" />

      <section className="relative mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-[1400px] flex-col justify-center p-5 md:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="rounded-full" variant={setup.complete ? "secondary" : "outline"}>
            {setup.complete ? "Dashboard unlocked" : "Two steps to unlock"}
          </Badge>
          <h1 className="mt-5 text-4xl font-medium leading-[0.96] tracking-[-0.06em] md:text-6xl">
            Setup Locality on this computer.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Install the CLI and authorize this device. After those first two steps, the dashboard is available.
            Import and local AI can happen next.
          </p>
        </div>

        <div className="mt-14 grid gap-10">
          <div className=" setup-step-row grid gap-10 md:grid-cols-4">
            {setupSteps.map((step, index) => {
              const complete = index < completedSteps;
              const number = String(index + 1).padStart(2, "0");
              const isTerminal = step.icon === "terminal";
              const Icon = isTerminal ? null : step.icon;

              return (
                <article className="setup-step-card group relative min-h-[196px] overflow-visible rounded-2xl border bg-card/82 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl" key={step.title}>
                  {index < setupSteps.length - 1 ? (
                    <span className="setup-step-connector hidden md:block" aria-hidden="true" />
                  ) : null}
                  <div className="flex items-start justify-between gap-4">
                    <div className={`grid size-10 place-items-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${complete ? "bg-emerald-500/15" : "bg-muted"}`}>
                      {isTerminal ? (
                        <Image src="/logo.png" alt="" width={30} height={30} className="rounded-lg bg-white object-cover" />
                      ) : Icon ? (
                        <Icon className={`size-5 ${complete ? "text-emerald-600 dark:text-emerald-300" : "text-primary"}`} />
                      ) : null}
                    </div>
                    <span className="font-mono text-xs font-semibold text-muted-foreground">{number}</span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-base font-semibold tracking-[-0.025em]">{step.title}</h2>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{step.copy}</p>
                  </div>
                  <CopyCommand command={step.command} />
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">{step.helper}</p>
                  {complete ? (
                    <div className="absolute right-4 top-14 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white">
                      Done
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
              <Button render={<a href={downloadUrl} />}>
                Download CLI
                <ArrowRight data-icon="inline-end" />
              </Button>
              {setup.complete ? (
                <Button render={<Link href="/dashboard" />} variant="secondary">
                  Open dashboard
                  <ArrowRight data-icon="inline-end" />
                </Button>
              ) : (
                <Button render={<Link href="/setup" />} variant="secondary">
                  <RefreshCw data-icon="inline-start" />
                  Check again
                </Button>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}
