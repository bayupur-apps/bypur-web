import { CTAButtons } from "./cta-buttons";
import type { Profile } from "@/lib/types";

interface NarrativeSectionProps {
  profileData: Profile;
}

export function NarrativeSection({ profileData }: NarrativeSectionProps) {
  // Dedicated About copy when the CMS provides it; otherwise the full bio
  // (Hero only shows its first two sentences, so this isn't a repeat).
  const story = profileData.about?.description || profileData.bio;
  const paragraphs = story
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mt-6 flex flex-col">
      <div className="space-y-4 text-[15px] leading-[1.8] text-text-2">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <CTAButtons
        cta={profileData.cta}
        secondaryText={profileData.about?.cta?.secondary?.text}
        resumeUrl={profileData.resumeUrl}
        isCvVisible={profileData.isCvVisible}
      />
    </div>
  );
}
