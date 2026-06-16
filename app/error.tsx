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
    <main className="page-main app-page state-page">
      <div className="shell">
        <div className="activate-box state-card">
          <span className="eyebrow">Something went wrong</span>
          <h1>Locality hit an unexpected error.</h1>
          <p>Check the database and environment configuration, then try again.</p>
          <button className="button" onClick={reset} type="button">Try again</button>
        </div>
      </div>
    </main>
  );
}
