import { findSkillIcon } from "@/lib/config/skill-icons";
import { cn } from "@/lib/helpers";

interface TechChipProps {
  name: string;
  className?: string;
}

/** Tech chip with logo and monospace label for Neumorphic Tech Blueprint. */
export function TechChip({ name, className }: TechChipProps) {
  const icon = findSkillIcon(name);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-bg-subtle/80 px-2.5 py-1 font-mono text-xs font-medium text-text-2 transition-all duration-200 hover:border-accent/40 hover:bg-bg-card hover:text-text-1",
        className
      )}
    >
      {icon?.kind === "brand" && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 shrink-0 text-text-3" aria-hidden="true">
          <path d={icon.path} />
        </svg>
      )}
      {icon?.kind === "lucide" && <icon.icon size={12} className="shrink-0 text-accent" aria-hidden="true" />}
      {name}
    </span>
  );
}
