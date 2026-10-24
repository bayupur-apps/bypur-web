"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { usePortfolio } from "@/contexts/portfolio-context";
import { Mail, ArrowUpRight } from "lucide-react";

export function AppTopBar() {
  const { profile, settings } = usePortfolio();
  const [time, setTime] = useState<string>("");

  const displayName = settings?.site_name || profile.name || "Bayu Purnomo";
  const displayTagline = settings?.site_tagline || profile.title;
  const displayEmail = settings?.owner_email || profile.email;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BP";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-40 w-full shrink-0 pt-3 pb-2 md:pb-1">
      <header className="flex h-13 w-full items-center justify-between gap-3 rounded-xl border border-border/80 bg-bg-card px-3 py-2 shadow-xs transition-all sm:px-5">
        {/* LEFT: Brand Identity Monogram & Title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg font-bold text-xs tracking-wider shadow-xs">
            {initials}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-bold tracking-tight text-text-1">
              {displayName}
            </span>
            {displayTagline && (
              <span className="max-w-[200px] truncate text-[11px] text-text-3">
                {displayTagline}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Local Time, Contact CTA & Theme Toggle */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {time && profile.location && (
            <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] text-text-3">
              <span>{profile.location}</span>
              <span className="text-text-1 font-semibold">{time} WIB</span>
            </div>
          )}

          {displayEmail && (
            <a
              href={`mailto:${displayEmail}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-bg-subtle/50 px-3 py-1.5 text-xs font-medium text-text-2 transition-all hover:border-accent/40 hover:text-accent hover:-translate-y-0.5"
            >
              <Mail size={13} className="text-accent" />
              <span className="hidden sm:inline">Get in Touch</span>
              <ArrowUpRight size={12} className="text-text-3" />
            </a>
          )}

          <div className="h-4 w-px bg-border/70 hidden sm:block" />

          <ThemeToggle />
        </div>
      </header>
    </div>
  );
}
