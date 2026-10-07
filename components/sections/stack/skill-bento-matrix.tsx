"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { getSkillIcon, isDarkBrand } from "@/lib/config/skill-icons";
import type { Skill, Project } from "@/lib/types";
import {
  Code2,
  Server,
  Database,
  Wrench,
  Cpu,
  ArrowUpRight,
  FolderGit2,
  Terminal,
  Activity,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
} from "lucide-react";
import { usePortfolio } from "@/contexts/portfolio-context";
import { cn } from "@/lib/helpers";

interface SkillBentoMatrixProps {
  skills: Skill[];
}

interface TierDefinition {
  id: string;
  code: string;
  label: string;
  icon: typeof Code2;
  match: (skill: Skill) => boolean;
}

const ARCHITECTURE_TIERS: TierDefinition[] = [
  {
    id: "client",
    code: "01_CLIENT",
    label: "Frontend & UI Systems",
    icon: Code2,
    match: (s) => s.category === "frontend",
  },
  {
    id: "server",
    code: "02_SERVER",
    label: "Backend & Microservices",
    icon: Server,
    match: (s) =>
      s.category === "backend" &&
      !["mysql", "postgresql", "redis"].includes(s.name.toLowerCase()),
  },
  {
    id: "data",
    code: "03_DATA",
    label: "Persistence & Cache",
    icon: Database,
    match: (s) =>
      ["mysql", "postgresql", "redis"].includes(s.name.toLowerCase()),
  },
  {
    id: "infra",
    code: "04_INFRA",
    label: "DevOps & Tooling",
    icon: Wrench,
    match: (s) => s.category === "tools",
  },
  {
    id: "intelligence",
    code: "05_AI_SPEC",
    label: "AI & System Protocols",
    icon: Cpu,
    match: (s) => s.category === "ai" || s.category === "other",
  },
];

function SkillIconRenderer({
  skill,
  className,
}: {
  skill: Skill;
  className?: string;
}) {
  if (skill.icon) {
    return (
      <div className={cn("relative h-4 w-4 shrink-0", className)}>
        <Image
          src={skill.icon}
          alt=""
          fill
          sizes="16px"
          className="object-contain"
        />
      </div>
    );
  }

  const icon = getSkillIcon(skill.name);
  if (icon.kind === "lucide") {
    const Icon = icon.icon;
    return (
      <Icon
        size={15}
        strokeWidth={1.8}
        className={cn("shrink-0 text-accent", className)}
        aria-hidden="true"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        "h-3.5 w-3.5 shrink-0 text-text-2 transition-colors group-hover:text-accent",
        className
      )}
      aria-hidden="true"
    >
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

export function SkillBentoMatrix({ skills }: SkillBentoMatrixProps) {
  const { projects } = usePortfolio();
  const [selectedSkill, setSelectedSkill] = useState<string | null>("Next.js");

  const sortedSkills = useMemo(
    () => [...skills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [skills]
  );

  // Top 4 Primary Core Production Technologies
  const coreSkills = useMemo(() => {
    const coreNames = ["Next.js", "TypeScript", "Laravel", "Golang"];
    const found = coreNames
      .map((name) =>
        sortedSkills.find((s) => s.name.toLowerCase() === name.toLowerCase())
      )
      .filter((s): s is Skill => Boolean(s));

    if (found.length < 4) {
      const remaining = sortedSkills.filter((s) => !found.includes(s));
      return [...found, ...remaining].slice(0, 4);
    }
    return found;
  }, [sortedSkills]);

  // Projects linked with selectedSkill
  const connectedProjects = useMemo(() => {
    if (!selectedSkill) return [];
    return projects.filter((p: Project) =>
      p.techStack.some(
        (t) =>
          t.toLowerCase().includes(selectedSkill.toLowerCase()) ||
          selectedSkill.toLowerCase().includes(t.toLowerCase())
      )
    );
  }, [projects, selectedSkill]);

  const activeSkillObj = useMemo(
    () => sortedSkills.find((s) => s.name === selectedSkill) || null,
    [sortedSkills, selectedSkill]
  );

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl neumorphic text-center">
        <Terminal className="h-6 w-6 text-text-3 mb-1.5" />
        <p className="text-xs font-semibold text-text-1">No skills configured</p>
        <p className="text-[11px] text-text-3 font-mono mt-0.5">
          Technical matrix data will populate once configured.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-full">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5 px-0.5">
        <div className="flex items-center gap-2">
          <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-accent/10 text-accent ring-1 ring-accent/20">
            <Activity size={13} />
          </div>
          <h2 className="text-xs sm:text-sm font-bold tracking-tight text-text-1">
            Technical Architecture &amp; Matrix
          </h2>
          <span className="font-mono text-[10px] text-text-3 hidden sm:inline">
            {"// RUNTIME & ECOSYSTEM SPEC"}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-bold text-accent">
            {skills.length} TECHS
          </span>
          <span className="hidden sm:inline rounded-full bg-bg-subtle px-2 py-0.5 text-text-3">
            {projects.length} PROJECTS
          </span>
        </div>
      </div>

      {/* Main Bento Layout Frame: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
        {/* LEFT COLUMN: Core Engines & Architecture Bus (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2.5">
          {/* 01: Core Production Engines Slots */}
          <div className="rounded-2xl neumorphic p-2.5 sm:p-3">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40">
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-accent" />
                <span className="font-mono text-[11px] font-bold text-text-1 uppercase tracking-wide">
                  Core Production Engines
                </span>
              </div>
              <span className="font-mono text-[9px] text-accent font-semibold px-1.5 py-0.5 rounded bg-accent/10">
                TIER 1 RUNTIMES
              </span>
            </div>

            {/* 4 Core Horizontal Engine Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {coreSkills.map((skill) => {
                const isSelected = selectedSkill === skill.name;
                const matchCount = projects.filter((p) =>
                  p.techStack.some((t) =>
                    t.toLowerCase().includes(skill.name.toLowerCase())
                  )
                ).length;

                return (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => setSelectedSkill(skill.name)}
                    aria-pressed={isSelected}
                    style={brandStyle(skill)}
                    className={cn(
                      "group relative flex flex-col justify-between rounded-xl p-2 text-left transition-all duration-150 min-h-[64px]",
                      isSelected
                        ? "neumorphic-pressed text-accent ring-1 ring-accent/50"
                        : "neumorphic-chip hover:border-accent/40 hover:-translate-y-0.5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-bg-subtle/70 ring-1 ring-border/50">
                        <SkillIconRenderer skill={skill} />
                      </div>
                      <span className="font-mono text-[9px] text-text-3 font-semibold">
                        {matchCount} {matchCount === 1 ? "proj" : "projs"}
                      </span>
                    </div>

                    <div className="mt-1">
                      <p className="text-xs font-bold text-text-1 group-hover:text-accent transition-colors truncate">
                        {skill.name}
                      </p>
                      <p className="font-mono text-[9px] text-text-3 capitalize truncate">
                        {skill.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 02: Architecture Tier Bus Lines */}
          <div className="rounded-2xl neumorphic p-2.5 sm:p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-0.5 pb-1 border-b border-border/40 font-mono text-[10px] text-text-3">
              <span>SYSTEM ARCHITECTURE TIERS</span>
              <span className="hidden sm:inline">CLICK NODE TO INSPECT TELEMETRY</span>
            </div>

            <div className="space-y-1.5">
              {ARCHITECTURE_TIERS.map((tier) => {
                const tierSkills = sortedSkills.filter(tier.match);
                if (tierSkills.length === 0) return null;
                const TierIcon = tier.icon;

                return (
                  <div
                    key={tier.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 rounded-xl bg-bg-subtle/30 p-1.5 border border-border/30 hover:border-border/60 transition-colors"
                  >
                    {/* Tier Tag */}
                    <div className="flex items-center gap-1.5 shrink-0 sm:w-32 px-1">
                      <TierIcon size={12} className="text-accent shrink-0" />
                      <span className="font-mono text-[10px] font-bold text-text-2 tracking-tight truncate">
                        {tier.code}
                      </span>
                    </div>

                    {/* Nodes Array */}
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      {tierSkills.map((skill) => {
                        const isSelected = selectedSkill === skill.name;
                        return (
                          <button
                            key={skill.id ?? skill.name}
                            type="button"
                            onClick={() => setSelectedSkill(skill.name)}
                            aria-pressed={isSelected}
                            style={brandStyle(skill)}
                            className={cn(
                              "group/node inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium transition-all duration-150 min-h-[26px]",
                              isSelected
                                ? "neumorphic-pressed text-accent font-bold ring-1 ring-accent/40"
                                : "neumorphic-chip text-text-2 hover:border-accent/40 hover:text-accent hover:-translate-y-0.5"
                            )}
                          >
                            <SkillIconRenderer skill={skill} className="h-3 w-3" />
                            <span className="truncate">{skill.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contextual Proof-of-Work & Telemetry HUD (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl neumorphic p-3 border border-border/70">
          <div>
            {/* HUD Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <FolderGit2 size={13} className="text-accent" />
                <h3 className="font-mono text-xs font-bold text-text-1 uppercase">
                  Spec &amp; Proof-of-Work
                </h3>
              </div>
              {selectedSkill && (
                <button
                  type="button"
                  onClick={() => setSelectedSkill(null)}
                  className="font-mono text-[10px] text-text-3 hover:text-accent flex items-center gap-0.5"
                >
                  <X size={10} /> Clear
                </button>
              )}
            </div>

            {/* Active Spec Info */}
            {activeSkillObj ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-bg-subtle/60 p-2 border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-bg-card ring-1 ring-border/60">
                      <SkillIconRenderer skill={activeSkillObj} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-1">
                        {activeSkillObj.name}
                      </p>
                      <p className="font-mono text-[9px] text-text-3 capitalize">
                        {activeSkillObj.category} Domain
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] font-bold text-accent">
                    ACTIVE NODE
                  </span>
                </div>

                {/* Linked Projects List */}
                <div className="space-y-1.5">
                  <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
                    Verified Codebase Implementations ({connectedProjects.length})
                  </p>

                  {connectedProjects.length > 0 ? (
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-workspace-scroll pr-1">
                      {connectedProjects.map((p) => (
                        <div
                          key={p.id}
                          className="group/proj flex items-center justify-between rounded-md border border-border/60 bg-bg-subtle/40 px-2.5 py-1.5 text-xs transition-all duration-150 hover:border-accent/50 hover:bg-bg-subtle/70"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-semibold text-text-1 text-[11px] truncate group-hover/proj:text-accent transition-colors">
                              {p.title}
                            </p>
                            <p className="text-[9px] text-text-3 font-mono truncate">
                              {p.techStack.slice(0, 3).join(" • ")}
                            </p>
                          </div>
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 flex h-5.5 w-5.5 items-center justify-center rounded-md bg-accent/10 text-accent hover:bg-accent hover:text-accent-fg transition-colors"
                              title="Open live implementation"
                            >
                              <ArrowUpRight size={11} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md bg-bg-subtle/30 p-3 text-center border border-dashed border-border/60">
                      <CheckCircle2 size={15} className="text-accent mx-auto mb-1" />
                      <p className="text-[11px] font-medium text-text-2">
                        Cross-Architecture Asset
                      </p>
                      <p className="text-[9px] text-text-3 font-mono mt-0.5">
                        Integrated across backend routines, protocols, and tooling pipelines.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Layers size={20} className="text-text-3 mb-1.5" />
                <p className="text-xs font-semibold text-text-2">
                  Select an Architecture Node
                </p>
                <p className="text-[10px] text-text-3 font-mono mt-0.5 max-w-[200px]">
                  Click any engine or module across the bus to view real project references.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="pt-2 border-t border-border/40 mt-2 font-mono text-[9px] text-text-3 flex items-center justify-between">
            <span>SYS: OPTIMIZED</span>
            <span className="text-accent font-semibold">100% DESKTOP READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
