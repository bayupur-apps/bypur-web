import { cn } from "@/lib/helpers";

interface AvailabilityPillProps {
  label: string;
  className?: string;
}

export function AvailabilityPill({ label, className }: AvailabilityPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-emerald-500/25 glass px-3 py-1 text-xs font-medium text-text-2 shadow-sm",
        className
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}
