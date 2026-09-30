"use client";

import type { MouseEvent } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { HeroPortrait } from "./hero-portrait";
import { FloatingBadges, ParallaxLayer } from "./floating-badges";
import type { Profile } from "@/lib/types";

interface DesktopAvatarProps {
  profileData: Profile;
}

const SPRING = { stiffness: 120, damping: 20, mass: 0.4 };

export function DesktopAvatar({ profileData }: DesktopAvatarProps) {
  const reduceMotion = useReducedMotion();

  // Pointer position relative to the avatar box, normalised to -0.5..0.5.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, SPRING);
  const y = useSpring(pointerY, SPRING);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      className="relative mx-auto hidden w-fit py-10 lg:block"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Photo drifts slightly against the pointer, badges with it - the
          depth difference is what sells the parallax. */}
      <ParallaxLayer x={x} y={y} depth={-8}>
        <HeroPortrait src={profileData.avatar} alt={profileData.name} size="lg" priority />
      </ParallaxLayer>

      {/* Floating badges */}
      <FloatingBadges highlights={profileData.highlights} x={x} y={y} />
    </div>
  );
}
