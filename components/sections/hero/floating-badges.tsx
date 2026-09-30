"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Server, Code2, Database, Container, Zap, Layers, Cloud, Bot, Monitor, Workflow } from "lucide-react";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { cn } from "@/lib/helpers";
import type { Profile } from "@/lib/types";

// Icon mapping for highlights
const iconMap: Record<string, typeof Server> = {
  Server,
  Code2,
  Database,
  Container,
  Zap,
  Layers,
  Cloud,
  Bot,
  Monitor,
  Workflow,
};

interface ParallaxLayerProps {
  /** Normalised pointer position (-0.5..0.5). */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Max travel in px; negative moves against the pointer. */
  depth: number;
  children: ReactNode;
}

/** Shifts its children with the pointer by `depth` px. */
export function ParallaxLayer({ x, y, depth, children }: ParallaxLayerProps) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return <motion.div style={{ x: tx, y: ty }}>{children}</motion.div>;
}

// Positions keep the idle float animation on the outer wrapper and the
// pointer parallax on the inner layer, so the two transforms don't fight.
// Coordinates are relative to the portrait card box; negative offsets let the
// badges straddle its edges.
const BADGES = [
  { position: "top-20 -left-14 animate-float", depth: 26 },
  { position: "top-[38%] -right-12 animate-float-slow", depth: 22 },
  { position: "bottom-32 -left-16 animate-float-slower", depth: 16 },
  { position: "bottom-6 -right-8 animate-float-slow", depth: 18 },
];

interface FloatingBadgesProps {
  highlights?: Profile["highlights"];
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export function FloatingBadges({ highlights, x, y }: FloatingBadgesProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <>
      {highlights.slice(0, BADGES.length).map((highlight, idx) => (
        <div key={highlight.label} className={cn("absolute z-10", BADGES[idx].position)}>
          <ParallaxLayer x={x} y={y} depth={BADGES[idx].depth}>
            <FloatingBadge
              icon={iconMap[highlight.icon] || Server}
              label={highlight.label || ""}
            />
          </ParallaxLayer>
        </div>
      ))}
    </>
  );
}
