import { cn } from "@/lib/helpers";

interface AvailabilityPillProps {
  label: string;
  className?: string;
}

export function AvailabilityPill({ label, className }: AvailabilityPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-success/30 neumorphic-chip px-3 py-1 text-xs font-medium text-text-2",
        className
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden="true">
        <span className="inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      {label}
    </span>
  );
}
