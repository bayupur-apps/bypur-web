import { ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "interactive" | "gradient";
  className?: string;
  asChild?: boolean;
}

export function Card({ children, variant = "default", className, asChild }: CardProps) {
  const variants = {
    default: "rounded-md border border-border bg-bg-card p-5",
    interactive:
      "group rounded-md border border-border bg-bg-card p-5 transition-colors hover:border-accent/50",
    gradient:
      "rounded-xl border border-border bg-gradient-to-br from-accent/5 to-transparent",
  };

  const Component = asChild ? "div" : "div";

  return <Component className={cn(variants[variant], className)}>{children}</Component>;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("", className)}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cn("text-[15px] font-semibold text-text-1", className)}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn("mt-1.5 text-[13px] leading-relaxed text-text-2", className)}>{children}</p>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn("mt-auto flex items-center gap-3 border-t border-border pt-3", className)}>{children}</div>;
}
