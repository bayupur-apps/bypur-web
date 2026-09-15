"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Code2, ExternalLink, Sparkles } from "lucide-react";
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = Boolean(project.content?.trim());

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-xl p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
      {/* Image placeholder */}
      <div className="relative aspect-video overflow-hidden bg-bg-subtle">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Code2 size={28} className="text-text-3 opacity-10" />
          </div>
        )}

        {project.featured && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-accent/30 bg-bg/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm">
            <Sparkles size={11} />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>

          {hasContent && (
            <>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-accent transition-colors hover:text-accent/80"
                aria-expanded={expanded}
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  size={13}
                  className={cn("transition-transform duration-200", expanded && "rotate-180")}
                />
              </button>
              {expanded && (
                <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-text-3">
                  {project.content}
                </p>
              )}
            </>
          )}
        </div>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((tech, idx) => (
            <Badge key={`${tech}-${idx}`}>{tech}</Badge>
          ))}
        </div>

        {/* Links */}
        <CardFooter>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-accent-fg shadow-sm shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent/30"
            >
              <ExternalLink
                size={13}
                className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
              Live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium text-text-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              <Code2 size={14} />
              Code
            </a>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
