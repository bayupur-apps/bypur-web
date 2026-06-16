"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionContainer } from "@/components/ui/section-container";
import { PrimaryStack } from "./stack/primary-stack";
import { SupportingStack } from "./stack/supporting-stack";
import { FamiliarStack } from "./stack/familiar-stack";
import { CTABanner } from "./stack/cta-banner";
import { filterSkills } from "./stack/utils";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function StackSection() {
  const { profile: profileData, skills: allSkills } = usePortfolio();

  // Get skills config from profile
  const skillsConfig = profileData.skills || {};
  const primaryStack = skillsConfig.primaryStack || [];
  const familiarWith = skillsConfig.familiarWith || [];

  // Build sets for filtering
  const primaryNameSet = new Set(primaryStack.map((item) => item.name));
  const familiarSet = new Set(familiarWith);

  // Filter supporting skills
  const supportingSkills = filterSkills(allSkills, primaryNameSet, familiarSet);

  // Dynamic title and description
  const label = skillsConfig.label || "Skills";
  const title = skillsConfig.title || "Tools I use to build great things.";
  const titleHighlight = skillsConfig.titleHighlight || "build great things.";
  const description =
    skillsConfig.description ||
    (allSkills.length > 0
      ? `A snapshot of technologies and practices I rely on day-to-day — ${allSkills.length}+ technologies.`
      : "A snapshot of technologies and practices I rely on day-to-day");

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
        {/* Tier 1: Primary Stack */}
        {primaryStack.length > 0 && <PrimaryStack items={primaryStack} />}

        {/* Tier 2: Supporting Stack */}
        {supportingSkills.length > 0 && <SupportingStack skills={supportingSkills} />}

        {/* Tier 3: Familiar With */}
        {familiarWith.length > 0 && <FamiliarStack items={familiarWith} />}

        {/* CTA Banner */}
        <CTABanner cta={skillsConfig.cta} />
      </div>
    </SectionContainer>
  );
}
