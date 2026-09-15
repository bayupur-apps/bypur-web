"use client";

import { useMemo, useState } from "react";
import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
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
  const ordered = useMemo(() => sortByFeatured(projects), [projects]);
  const filtered = filter === "All" ? ordered : ordered.filter((p) => p.techStack.includes(filter));

  return (
    <SectionContainer id="projects" background="subtle">
      <FadeUp>
        <SectionHeader
          label={label}
          title={
            <>
              {title.replace(titleHighlight, "")}{" "}
              <span className="text-accent">{titleHighlight}</span>
            </>
          }
          description={description}
        />
      </FadeUp>

      <FadeUp delay={0.05}>
        <ProjectsFilter tags={tags} activeFilter={filter} onFilterChange={setFilter} />
      </FadeUp>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <FadeUp key={project.id} delay={i * 0.04}>
            <ProjectCard project={project} />
          </FadeUp>
        ))}
      </div>
    </SectionContainer>
  );
}