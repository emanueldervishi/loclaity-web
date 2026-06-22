import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center text-foreground">
              <Logo />
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Private memory for coding agents.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
            <Link className="transition-colors hover:text-foreground" href="/#features">Features</Link>
            <Link className="transition-colors hover:text-foreground" href="/pricing">Pricing</Link>
            <Link className="transition-colors hover:text-foreground" href="/dashboard">Dashboard</Link>
            <Link className="transition-colors hover:text-foreground" href="/privacy">Privacy</Link>
            <Link className="transition-colors hover:text-foreground" href="/terms">Terms</Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border/70 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; 2026 Locality</span>
          <span>Built for work worth remembering.</span>
        </div>
      </div>
    </footer>
  );
}
