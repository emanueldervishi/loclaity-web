"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyCommandProps = {
  command: string;
};

export function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border bg-background/86 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
      <code className="min-w-0 truncate font-mono text-[13px] font-medium text-foreground">{command}</code>
      <button
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border bg-muted px-3 text-xs font-semibold text-foreground transition hover:bg-muted/80"
        type="button"
        onClick={copyCommand}
        aria-label={`Copy ${command}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
