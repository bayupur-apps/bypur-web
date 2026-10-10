import Image from "next/image";
import { findSkillIcon, type SkillIcon } from "@/lib/config/skill-icons";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";
import { hasRealImage, pickCoverPalette } from "./utils";

// Spelled out in full so Tailwind can detect them.
const PALETTES = [
  "from-secondary/35 via-secondary/10 to-tertiary/30 dark:from-secondary/25 dark:via-transparent dark:to-tertiary/30",
  "from-tertiary/30 via-secondary/15 to-secondary/30 dark:from-tertiary/30 dark:via-transparent dark:to-secondary/25",
  "from-secondary/30 via-accent/10 to-tertiary/25 dark:from-secondary/20 dark:via-accent/20 dark:to-tertiary/30",
  "from-accent/20 via-secondary/20 to-secondary/35 dark:from-accent/40 dark:via-transparent dark:to-secondary/25",
];

function Glyph({ icon }: { icon: SkillIcon }) {
  if (icon.kind === "lucide") {
    const Icon = icon.icon;
    return <Icon size={22} strokeWidth={1.75} aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5.5 w-5.5" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

/** Stand-in cover built from the project's own stack when there's no screenshot. */
function GeneratedCover({ project }: { project: Project }) {
  const logos = project.techStack
    .map((tech) => ({ tech, icon: findSkillIcon(tech) }))
    .filter((t): t is { tech: string; icon: SkillIcon } => Boolean(t.icon))
    .slice(0, 3);

  const initials = project.title
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      aria-hidden="true"
      className={cn("relative h-full w-full overflow-hidden bg-linear-to-br", PALETTES[pickCoverPalette(project.title, PALETTES.length)])}
    >
      {/* Faint grid, faded out towards the edges */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[28px_28px] opacity-60 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="absolute inset-0 flex items-center justify-center gap-3 transition-transform duration-500 group-hover:scale-105">
        {logos.length > 0 ? (
          logos.map(({ tech, icon }, i) => (
            <span
              key={tech}
              className={cn(
                "flex h-13 w-13 items-center justify-center rounded-xl border border-border/70 glass-strong text-text-1 shadow-md dark:border-white/10",
                i === 1 && "-translate-y-2"
              )}
            >
              <Glyph icon={icon} />
            </span>
          ))
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-border/70 glass-strong text-xl font-bold text-text-1 shadow-md dark:border-white/10">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

export function ProjectCover({ project }: { project: Project }) {
  if (hasRealImage(project.imageUrl)) {
    return (
      <Image
        src={project.imageUrl!}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    );
  }
  return <GeneratedCover project={project} />;
}
