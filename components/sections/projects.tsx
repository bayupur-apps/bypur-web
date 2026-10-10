"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FolderGit2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ProjectCard } from "./projects/project-card";
import { ProjectDetailModal } from "./projects/project-detail-modal";
import { generateTags, sortByFeatured } from "./projects/utils";
import { usePortfolio } from "@/contexts/portfolio-context";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionTopBar } from "@/components/ui/section-top-bar";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";

const CARDS_PER_PAGE = 3;

type TransitionType = "slide" | "filter";

interface AnimationMeta {
  type: TransitionType;
  direction: number;
}

const containerVariants: Variants = {
  initial: {
    opacity: 1,
  },
  enter: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.01,
    },
  },
  exit: ({ type, direction }: AnimationMeta) => ({
    opacity: 0,
    x: type === "slide" ? (direction > 0 ? -24 : 24) : 0,
    y: type === "filter" ? -4 : 0,
    scale: type === "filter" ? 0.99 : 1,
    transition: {
      duration: 0.12,
      ease: [0.4, 0, 1, 1] as const,
    },
  }),
};

const cardVariants: Variants = {
  initial: ({ type, direction }: AnimationMeta) => ({
    opacity: 0,
    x: type === "slide" ? (direction > 0 ? 30 : -30) : 0,
    y: type === "filter" ? 10 : 0,
    scale: type === "filter" ? 0.985 : 1,
  }),
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function ProjectsSection() {
  const { profile: profileData, projects } = usePortfolio();
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [transitionType, setTransitionType] = useState<TransitionType>("filter");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const animationMeta = useMemo<AnimationMeta>(
    () => ({ type: transitionType, direction }),
    [transitionType, direction]
  );

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
    setTransitionType("filter");
    setFilter(tag);
    setCurrentPage(0);
  };

  const handlePageChange = useCallback((newPage: number, newDirection: number) => {
    setTransitionType("slide");
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
      {/* Top Console Bar */}
      <SectionTopBar
        icon={FolderGit2}
        title={projectsConfig.title || "Featured Projects & Systems Studio"}
        subtitle="// PRODUCTION SHOWCASE & ARCHITECTURE"
        badge={`${filtered.length} SYSTEMS`}
        secondaryBadge={activeFilter !== "All" ? `${projects.length} TOTAL` : undefined}
        className="mb-2"
      />

      {/* Filter Toolbar: Pinned horizontal scrollable tags */}
      <div className="relative max-w-full overflow-hidden mb-2.5">
        <div
          role="group"
          aria-label="Filter projects by technology"
          className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_6px,black_calc(100%-6px),transparent)] sm:[mask-image:none]"
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
                    "inline-flex min-h-11 sm:min-h-[28px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 font-mono text-[10.5px] font-semibold transition-all duration-150 active:scale-95",
                    active
                      ? "bg-accent text-accent-fg shadow-xs"
                      : "border border-border/60 bg-bg-card/50 text-text-2 hover:border-accent/40 hover:text-text-1"
                  )}
                >
                  {tag}
                  {typeof counts[tag] === "number" && (
                    <span className={active ? "text-accent-fg/80" : "text-text-3"}>
                      {counts[tag]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
      </div>

      {/* 3-Card Stage: Display cards with smooth slide carousel and touch-swipe support on mobile */}
      <div className="relative min-h-[340px] flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={animationMeta}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center p-8 rounded-xl border border-border/70 bg-bg-card text-center"
            >
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
                className="inline-flex min-h-11 sm:min-h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-bg-subtle/50 px-3 text-xs font-semibold text-accent transition-all hover:border-accent/40 active:scale-95"
              >
                <RotateCcw size={12} />
                Reset Filter
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeFilter}-${safePage}`}
              custom={animationMeta}
              variants={containerVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -45 && safePage < totalPages - 1) {
                  handlePageChange(safePage + 1, 1);
                } else if (info.offset.x > 45 && safePage > 0) {
                  handlePageChange(safePage - 1, -1);
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 touch-pan-y"
            >
              {visibleProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  custom={animationMeta}
                  variants={cardVariants}
                  className="h-full"
                >
                  <ProjectCard
                    project={project}
                    index={safePage * CARDS_PER_PAGE + idx}
                    onOpenSpecs={setModalProject}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

          {/* Center: Interactive dot pills with accessible touch targets */}
          {totalPages > 1 && (
            <div
              role="tablist"
              aria-label="Project slides"
              className="flex items-center gap-0.5 sm:gap-1.5"
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
                    className="min-h-11 min-w-[32px] sm:min-h-[28px] sm:min-w-0 px-1 py-2 flex items-center justify-center group focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 ease-out pointer-events-none block",
                        isActive
                          ? "w-6 bg-accent shadow-xs"
                          : "w-2 bg-border/80 group-hover:bg-text-3"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Right: Tactile Prev / Next Controls */}
          {totalPages > 1 ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                disabled={safePage === 0}
                onClick={() => handlePageChange(safePage - 1, -1)}
                aria-label="Previous slide"
                className="inline-flex min-h-11 sm:min-h-[28px] min-w-11 sm:min-w-[28px] items-center justify-center rounded-md border border-border/60 bg-bg-card/50 text-text-2 transition-all hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:pointer-events-none active:scale-95"
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
                className="inline-flex min-h-11 sm:min-h-[28px] min-w-11 sm:min-w-[28px] items-center justify-center rounded-md border border-border/60 bg-bg-card/50 text-text-2 transition-all hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:pointer-events-none active:scale-95"
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
