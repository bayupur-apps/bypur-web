"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { ContentSection } from "./hero/content-section";
import { AvatarSection } from "./hero/avatar-section";
import { MobileHero } from "./hero/mobile-hero";
import { getDefaultMobileStats } from "./hero/utils";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function HeroSection() {
  const { profile: profileData } = usePortfolio();

  // Derived data
  const tagline = profileData.tagline || "I craft scalable digital products.";
  const mobileStats = profileData.mobileStats || getDefaultMobileStats(profileData);

  return (
    <SectionContainer id="hero" variant="hero" className="py-1 sm:py-2">
      {/* 01: Clean Minimalist Mobile Hero (No visual clutter) */}
      <div className="lg:hidden">
        <MobileHero profileData={profileData} tagline={tagline} />
      </div>

      {/* 02: Desktop Split Stage */}
      <div className="hidden lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-10 items-center">
        {/* LEFT - Content */}
        <ContentSection
          profileData={profileData}
          tagline={tagline}
        />

        {/* RIGHT - Avatar & Stats */}
        <AvatarSection profileData={profileData} mobileStats={mobileStats} />
      </div>
    </SectionContainer>
  );
}
