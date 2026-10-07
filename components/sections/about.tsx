"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { SectionContainer } from "@/components/ui/section-container";
import { NarrativeSection } from "./about/narrative-section";
import { ServicesList } from "./about/services-list";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function AboutSection() {
  const { profile: profileData, services: servicesData } = usePortfolio();

  // Derived data
  const aboutLabel = profileData.about?.label || "About";
  const aboutTitle = profileData.about?.title || "A developer who cares about";
  const aboutTitleHighlight = profileData.about?.titleHighlight || "the full picture.";

  return (
    <SectionContainer id="about" background="subtle">
      {/* Intro: the story only - identity, contact and stack already live
          in Hero, Contact and Skills. */}
      <FadeUp>
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeader
            label={aboutLabel}
            title={
              <HighlightedTitle title={aboutTitle} highlight={aboutTitleHighlight} />
            }
          />
          <NarrativeSection profileData={profileData} />
        </div>
      </FadeUp>

      {/* Services */}
      <div className="mt-20 sm:mt-24">
        <FadeUp>
          <SectionHeader
            label="Services"
            title="What I do"
            description="Services and expertise I offer - from the first API to production deployment."
            className="mx-auto mb-10 max-w-xl text-center"
          />
        </FadeUp>
        <ServicesList services={servicesData} />
      </div>
    </SectionContainer>
  );
}
