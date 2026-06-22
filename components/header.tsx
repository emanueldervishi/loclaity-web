import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { auth } from "@/auth";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const homeLinks = [
  { label: "Products", href: "/#features", hasChevron: true },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Docs", href: "/#workflow" },
  { label: "Company", href: "/#faq" },
];

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link className="inline-flex items-center text-foreground" href="/" aria-label="Locality home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {homeLinks.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
              {item.hasChevron ? <ChevronDown size={13} /> : null}
            </Link>
          ))}
          {session?.user ? (
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              AI Chat
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition hover:opacity-90"
              href="/dashboard"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition hover:opacity-90"
              href="/login"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
