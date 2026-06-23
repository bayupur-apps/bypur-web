"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/helpers";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-subtle/50 text-text-2 transition-all hover:border-accent/40 hover:bg-bg-subtle hover:text-text-1"
      aria-label="Toggle theme"
    >
      <Sun
        size={16}
        className={cn(
          "absolute transition-all duration-500",
          resolvedTheme === "dark"
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        size={16}
        className={cn(
          "absolute transition-all duration-500",
          resolvedTheme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
