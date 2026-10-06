"use client";

import { useRef, type KeyboardEvent } from "react";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";
import { formatDuration } from "./utils";

interface DesktopTimelineProps {
  experiences: Experience[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const detailPanelId = "experience-detail-panel";
export const tabId = (id: string) => `experience-tab-${id}`;

export function DesktopTimeline({ experiences, selectedId, onSelect }: DesktopTimelineProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Tabs pattern: arrow keys move between roles, Home/End jump to the ends.
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = experiences.length - 1;
    const next =
      e.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    onSelect(experiences[next].id);
    tabsRef.current[next]?.focus();
  };

  return (
    <FadeUp delay={0.05} className="sticky top-24">
      <div role="tablist" aria-orientation="vertical" aria-label="Career timeline" className="relative flex flex-col gap-2">
        {/* Timeline line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-5.75 top-6 w-px bg-linear-to-b from-accent/50 via-border to-transparent"
        />

        {experiences.map((exp, i) => {
          const active = selectedId === exp.id;
          const duration = formatDuration(exp.period);
          return (
            <button
              key={exp.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              id={tabId(exp.id)}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={detailPanelId}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(exp.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                "group relative rounded-2xl border py-4 pl-13 pr-4 text-left transition-all duration-300",
                active
                  ? "border-accent/40 neumorphic shadow-md"
                  : "border-transparent hover:border-border/60 hover:bg-bg-subtle/50"
              )}
            >
              {/* Dot */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-3.5 top-5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 transition-all duration-300",
                  active
                    ? "border-accent bg-accent shadow-sm"
                    : "border-border bg-bg-card group-hover:border-accent/50"
                )}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>

              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-text-3">
                <span className={cn("uppercase tracking-wider font-mono", active && "text-accent font-semibold")}>
                  {exp.period}
                </span>
                {exp.isCurrent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-success-ink">
                    <span className="h-1 w-1 rounded-full bg-success" />
                    Now
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "mt-1.5 block text-[15px] font-semibold leading-snug transition-colors",
                  active ? "text-text-1" : "text-text-2 group-hover:text-text-1"
                )}
              >
                {exp.role}
              </span>
              <span className="mt-0.5 block text-[13px] text-text-3">
                {exp.company}
                {duration && <span className="text-text-3/80"> · {duration}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </FadeUp>
  );
}
