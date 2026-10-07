"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FolderGit2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "./projects/project-card";
import { ProjectDetailModal } from "./projects/project-detail-modal";
import { generateTags, sortByFeatured } from "./projects/utils";
import { usePortfolio } from "@/contexts/portfolio-context";
import { SectionContainer } from "@/components/ui/section-container";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";

const CARDS_PER_PAGE = 3;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
  }),
};

export default function ProjectsSection() {
  const { profile: profileData, projects } = usePortfolio();
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const tags = useMemo(() => generateTags(projects), [projects]);
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach((p) =>
      p.techStack.forEach((t) => (map[t] = (map[t] ?? 0) + 1))
    );
    return map;
  }, [projects]);
  const ordered = useMemo(() => sortByFeatured(projects), [projects]);

  const activeFilter = tags.includes(filter) ? filter : "All";
  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? ordered
        : ordered.filter((p) => p.techStack.includes(activeFilter)),
    [activeFilter, ordered]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages - 1);

  const handleFilterChange = (tag: string) => {
    setFilter(tag);
    setCurrentPage(0);
    setDirection(1);
  };

  const handlePageChange = useCallback((newPage: number, newDirection: number) => {
    setDirection(newDirection);
    setCurrentPage(newPage);
  }, []);

  // Keyboard navigation for carousel slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalProject) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && safePage > 0) {
        handlePageChange(safePage - 1, -1);
      } else if (e.key === "ArrowRight" && safePage < totalPages - 1) {
        handlePageChange(safePage + 1, 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [safePage, totalPages, modalProject, handlePageChange]);

  const visibleProjects = useMemo(() => {
    const start = safePage * CARDS_PER_PAGE;
    return filtered.slice(start, start + CARDS_PER_PAGE);
  }, [filtered, safePage]);

  const projectsConfig = profileData.projects || {};

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl neumorphic text-center">
        <FolderGit2 className="h-8 w-8 text-text-3 mb-2" />
        <p className="text-sm font-semibold text-text-1">No projects found</p>
        <p className="text-xs text-text-3 font-mono mt-1">
          Projects registry will populate once configured.
        </p>
      </div>
    );
  }

  return (
    <SectionContainer id="projects" background="default" className="py-1">
      {/* Header & Filter Toolbar: Pinned to maintain zero-scroll application layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/30 shadow-[0_0_8px_rgba(2,132,199,0.2)]">
            <FolderGit2 size={13} />
          </div>
          <h2 className="text-xs sm:text-sm font-bold tracking-tight text-text-1 truncate">
            {projectsConfig.title || "Featured Projects & Systems Studio"}
          </h2>
          <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent font-mono">
            {filtered.length} SYSTEMS
          </span>
        </div>

        <div
          role="group"
          aria-label="Filter projects by technology"
          className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tags.map((tag) => {
            const active = activeFilter === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleFilterChange(tag)}
                aria-pressed={active}
                className={cn(
                  "inline-flex min-h-11 sm:min-h-[30px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 font-mono text-[10px] font-semibold transition-all duration-150 active:scale-95",
                  active
                    ? "neumorphic-pressed text-accent ring-1 ring-accent/50"
                    : "neumorphic-chip text-text-2 hover:text-text-1 hover:border-accent/40"
                )}
              >
                {tag}
                {typeof counts[tag] === "number" && (
                  <span className={active ? "text-accent" : "text-text-3"}>
                    {counts[tag]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Card Stage: Display exactly 3 cards with smooth slide carousel (Zero Scroll) */}
      <div className="relative min-h-[340px] flex flex-col justify-center">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl neumorphic border border-border/70 text-center">
            <FolderGit2 className="h-8 w-8 text-text-3 mb-2" />
            <p className="text-xs font-semibold text-text-1">
              No systems matching &quot;{activeFilter}&quot;
            </p>
            <p className="text-[11px] text-text-3 font-mono mt-1 mb-3">
              Try switching technology filters to inspect other architecture builds.
            </p>
            <button
              type="button"
              onClick={() => handleFilterChange("All")}
              className="inline-flex min-h-11 sm:min-h-9 items-center gap-1.5 rounded-xl neumorphic-chip px-3 text-xs font-semibold text-accent transition-all hover:border-accent/40 active:scale-95"
            >
              <RotateCcw size={12} />
              Reset Filter
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${activeFilter}-${safePage}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5"
            >
              {visibleProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={safePage * CARDS_PER_PAGE + idx}
                  onOpenSpecs={setModalProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Slide Navigation Dock: Prev / Next, Dot Indicators, Telemetry Counter */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-border/50 pt-2.5 mt-2.5">
          {/* Left: Telemetry range */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-3">
            <span className="hidden sm:inline-block">SYS:</span>
            <span className="font-bold text-accent">
              {String(safePage * CARDS_PER_PAGE + 1).padStart(2, "0")}
              {visibleProjects.length > 1
                ? `-${String(safePage * CARDS_PER_PAGE + visibleProjects.length).padStart(2, "0")}`
                : ""}
            </span>
            <span>/ {String(filtered.length).padStart(2, "0")}</span>
          </div>

          {/* Center: Interactive dot pills */}
          {totalPages > 1 && (
            <div
              role="tablist"
              aria-label="Project slides"
              className="flex items-center gap-1.5"
            >
              {Array.from({ length: totalPages }).map((_, i) => {
                const isActive = i === safePage;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => handlePageChange(i, i > safePage ? 1 : -1)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-200 min-h-11 sm:min-h-0 flex items-center justify-center",
                      isActive
                        ? "w-6 bg-accent shadow-[0_0_8px_rgba(2,132,199,0.35)]"
                        : "w-2 bg-border/80 hover:bg-text-3"
                    )}
                  />
                );
              })}
            </div>
          )}

          {/* Right: Tactile Prev / Next Controls */}
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage === 0}
                onClick={() => handlePageChange(safePage - 1, -1)}
                aria-label="Previous slide"
                className="inline-flex min-h-11 sm:min-h-[28px] min-w-11 sm:min-w-[28px] items-center justify-center rounded-xl neumorphic-chip text-text-2 transition-all hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="font-mono text-[10px] font-semibold text-text-2 px-1">
                {String(safePage + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
              </span>

              <button
                type="button"
                disabled={safePage >= totalPages - 1}
                onClick={() => handlePageChange(safePage + 1, 1)}
                aria-label="Next slide"
                className="inline-flex min-h-11 sm:min-h-[28px] min-w-11 sm:min-w-[28px] items-center justify-center rounded-xl neumorphic-chip text-text-2 transition-all hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <span className="font-mono text-[9px] text-text-3">
              ALL SYSTEMS VISIBLE
            </span>
          )}
        </div>
      )}

      <ProjectDetailModal
        project={modalProject}
        isOpen={Boolean(modalProject)}
        onClose={() => setModalProject(null)}
      />
    </SectionContainer>
  );
}
