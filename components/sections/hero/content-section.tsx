import { AvailabilityPill } from "./availability-pill";
import { HeroActions } from "./hero-actions";
import { HeroStats } from "./hero-stats";
import { HeroTagline } from "./hero-tagline";
import { RoleLine } from "./role-line";
import type { Profile } from "@/lib/types";

const getShortBio = (bio: string) => {
  const sentences = bio.match(/[^.!?]+[.!?]+/g);
  return sentences?.slice(0, 2).join(" ").trim() || bio;
};

// Entrance runs as a pure CSS animation (no JS), staggered per row. The
// headline itself is never hidden so it paints immediately (LCP). Class
// names are spelled out in full so Tailwind can detect them.
const STAGGER = {
  0: "animate-fade-up",
  80: "animate-fade-up [animation-delay:80ms]",
  160: "animate-fade-up [animation-delay:160ms]",
  240: "animate-fade-up [animation-delay:240ms]",
} as const;
const stagger = (delayMs: keyof typeof STAGGER) => STAGGER[delayMs];

interface ContentSectionProps {
  profileData: Profile;
  tagline: string;
}

export function ContentSection({
  profileData,
  tagline,
}: Readonly<ContentSectionProps>) {
  const shortBio = getShortBio(profileData.bio);

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      {profileData.availability && (
        <AvailabilityPill label={profileData.availability} className={`mb-5 ${stagger(0)}`} />
      )}

      {/* Headline */}
      <h1 className="mb-4 text-3xl font-bold leading-[1.08] tracking-tight text-text-1 sm:text-4xl lg:text-[2.75rem]">
        Hi, I&apos;m {profileData.name.split(" ")[0]}
        <span className="mt-1.5 block text-lg font-normal leading-snug tracking-normal text-text-2 sm:text-xl lg:text-2xl">
          <HeroTagline tagline={tagline} highlight={profileData.taglineHighlight} />
        </span>
      </h1>

      <RoleLine profileData={profileData} className={`mb-4 ${stagger(80)}`} />

      {/* Bio - short version */}
      <p className={`mb-5 max-w-lg text-sm leading-[1.7] text-text-2 ${stagger(80)}`}>
        {shortBio}
      </p>

      {/* CTA + CV + GitHub/LinkedIn */}
      <HeroActions profileData={profileData} className={stagger(160)} />

      {/* Stats (desktop) */}
      <HeroStats stats={profileData.stats} className={`mt-6 hidden w-full max-w-lg lg:grid ${stagger(240)}`} />
    </div>
  );
}
