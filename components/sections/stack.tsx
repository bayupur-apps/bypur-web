"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { SectionContainer } from "@/components/ui/section-container";
import { SkillLogoGrid } from "./stack/skill-logo-grid";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function StackSection() {
  const { profile: profileData, skills } = usePortfolio();

  const skillsConfig = profileData.skills || {};

  const label = skillsConfig.label || "Skills";
  const title = skillsConfig.title || "Tools I use to build great things.";
  const titleHighlight = skillsConfig.titleHighlight || "build great things.";
  const description =
    skillsConfig.description ||
    "A focused snapshot of the technologies I reach for most.";

  return (
    <SectionContainer id="skills" background="accent">
      <FadeUp>
        <SectionHeader
          label={label}
          title={<HighlightedTitle title={title} highlight={titleHighlight} />}
          description={description}
          className="mx-auto max-w-2xl text-center"
        />
      </FadeUp>

      {/* The "see my projects" banner was dropped: Hero already leads with
          that CTA and the Projects section is two scrolls away. */}
      <FadeUp delay={0.05} className="mx-auto mt-10 max-w-5xl">
        <SkillLogoGrid skills={skills} />
      </FadeUp>
    </SectionContainer>
  );
}
