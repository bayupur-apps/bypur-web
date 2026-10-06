"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { FilterPills, type FilterOption } from "@/components/ui/filter-pills";
import { getSkillIcon, isDarkBrand } from "@/lib/config/skill-icons";
import type { Skill } from "@/lib/types";
import { Code2, Server, Wrench, Cpu, Layers } from "lucide-react";

interface SkillLogoGridProps {
  skills: Skill[];
}

const CATEGORY_LABELS: Record<Skill["category"], string> = {
  frontend: "Frontend Architecture",
  backend: "Backend & Systems",
  tools: "DevOps & Tooling",
  ai: "AI & Data",
  other: "Practices & Methods",
};

const CATEGORY_ICONS: Record<Skill["category"], typeof Code2> = {
  frontend: Code2,
  backend: Server,
  tools: Wrench,
  ai: Cpu,
  other: Layers,
};

type Filter = "all" | Skill["category"];

function SkillLogo({ skill }: { skill: Skill }) {
  if (skill.icon) {
    return (
      <div className="relative h-5 w-5 shrink-0">
        <Image
          src={skill.icon}
          alt=""
          fill
          sizes="20px"
          className="object-contain opacity-80 transition-all duration-200 group-hover:opacity-100"
        />
      </div>
    );
  }

  const icon = getSkillIcon(skill.name);
  if (icon.kind === "lucide") {
    const Icon = icon.icon;
    return <Icon size={18} strokeWidth={1.8} className="shrink-0 text-accent transition-transform group-hover:scale-110" aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5 shrink-0 text-text-2 transition-colors group-hover:text-accent" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

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

  const categories = useMemo(
    () =>
      (Object.keys(CATEGORY_LABELS) as Skill["category"][])
        .map((key) => ({
          key,
          label: CATEGORY_LABELS[key],
          count: sorted.filter((s) => s.category === key).length,
          skills: sorted.filter((s) => s.category === key),
        }))
        .filter((c) => c.count > 0),
    [sorted]
  );

  if (sorted.length === 0) return null;

  const tabs: FilterOption<Filter>[] = [
    { key: "all", label: "All Domains", count: sorted.length },
    ...categories.map((c) => ({ key: c.key, label: c.label.split(" ")[0], count: c.count })),
  ];

  const visibleCategories = filter === "all" ? categories : categories.filter((c) => c.key === filter);

  return (
    <div>
      <FilterPills
        options={tabs}
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter skills by category domain"
        className="mb-8"
      />

      <div key={filter} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {visibleCategories.map((cat, idx) => {
          const CategoryIcon = CATEGORY_ICONS[cat.key] || Layers;
          return (
            <div
              key={cat.key}
              className="animate-fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 neumorphic p-6 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Header */}
              <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                    <CategoryIcon size={18} />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-text-1">{cat.label}</h3>
                </div>
                <span className="mono-label rounded-full bg-bg-subtle px-2.5 py-1 text-[11px] font-semibold text-text-3">
                  {cat.count} TECHS
                </span>
              </div>

              {/* Skills Chip List */}
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.id ?? skill.name}
                    style={brandStyle(skill)}
                    className="group/chip inline-flex items-center gap-2 rounded-xl border border-border/60 bg-bg-subtle/60 px-3.5 py-2 text-xs font-medium text-text-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-bg-card hover:text-text-1 hover:shadow-sm"
                  >
                    <SkillLogo skill={skill} />
                    <span>{skill.name}</span>
                    {typeof skill.level === "number" && skill.level >= 4 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/70" title="Core skill" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
