"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Sparkles, Orbit, Radio } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { TechChip } from "@/components/ui/tech-chip";
import type { Experience } from "@/lib/types";
import { detailPanelId, tabId } from "./desktop-timeline";
import { formatDuration } from "./utils";
import { cn } from "@/lib/helpers";

interface ExperienceDetailProps {
  experience: Experience;
}

/** Company initials for the logo tile ("PT Ethos Kreatif Indonesia" -> "EK"). */
export function companyInitials(company: string) {
  const words = company
    .replace(/^(pt|cv|tbk)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
  const duration = formatDuration(experience.period);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <FadeUp delay={0.1}>
      <article
        key={experience.id}
        id={detailPanelId}
        role="tabpanel"
        aria-labelledby={tabId(experience.id)}
        className="relative isolate animate-fade-in overflow-hidden rounded-2xl neumorphic p-4 sm:p-5 flex flex-col justify-between min-h-[380px] xl:min-h-[390px] max-h-[380px] xl:max-h-[390px] shadow-[0_0_25px_rgba(2,132,199,0.12)] border border-border/70"
      >
        {/* Floating Station Ambient Halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        />

        {/* Floating Station Header */}
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl neumorphic-chip font-mono font-bold text-sm tracking-tight text-accent ring-1 ring-accent/30 shadow-[0_0_10px_rgba(2,132,199,0.2)]"
            >
              {companyInitials(experience.company)}
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-text-1">
                  {experience.role}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-text-2 truncate">
                {experience.company}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10px] text-text-3">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={11} aria-hidden="true" />
                  {experience.period}
                  {duration && <span className="text-text-3/80">({duration})</span>}
                </span>
                {experience.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} aria-hidden="true" />
                    {experience.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Orbit Corner Badge */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            {experience.isCurrent ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-bold text-accent shadow-[0_0_8px_rgba(2,132,199,0.3)]">
                <Radio size={9} className="animate-pulse text-accent" />
                Active Station
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-bg-subtle/70 px-2 py-0.5 font-mono text-[9px] font-medium text-text-3">
                <Orbit size={9} />
                Completed Orbit
              </span>
            )}
            <span className="font-mono text-[8px] text-text-3">
              ZERO-GRAVITY SPEC
            </span>
          </div>
        </header>

        <div className="my-2.5 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

        {/* Levitating Responsibilities (Staggered Micro-cards) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] text-text-3">
            <span className="flex items-center gap-1 text-accent">
              <Sparkles size={11} /> MISSION RESPONSIBILITIES
            </span>
            <span>{experience.description.length} CORE DELIVERABLES</span>
          </div>

          <ul className="space-y-1.5 overflow-y-auto custom-workspace-scroll pr-1 py-0.5 flex-1 max-h-[145px]">
            <AnimatePresence mode="popLayout">
              {experience.description.map((desc, idx) => {
                const isHovered = hoveredIndex === idx;

                return (
                  <motion.li
                    key={`${desc}-${idx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      "group/bullet flex items-start gap-2 rounded-md border p-1.5 text-xs leading-relaxed transition-all duration-150",
                      isHovered
                        ? "border-accent/50 bg-bg-subtle/80 text-text-1 shadow-[0_0_10px_rgba(2,132,199,0.15)]"
                        : "border-border/40 bg-bg-subtle/30 text-text-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                        isHovered ? "bg-accent shadow-[0_0_6px_rgba(2,132,199,0.8)]" : "bg-accent/60"
                      )}
                    />
                    <span className="text-[11px] sm:text-xs">{desc}</span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>

        {/* Orbital Tech Stack Constellation */}
        {experience.techStack?.length ? (
          <div className="mt-2.5 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between mb-1 font-mono text-[9px] text-text-3">
              <span className="uppercase tracking-wider">
                Orbital Tech Stack ({experience.techStack.length})
              </span>
              <span className="text-accent">Hover for details</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-[55px] overflow-y-auto custom-workspace-scroll pr-1">
              {experience.techStack.map((tech, idx) => (
                <div
                  key={`${tech}-${idx}`}
                  className="transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <TechChip name={tech} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </FadeUp>
  );
}
