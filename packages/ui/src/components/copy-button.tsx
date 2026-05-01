"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils.js";

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: "sm" | "md";
}

export function CopyButton({ value, className, size = "md" }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        className
      )}
    >
      {copied ? (
        <Check className={cn("text-emerald-500", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      ) : (
        <Copy className={cn("text-muted-foreground", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      )}
    </button>
  );
}
