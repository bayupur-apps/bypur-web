import { ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface SectionContainerProps {
  id: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: "default" | "hero" | "full-height";
  background?: "default" | "subtle" | "accent" | "gradient";
}

export function SectionContainer({
  id,
  children,
  className,
  innerClassName,
  variant = "default",
  background = "default",
}: SectionContainerProps) {
  const variantStyles = {
    default: "w-full py-2 sm:py-4",
    hero: "w-full flex flex-col justify-center py-2 sm:py-4",
    "full-height": "w-full flex flex-col justify-center py-2",
  };

  const backgroundStyles = {
    default: "bg-transparent",
    // Fades in and out so the band has no hard top/bottom edge over the
    // page-wide gradient backdrop.
    subtle: "bg-linear-to-b from-transparent via-bg-subtle/50 to-transparent",
    accent: "bg-accent/[0.02] dark:bg-accent/[0.01]",
    gradient: "bg-linear-to-b from-bg-subtle/60 to-transparent",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative",
        variantStyles[variant],
        backgroundStyles[background],
        className
      )}
    >
      <div className={cn("w-full", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
