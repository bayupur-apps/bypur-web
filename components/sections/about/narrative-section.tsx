import { FadeUp } from "@/components/ui/motion";
import { CTAButtons } from "./cta-buttons";
import type { Profile } from "@/lib/types";

interface NarrativeSectionProps {
  profileData: Profile;
}

export function NarrativeSection({ profileData }: NarrativeSectionProps) {
  const about = profileData.about;

  return (
    <FadeUp delay={0.05}>
      <div className="flex flex-col text-center">
        {/* Description */}
        {about?.description && (
          <p className="text-[15px] leading-relaxed text-text-3">
            {about.description}
          </p>
        )}

        {/* CTAs */}
        <CTAButtons cta={about?.cta} resumeUrl={profileData.resumeUrl} />
      </div>
    </FadeUp>
  );
}
