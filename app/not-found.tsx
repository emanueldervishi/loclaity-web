import Link from "next/link";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="page-main app-page state-page">
        <div className="shell">
          <div className="activate-box state-card">
            <span className="eyebrow">404</span>
            <h1>This memory does not exist.</h1>
            <p>The page may have moved, or the link may be incomplete.</p>
            <Link className="button" href="/">Return home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
