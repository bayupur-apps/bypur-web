import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/helpers";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function Button({
  href,
  onClick,
  children,
  icon: Icon,
  iconPosition = "right",
  variant = "primary",
  size = "md",
  className,
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "group bg-accent text-accent-fg shadow-xs hover:bg-accent-hover hover:shadow-sm active:scale-[0.99]",
    secondary:
      "border border-border/80 neumorphic text-text-1 hover:bg-bg-subtle hover:border-accent/40 active:scale-[0.99]",
    outline:
      "border border-accent/60 text-accent hover:bg-accent/10 hover:border-accent active:scale-[0.99]",
  };

  const sizeStyles = {
    sm: "min-h-10 px-4 py-2 text-xs",
    md: "min-h-11 px-5 py-2.5 text-sm",
    lg: "min-h-12 px-6 py-3 text-base",
  };

  const iconSizeMap = {
    sm: 14,
    md: 15,
    lg: 16,
  };

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const iconSize = iconSizeMap[size];

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon
          size={iconSize}
          className={cn(
            "transition-transform duration-200",
            variant === "primary" && "group-hover:-translate-x-0.5"
          )}
        />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon
          size={iconSize}
          className={cn(
            "transition-transform duration-200",
            variant === "primary" && "group-hover:translate-x-0.5"
          )}
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName} disabled={disabled}>
      {content}
    </button>
  );
}
