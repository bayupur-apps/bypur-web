"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { TechChip } from "@/components/ui/tech-chip";
import { cn } from "@/lib/helpers";
import type { Experience } from "@/lib/types";
import { companyInitials } from "./experience-detail";
import { formatDuration } from "./utils";

interface MobileTimelineProps {
  experiences: Experience[];
}

// Six bullets per role makes a very long scroll on a phone - show the
// first few and let the reader expand.
const COLLAPSED_BULLETS = 3;

function MobileExperienceCard({ exp }: { exp: Experience }) {
  const [expanded, setExpanded] = useState(false);
  const duration = formatDuration(exp.period);
  const bullets = expanded ? exp.description : exp.description.slice(0, COLLAPSED_BULLETS);
  const hidden = exp.description.length - COLLAPSED_BULLETS;

  return (
    <article className="rounded-2xl border border-border glass p-5">
      <header className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-secondary/25 to-accent/15 text-sm font-semibold text-accent ring-1 ring-inset ring-secondary/25 dark:to-tertiary/15 dark:text-secondary"
        >
          {companyInitials(exp.company)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-text-1">{exp.role}</h3>
          <p className="mt-0.5 text-sm font-medium text-text-2">{exp.company}</p>
        </div>
      </header>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-3">
        <span>
          {exp.period}
          {duration && <span className="text-text-3/80"> · {duration}</span>}
        </span>
        {exp.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" />
            {exp.location}
          </span>
        )}
      </p>

      <ul className="mt-4 space-y-2.5">
        {bullets.map((d, idx) => (
          <li key={`${d}-${idx}`} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-2">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-secondary to-accent dark:to-tertiary"
            />
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-3 inline-flex min-h-9 items-center gap-1 text-sm font-medium text-accent dark:text-secondary"
        >
          {expanded ? "Show less" : `Show ${hidden} more`}
          <ChevronDown size={15} className={cn("transition-transform duration-300", expanded && "rotate-180")} />
        </button>
      )}

      {exp.techStack?.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
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
    <ol className="relative mx-auto mt-10 max-w-2xl lg:hidden">
      {/* Timeline line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1.75 top-2 w-px bg-linear-to-b from-secondary/50 via-border to-transparent"
      />

      {experiences.map((exp, i) => (
        <li key={exp.id} className="relative mb-8 pl-8 last:mb-0">
          {/* Dot */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 top-5 h-3.75 w-3.75 rounded-full border-2",
              exp.isCurrent
                ? "border-secondary bg-secondary shadow-md shadow-secondary/40"
                : "border-border bg-bg"
            )}
          />
          <FadeUp delay={i * 0.05}>
            <MobileExperienceCard exp={exp} />
          </FadeUp>
        </li>
      ))}
    </ol>
  );
}
