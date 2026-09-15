import { FadeUp } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/lib/types";

interface MobileTimelineProps {
  experiences: Experience[];
}

export function MobileTimeline({ experiences }: MobileTimelineProps) {
  return (
    <div className="relative mx-auto mt-8 max-w-2xl lg:hidden">
      {/* Timeline gradient line */}
      <div className="pointer-events-none absolute bottom-0 left-4 top-0 w-0.5 bg-linear-to-b from-accent/30 via-border to-transparent" />

      {experiences.map((exp, i) => (
        <FadeUp key={exp.id} delay={i * 0.05}>
          <div className="relative mb-12 pl-10 last:mb-0">
            {/* Enhanced dot */}
            <span className="absolute left-2.5 top-2 flex h-3 w-3 items-center justify-center">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-accent/30" />
              <span className="relative h-3 w-3 rounded-full border-2 border-accent bg-bg shadow-md shadow-accent/20" />
            </span>

            <div className="group mb-3 rounded-md border border-border bg-bg-card p-5 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    {exp.period}
                  </span>
                </div>
                {exp.isCurrent && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500">
                      Now
                    </span>
                  </div>
                )}
              </div>

              <h3 className="mt-2 text-[16px] font-bold text-text-1">{exp.role}</h3>
              <p className="mt-0.5 text-[13px] font-medium text-text-2">{exp.company}</p>

              <ul className="mt-4 space-y-2">
                {exp.description.map((d, idx) => (
                  <li
                    key={`${d}-${idx}`}
                    className="flex items-start gap-2 text-[13px] leading-relaxed text-text-2"
                  >
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-accent/10 text-[9px] font-bold text-accent">
                      {idx + 1}
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              {exp.techStack?.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.techStack.map((tech, idx) => (
                    <Badge key={`${tech}-${idx}`} variant="outline" className="text-[11px]">
                      {tech}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
