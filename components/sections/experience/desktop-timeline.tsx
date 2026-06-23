import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";

interface DesktopTimelineProps {
  experiences: Experience[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export function DesktopTimeline({ experiences, selectedId, onSelect }: DesktopTimelineProps) {
  return (
    <FadeUp delay={0.1}>
      <nav className="sticky top-24 flex flex-col gap-2" aria-label="Career timeline">
        {/* Timeline line */}
        <div className="pointer-events-none absolute bottom-8 left-6 top-8 w-px bg-linear-to-b from-accent/40 via-border to-border" />

        {experiences.map((exp, i) => (
          <button
            key={exp.id}
            className={cn(
              "group relative rounded-md border py-4 pl-14 pr-4 text-left transition-all duration-300",
              selectedId === exp.id
                ? "border-accent/30 bg-bg-card shadow-lg shadow-accent/5"
                : "border-transparent hover:border-border/50 hover:bg-bg-card/50"
            )}
            onClick={() => onSelect(exp.id)}
          >
            {/* Animated dot */}
            <span
              className={cn(
                "absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-2 font-mono text-[9px] font-semibold transition-all duration-300",
                selectedId === exp.id
                  ? "border-accent bg-accent text-accent-fg shadow-md shadow-accent/25"
                  : "border-border bg-bg text-text-3 group-hover:border-accent/40 group-hover:bg-bg-card"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Pulse effect when active */}
            {selectedId === exp.id && (
              <span className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 animate-ping rounded-full bg-accent/20" />
            )}

            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                {exp.period}
              </span>
              <span
                className={cn(
                  "mt-1 block text-[14px] font-semibold leading-snug transition-colors",
                  selectedId === exp.id
                    ? "text-text-1"
                    : "text-text-2 group-hover:text-text-1"
                )}
              >
                {exp.role}
              </span>
              <span className="mt-0.5 block text-[12px] text-text-3">{exp.company}</span>
            </div>
          </button>
        ))}
      </nav>
    </FadeUp>
  );
}
