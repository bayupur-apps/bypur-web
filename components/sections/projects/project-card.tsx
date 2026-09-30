"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, Code2, Lock, Sparkles } from "lucide-react";
import { TechChip } from "@/components/ui/tech-chip";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";
import { ProjectCover } from "./project-cover";

interface ProjectCardProps {
  project: Project;
}

const VISIBLE_TECH = 4;
// Roughly three lines at card width - longer copy gets clamped with a toggle.
const LONG_DESCRIPTION = 150;

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = Boolean(project.content?.trim());
  const canExpand = hasContent || project.description.length > LONG_DESCRIPTION;
  const extraTech = project.techStack.length - VISIBLE_TECH;
  const hasLinks = Boolean(project.liveUrl || project.repoUrl);

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border glass transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl hover:shadow-secondary/10">
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden border-b border-border">
        <ProjectCover project={project} />

        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/50 glass-strong px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent dark:border-white/10 dark:text-secondary">
            <Sparkles size={11} />
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-text-1">{project.title}</h3>

        <p className={cn("mt-2 text-sm leading-relaxed text-text-2", !expanded && "line-clamp-3")}>
          {project.description}
        </p>
        {expanded && hasContent && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-3">{project.content}</p>
        )}
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-2 inline-flex items-center gap-1 self-start text-xs font-medium text-accent transition-colors hover:text-accent-hover dark:text-secondary"
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronDown size={13} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
          </button>
        )}

        {/* Stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, VISIBLE_TECH).map((tech, idx) => (
            <TechChip key={`${tech}-${idx}`} name={tech} />
          ))}
          {extraTech > 0 && (
            <span
              className="inline-flex items-center rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-text-3"
              title={project.techStack.slice(VISIBLE_TECH).join(", ")}
            >
              +{extraTech}
            </span>
          )}
        </div>

        <div className="min-h-5 flex-1" aria-hidden="true" />

        {/* Links - or say why there are none, instead of an empty footer */}
        <div className="flex items-center gap-2 border-t border-border pt-4">
          {hasLinks ? (
            <>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} live site`}
                  className="group/btn inline-flex min-h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-accent-fg shadow-sm shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30"
                >
                  Live site
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} source code`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium text-text-2 transition-all duration-200 hover:border-secondary/40 hover:text-text-1"
                >
                  <Code2 size={14} />
                  Source
                </a>
              )}
            </>
          ) : (
            <span className="inline-flex min-h-10 items-center gap-1.5 text-xs text-text-3">
              <Lock size={13} aria-hidden="true" />
              No public link
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
