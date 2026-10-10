import { type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/helpers";

export interface SectionTopBarProps {
  icon: ElementType<{ size?: number; className?: string }>;
  title: string;
  badge: ReactNode;
  subtitle?: ReactNode;
  secondaryBadge?: ReactNode;
  className?: string;
}

export function SectionTopBar({
  icon: Icon,
  title,
  badge,
  subtitle,
  secondaryBadge,
  className,
}: SectionTopBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border/60 pb-1.5 px-0.5",
        className
      )}
    >
      {/* Left: Icon, Title & optional Desktop Subtitle Tag */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-accent/10 text-accent ring-1 ring-accent/20">
          <Icon size={12} />
        </div>
        <h2 className="text-xs sm:text-sm font-bold tracking-tight text-text-1 truncate">
          {title}
        </h2>
        {subtitle && (
          <span className="font-mono text-[9.5px] text-text-3 hidden sm:inline truncate">
            {subtitle}
          </span>
        )}
      </div>

      {/* Right: Technical Badges (Consistent right alignment across mobile and desktop) */}
      <div className="flex items-center gap-1.5 font-mono text-[9.5px] shrink-0">
        {typeof badge === "string" || typeof badge === "number" ? (
          <span className="rounded-[4px] bg-accent/10 px-2 py-0.5 font-bold text-accent">
            {badge}
          </span>
        ) : (
          badge
        )}
        {secondaryBadge && (
          <span className="hidden sm:inline rounded-[4px] bg-bg-subtle px-2 py-0.5 text-text-3">
            {secondaryBadge}
          </span>
        )}
      </div>
    </div>
  );
}
