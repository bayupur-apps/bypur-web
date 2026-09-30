"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/helpers";
import { FilterPills, type FilterOption } from "@/components/ui/filter-pills";
import { getSkillIcon, isDarkBrand } from "@/lib/config/skill-icons";
import type { Skill } from "@/lib/types";

interface SkillLogoGridProps {
  skills: Skill[];
}

const CATEGORY_LABELS: Record<Skill["category"], string> = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools",
  ai: "AI",
  other: "Practices",
};

type Filter = "all" | Skill["category"];

function LevelDots({ level }: { level: number }) {
  return (
    <div className="flex items-center justify-center gap-0.75" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-1 rounded-full transition-colors duration-300",
            i < level ? "bg-accent/50 group-hover:bg-accent dark:bg-secondary/50 dark:group-hover:bg-secondary" : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

function SkillLogo({ skill }: { skill: Skill }) {
  // A logo uploaded in the CMS wins over the built-in icon set.
  if (skill.icon) {
    return (
      <div className="relative h-8 w-8">
        <Image
          src={skill.icon}
          alt=""
          fill
          sizes="32px"
          className="object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
    );
  }

  const icon = getSkillIcon(skill.name);
  if (icon.kind === "lucide") {
    const Icon = icon.icon;
    return <Icon size={28} strokeWidth={1.6} aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

/** Brand colour for the hover state, exposed as a CSS variable. */
const brandStyle = (skill: Skill): CSSProperties | undefined => {
  if (skill.icon) return undefined;
  const icon = getSkillIcon(skill.name);
  if (icon.kind !== "brand" || isDarkBrand(icon.hex)) return undefined;
  return { "--brand": `#${icon.hex}` } as CSSProperties;
};

export function SkillLogoGrid({ skills }: SkillLogoGridProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = useMemo(
    () => [...skills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [skills]
  );

  // Only offer categories that actually have skills, in a stable order.
  const categories = useMemo(
    () =>
      (Object.keys(CATEGORY_LABELS) as Skill["category"][])
        .map((key) => ({ key, count: sorted.filter((s) => s.category === key).length }))
        .filter((c) => c.count > 0),
    [sorted]
  );

  const items = filter === "all" ? sorted : sorted.filter((s) => s.category === filter);

  if (sorted.length === 0) return null;

  const tabs: FilterOption<Filter>[] = [
    { key: "all", label: "All", count: sorted.length },
    ...categories.map((c) => ({ key: c.key, label: CATEGORY_LABELS[c.key], count: c.count })),
  ];

  return (
    <div>
      <FilterPills
        options={tabs}
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter skills by category"
        className="mb-8"
      />

      {/* Remount on filter change so the entrance animation replays */}
      <ul key={filter} className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((skill, idx) => (
          <li
            key={skill.id ?? skill.name}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(idx, 18) * 25}ms` }}
          >
            <div
              style={brandStyle(skill)}
              className="group relative isolate flex h-full flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border glass px-2 py-5 text-text-2 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:text-[color:var(--brand,var(--text-1))] hover:shadow-lg hover:shadow-secondary/10"
              title={`${skill.name} · ${CATEGORY_LABELS[skill.category]}`}
            >
              {/* Brand-tinted glow behind the logo, only on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-2 -z-10 h-16 w-16 rounded-full bg-[var(--brand,var(--secondary))] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-25"
              />

              <div className="flex h-8 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <SkillLogo skill={skill} />
              </div>

              <span className="w-full truncate text-center text-[11px] font-medium text-text-2 transition-colors duration-300 group-hover:text-text-1 sm:text-xs">
                {skill.name}
              </span>

              {typeof skill.level === "number" && skill.level > 0 && <LevelDots level={skill.level} />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
