"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { SkillBentoMatrix } from "./stack/skill-bento-matrix";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function StackSection() {
  const { skills } = usePortfolio();

  return (
    <SectionContainer
      id="skills"
      variant="hero"
      background="default"
      className="py-0 sm:py-0 w-full flex flex-col justify-center my-auto"
      innerClassName="w-full flex flex-col justify-center my-auto"
    >
      <SkillBentoMatrix skills={skills} />
    </SectionContainer>
  );
}
