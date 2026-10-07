"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionContainer } from "@/components/ui/section-container";
import { SkillBentoMatrix } from "./stack/skill-bento-matrix";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function StackSection() {
  const { skills } = usePortfolio();

  return (
    <SectionContainer id="skills" background="default" className="py-1">
      <FadeUp className="w-full">
        <SkillBentoMatrix skills={skills} />
      </FadeUp>
    </SectionContainer>
  );
}
