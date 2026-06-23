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
    default: "py-16 sm:py-20 lg:py-24",
    hero: "min-h-svh flex flex-col justify-center pt-16 pb-12 sm:pt-20",
    "full-height": "min-h-screen flex flex-col justify-center py-16 sm:py-20",
  };

  const backgroundStyles = {
    default: "bg-bg",
    subtle: "bg-bg-subtle",
    accent: "bg-accent/[0.02] dark:bg-accent/[0.01]",
    gradient: "bg-linear-to-b from-bg-subtle to-bg",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        variantStyles[variant],
        backgroundStyles[background],
        className
      )}
    >
      <div className={cn("container-main w-full", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
