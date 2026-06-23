import { ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface StatsBarProps {
  children: ReactNode;
  className?: string;
}

export function StatsBar({ children, className }: StatsBarProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-fit max-w-full overflow-hidden rounded-md border border-border",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatItemProps {
  value: string | number;
  label: string;
  accent?: boolean;
  className?: string;
}

export function StatItem({ value, label, accent = false, className }: StatItemProps) {
  return (
    <div className={cn("border-r border-border px-4 py-3 text-center last:border-r-0 sm:px-7 sm:py-4", className)}>
      <p className={cn("font-mono text-[1.375rem] font-semibold leading-none tabular-nums tracking-tight", accent ? "text-secondary" : "text-text-1")}>
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-3">
        {label}
      </p>
    </div>
  );
}
