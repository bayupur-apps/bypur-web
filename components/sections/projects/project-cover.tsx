import Image from "next/image";
import { findSkillIcon, type SkillIcon } from "@/lib/config/skill-icons";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";
import { hasRealImage, pickCoverPalette } from "./utils";
import { Network } from "lucide-react";

const PALETTES = [
  "from-secondary/35 via-secondary/10 to-tertiary/30 dark:from-[#181B26] dark:via-[#12141D] dark:to-[#0D0F15]",
  "from-tertiary/30 via-secondary/15 to-secondary/30 dark:from-[#1A1826] dark:via-[#12141D] dark:to-[#0D0F15]",
  "from-secondary/30 via-accent/10 to-tertiary/25 dark:from-[#191C28] dark:via-[#131520] dark:to-[#0D0F15]",
  "from-accent/20 via-secondary/20 to-secondary/35 dark:from-[#1E1A26] dark:via-[#14121A] dark:to-[#0D0F15]",
];

function Glyph({ icon }: Readonly<{ icon: SkillIcon }>) {
  if (icon.kind === "lucide") {
    const Icon = icon.icon;
    return <Icon size={20} strokeWidth={1.75} aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

/** Interactive Architecture HUD cover built from the project's tech stack and architecture metrics. */
function GeneratedCover({ project }: Readonly<{ project: Project }>) {
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

  const archType =
    project.architectureHighlights?.[0] ??
    (project.endpoints && project.endpoints.length > 0 ? "REST API Service" : "Fullstack Architecture");

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-full w-full overflow-hidden bg-gradient-to-br transition-all duration-300",
        PALETTES[pickCoverPalette(project.title, PALETTES.length)]
      )}
    >
      {/* Blueprint Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      {/* Ambient Focal Glow */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full bg-accent/10 dark:bg-accent/15 blur-2xl" />

      {/* Tech Stack Pods */}
      <div className="absolute inset-0 flex items-center justify-center gap-3 transition-transform duration-300 group-hover:scale-105">
        {logos.length > 0 ? (
          logos.map(({ tech, icon }, i) => (
            <div
              key={tech}
              className={cn(
                "flex flex-col items-center gap-1 transition-transform duration-300",
                i === 1 && "-translate-y-1.5"
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-bg-card/90 dark:bg-[#151824]/90 backdrop-blur-xs text-text-1 shadow-md dark:border-white/10 group-hover:border-accent/50 group-hover:shadow-accent/10 transition-colors">
                <Glyph icon={icon} />
              </span>
              <span className="font-mono text-[8px] font-semibold text-text-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {tech}
              </span>
            </div>
          ))
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/80 bg-bg-card/90 dark:bg-[#151824]/90 backdrop-blur-xs text-lg font-bold text-text-1 shadow-md dark:border-white/10">
            {initials}
          </span>
        )}
      </div>

      {/* Bottom Right HUD Archetype Pill */}
      <div className="absolute right-2.5 bottom-2.5 z-10 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md border border-border/60 bg-bg-card/85 dark:bg-[#0D0F15]/90 backdrop-blur-xs font-mono text-[8.5px] text-text-3 shadow-2xs">
        <Network size={9} className="text-accent" />
        <span className="truncate max-w-[150px]">{archType}</span>
      </div>
    </div>
  );
}

export function ProjectCover({ project }: Readonly<{ project: Project }>) {
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
