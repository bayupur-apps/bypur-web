"use client";

import type { MouseEvent } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  motion,
} from "framer-motion";
import { HeroPortrait } from "./hero-portrait";
import { FloatingBadges, ParallaxLayer } from "./floating-badges";
import type { Profile } from "@/lib/types";

interface DesktopAvatarProps {
  profileData: Profile;
}

const SPRING_CONFIG = { stiffness: 140, damping: 22, mass: 0.4 };

export function DesktopAvatar({ profileData }: Readonly<DesktopAvatarProps>) {
  const reduceMotion = useReducedMotion();

  // Pointer position relative to the avatar box, normalised to -0.5..0.5.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, SPRING_CONFIG);
  const y = useSpring(pointerY, SPRING_CONFIG);

  // Subtle 3D perspective tilt
  const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);

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

  const statusText =
    profileData.isAvailable !== false ? "SYS: ACTIVE" : undefined;

  return (
    <div
      className="relative mx-auto hidden w-fit py-10 lg:block [perspective:1200px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Soft Ambient Radial Halo behind the orbital ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500"
      />

      {/* 3D Tilting Orbital Portrait with Layered Parallax */}
      <motion.div
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <ParallaxLayer x={x} y={y} depth={-10}>
          <HeroPortrait
            src={profileData.avatar}
            alt={profileData.name}
            size="lg"
            priority
            statusText={statusText}
          />
        </ParallaxLayer>

        {/* Floating badges connected with diagonal vector lines */}
        <FloatingBadges highlights={profileData.highlights} x={x} y={y} />
      </motion.div>
    </div>
  );
}
