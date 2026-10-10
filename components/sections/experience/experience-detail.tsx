"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Sparkles, Orbit, Radio } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import type { Experience } from "@/lib/types";
import { detailPanelId, tabId } from "./desktop-timeline";
import { formatDuration } from "./utils";

interface ExperienceDetailProps {
  experience: Experience;
}

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

  return (
    <FadeUp delay={0.1} className="w-full h-full">
      <article
        id={detailPanelId}
        role="tabpanel"
        aria-labelledby={tabId(experience.id)}
        className="relative isolate overflow-hidden rounded-xl border border-border/70 bg-bg-card p-4 sm:p-5 flex flex-col justify-between h-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between h-full w-full gap-2.5"
          >
            {/* Header: Company & Role */}
            <header className="flex items-start justify-between gap-2.5 border-b border-border/50 pb-3">
              <div className="flex items-start gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono font-bold text-xs tracking-tight text-accent bg-accent/10 border border-accent/30"
                >
                  {companyInitials(experience.company)}
                </span>

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold tracking-tight text-text-1">
                    {experience.role}
                  </h3>
                  <p className="text-xs font-semibold text-text-2 truncate">
                    {experience.company}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10px] text-text-3">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <CalendarDays size={11} aria-hidden="true" className="text-accent" />
                      {experience.period}
                      {duration && <span className="text-text-3/70">({duration})</span>}
                    </span>
                    {experience.location && (
                      <span className="inline-flex items-center gap-1 font-medium text-text-3">
                        <MapPin size={11} aria-hidden="true" />
                        {experience.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex flex-col items-end gap-0.5">
                {experience.isCurrent ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-bold text-accent">
                    <Radio size={8} className="text-accent" />
                    Active Role
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-bg-subtle/80 px-2 py-0.5 font-mono text-[9px] font-medium text-text-2 border border-border/50">
                    <Orbit size={8} />
                    Completed
                  </span>
                )}
              </div>
            </header>

            {/* Mission Deliverables: Clean editorial list without boxes around each bullet */}
            <div className="flex-1 flex flex-col min-h-0 my-1">
              <div className="flex items-center justify-between mb-2 font-mono text-[10px] text-text-3">
                <span className="flex items-center gap-1.5 text-accent font-semibold">
                  <Sparkles size={11} /> KEY RESPONSIBILITIES &amp; IMPACT
                </span>
                <span className="font-medium text-text-3/80">{experience.description.length} DELIVERABLES</span>
              </div>

              <ul className="space-y-2 py-0.5 min-h-0 overflow-y-auto custom-workspace-scroll pr-1">
                {experience.description.map((desc, idx) => (
                  <li
                    key={`${desc}-${idx}`}
                    className="flex items-start gap-2.5 text-xs text-text-2 leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="flex-1 font-sans">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Production Tech Stack: Clean monospaced flow */}
            {experience.techStack?.length ? (
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between mb-1.5 font-mono text-[9.5px] text-text-3">
                  <span className="uppercase tracking-wider font-semibold text-text-2">
                    Technologies Used ({experience.techStack.length})
                  </span>
                  <span className="text-text-3 text-[9px]">Production Stack</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {experience.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10.5px] rounded-md border border-border/50 bg-bg-subtle/60 px-2 py-0.5 text-text-2"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </article>
    </FadeUp>
  );
}
