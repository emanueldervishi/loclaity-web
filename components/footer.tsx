import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-brand-copy">
          <Logo />
          <p>Private memory for coding agents.</p>
        </div>
        <div className="footer-links">
          <Link href="/#features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="shell footer-meta">
        <span>© 2026 Locality</span>
        <span>Built for work worth remembering.</span>
      </div>
    </footer>
  );
}
