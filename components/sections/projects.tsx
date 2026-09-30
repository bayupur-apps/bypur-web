"use client";

import { useMemo, useState } from "react";
import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { SectionContainer } from "@/components/ui/section-container";
import { ProjectsFilter } from "./projects/projects-filter";
import { ProjectCard } from "./projects/project-card";
import { generateTags, sortByFeatured } from "./projects/utils";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function ProjectsSection() {
  const { profile: profileData, projects } = usePortfolio();
  const [filter, setFilter] = useState("All");

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

  // A tag can disappear when live data replaces the defaults.
  const activeFilter = tags.includes(filter) ? filter : "All";
  const filtered = activeFilter === "All" ? ordered : ordered.filter((p) => p.techStack.includes(activeFilter));

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
        <ProjectsFilter tags={tags} counts={counts} activeFilter={activeFilter} onFilterChange={setFilter} />
      </FadeUp>

      {/* Remount on filter change so the entrance animation replays */}
      <ul key={activeFilter} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <li
            key={project.id}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
          >
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
