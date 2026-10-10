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
    <div className="flex flex-col items-center text-center gap-3 sm:gap-4 py-1 select-none animate-fade-in max-w-md mx-auto">
      {/* 00: Engineering Status Indicator */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-bg-card/80 px-3 py-1 font-mono text-[10px] text-text-2 shadow-xs backdrop-blur-xs">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
        <span className="font-semibold text-text-1">SYS: ACTIVE</span>
        <span className="text-text-3">·</span>
        <span>PURWOKERTO (WIB)</span>
      </div>

      {/* 01: 3D Portrait with calibrated mobile scale */}
      <div className="relative flex items-center justify-center">
        <HeroPortrait
          src={profileData.avatar}
          alt={profileData.name}
          size="sm"
          priority
          className="w-36 min-[380px]:w-40 sm:w-48 md:w-52"
        />
      </div>

      {/* 02: Signature Headline & Bio */}
      <div className="w-full px-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-1 mb-1">
          Hi, I&apos;m {profileData.name.split(" ")[0]}
          <span className="mt-1 block text-sm sm:text-base font-normal leading-snug tracking-normal text-text-2">
            {renderTagline(tagline, profileData.taglineHighlight)}
          </span>
        </h1>

        {profileData.bio && (
          <p className="text-xs leading-relaxed text-text-2 mt-1.5 max-w-sm mx-auto line-clamp-3 sm:line-clamp-none">
            {profileData.bio}
          </p>
        )}
      </div>

      {/* 03: Action Cluster (View my work + Download CV + Socials) */}
      <HeroActions profileData={profileData} className="w-full justify-center mt-0.5" />

      {/* 04: Signature Metrics */}
      {profileData.stats && profileData.stats.length > 0 && (
        <HeroStats stats={profileData.stats} className="w-full max-w-sm mx-auto mt-1 pt-3 border-t border-border/50" />
      )}
    </div>
  );
}
