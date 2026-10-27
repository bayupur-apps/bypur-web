"use client";

import { useState } from "react";
import { Laptop } from "lucide-react";
import { cn } from "@/lib/helpers";
import { companyInitials } from "./utils";

interface CompanyAvatarProps {
  company: string;
  companyLogo?: string;
  isFreelance?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-md text-[10px]",
  md: "h-10 w-10 rounded-lg text-xs",
  lg: "h-12 w-12 rounded-xl text-sm",
};

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 22,
};

export function CompanyAvatar({
  company,
  companyLogo,
  isFreelance = false,
  size = "md",
  className,
}: Readonly<CompanyAvatarProps>) {
  const [imgError, setImgError] = useState(false);
  const initials = companyInitials(company);

  if (companyLogo && !imgError) {
    return (
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center overflow-hidden border border-border/80 bg-bg-card/90 p-1.5 shadow-xs transition-transform duration-200 group-hover:scale-105",
          sizeClasses[size],
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={companyLogo}
          alt={`${company} logo`}
          onError={() => setImgError(true)}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  if (isFreelance) {
    return (
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center border border-accent/40 bg-accent/10 text-accent shadow-xs transition-transform duration-200 group-hover:scale-105",
          sizeClasses[size],
          className
        )}
        title="Freelance / Independent"
      >
        <Laptop size={iconSizes[size]} strokeWidth={2} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 flex items-center justify-center font-mono font-bold tracking-wider text-accent border border-accent/30 bg-gradient-to-br from-accent/15 via-bg-subtle/80 to-bg-card shadow-xs transition-transform duration-200 group-hover:scale-105",
        sizeClasses[size],
        className
      )}
      title={company}
    >
      <span>{initials}</span>
      <span
        aria-hidden="true"
        className="absolute bottom-0.5 right-0.5 h-1 w-1 rounded-full bg-accent/70"
      />
    </div>
  );
}
