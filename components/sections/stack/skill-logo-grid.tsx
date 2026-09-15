import Image from "next/image";
import { FadeUp } from "@/components/ui/motion";
import { cn } from "@/lib/helpers";
import type { Skill } from "@/lib/types";

interface SkillLogoGridProps {
  skills: Skill[];
  limit?: number;
}

const DEFAULT_LIMIT = 12;

function LevelDots({ level }: { level: number }) {
  return (
    <div className="flex items-center justify-center gap-0.75" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-1 rounded-full transition-colors duration-300",
            i < level
              ? "bg-accent/50 group-hover:bg-accent"
              : "bg-border group-hover:bg-border"
          )}
        />
      ))}
    </div>
  );
}

export function SkillLogoGrid({ skills, limit = DEFAULT_LIMIT }: SkillLogoGridProps) {
  const items = [...skills]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, limit);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {items.map((skill, idx) => (
        <FadeUp key={skill.id ?? skill.name} delay={idx * 0.03}>
          <div
            className="group relative flex flex-col items-center gap-2.5 rounded-2xl border border-border/60 bg-bg-card/40 px-3 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-bg-card hover:shadow-lg hover:shadow-accent/10"
            title={skill.name}
          >
            {/* Accent glow behind the logo, only on hover */}
            <div className="pointer-events-none absolute top-3 h-14 w-14 rounded-full bg-accent/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
              {skill.icon ? (
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  fill
                  sizes="44px"
                  className="object-contain grayscale opacity-50 drop-shadow-none transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-base font-bold text-accent/60 transition-all duration-300 group-hover:scale-110 group-hover:text-accent">
                  {skill.name.charAt(0)}
                </span>
              )}
            </div>

            <span className="relative truncate text-center text-[11px] font-semibold text-text-2 transition-colors duration-300 group-hover:text-text-1">
              {skill.name}
            </span>

            {typeof skill.level === "number" && skill.level > 0 && (
              <LevelDots level={skill.level} />
            )}
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
