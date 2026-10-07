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

type ConnectorQuadrant = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface BadgeSpec {
  position: string;
  depth: number;
  quadrant: ConnectorQuadrant;
}

const BADGES: BadgeSpec[] = [
  { position: "top-2 -left-10 lg:-left-14 animate-float", depth: 16, quadrant: "top-left" },
  { position: "top-6 -right-10 lg:-right-14 animate-float-slow", depth: 14, quadrant: "top-right" },
  { position: "bottom-12 -left-12 lg:-left-16 animate-float-slower", depth: 12, quadrant: "bottom-left" },
  { position: "bottom-2 -right-8 lg:-right-12 animate-float-slow", depth: 10, quadrant: "bottom-right" },
];

function DiagonalConnector({ quadrant }: { quadrant: ConnectorQuadrant }) {
  if (quadrant === "top-left") {
    return (
      <svg
        aria-hidden="true"
        className="absolute -bottom-6 -right-8 w-12 h-9 pointer-events-none overflow-visible hidden sm:block"
        viewBox="0 0 44 32"
      >
        <path
          d="M6 6 L36 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent/60"
          strokeDasharray="3 2"
        />
        <circle cx="6" cy="6" r="2.5" className="fill-accent" />
        <circle cx="36" cy="26" r="3.5" className="fill-accent stroke-bg stroke-2" />
      </svg>
    );
  }

  if (quadrant === "top-right") {
    return (
      <svg
        aria-hidden="true"
        className="absolute -bottom-6 -left-8 w-12 h-9 pointer-events-none overflow-visible hidden sm:block"
        viewBox="0 0 44 32"
      >
        <path
          d="M38 6 L8 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent/60"
          strokeDasharray="3 2"
        />
        <circle cx="38" cy="6" r="2.5" className="fill-accent" />
        <circle cx="8" cy="26" r="3.5" className="fill-accent stroke-bg stroke-2" />
      </svg>
    );
  }

  if (quadrant === "bottom-left") {
    return (
      <svg
        aria-hidden="true"
        className="absolute -top-6 -right-8 w-12 h-9 pointer-events-none overflow-visible hidden sm:block"
        viewBox="0 0 44 32"
      >
        <path
          d="M6 26 L36 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent/60"
          strokeDasharray="3 2"
        />
        <circle cx="6" cy="26" r="2.5" className="fill-accent" />
        <circle cx="36" cy="6" r="3.5" className="fill-accent stroke-bg stroke-2" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="absolute -top-6 -left-8 w-12 h-9 pointer-events-none overflow-visible hidden sm:block"
      viewBox="0 0 44 32"
    >
      <path
        d="M38 26 L8 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent/60"
        strokeDasharray="3 2"
      />
      <circle cx="38" cy="26" r="2.5" className="fill-accent" />
      <circle cx="8" cy="6" r="3.5" className="fill-accent stroke-bg stroke-2" />
    </svg>
  );
}

interface FloatingBadgesProps {
  highlights?: Profile["highlights"];
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export function FloatingBadges({ highlights, x, y }: FloatingBadgesProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <>
      {highlights.slice(0, BADGES.length).map((highlight, idx) => {
        const spec = BADGES[idx];

        return (
          <div key={highlight.label} className={cn("absolute z-20", spec.position)}>
            <ParallaxLayer x={x} y={y} depth={spec.depth}>
              <div className="relative flex items-center">
                {/* Floating Badge Card */}
                <FloatingBadge
                  icon={iconMap[highlight.icon] || Server}
                  label={highlight.label || ""}
                />

                {/* Diagonal SVG Connector pointing directly into the circle perimeter */}
                <DiagonalConnector quadrant={spec.quadrant} />
              </div>
            </ParallaxLayer>
          </div>
        );
      })}
    </>
  );
}
