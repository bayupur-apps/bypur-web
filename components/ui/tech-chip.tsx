import { findSkillIcon } from "@/lib/config/skill-icons";
import { cn } from "@/lib/helpers";

interface TechChipProps {
  name: string;
  className?: string;
}

/** Small glass chip for a technology, with its logo when one is known. */
export function TechChip({ name, className }: TechChipProps) {
  const icon = findSkillIcon(name);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-subtle px-2.5 py-1 text-xs font-medium text-text-2",
        className
      )}
    >
      {icon?.kind === "brand" && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 shrink-0 text-text-3" aria-hidden="true">
          <path d={icon.path} />
        </svg>
      )}
      {icon?.kind === "lucide" && <icon.icon size={12} className="shrink-0 text-text-3" aria-hidden="true" />}
      {name}
    </span>
  );
}
