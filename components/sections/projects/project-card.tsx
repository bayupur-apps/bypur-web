"use client";

import { ArrowUpRight, Code2, Lock, Maximize2, Sparkles } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectCover } from "./project-cover";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenSpecs: (project: Project) => void;
}

const VISIBLE_TECH = 3;

export function ProjectCard({ project, index, onOpenSpecs }: ProjectCardProps) {
  const systemCode = `SYS-${String(index + 1).padStart(2, "0")}`;
  const highlight = project.architectureHighlights?.[0];
  const extraTech = project.techStack.length - VISIBLE_TECH;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm">
      {/* Interactive Cover Header */}
      <button
        type="button"
        onClick={() => onOpenSpecs(project)}
        aria-label={`Open ${project.title} specifications`}
        className="relative block aspect-[16/6.5] sm:aspect-[16/5.2] w-full overflow-hidden border-b border-border/50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ProjectCover project={project} />

        {/* Minimal System Code & Status Badges */}
        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 flex items-center gap-1.5 max-w-[65%]">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-bg/90 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-text-2 backdrop-blur-xs shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            {systemCode}
          </span>
          {project.endpoints && project.endpoints.length > 0 && (
            <span className="hidden sm:inline-flex rounded-md border border-border/50 bg-bg/90 px-2 py-0.5 font-mono text-[9px] text-text-3 backdrop-blur-xs">
              {project.endpoints.length} EP
            </span>
          )}
        </div>

        {project.featured && (
          <span className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 inline-flex items-center gap-1 rounded-md border border-accent/40 bg-bg/90 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-accent backdrop-blur-xs">
            <Sparkles size={9} aria-hidden="true" />
            Featured
          </span>
        )}
      </button>

      {/* Card Content: Typography-first, calibrated padding for mobile */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4.5">
        <h3 className="text-sm font-bold leading-snug tracking-tight text-text-1 transition-colors group-hover:text-accent">
          {project.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-2">
          {project.description}
        </p>

        {/* Architecture Highlight: Clean typography note with dot */}
        {highlight && (
          <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10.5px] text-text-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
            <span className="truncate">{highlight}</span>
          </div>
        )}

        {/* Tech Stack: Clean monospaced flow */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[10.5px] text-text-3">
          {project.techStack.slice(0, VISIBLE_TECH).map((tech, idx) => (
            <span key={`${tech}-${idx}`} className="text-text-2">
              {tech}
              {idx < Math.min(project.techStack.length, VISIBLE_TECH) - 1 ? (
                <span className="ml-1.5 text-text-3/60">·</span>
              ) : null}
            </span>
          ))}
          {extraTech > 0 && (
            <span
              className="text-text-3 text-[10px]"
              title={project.techStack.slice(VISIBLE_TECH).join(", ")}
            >
              +{extraTech} more
            </span>
          )}
        </div>

        <div className="flex-1" aria-hidden="true" />

        {/* Footer Action Bar: Clean inline actions */}
        <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-2.5">
          <button
            type="button"
            onClick={() => onOpenSpecs(project)}
            aria-label={`Open ${project.title} specifications`}
            className="inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 text-xs font-semibold text-text-2 transition-colors hover:text-accent active:scale-95"
          >
            <Maximize2 size={12} aria-hidden="true" />
            <span>Specs</span>
          </button>

          <div className="flex items-center gap-1.5">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} source code`}
                className="inline-flex min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 items-center justify-center rounded-lg text-text-3 transition-colors hover:bg-bg-subtle hover:text-text-1 active:scale-95"
              >
                <Code2 size={14} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 sm:min-h-8 items-center gap-1 rounded-md bg-accent px-2.5 text-xs font-semibold text-accent-fg shadow-xs transition-all hover:bg-accent-hover active:scale-95"
              >
                <span>Live</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            )}
            {!project.repoUrl && !project.liveUrl && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-text-3">
                <Lock size={10} aria-hidden="true" />
                Private
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
