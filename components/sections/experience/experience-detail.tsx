import { CalendarDays, MapPin } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { TechChip } from "@/components/ui/tech-chip";
import type { Experience } from "@/lib/types";
import { detailPanelId, tabId } from "./desktop-timeline";
import { formatDuration } from "./utils";

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

  return (
    <FadeUp delay={0.1}>
      <article
        // Remount per role so the fade replays when switching tabs
        key={experience.id}
        id={detailPanelId}
        role="tabpanel"
        aria-labelledby={tabId(experience.id)}
        className="relative isolate animate-fade-in overflow-hidden rounded-3xl border border-border glass p-8 shadow-xl shadow-accent/5 xl:p-10 dark:shadow-black/20"
      >
        {/* Corner glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 -z-10 h-56 w-56 rounded-full bg-secondary/20 blur-3xl"
        />

        {/* Header */}
        <header className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-secondary/25 to-accent/15 font-semibold tracking-tight text-accent ring-1 ring-inset ring-secondary/25 dark:to-tertiary/15 dark:text-secondary"
          >
            {companyInitials(experience.company)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-text-1">{experience.role}</h3>
              {experience.isCurrent && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Current
                </span>
              )}
            </div>
            <p className="mt-1 font-medium text-text-2">{experience.company}</p>

            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-3">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} aria-hidden="true" />
                {experience.period}
                {duration && <span className="text-text-3/80">· {duration}</span>}
              </span>
              {experience.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} aria-hidden="true" />
                  {experience.location}
                </span>
              )}
            </p>
          </div>
        </header>

        <div className="my-7 h-px bg-linear-to-r from-border via-secondary/25 to-transparent" />

        {/* Responsibilities */}
        <ul className="space-y-3.5">
          {experience.description.map((desc, idx) => (
            <li key={`${desc}-${idx}`} className="flex items-start gap-3.5 text-[15px] leading-relaxed text-text-2">
              <span
                aria-hidden="true"
                className="mt-2.25 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-secondary to-accent ring-4 ring-secondary/10 dark:to-tertiary"
              />
              <span>{desc}</span>
            </li>
          ))}
        </ul>

        {/* Tech stack */}
        {experience.techStack?.length ? (
          <div className="mt-8">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-3">Tech stack</p>
            <div className="flex flex-wrap gap-2">
              {experience.techStack.map((tech, idx) => (
                <TechChip key={`${tech}-${idx}`} name={tech} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </FadeUp>
  );
}
