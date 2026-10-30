"use client";

import { useRef, useMemo, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";
import {
  formatDuration,
  isFreelance,
  getReverseChronologicalExperiences,
} from "./utils";

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
}: Readonly<DesktopTimelineProps>) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  // Reverse-chronological order: latest/current at top, earliest at bottom
  const orderedExperiences = useMemo(() => {
    return getReverseChronologicalExperiences(experiences);
  }, [experiences]);

  const hasMultiple = orderedExperiences.length > 1;

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (!hasMultiple) return;

    const last = orderedExperiences.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
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
    const nextItem = orderedExperiences[next];
    onSelect(nextItem.id);
    const nextEl = tabsRef.current[next];
    if (nextEl) {
      nextEl.focus();
      if (typeof nextEl.scrollIntoView === "function") {
        nextEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  };

  return (
    <FadeUp delay={0.05} className="w-full h-full min-h-0 flex flex-col">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Experience timeline"
        className="relative w-full h-full min-h-0 flex flex-col justify-start gap-2.5 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] py-0.5 pr-0.5"
      >
        {/* Continuous Vertical Spine behind the station dots */}
        {hasMultiple && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-[2px] bg-border/60"
          />
        )}

        {orderedExperiences.map((exp, i) => {
          const active = selectedId === exp.id;
          const duration = formatDuration(exp.period);
          const freelance = isFreelance(exp.company, exp.role);

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
              tabIndex={active || !hasMultiple ? 0 : -1}
              onClick={() => onSelect(exp.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl p-3 text-left transition-colors duration-150 cursor-pointer min-h-[44px] shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent border",
                active
                  ? "border-accent/40 shadow-xs"
                  : "border-border/40 bg-bg-card/40 hover:border-border/80 hover:bg-bg-card/80"
              )}
            >
              {/* Gliding Active Background Pill */}
              {active && (
                <motion.div
                  layoutId="activeExperienceCard"
                  className="absolute inset-0 rounded-xl bg-accent/10 border border-accent/40 shadow-xs pointer-events-none"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 400, damping: 30 }
                  }
                />
              )}

              {/* Milestone Node on the Vertical Spine */}
              <div className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                {active ? (
                  <motion.span
                    layoutId="activeVerticalDotRing"
                    className="absolute -inset-1 rounded-full border border-accent/70 bg-accent/15"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 30 }
                    }
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-10 rounded-full transition-all duration-150",
                    active
                      ? "h-3 w-3 bg-accent ring-2 ring-background shadow-xs"
                      : "h-2.5 w-2.5 border-2 border-border/80 bg-bg-card group-hover:border-accent/80 group-hover:scale-110"
                  )}
                />
              </div>

              {/* Milestone Information */}
              <div className="relative z-10 min-w-0 flex-1">
                {/* Period & Status Pill */}
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={cn(
                      "font-mono text-[11px] transition-colors",
                      active ? "text-accent font-semibold" : "text-text-3 group-hover:text-text-2"
                    )}
                  >
                    {exp.period}
                  </span>
                  {exp.isCurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.2 font-mono text-[9.5px] font-semibold text-accent shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Current
                    </span>
                  ) : null}
                </div>

                {/* Role Title */}
                <p
                  className={cn(
                    "mt-0.5 text-xs sm:text-[12.5px] font-bold leading-snug line-clamp-2 transition-colors",
                    active ? "text-text-1" : "text-text-2 group-hover:text-text-1"
                  )}
                >
                  {exp.role}
                </p>

                {/* Company Name & Duration */}
                <div className="mt-0.5 flex items-baseline justify-between gap-2 font-mono text-[11px] text-text-3">
                  <span className="truncate font-medium text-text-2">
                    {exp.company}
                    {freelance && (
                      <span className="ml-1.5 rounded bg-accent/15 px-1 py-0.2 font-mono text-[9px] font-bold text-accent">
                        FL
                      </span>
                    )}
                  </span>
                  {duration && (
                    <span className="shrink-0 text-[10px] text-text-3">
                      {duration}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </FadeUp>
  );
}
