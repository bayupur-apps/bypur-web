"use client";

import { useState } from "react";
import { ChevronDown, MapPin, CheckCircle2, CalendarDays, Cpu } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";
import { CompanyAvatar } from "./company-avatar";
import { formatDuration, isFreelance } from "./utils";

interface MobileTimelineProps {
  experiences: Experience[];
}

const COLLAPSED_BULLETS = 3;

function MobileExperienceCard({ exp }: Readonly<{ exp: Experience }>) {
  const [expanded, setExpanded] = useState(false);
  const duration = formatDuration(exp.period);
  const freelance = isFreelance(exp.company, exp.role);
  const bullets = expanded ? exp.description : exp.description.slice(0, COLLAPSED_BULLETS);
  const hidden = exp.description.length - COLLAPSED_BULLETS;

  return (
    <article className="rounded-xl border border-border/70 bg-bg-card p-3.5 sm:p-4 transition-all shadow-xs">
      {/* Header: Company & Role */}
      <header className="flex items-start justify-between gap-2.5 border-b border-border/50 pb-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          <CompanyAvatar
            company={exp.company}
            companyLogo={exp.companyLogo}
            isFreelance={freelance}
            size="md"
            className="rounded-lg border border-border/80 shadow-xs"
          />
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold leading-snug text-text-1 line-clamp-2">
              {exp.role}
            </h3>
            <div className="flex items-center gap-1.5 truncate mt-0.5">
              <p className="text-xs font-semibold text-text-2 truncate">{exp.company}</p>
              {freelance && (
                <span className="rounded bg-accent/15 px-1.5 py-0.2 font-mono text-[8.5px] font-bold text-accent shrink-0">
                  Freelance
                </span>
              )}
            </div>
          </div>
        </div>

        {exp.isCurrent ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-accent shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Current
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-bg-subtle/80 px-2 py-0.5 font-mono text-[9px] font-medium text-text-3 shrink-0">
            <CheckCircle2 size={9} className="text-text-3" />
            Previous
          </span>
        )}
      </header>

      {/* Temporal Meta */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] text-text-3">
        <span className="inline-flex items-center gap-1 font-medium text-text-2">
          <CalendarDays size={10} className="text-accent" />
          {exp.period}
          {duration && <span className="text-text-3 font-normal">({duration})</span>}
        </span>
        {exp.location && (
          <span className="inline-flex items-center gap-1 text-text-3">
            <MapPin size={10} aria-hidden="true" />
            {exp.location}
          </span>
        )}
      </div>

      {/* Deliverable Items */}
      <ul className="mt-2.5 space-y-1.5">
        {bullets.map((d, idx) => (
          <li
            key={`${d}-${idx}`}
            className="flex items-start gap-2 text-xs leading-relaxed text-text-2 py-0.5"
          >
            <span
              aria-hidden="true"
              className="mt-1 font-mono text-[9px] font-bold text-accent/80 shrink-0 select-none"
            >
              [{String(idx + 1).padStart(2, "0")}]
            </span>
            <span className="text-[11.5px] leading-relaxed text-text-2">{d}</span>
          </li>
        ))}
      </ul>

      {/* Show more toggle button with 44px min touch target */}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2.5 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-bg-subtle/40 text-xs font-semibold text-accent hover:border-accent/40 active:scale-98 transition-all"
        >
          {expanded ? "Show less" : `View ${hidden} more deliverables`}
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", expanded && "rotate-180")}
          />
        </button>
      )}

      {/* Tech Stack Pills */}
      {exp.techStack?.length ? (
        <div className="mt-3 pt-2 border-t border-border/40">
          <div className="flex items-center gap-1 mb-1.5 font-mono text-[9px] text-text-3 uppercase tracking-wider">
            <Cpu size={9} className="text-accent" /> Stack ({exp.techStack.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {exp.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9.5px] rounded border border-border/50 bg-bg-subtle/60 px-1.5 py-0.5 text-text-2"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function MobileTimeline({ experiences }: Readonly<MobileTimelineProps>) {
  return (
    <ol className="relative mx-auto mt-2 max-w-2xl lg:hidden pl-4 sm:pl-5 border-l-2 border-border/70 ml-4 sm:ml-5 space-y-3.5">
      {experiences.map((exp, i) => (
        <li key={exp.id} className="relative">
          {/* Station Node Marker on Timeline Spine */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-[23px] sm:-left-[27px] top-4.5 rounded-full ring-4 ring-bg transition-all",
              exp.isCurrent
                ? "h-3 w-3 bg-accent shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                : "h-2.5 w-2.5 bg-border/90 border border-bg-card"
            )}
          />

          <FadeUp delay={i * 0.04}>
            <MobileExperienceCard exp={exp} />
          </FadeUp>
        </li>
      ))}
    </ol>
  );
}
