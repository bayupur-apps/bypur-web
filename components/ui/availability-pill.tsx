import { cn } from "@/lib/helpers";

export type AvailabilityMode = "projects" | "hiring";

interface AvailabilityPillProps {
  isAvailable: boolean;
  mode?: AvailabilityMode;
  className?: string;
}

const availabilityLabels: Record<
  AvailabilityMode,
  {
    available: string;
    unavailable: string;
    compactAvailable: string;
    compactUnavailable: string;
  }
> = {
  projects: {
    available: "Available for Projects",
    unavailable: "Not Taking Projects",
    compactAvailable: "Projects",
    compactUnavailable: "Unavailable",
  },
  hiring: {
    available: "Open to Work",
    unavailable: "Not Looking for Work",
    compactAvailable: "Open to Work",
    compactUnavailable: "Not Looking",
  },
};

export function AvailabilityPill({
  isAvailable,
  mode = "projects",
  className,
}: Readonly<AvailabilityPillProps>) {
  const labels = availabilityLabels[mode];
  const label = isAvailable ? labels.available : labels.unavailable;

  return (
    <span
      role="status"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium",
        isAvailable
          ? "border-success/40 bg-success/10 text-text-2"
          : "border-border/70 bg-bg-subtle/50 text-text-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          isAvailable ? "bg-success" : "bg-text-3",
        )}
      />
      <span className="hidden truncate sm:inline">{label}</span>
      <span className="truncate sm:hidden">
        {isAvailable ? labels.compactAvailable : labels.compactUnavailable}
      </span>
    </span>
  );
}
