"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Orbit, Radio } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";
import { companyInitials } from "./experience-detail";
import { formatDuration } from "./utils";

interface MobileTimelineProps {
  experiences: Experience[];
}

const COLLAPSED_BULLETS = 3;

function MobileExperienceCard({ exp }: { exp: Experience }) {
  const [expanded, setExpanded] = useState(false);
  const duration = formatDuration(exp.period);
  const bullets = expanded ? exp.description : exp.description.slice(0, COLLAPSED_BULLETS);
  const hidden = exp.description.length - COLLAPSED_BULLETS;

  return (
    <article className="rounded-xl border border-border/70 bg-bg-card p-4 transition-all">
      <header className="flex items-start justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-accent bg-accent/10 border border-accent/30"
          >
            {companyInitials(exp.company)}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-snug text-text-1">{exp.role}</h3>
            <p className="text-xs font-semibold text-text-2">{exp.company}</p>
          </div>
        </div>

        {exp.isCurrent ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[8px] font-bold text-accent">
            <Radio size={8} />
            LIVE
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 rounded-md bg-bg-subtle px-2 py-0.5 font-mono text-[8px] font-medium text-text-2 border border-border/50">
            <Orbit size={8} />
            PRIOR
          </span>
        )}
      </header>

      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[10px] text-text-3">
        <span className="font-medium text-text-2">
          {exp.period}
          {duration && <span className="text-text-3 font-normal"> ({duration})</span>}
        </span>
        {exp.location && (
          <span className="inline-flex items-center gap-1 text-text-3">
            <MapPin size={10} aria-hidden="true" />
            {exp.location}
          </span>
        )}
      </div>

      <ul className="mt-3 space-y-1.5">
        {bullets.map((d, idx) => (
          <li key={`${d}-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed text-text-2 py-0.5">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            <span className="text-[11.5px] leading-relaxed">{d}</span>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2.5 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-bg-subtle/50 text-xs font-semibold text-accent hover:border-accent/40 active:scale-98 transition-all"
        >
          {expanded ? "Show less" : `View ${hidden} more deliverables`}
          <ChevronDown size={14} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
        </button>
      )}

      {exp.techStack?.length ? (
        <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-wrap gap-1.5">
          {exp.techStack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] rounded-md border border-border/50 bg-bg-subtle/60 px-2 py-0.5 text-text-2"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function MobileTimeline({ experiences }: MobileTimelineProps) {
  return (
    <ol className="relative mx-auto mt-2.5 max-w-2xl lg:hidden pl-5 border-l-2 border-border/80 ml-2.5 space-y-3.5">
      {experiences.map((exp, i) => (
        <li key={exp.id} className="relative">
          {/* Chronologic Node Marker on Timeline Spine */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-[27px] top-4.5 rounded-full ring-4 ring-bg transition-all",
              exp.isCurrent
                ? "h-3 w-3 bg-accent shadow-[0_0_8px_rgba(37,99,235,0.6)]"
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
