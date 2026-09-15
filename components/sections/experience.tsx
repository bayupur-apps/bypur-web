"use client";

import { useState } from "react";
import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { StatsBar, StatItem } from "@/components/ui/stats-bar";
import { SectionContainer } from "@/components/ui/section-container";
import { DesktopTimeline } from "./experience/desktop-timeline";
import { MobileTimeline } from "./experience/mobile-timeline";
import { ExperienceDetail } from "./experience/experience-detail";
import { calculateYearsExp } from "./experience/utils";
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

  const yearsExp = calculateYearsExp(experiences);
  const stats = experienceConfig.stats || {};

  const selected = experiences.find((e) => e.id === selectedId) ?? experiences[0];

  return (
    <SectionContainer id="experience" background="default">
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

      {/* Stats bar */}
      <FadeUp delay={0.05}>
        <StatsBar className="mb-16 mt-10">
          <StatItem
            value={stats.yearsExp || `${yearsExp}+`}
            label={stats.yearsExp ? "Years hands-on" : "Years hands-on"}
          />
          <StatItem value={experiences.length} label={stats.positions || "Positions held"} />
          <StatItem
            value={stats.highlight?.value || "-40%"}
            label={stats.highlight?.label || "API latency cut"}
            accent
          />
        </StatsBar>
      </FadeUp>

      {/* Desktop: Split Panel */}
      <div className="mx-auto hidden max-w-5xl items-start gap-8 lg:grid lg:grid-cols-[260px_1fr] xl:max-w-6xl xl:grid-cols-[300px_1fr] xl:gap-10">
        <DesktopTimeline
          experiences={experiences}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {selected && <ExperienceDetail experience={selected} />}
      </div>

      {/* Mobile: Enhanced Vertical Timeline */}
      <MobileTimeline experiences={experiences} />
    </SectionContainer>
  );
}
              
