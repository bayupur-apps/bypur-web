"use client";

import { HeroActions } from "./hero-actions";
import { HeroStats } from "./hero-stats";
import { HeroPortrait } from "./hero-portrait";
import { escapeRegExp } from "./utils";
import type { Profile } from "@/lib/types";

interface MobileHeroProps {
  profileData: Profile;
  tagline: string;
}

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
    )
  );
};

export function MobileHero({ profileData, tagline }: MobileHeroProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-2 select-none animate-fade-in">
      {/* 01: 3D Neumorphic Portrait (Clean, Modern, without floating badge clutter) */}
      <div className="relative my-1 flex items-center justify-center">
        <HeroPortrait
          src={profileData.avatar}
          alt={profileData.name}
          size="sm"
          priority
          className="w-36 sm:w-44"
        />
      </div>

      {/* 02: Signature Headline & Bio */}
      <div className="max-w-md mx-auto px-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-1 mb-1.5">
          Hi, I&apos;m {profileData.name.split(" ")[0]}
          <span className="mt-1 block text-base sm:text-lg font-normal leading-snug tracking-normal text-text-2">
            {renderTagline(tagline, profileData.taglineHighlight)}
          </span>
        </h1>

        {profileData.bio && (
          <p className="text-xs sm:text-sm leading-relaxed text-text-2 mt-2 max-w-sm mx-auto">
            {profileData.bio}
          </p>
        )}
      </div>

      {/* 03: Action Cluster (View my work + Download CV + Socials) */}
      <HeroActions profileData={profileData} className="w-full justify-center mt-1" />

      {/* 04: Signature 3-Column Metrics */}
      {profileData.stats && profileData.stats.length > 0 && (
        <HeroStats stats={profileData.stats} className="w-full max-w-sm mx-auto mt-2 pt-4" />
      )}
    </div>
  );
}
