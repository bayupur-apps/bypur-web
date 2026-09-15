import { FadeUp } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/lib/types";

interface ExperienceDetailProps {
  experience: Experience;
}

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
  return (
    <FadeUp delay={0.15}>
      <article
        key={experience.id}
        className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg xl:p-9"
      >
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/5 blur-3xl transition-opacity group-hover:opacity-100" />

        <div className="relative">
          {/* Header with badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                    {experience.period}
                  </span>
                </div>
                {experience.isCurrent && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-500">
                      Currently working here
                    </span>
                  </div>
                )}
              </div>
              <h3 className="mt-3 text-[22px] font-bold tracking-tight text-text-1 sm:text-2xl">
                {experience.role}
              </h3>
              <p className="mt-1.5 text-[14px] font-medium text-text-2">{experience.company}</p>
            </div>
          </div>

          <div className="my-6 h-px w-full bg-linear-to-r from-border via-accent/20 to-transparent" />

          {/* Responsibilities */}
          <ul className="mb-6 flex flex-col gap-3.5">
            {experience.description.map((desc, idx) => (
              <li
                key={`${desc}-${idx}`}
                className="group/item flex items-start gap-3 text-[14px] leading-relaxed text-text-2"
              >
                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/10 text-[10px] font-bold text-accent transition-colors group-hover/item:bg-accent group-hover/item:text-accent-fg">
                  {idx + 1}
                </span>
                <span className="flex-1">{desc}</span>
              </li>
            ))}
          </ul>

          {/* Tech stack */}
          {experience.techStack?.length ? (
            <div className="rounded-lg border border-border/50 bg-bg-subtle/50 p-4">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {experience.techStack.map((tech, idx) => (
                  <Badge key={`${tech}-${idx}`} variant="tech">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </FadeUp>
  );
}
