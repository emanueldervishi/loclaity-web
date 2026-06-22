"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("locality-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", next);
    const frame = window.requestAnimationFrame(() => setDark(next));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("locality-theme", next ? "dark" : "light");
  }

  return (
    <button
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/80 text-foreground transition-colors hover:bg-muted",
        showLabel && "w-auto gap-2 px-3",
        className
      )}
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      {showLabel ? <span>{dark ? "Light" : "Dark"}</span> : null}
    </button>
  );
}
