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
    "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "group bg-accent text-accent-fg shadow-sm shadow-accent/25 hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30",
    secondary:
      "border border-border bg-card text-text-1 hover:bg-bg-subtle hover:border-text-3",
    outline:
      "border border-accent text-accent hover:bg-accent/10 hover:border-accent-hover",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
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
