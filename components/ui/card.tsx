import { ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "interactive" | "gradient";
  className?: string;
}

export function Card({ children, variant = "default", className }: CardProps) {
  const variants = {
    default: "rounded-xl border border-border glass p-5",
    interactive:
      "group rounded-xl border border-border glass p-5 transition-colors hover:border-accent/50",
    gradient: "rounded-xl border border-border glass",
  };

  return <div className={cn(variants[variant], className)}>{children}</div>;
}
