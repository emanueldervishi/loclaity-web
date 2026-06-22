"use client";

import { CodeforgeHome } from "@/components/codeforge/home";
import { Navbar } from "@/components/codeforge/section/navbar";

export function HomePageClient() {
  return (
    <div className="mx-auto max-w-7xl border-x border-border">
      <Navbar />
      <CodeforgeHome />
    </div>
  );
}
