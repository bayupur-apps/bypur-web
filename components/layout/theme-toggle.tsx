"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/helpers";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border glass text-text-2 transition-all hover:border-accent/40 hover:bg-bg-subtle hover:text-text-1"
      aria-label="Toggle theme"
    >
      <Sun
        size={18}
        className={cn(
          "absolute transition-all duration-500",
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        size={18}
        className={cn(
          "absolute transition-all duration-500",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
