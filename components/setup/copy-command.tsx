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
    <div className="setup-command">
      <code>{command}</code>
      <button type="button" onClick={copyCommand} aria-label={`Copy ${command}`}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
