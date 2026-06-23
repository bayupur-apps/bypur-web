import { ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("", className)}>
      <span className="mono-label">{label}</span>
      <h2 className="mt-2 text-2xl font-semibold text-text-1 sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-text-2">{description}</p>
      )}
    </div>
  );
}
