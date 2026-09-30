"use client";

import { useState } from "react";
import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { SectionContainer } from "@/components/ui/section-container";
import { DesktopTimeline } from "./experience/desktop-timeline";
import { MobileTimeline } from "./experience/mobile-timeline";
import { ExperienceDetail } from "./experience/experience-detail";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function ExperienceSection() {
  const { profile: profileData, experiences } = usePortfolio();
  const [selectedId, setSelectedId] = useState(experiences[0]?.id ?? "");

  const experienceConfig = profileData.experience || {};
  const label = experienceConfig.label || "Experience";
  const title = experienceConfig.title || "A timeline of building & learning.";
  const titleHighlight = experienceConfig.titleHighlight || "building & learning.";
  const description =
    experienceConfig.description ||
    "The roles, teams, and challenges that shaped how I work today.";

  // Live data can replace the defaults after mount - fall back to the first
  // role if the selected one no longer exists.
  const selected = experiences.find((e) => e.id === selectedId) ?? experiences[0];

  if (!selected) return null;

  return (
    <SectionContainer id="experience" background="default">
      {/* The old stats strip (years / roles) was dropped - Hero already shows
          years of experience, and the timeline itself shows the roles. */}
      <FadeUp>
        <SectionHeader
          label={label}
          title={<HighlightedTitle title={title} highlight={titleHighlight} />}
          description={description}
          className="mx-auto max-w-2xl text-center"
        />
      </FadeUp>

      {/* Desktop: role list + detail panel */}
      <div className="mx-auto mt-12 hidden max-w-6xl items-start gap-8 lg:grid lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] xl:gap-10">
        <DesktopTimeline
          experiences={experiences}
          selectedId={selected.id}
          onSelect={setSelectedId}
        />
        <ExperienceDetail experience={selected} />
      </div>

      {/* Mobile: vertical timeline */}
      <MobileTimeline experiences={experiences} />
    </SectionContainer>
  );
}
