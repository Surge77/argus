"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

/** Copies the current share URL to the clipboard. */
export function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 font-mono text-xs text-dim transition-colors hover:border-brass/50 hover:text-brass"
    >
      {copied ? <Check size={14} className="text-up" /> : <Link2 size={14} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
