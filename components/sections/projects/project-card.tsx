"use client";

import { ArrowUpRight, Code2, Lock, SlidersHorizontal, Sparkles, Server } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectCover } from "./project-cover";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenSpecs: (project: Project) => void;
}

const VISIBLE_TECH = 3;

export function ProjectCard({ project, index, onOpenSpecs }: Readonly<ProjectCardProps>) {
  const systemCode = `SYS-${String(index + 1).padStart(2, "0")}`;
  const extraTech = project.techStack.length - VISIBLE_TECH;
  const endpointCount = project.endpoints?.length ?? 0;

  return (
    <SpotlightCard className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-md">
      {/* 01. Visual Cover Stage (Subtly tuned aspect ratio) */}
      <button
        type="button"
        onClick={() => onOpenSpecs(project)}
        aria-label={`Open ${project.title} specifications`}
        className="relative block aspect-[16/7.8] w-full overflow-hidden border-b border-border/50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
      >
        <ProjectCover project={project} />

        {/* Top Badges Overlay */}
        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 flex items-center gap-1.5 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-bg-card/90 dark:bg-[#0D0F15]/90 px-2 py-0.5 font-mono text-[9px] font-semibold text-text-1 backdrop-blur-xs shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            {systemCode}
          </span>
          {endpointCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-bg-card/90 dark:bg-[#0D0F15]/90 px-2 py-0.5 font-mono text-[8.5px] text-text-3 backdrop-blur-xs shadow-2xs">
              <Server size={9} className="text-accent" />
              {endpointCount} EP
            </span>
          )}
        </div>

        {project.featured && (
          <span className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/15 px-2 py-0.5 font-mono text-[9px] font-bold text-accent backdrop-blur-xs shadow-2xs z-20">
            <Sparkles size={9} aria-hidden="true" />
            Featured
          </span>
        )}
      </button>

      {/* 02. Clean Typography & Essential Architecture Info (Subtly reduced padding) */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm sm:text-[14.5px] font-bold leading-snug tracking-tight text-text-1 transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {project.liveUrl && (
            <span className="shrink-0 font-mono text-[8.5px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              LIVE
            </span>
          )}
        </div>

        {/* Clean, readable description */}
        <p className="mt-1.5 text-xs leading-relaxed text-text-2 line-clamp-2">
          {project.description}
        </p>

        {/* Minimal Tech Chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {project.techStack.slice(0, VISIBLE_TECH).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border/60 bg-bg-subtle/80 px-2 py-0.5 font-mono text-[8.5px] text-text-2"
            >
              {tech}
            </span>
          ))}
          {extraTech > 0 && (
            <span className="font-mono text-[8.5px] text-text-3 px-1">
              +{extraTech}
            </span>
          )}
        </div>

        {/* Flex Spacer */}
        <div className="flex-1 min-h-2" aria-hidden="true" />

        {/* 03. Elegant Action Bar (Subtly reduced margin & padding) */}
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
          <button
            type="button"
            onClick={() => onOpenSpecs(project)}
            aria-label={`Open ${project.title} specifications`}
            className="inline-flex min-h-11 sm:min-h-7 items-center gap-1.5 rounded-lg border border-border/70 bg-bg-subtle/50 px-2.5 text-xs font-semibold text-text-2 transition-all hover:border-accent hover:text-accent active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal size={12} aria-hidden="true" className="text-accent" />
            <span>Specifications</span>
          </button>

          <div className="flex items-center gap-1.5">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source code for ${project.title}`}
                className="inline-flex min-h-11 min-w-11 sm:min-h-7 sm:min-w-7 items-center justify-center rounded-lg border border-border/70 bg-bg-card text-text-3 transition-colors hover:border-accent/40 hover:text-text-1 active:scale-95"
              >
                <Code2 size={13} />
              </a>
            )}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 sm:min-h-7 items-center gap-1.5 rounded-lg bg-accent px-2.5 text-xs font-semibold text-accent-fg shadow-xs transition-all hover:bg-accent-hover active:scale-95"
              >
                <span>Live Demo</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-bg-subtle/40 px-2 py-0.5 font-mono text-[8.5px] text-text-3">
                <Lock size={9} aria-hidden="true" />
                Private Spec
              </span>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
