"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { usePortfolio } from "@/contexts/portfolio-context";
import { Mail, ArrowUpRight } from "lucide-react";

export function AppTopBar() {
  const { profile } = usePortfolio();
  const [time, setTime] = useState<string>("");

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
      <header className="flex h-13 w-full items-center justify-between rounded-xl border border-border/80 bg-bg-card px-4 py-2 shadow-xs transition-all sm:px-5">
        {/* LEFT: Brand Identity Monogram & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg font-bold text-xs tracking-wider shadow-xs">
            BP
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-text-1">
              {profile.name || "Bayu Purnomo"}
            </span>
            <span className="text-[11px] text-text-3 truncate max-w-[140px] sm:max-w-none">
              {profile.title || "Full-Stack Developer"}
            </span>
          </div>
        </div>

        {/* RIGHT: Local Time, Contact CTA & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {time && (
            <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] text-text-3">
              <span>Purwokerto</span>
              <span className="text-text-1 font-semibold">{time} WIB</span>
            </div>
          )}

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
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
