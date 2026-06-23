import { Server, Code2, Database, Container } from "lucide-react";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { cn } from "@/lib/helpers";
import type { Profile } from "@/lib/types";

// Icon mapping for highlights
const iconMap: Record<string, typeof Server> = {
  Server,
  Code2,
  Database,
  Container,
};

interface FloatingBadgesProps {
  highlights?: Profile["highlights"];
}

export function FloatingBadges({ highlights }: FloatingBadgesProps) {
  if (!highlights || highlights.length === 0) return null;

  const positions = [
    "top-8 -right-16 animate-float-slow",
    "-bottom-12 left-4 animate-float-slower",
    "-top-8 -left-14 animate-float",
    "bottom-16 -right-10 animate-float-slow",
  ];

  return (
    <>
      {highlights.slice(0, 4).map((highlight, idx) => (
        <div key={highlight.label} className={cn("absolute", positions[idx])}>
          <FloatingBadge
            icon={iconMap[highlight.icon] || Server}
            label={highlight.label || ""}
          />
        </div>
      ))}
    </>
  );
}
