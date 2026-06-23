import { cn } from "@/lib/helpers";

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  showPing?: boolean;
}

export function StatusBadge({
  status,
  label = "Currently working as",
  className,
  showPing = true,
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center justify-center gap-2 text-sm text-text-2 lg:justify-start",
        className
      )}
    >
      {showPing && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
        </span>
      )}
      {label}
      <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
        {status}
      </span>
    </div>
  );
}
