import { ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "tech" | "small" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[10px] text-text-3",
    tech: "rounded-md border border-border bg-bg-card px-2.5 py-1 text-[11px] text-text-2 transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent",
    small: "rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[9px] text-text-3",
    outline: "rounded-full border border-border px-3 py-1 text-[11px] text-text-3 transition-colors hover:border-text-2 hover:text-text-2",
  };

  return <span className={cn(variants[variant], className)}>{children}</span>;
}
