import { MobileStatsGrid } from "./mobile-stats";
import { DesktopAvatar } from "./desktop-avatar";
import type { Profile, MobileStat } from "@/lib/types";

interface AvatarSectionProps {
  profileData: Profile;
  mobileStats: MobileStat[];
}

export function AvatarSection({ profileData, mobileStats }: AvatarSectionProps) {
  return (
    // CSS-only entrance so the avatar (often the LCP image) isn't held back
    // until framer-motion hydrates.
    <div className="animate-fade-in [animation-delay:200ms]">
      {/* Mobile: Stats (compact avatar renders above the headline in
          HeroSection, not here, so it leads the mobile layout). The tech
          stack preview chips were dropped - the "primary stack" stat card
          already covers it, and the full Skills section has real logos. */}
      <div className="lg:hidden">
        <MobileStatsGrid stats={mobileStats} />
      </div>

      {/* Desktop: Avatar with floating badges */}
      <DesktopAvatar profileData={profileData} />
    </div>
  );
}
