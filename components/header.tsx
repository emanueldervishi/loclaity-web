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
    <header className="site-header">
      <div className="header-inner app-header-inner">
        <Link className="logo-link" href="/" aria-label="Locality home">
          <Logo />
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {homeLinks.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
              {item.hasChevron ? <ChevronDown size={13} /> : null}
            </Link>
          ))}
          {session?.user ? <Link href="/dashboard/chat">AI Chat</Link> : null}
        </nav>

        <div className="header-actions">
          <ThemeToggle className="icon-button" />
          {session?.user ? (
            <Link className="button button-small" href="/dashboard">
              Dashboard
            </Link>
          ) : (
            <Link className="button button-small" href="/login">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
