"use client";

import { ArrowUpRight, Code2, Lock, Maximize2, Sparkles } from "lucide-react";
import { TechChip } from "@/components/ui/tech-chip";
import type { Project } from "@/lib/types";
import { ProjectCover } from "./project-cover";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenSpecs: (project: Project) => void;
}

const VISIBLE_TECH = 4;

export function ProjectCard({ project, index, onOpenSpecs }: ProjectCardProps) {
  const extraTech = project.techStack.length - VISIBLE_TECH;
  const systemCode = `SYS-${String(index + 1).padStart(2, "0")}`;
  const highlight = project.architectureHighlights?.[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl neumorphic border border-border/70 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_20px_rgba(2,132,199,0.08)]">
      {/* Top accent glow line on card hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10"
      />

      {/* Interactive Cover: Opens specs modal */}
      <button
        type="button"
        onClick={() => onOpenSpecs(project)}
        aria-label={`Open ${project.title} specifications`}
        className="relative block aspect-[16/8] w-full overflow-hidden border-b border-border/60 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ProjectCover project={project} />

        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md neumorphic-chip px-1.5 py-0.5 font-mono text-[9px] font-bold text-text-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            {systemCode}
          </span>
          {project.endpoints && project.endpoints.length > 0 && (
            <span className="hidden sm:inline-flex rounded-md neumorphic-chip px-1.5 py-0.5 font-mono text-[9px] font-medium text-text-3">
              {project.endpoints.length} EP
            </span>
          )}
        </div>

        {project.featured && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md neumorphic-chip px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-accent">
            <Sparkles size={9} aria-hidden="true" />
            Featured
          </span>
        )}

        {/* Tactile Hover Prompt */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-secondary/15 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-bg-card/95 px-3 py-1 text-xs font-semibold text-accent shadow-md">
            <Maximize2 size={12} aria-hidden="true" />
            Inspect Specs
          </span>
        </div>
      </button>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="text-sm font-bold leading-snug tracking-tight text-text-1 transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-2">
          {project.description}
        </p>

        {/* Architecture Highlight (Proof-of-work) */}
        {highlight && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-bg-subtle/50 px-2 py-1 border border-border/40 font-mono text-[10px] text-text-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
            <span className="truncate">{highlight}</span>
          </div>
        )}

        {/* Tech Stack Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, VISIBLE_TECH).map((tech, idx) => (
            <TechChip key={`${tech}-${idx}`} name={tech} />
          ))}
          {extraTech > 0 && (
            <span
              className="inline-flex items-center rounded-lg neumorphic-chip px-2 py-0.5 font-mono text-[10px] font-medium text-text-3"
              title={project.techStack.slice(VISIBLE_TECH).join(", ")}
            >
              +{extraTech}
            </span>
          )}
        </div>

        <div className="flex-1" aria-hidden="true" />

        {/* Footer Action Bar */}
        <div className="mt-3.5 flex items-center gap-2 border-t border-border/50 pt-3">
          <button
            type="button"
            onClick={() => onOpenSpecs(project)}
            aria-label={`Open ${project.title} specifications`}
            className="inline-flex min-h-11 sm:min-h-9 items-center gap-1.5 rounded-xl neumorphic-chip px-3 text-xs font-semibold text-text-2 transition-all hover:border-accent/40 hover:text-accent active:scale-95"
          >
            <Maximize2 size={12} aria-hidden="true" />
            Specs
          </button>

          <div className="ml-auto flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} source code`}
                className="inline-flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-xl neumorphic-chip text-text-2 transition-all hover:border-accent/40 hover:text-text-1 active:scale-95"
              >
                <Code2 size={14} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 sm:min-h-9 items-center gap-1 rounded-xl bg-accent px-3 text-xs font-semibold text-accent-fg shadow-sm transition-all hover:bg-accent-hover active:scale-95"
              >
                Live
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            )}
            {!project.repoUrl && !project.liveUrl && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-text-3">
                <Lock size={11} aria-hidden="true" />
                Private
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
