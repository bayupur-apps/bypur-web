import { Server } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { RotatingRole } from "@/components/ui/rotating-role";
import { CTAButtons } from "./cta-buttons";
import type { Profile } from "@/lib/types";

// Helper to render tagline with dynamic highlight
const renderTagline = (tagline: string, highlight?: string) => {
  if (!highlight) return tagline;

  const regex = new RegExp(`(${highlight})`, "i");
  const parts = tagline.split(regex);

  return parts.map((part, idx) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={idx} className="font-bold text-text-1">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const getMobileBio = (bio: string) => {
  const sentences = bio.match(/[^.!?]+[.!?]+/g);
  return sentences?.slice(0, 2).join(" ").trim() || bio;
};

interface ContentSectionProps {
  profileData: Profile;
  roles: { label: string; icon: typeof Server }[];
  tagline: string;
}

export function ContentSection({
  profileData,
  roles,
  tagline,
}: ContentSectionProps) {
  const mobileBio = getMobileBio(profileData.bio);

  return (
    <div className="flex flex-col gap-0 text-center lg:text-left">
      <FadeUp>
        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold leading-[1.06] text-text-1 sm:text-5xl lg:text-[3.25rem]">
          Hi, I&apos;m {profileData.name.split(" ")[0]} -{" "}
          <span className="mt-1.5 block text-xl font-normal text-text-2 sm:text-2xl lg:text-3xl">
            {renderTagline(tagline, profileData.taglineHighlight)}
          </span>
        </h1>

        {/* Rotating role badge */}
        <RotatingRole
          roles={roles}
          label={profileData.rolesLabel || "Currently working as"}
          className="mb-6 self-center lg:self-start"
        />

        {/* Bio */}
        <p className="mb-6 mx-auto max-w-lg text-sm leading-[1.75] text-text-2 sm:text-[15px] lg:hidden">
          {mobileBio}
        </p>
        <p className="mb-6 mx-auto hidden max-w-lg text-[15px] leading-[1.8] text-text-2 lg:mx-0 lg:block">
          {profileData.bio}
        </p>

        {/* CTA Buttons */}
        <CTAButtons cta={profileData.cta} />
      </FadeUp>
    </div>
  );
}
