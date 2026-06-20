"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  ariaLabel?: string;
  callbackUrl?: string;
  children: React.ReactNode;
  className?: string;
};

export function SignOutButton({
  ariaLabel = "Sign out",
  callbackUrl = "/",
  children,
  className,
}: SignOutButtonProps) {
  async function handleSignOut() {
    const confirmed = window.confirm("Sign out of Locality?");
    if (!confirmed) return;
    await signOut({ callbackUrl });
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(className)}
      onClick={() => {
        void handleSignOut();
      }}
    >
      {children}
    </button>
  );
}
