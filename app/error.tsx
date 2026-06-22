"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl justify-center">
        <div className="w-full max-w-xl rounded-[2rem] border bg-card/92 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <span className="inline-flex rounded-full border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Something went wrong</span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.05em]">Locality hit an unexpected error.</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Check the database and environment configuration, then try again.</p>
          <button className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90" onClick={reset} type="button">Try again</button>
        </div>
      </div>
    </main>
  );
}
