"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/helpers";
import type { DockItem } from "./app-island-dock";

interface AppMobileDockProps {
  items: DockItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

const MOBILE_LABELS: Record<string, string> = {
  bio: "Bio",
  projects: "Work",
  experience: "Exp",
  stack: "Stack",
  certificates: "Certs",
  contact: "Talk",
};

export function AppMobileDock({ items, activeId, onSelect }: AppMobileDockProps) {
  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center gap-1 rounded-full border border-border/80 bg-bg-card/95 p-1.5 shadow-xl backdrop-blur-xl max-w-[calc(100vw-20px)]"
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon;
        const displayLabel = MOBILE_LABELS[item.id] || item.label;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "relative flex min-h-[44px] min-w-[46px] flex-col items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-medium transition-all duration-200 shrink-0",
              isActive
                ? "text-accent font-bold"
                : "text-text-3 hover:text-text-1"
            )}
            aria-label={item.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeMobileDockPill"
                className="absolute inset-0 rounded-full bg-accent/15 border border-accent/30 pointer-events-none"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={17} className="mb-0.5" />
            <span className="text-[10px] leading-tight tracking-tight">{displayLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
