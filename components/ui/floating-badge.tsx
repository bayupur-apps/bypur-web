import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/helpers";

interface FloatingBadgeProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function FloatingBadge({ icon: Icon, label, className }: FloatingBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-1 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-accent/50 hover:shadow-xl",
        className
      )}
    >
      <Icon size={14} className="text-accent" />
      <span>{label}</span>
    </div>
  );
}
