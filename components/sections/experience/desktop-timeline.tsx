"use client";

import { useRef, type KeyboardEvent } from "react";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";
import { formatDuration } from "./utils";
import { Radio, Compass, Orbit } from "lucide-react";

interface DesktopTimelineProps {
  experiences: Experience[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const detailPanelId = "experience-detail-panel";
export const tabId = (id: string) => `experience-tab-${id}`;

export function DesktopTimeline({
  experiences,
  selectedId,
  onSelect,
}: DesktopTimelineProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const last = experiences.length - 1;
    const next =
      e.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : e.key === "ArrowUp"
        ? index === 0
          ? last
          : index - 1
        : e.key === "Home"
        ? 0
        : e.key === "End"
        ? last
        : null;
    if (next === null) return;
    e.preventDefault();
    onSelect(experiences[next].id);
    tabsRef.current[next]?.focus();
  };

  return (
    <FadeUp delay={0.05} className="w-full">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Orbital career timeline"
        className="relative rounded-2xl neumorphic p-3 flex flex-col gap-2.5 min-h-[380px] xl:min-h-[390px] max-h-[380px] xl:max-h-[390px] overflow-y-auto custom-workspace-scroll"
      >
        {/* Orbital Timeline Vertical Glowing Conduit */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-6 bottom-6 w-0.5 bg-linear-to-b from-accent via-accent/40 to-transparent shadow-[0_0_8px_rgba(2,132,199,0.5)]"
        />

        {/* Orbit Index Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-border/40 font-mono text-[10px] text-text-3 px-1">
          <span className="flex items-center gap-1 text-accent font-semibold">
            <Orbit size={11} /> ORBITAL STATIONS
          </span>
          <span>STATION {experiences.findIndex((e) => e.id === selectedId) + 1} / {experiences.length}</span>
        </div>

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
                "group relative flex items-start gap-3 rounded-xl p-2.5 text-left transition-all duration-200",
                active
                  ? "neumorphic-pressed text-accent ring-1 ring-accent/50 shadow-[0_0_15px_rgba(2,132,199,0.2)]"
                  : "neumorphic-chip text-text-2 hover:border-accent/40 hover:text-text-1 hover:-translate-y-0.5"
              )}
            >
              {/* Orbital Beacon Marker */}
              <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all duration-200",
                    active
                      ? "bg-accent shadow-[0_0_10px_rgba(2,132,199,0.8)] scale-125"
                      : "bg-border group-hover:bg-accent/60"
                  )}
                />
                {exp.isCurrent && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-accent animate-ping opacity-60 pointer-events-none"
                  />
                )}
              </div>

              {/* Station Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "font-mono text-[9px] uppercase tracking-wider",
                      active ? "text-accent font-bold" : "text-text-3"
                    )}
                  >
                    {exp.period}
                  </span>
                  {exp.isCurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-accent">
                      <Radio size={9} className="animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="font-mono text-[8px] text-text-3 flex items-center gap-0.5">
                      <Compass size={9} /> ARCHIVE
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "mt-0.5 text-xs sm:text-[13px] font-bold leading-snug truncate transition-colors",
                    active ? "text-accent" : "text-text-1 group-hover:text-accent"
                  )}
                >
                  {exp.role}
                </p>

                <div className="mt-0.5 flex items-center justify-between text-[10px] text-text-3 font-mono">
                  <span className="truncate">{exp.company}</span>
                  {duration && <span className="shrink-0 text-text-3/80">({duration})</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </FadeUp>
  );
}
