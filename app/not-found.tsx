import Link from "next/link";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-8rem)] bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border bg-card/92 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <span className="inline-flex rounded-full border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">404</span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.05em]">This memory does not exist.</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">The page may have moved, or the link may be incomplete.</p>
            <Link className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90" href="/">Return home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
