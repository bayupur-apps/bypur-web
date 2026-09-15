"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { DecorativeAvatar } from "@/components/ui/decorative-avatar";
import { ContentSection } from "./hero/content-section";
import { AvatarSection } from "./hero/avatar-section";
import { mapRolesToIcons, getDefaultMobileStats } from "./hero/utils";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function HeroSection() {
  const { profile: profileData } = usePortfolio();

  // Derived data
  const roles = mapRolesToIcons(profileData.roles);
  const tagline = profileData.tagline || "I craft scalable digital products.";
  const mobileStats = profileData.mobileStats || getDefaultMobileStats(profileData);

  return (
    <SectionContainer id="hero" variant="hero">
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        {/* Mobile-only: compact avatar leads the layout (hidden on desktop,
            where DesktopAvatar takes over inside AvatarSection) */}
        <div className="lg:hidden flex justify-center">
          <DecorativeAvatar
            src={profileData.avatar}
            alt={profileData.name}
            size="sm"
            decoration="minimal"
            shape="circle"
            showGlow={false}
            priority
          />
        </div>

        {/* LEFT - Content */}
        <ContentSection
          profileData={profileData}
          roles={roles}
          tagline={tagline}
        />

        {/* RIGHT - Avatar & Stats */}
        <AvatarSection profileData={profileData} mobileStats={mobileStats} />
      </div>
    </SectionContainer>
  );
}
