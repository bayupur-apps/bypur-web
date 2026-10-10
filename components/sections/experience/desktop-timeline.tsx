"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
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
    <FadeUp delay={0.05} className="w-full h-full">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Career experience timeline"
        className="relative rounded-xl border border-border/70 bg-bg-card p-3 sm:p-3.5 flex flex-col justify-between gap-2.5 h-full"
      >
        <div className="flex flex-col gap-2 flex-1">
          {/* Timeline Index Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-border/50 font-mono text-[10px] text-text-2 px-1">
            <span className="flex items-center gap-1.5 text-accent font-bold">
              <Orbit size={12} /> EXPERIENCE TIMELINE
            </span>
            <span className="font-medium text-text-3">
              ROLE {experiences.findIndex((e) => e.id === selectedId) + 1} OF {experiences.length}
            </span>
          </div>

          {/* Stations List with Connecting Conduit */}
          <div className="relative flex flex-col gap-2.5 pt-1">
            {/* Conduit Hairline accurately connecting from top station to bottom station */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-px bg-border/60"
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
                    "group relative flex items-start gap-2.5 rounded-lg p-3 text-left transition-all duration-150",
                    active
                      ? "text-accent"
                      : "border border-border/50 bg-bg-card/50 text-text-2 hover:border-accent/40 hover:bg-bg-card hover:text-text-1"
                  )}
                >
                {/* Active station spring indicator */}
                {active && (
                  <motion.div
                    layoutId="activeStationHighlight"
                    className="absolute inset-0 rounded-lg bg-bg-card border border-accent/60 shadow-xs pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Beacon Marker */}
                <div className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-200",
                      active
                        ? "bg-accent shadow-xs scale-110"
                        : "bg-border group-hover:bg-accent/60"
                    )}
                  />
                </div>

                {/* Station Content */}
                <div className="relative z-10 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={cn(
                        "font-mono text-[9px] uppercase tracking-wider font-semibold",
                        active ? "text-accent" : "text-text-2"
                      )}
                    >
                      {exp.period}
                    </span>
                    {exp.isCurrent ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-accent">
                        <Radio size={8} />
                        CURRENT
                      </span>
                    ) : (
                      <span className="font-mono text-[8px] text-text-3 flex items-center gap-0.5">
                        <Compass size={8} /> COMPLETED
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

                  <div className="mt-0.5 flex items-center justify-between text-[10.5px] text-text-2 font-mono">
                    <span className="truncate font-medium">{exp.company}</span>
                    {duration && <span className="shrink-0 text-text-3 text-[9.5px]">({duration})</span>}
                  </div>
                </div>
              </button>
            );
          })}
          </div>
        </div>

        {/* Tenure Summary Pod: Clean and minimal */}
        <div className="pt-2 border-t border-border/50">
          <div className="rounded-lg border border-border/50 bg-bg-subtle/40 px-3 py-2 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Orbit size={11} />
              </span>
              <div>
                <p className="font-bold text-text-1 leading-tight text-[10px]">Engineering Track</p>
                <p className="text-[8.5px] text-text-3">Full Stack Architecture</p>
              </div>
            </div>
            <span className="rounded-md bg-accent/15 px-2 py-0.5 font-bold text-accent text-[9px]">
              3+ YRS ACTIVE
            </span>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
