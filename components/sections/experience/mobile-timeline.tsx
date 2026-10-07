"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Orbit, Radio } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { TechChip } from "@/components/ui/tech-chip";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";
import { companyInitials } from "./experience-detail";
import { formatDuration } from "./utils";

interface MobileTimelineProps {
  experiences: Experience[];
}

const COLLAPSED_BULLETS = 2;

function MobileExperienceCard({ exp }: { exp: Experience }) {
  const [expanded, setExpanded] = useState(false);
  const duration = formatDuration(exp.period);
  const bullets = expanded ? exp.description : exp.description.slice(0, COLLAPSED_BULLETS);
  const hidden = exp.description.length - COLLAPSED_BULLETS;

  return (
    <article className="rounded-2xl border border-border/80 neumorphic p-4 shadow-[0_0_15px_rgba(2,132,199,0.08)]">
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold text-accent bg-accent/10 ring-1 ring-accent/30"
          >
            {companyInitials(exp.company)}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-snug text-text-1">{exp.role}</h3>
            <p className="text-xs font-medium text-text-2">{exp.company}</p>
          </div>
        </div>

        {exp.isCurrent ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-accent">
            <Radio size={8} className="animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-bg-subtle px-1.5 py-0.5 font-mono text-[8px] text-text-3">
            <Orbit size={8} />
            ORBIT
          </span>
        )}
      </header>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[10px] text-text-3">
        <span>
          {exp.period}
          {duration && <span className="text-text-3/80"> ({duration})</span>}
        </span>
        {exp.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={10} aria-hidden="true" />
            {exp.location}
          </span>
        )}
      </div>

      <ul className="mt-3 space-y-1.5">
        {bullets.map((d, idx) => (
          <li key={`${d}-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed text-text-2 bg-bg-subtle/30 p-1.5 rounded-md border border-border/30">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            <span className="text-[11px]">{d}</span>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2.5 inline-flex min-h-[44px] w-full items-center justify-center gap-1 rounded-lg border border-border/50 bg-bg-subtle/50 text-xs font-semibold text-accent hover:border-accent/40"
        >
          {expanded ? "Show less" : `View ${hidden} more deliverables`}
          <ChevronDown size={14} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
        </button>
      )}

      {exp.techStack?.length ? (
        <div className="mt-3 pt-2 border-t border-border/40 flex flex-wrap gap-1">
          {exp.techStack.map((tech, idx) => (
            <TechChip key={`${tech}-${idx}`} name={tech} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function MobileTimeline({ experiences }: MobileTimelineProps) {
  return (
    <ol className="relative mx-auto mt-4 max-w-2xl lg:hidden space-y-4">
      {experiences.map((exp, i) => (
        <li key={exp.id} className="relative">
          <FadeUp delay={i * 0.05}>
            <MobileExperienceCard exp={exp} />
          </FadeUp>
        </li>
      ))}
    </ol>
  );
}
