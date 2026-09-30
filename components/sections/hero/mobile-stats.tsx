import { Briefcase, Globe, Rocket, Server, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/helpers";
import type { MobileStat } from "@/lib/types";

interface MobileStatsGridProps {
  stats: MobileStat[];
}

// Maps the "ti-*" (Tabler Icons) identifiers historically stored in this
// field to real lucide-react icons actually bundled in this app - Tabler's
// icon font was never loaded, so those icons were invisible before.
const ICON_MAP: Record<string, LucideIcon> = {
  "ti-briefcase": Briefcase,
  "ti-rocket": Rocket,
  "ti-server": Server,
  "ti-world": Globe,
};

export function MobileStatsGrid({ stats }: MobileStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat) => {
        const Icon = stat.icon ? ICON_MAP[stat.icon] : undefined;
        return (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-xl border border-border glass px-3.5 py-3"
          >
            <span
              className={cn(
                "absolute inset-y-0 left-0 w-0.75",
                stat.accent ? "bg-accent" : "bg-border",
              )}
            />
            {Icon && (
              <Icon
                size={14}
                className={cn(
                  "absolute right-3 top-3",
                  stat.accent ? "text-accent/60" : "text-text-3/60",
                )}
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
        );
      })}
    </div>
  );
}
