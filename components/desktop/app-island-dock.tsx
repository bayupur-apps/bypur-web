"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/helpers";
import { User, Cpu, FolderGit2, Briefcase, Award, Send } from "lucide-react";

export interface DockItem {
  id: string;
  index: string;
  label: string;
  shortcut: string;
  icon: typeof User;
}

interface AppIslandDockProps {
  items: DockItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const BASE_DOCK_ITEMS: DockItem[] = [
  { id: "bio", index: "01", label: "Bio & Overview", shortcut: "1", icon: User },
  { id: "projects", index: "02", label: "Projects", shortcut: "2", icon: FolderGit2 },
  { id: "experience", index: "03", label: "Experience", shortcut: "3", icon: Briefcase },
  { id: "stack", index: "04", label: "Skills Matrix", shortcut: "4", icon: Cpu },
  { id: "certificates", index: "05", label: "Certificates", shortcut: "5", icon: Award },
  { id: "contact", index: "06", label: "Contact", shortcut: "6", icon: Send },
];

export function AppIslandDock({ items, activeId, onSelect }: AppIslandDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Keyboard shortcut listener: pressing 1-6 switches views
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input or textarea
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const matched = items.find((item) => item.shortcut === e.key);
      if (matched) {
        onSelect(matched.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, onSelect]);

  return (
    <aside
      aria-label="Application Navigation Rail"
      className="hidden md:flex fixed left-3 lg:left-5 top-1/2 -translate-y-1/2 z-40 flex-col items-start justify-center select-none"
    >
      {/* Outer Fixed-Width Capsule */}
      <nav className="relative flex flex-col gap-2 w-14 items-center rounded-xl border border-border/80 bg-bg-card p-1.5 shadow-xs">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative flex h-11 w-11 items-center justify-center"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Button: Fixed in place when idle; Pops out to the right when hovered */}
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "group flex h-11 items-center rounded-lg transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-accent",
                  isHovered
                    ? "absolute left-0 z-50 w-max px-3.5 border border-border/80 bg-bg-card shadow-md translate-x-1 text-text-1"
                    : "relative w-11 justify-center px-0",
                  isActive && !isHovered && "bg-accent/10 border border-accent/40 text-accent font-semibold",
                  !isActive && !isHovered && "text-text-3 hover:text-text-1 hover:bg-bg-subtle/50"
                )}
                aria-label={`${item.label} (Shortcut: ${item.shortcut})`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active Indicator on idle */}
                {isActive && !isHovered && (
                  <motion.div
                    layoutId="activeDockIconPill"
                    className="absolute inset-0 rounded-lg border border-accent/40 pointer-events-none"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={cn(
                      "transition-all duration-200",
                      isActive || isHovered
                        ? "text-accent scale-105"
                        : "text-text-3 group-hover:text-accent"
                    )}
                  />
                </div>

                {/* Pop-out Content (Muncul menonjol ke kanan saat dihover) */}
                {isHovered && (
                  <div className="relative z-10 flex items-center ml-2.5 whitespace-nowrap animate-fade-in">
                    <span className="font-mono text-[10px] font-semibold text-accent mr-1.5">
                      {item.index}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold tracking-tight mr-2.5",
                        isActive ? "text-accent font-bold" : "text-text-1"
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="flex h-4 min-w-4 items-center justify-center rounded bg-bg-subtle px-1 font-mono text-[9px] font-bold text-text-3">
                      {item.shortcut}
                    </span>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
