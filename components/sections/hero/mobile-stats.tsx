import { cn } from "@/lib/helpers";
import type { MobileStat } from "@/lib/types";

interface MobileStatsGridProps {
  stats: MobileStat[];
}

export function MobileStatsGrid({ stats }: MobileStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl border border-border bg-bg-card px-3.5 py-3"
        >
          <span
            className={cn(
              "absolute inset-y-0 left-0 w-0.75",
              stat.accent ? "bg-accent" : "bg-border",
            )}
          />
          {stat.icon && (
            <i
              className={cn(
                "ti",
                stat.icon,
                "absolute right-3 top-2.5 text-sm text-text-3",
              )}
              aria-hidden
            />
          )}
          <p
            className={cn(
              "font-mono text-xl font-medium leading-none mb-1",
              stat.accent ? "text-accent" : "text-text-1",
            )}
          >
            {stat.value}
          </p>
          <p className="text-[11px] text-text-2">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
