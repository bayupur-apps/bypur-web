"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionContainer } from "@/components/ui/section-container";
import { SkillLogoGrid } from "./stack/skill-logo-grid";
import { CTABanner } from "./stack/cta-banner";
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
          title={
            <>
              {title.replace(titleHighlight, "")}{" "}
              <span className="text-accent">{titleHighlight}</span>
            </>
          }
          description={description}
        />
      </FadeUp>

      <div className="mx-auto mt-12 max-w-5xl space-y-16">
        <FadeUp delay={0.05}>
          <SkillLogoGrid skills={skills} />
        </FadeUp>

        <CTABanner cta={skillsConfig.cta} />
      </div>
    </SectionContainer>
  );
}
