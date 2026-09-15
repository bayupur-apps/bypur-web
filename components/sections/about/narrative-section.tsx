import { FadeUp } from "@/components/ui/motion";
import { CTAButtons } from "./cta-buttons";
import type { Profile } from "@/lib/types";

interface NarrativeSectionProps {
  profileData: Profile;
}

export function NarrativeSection({ profileData }: NarrativeSectionProps) {
  return (
    <FadeUp delay={0.05}>
      <div className="flex flex-col text-center">
        {/* Description - reuses the same backend-driven bio shown in Hero */}
        {profileData.bio && (
          <p className="text-[15px] leading-relaxed text-text-3">
            {profileData.bio}
          </p>
        )}

        {/* CTAs */}
        <CTAButtons
          cta={profileData.cta}
          secondaryText={profileData.about?.cta?.secondary?.text}
          resumeUrl={profileData.resumeUrl}
          isCvVisible={profileData.isCvVisible}
        />
      </div>
    </FadeUp>
  );
}
