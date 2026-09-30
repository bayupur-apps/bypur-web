import { AvailabilityPill } from "./availability-pill";
import { HeroActions } from "./hero-actions";
import { HeroStats } from "./hero-stats";
import { escapeRegExp } from "./utils";
import type { Profile } from "@/lib/types";

// Helper to render tagline with dynamic highlight
const renderTagline = (tagline: string, highlight?: string) => {
  if (!highlight) return tagline;

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, "i");
  const parts = tagline.split(regex);

  return parts.map((part, idx) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={idx} className="gradient-text font-semibold">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

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
}: ContentSectionProps) {
  const shortBio = getShortBio(profileData.bio);

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      {profileData.availability && (
        <AvailabilityPill label={profileData.availability} className={`mb-5 ${stagger(0)}`} />
      )}

      {/* Headline */}
      <h1 className="mb-6 text-4xl font-bold leading-[1.06] tracking-tight text-text-1 sm:text-5xl lg:text-[3.5rem]">
        Hi, I&apos;m {profileData.name.split(" ")[0]}
        <span className="mt-2 block text-xl font-normal leading-snug tracking-normal text-text-2 sm:text-2xl lg:text-3xl">
          {renderTagline(tagline, profileData.taglineHighlight)}
        </span>
      </h1>

      {/* Bio - short version; the full story lives in the About section */}
      <p className={`mb-8 max-w-lg text-[15px] leading-[1.8] text-text-2 ${stagger(80)}`}>
        {shortBio}
      </p>

      {/* CTA + CV + GitHub/LinkedIn */}
      <HeroActions profileData={profileData} className={stagger(160)} />

      {/* Stats (desktop - mobile shows the stats grid under the content) */}
      <HeroStats stats={profileData.stats} className={`mt-12 hidden w-full max-w-lg lg:grid ${stagger(240)}`} />
    </div>
  );
}
