"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  as?: "div" | "article";
}

/**
 * React Bits SpotlightCard
 * Creates a mouse-tracking radial spotlight effect over the surface and border.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(245, 158, 11, 0.12)",
  as: Component = "article",
}: Readonly<SpotlightCardProps>) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <Component
      ref={cardRef as React.Ref<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative rounded-xl border border-border/80 bg-bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md",
        className
      )}
    >
      {/* Interactive Cursor Spotlight Glare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />
      {children}
    </Component>
  );
}

export default SpotlightCard;
