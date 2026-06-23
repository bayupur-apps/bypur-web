"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { ContentSection } from "./hero/content-section";
import { AvatarSection } from "./hero/avatar-section";
import { mapRolesToIcons, getDefaultMobileStats } from "./hero/utils";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function HeroSection() {
  const { profile: profileData, loading } = usePortfolio();

  // Derived data
  const roles = mapRolesToIcons(profileData.roles);
  const tagline = profileData.tagline || "I craft scalable digital products.";
  const mobileStats = profileData.mobileStats || getDefaultMobileStats(profileData);
  const techStackPreview = profileData.techStack?.slice(0, 5) || [];

  if (loading) {
    return (
      <SectionContainer id="hero" variant="hero">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="hero" variant="hero">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        {/* LEFT - Content */}
        <ContentSection
          profileData={profileData}
          roles={roles}
          tagline={tagline}
        />

        {/* RIGHT - Avatar & Stats */}
        <AvatarSection
          profileData={profileData}
          mobileStats={mobileStats}
          techStackPreview={techStackPreview}
        />
      </div>
    </SectionContainer>
  );
}
