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
        "inline-flex items-center gap-2 rounded-xl border border-border/70 dark:border-white/10 neumorphic px-3 py-1.5 text-xs font-semibold text-text-1 shadow-md transition-all duration-200 hover:border-accent/40 hover:text-accent whitespace-nowrap",
        className
      )}
    >
      <Icon size={14} className="text-accent shrink-0" />
      <span>{label}</span>
      <span className="h-1.5 w-1.5 rounded-full bg-accent/40 ring-1 ring-accent/20 shrink-0" />
    </div>
  );
}
