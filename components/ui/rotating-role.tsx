"use client";

import { useState, useEffect } from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/helpers";

interface Role {
  label: string;
  icon: LucideIcon;
}

interface RotatingRoleProps {
  roles: Role[];
  label?: string;
  intervalMs?: number;
  className?: string;
}

export function RotatingRole({
  roles,
  label = "Currently working as",
  intervalMs = 2800,
  className,
}: RotatingRoleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (roles.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % roles.length);
        setIsAnimating(false);
      }, 200);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [roles.length, intervalMs]);

  const currentRole = roles[currentIndex] || roles[0];
  const Icon = currentRole?.icon;

  if (!currentRole) return null;

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center justify-center gap-2 text-sm text-text-2 lg:justify-start",
        className
      )}
    >
      <Sparkles size={14} className="text-accent" />
      {label}
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent transition-all duration-300",
          isAnimating && "opacity-0 -translate-y-1 scale-95"
        )}
      >
        {Icon && <Icon size={11} />}
        {currentRole.label}
      </span>
    </div>
  );
}
