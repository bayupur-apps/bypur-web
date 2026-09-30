"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { ContentSection } from "./hero/content-section";
import { HeroPortrait } from "./hero/hero-portrait";
import { AvatarSection } from "./hero/avatar-section";
import { ScrollCue } from "./hero/scroll-cue";
import { getDefaultMobileStats } from "./hero/utils";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function HeroSection() {
  const { profile: profileData } = usePortfolio();

  // Derived data
  const tagline = profileData.tagline || "I craft scalable digital products.";
  const mobileStats = profileData.mobileStats || getDefaultMobileStats(profileData);

  return (
    <SectionContainer id="hero" variant="hero">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Mobile-only: compact avatar leads the layout (hidden on desktop,
            where DesktopAvatar takes over inside AvatarSection) */}
        <div className="lg:hidden flex justify-center">
          <HeroPortrait src={profileData.avatar} alt={profileData.name} size="sm" priority />
        </div>

        {/* LEFT - Content */}
        <ContentSection
          profileData={profileData}
          tagline={tagline}
        />

        {/* RIGHT - Avatar & Stats */}
        <AvatarSection profileData={profileData} mobileStats={mobileStats} />
      </div>

      <ScrollCue href="#about" />
    </SectionContainer>
  );
}
