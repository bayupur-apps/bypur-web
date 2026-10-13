"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/helpers";
import type { Profile } from "@/lib/types";

interface RoleLineProps {
  profileData: Pick<Profile, "roles" | "rolesLabel">;
  className?: string;
}

export function RoleLine({ profileData, className }: RoleLineProps) {
  const roles = profileData.roles ?? [];
  const [roleIndex, setRoleIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (roles.length < 2 || prefersReducedMotion !== false) return;

    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [roles.length, prefersReducedMotion]);

  const role = roles[roleIndex] ?? roles[0];
  if (!role && !profileData.rolesLabel) return null;

  return (
    <p className={cn("text-sm font-medium text-text-2", className)}>
      {role && profileData.rolesLabel ? `${profileData.rolesLabel}: ` : null}
      {role ?? profileData.rolesLabel}
    </p>
  );
}
