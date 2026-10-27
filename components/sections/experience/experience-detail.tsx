"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  CheckCircle2,
  Cpu,
  Sparkles,
} from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import type { Experience } from "@/lib/types";
import { detailPanelId, tabId } from "./desktop-timeline";
import { formatDuration, isFreelance } from "./utils";
import { CompanyAvatar } from "./company-avatar";

export { companyInitials } from "./utils";

interface ExperienceDetailProps {
  experience: Experience;
}

export function ExperienceDetail({ experience }: Readonly<ExperienceDetailProps>) {
  const duration = formatDuration(experience.period);
  const freelance = isFreelance(experience.company, experience.role);

  return (
    <FadeUp delay={0.1} className="w-full h-full min-h-0 flex flex-col">
      <article
        id={detailPanelId}
        role="tabpanel"
        aria-labelledby={tabId(experience.id)}
        className="relative rounded-2xl border border-border/70 bg-bg-card shadow-xs transition-colors flex flex-col h-full min-h-0 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full min-h-0 overflow-hidden"
          >
            {/* Pinned Detail Header */}
            <header className="p-4 sm:p-5 pb-3 border-b border-border/50 shrink-0 bg-bg-card/90">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0">
                  <CompanyAvatar
                    company={experience.company}
                    companyLogo={experience.companyLogo}
                    isFreelance={freelance}
                    size="md"
                    className="rounded-lg border border-border/80 shadow-xs shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13.5px] sm:text-sm font-bold text-text-1 tracking-tight leading-snug">
                      {experience.role}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs font-semibold text-text-2 truncate">
                        {experience.company}
                      </p>
                      {freelance && (
                        <span className="rounded bg-accent/15 px-1.5 py-0.2 font-mono text-[8.5px] font-bold text-accent shrink-0">
                          Freelance
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {experience.isCurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      Current Role
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-bg-subtle/80 px-2 py-0.5 font-mono text-[9.5px] font-medium text-text-3">
                      <CheckCircle2 size={10} className="text-text-3" />
                      Previous Role
                    </span>
                  )}
                </div>
              </div>

              {/* Meta Row: Period, Duration, Location */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-[11px] text-text-2">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={11.5} className="text-accent shrink-0" aria-hidden="true" />
                  <span>
                    {experience.period}
                    {duration ? ` (${duration})` : ""}
                  </span>
                </div>

                {experience.location && (
                  <div className="flex items-center gap-1.5 text-text-3 font-sans">
                    <MapPin size={11.5} className="text-text-3 shrink-0" aria-hidden="true" />
                    <span>{experience.location}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Scrollable Detail Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 pt-3 space-y-3.5 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent]">
              {/* Technology Stack */}
              {experience.techStack?.length ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-text-3 flex items-center gap-1.5">
                      <Cpu size={11} className="text-accent" /> Technologies Used
                    </span>
                    <span className="font-mono text-[9.5px] text-text-3">
                      {experience.techStack.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {experience.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10.5px] rounded-md border border-border/60 bg-bg-subtle/60 px-2 py-0.5 text-text-2 transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Key Responsibilities & Contributions */}
              <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-0.5">
                  <span className="text-xs font-bold text-text-1 flex items-center gap-1.5 tracking-tight">
                    <Sparkles size={11.5} className="text-accent" aria-hidden="true" />
                    Key Responsibilities &amp; Contributions
                  </span>
                  <span className="font-mono text-[9.5px] text-text-3">
                    {experience.description.length} Deliverables
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {experience.description.map((desc, idx) => (
                    <li
                      key={`${desc}-${idx}`}
                      className="group/item flex items-start gap-2.5 rounded-lg transition-colors"
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[10.5px] font-semibold text-accent/80 shrink-0 w-4.5 pt-0.5 select-none group-hover/item:text-accent"
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[11.5px] leading-relaxed text-text-2 group-hover/item:text-text-1 transition-colors">
                        {desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </article>
    </FadeUp>
  );
}
