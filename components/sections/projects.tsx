"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { SectionContainer } from "@/components/ui/section-container";
import { ProjectsFilter } from "./projects/projects-filter";
import { ProjectCard } from "./projects/project-card";
import { generateTags, sortByFeatured } from "./projects/utils";
import { usePortfolio } from "@/contexts/portfolio-context";

const INITIAL_VISIBLE = 6;
const STEP_COUNT = 6;

export default function ProjectsSection() {
  const { profile: profileData, projects } = usePortfolio();
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const projectsConfig = profileData.projects || {};
  const label = projectsConfig.label || "Projects";
  const title = projectsConfig.title || "Selected work I'm proud of.";
  const titleHighlight = projectsConfig.titleHighlight || "I'm proud of.";
  const description =
    projectsConfig.description ||
    "A few projects that capture how I think about product, architecture, and craft.";

  const tags = useMemo(() => generateTags(projects), [projects]);
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach((p) => p.techStack.forEach((t) => (map[t] = (map[t] ?? 0) + 1)));
    return map;
  }, [projects]);
  const ordered = useMemo(() => sortByFeatured(projects), [projects]);

  const activeFilter = tags.includes(filter) ? filter : "All";
  const filtered = activeFilter === "All" ? ordered : ordered.filter((p) => p.techStack.includes(activeFilter));

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setVisibleCount(INITIAL_VISIBLE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP_COUNT, filtered.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE);
  };

  const visibleProjects = filtered.slice(0, visibleCount);
  const remainingCount = filtered.length - visibleCount;
  const isExpanded = visibleCount > INITIAL_VISIBLE && remainingCount <= 0;

  return (
    <SectionContainer id="projects" background="subtle">
      <FadeUp>
        <SectionHeader
          label={label}
          title={<HighlightedTitle title={title} highlight={titleHighlight} />}
          description={description}
          className="mx-auto max-w-2xl text-center"
        />
      </FadeUp>

      <FadeUp delay={0.05}>
        <ProjectsFilter tags={tags} counts={counts} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </FadeUp>

      {/* Remount on filter change so the entrance animation replays */}
      <ul key={activeFilter} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project, i) => (
          <li
            key={project.id}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
          >
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      {/* Load more / Show less controls */}
      {filtered.length > INITIAL_VISIBLE && (
        <div className="mt-10 flex justify-center">
          {remainingCount > 0 ? (
            <button
              type="button"
              onClick={handleLoadMore}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/80 neumorphic px-6 text-sm font-medium text-text-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-bg-card hover:text-accent hover:shadow-md active:scale-95"
            >
              <span>Load more projects</span>
              <span className="mono-label text-[11px] font-semibold text-text-3">({remainingCount} remaining)</span>
              <ChevronDown size={16} className="text-accent" />
            </button>
          ) : isExpanded ? (
            <button
              type="button"
              onClick={handleShowLess}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/80 neumorphic px-6 text-sm font-medium text-text-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-bg-card hover:text-accent hover:shadow-md active:scale-95"
            >
              <span>Show less</span>
              <ChevronUp size={16} className="text-accent" />
            </button>
          ) : null}
        </div>
      )}
    </SectionContainer>
  );
}
