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
import { SectionTopBar } from "@/components/ui/section-top-bar";

interface SkillBentoMatrixProps {
  skills: Skill[];
}

function SkillIconRenderer({
  skill,
  className,
}: {
  skill: Skill;
  className?: string;
}) {
  if (skill.icon) {
    return (
      <div className={cn("relative h-3.5 w-3.5 shrink-0", className)}>
        <Image
          src={skill.icon}
          alt=""
          fill
          sizes="14px"
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
        size={13}
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
        "h-3 w-3 shrink-0 text-text-2 transition-colors group-hover:text-accent",
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

// Skill categorization for Bento boxes: Balanced across architectural tiers
const isDataInfraSkill = (s: Skill) =>
  ["mysql", "postgresql", "redis", "docker", "ci/cd", "kubernetes", "aws"].some(
    (term) => s.name.toLowerCase().includes(term)
  );

const isServerArchSkill = (s: Skill) =>
  (s.category === "backend" && !isDataInfraSkill(s)) ||
  ["clean code", "system design"].includes(s.name.toLowerCase());

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

  const clientSkills = useMemo(
    () => sortedSkills.filter((s) => s.category === "frontend"),
    [sortedSkills]
  );

  const serverSkills = useMemo(
    () => sortedSkills.filter((s) => isServerArchSkill(s)),
    [sortedSkills]
  );

  const dataSkills = useMemo(
    () =>
      sortedSkills.filter(
        (s) =>
          isDataInfraSkill(s) &&
          !clientSkills.some((c) => c.name === s.name) &&
          !serverSkills.some((svr) => svr.name === s.name)
      ),
    [sortedSkills, clientSkills, serverSkills]
  );

  const toolAndAiSkills = useMemo(
    () =>
      sortedSkills.filter(
        (s) =>
          !clientSkills.some((c) => c.name === s.name) &&
          !serverSkills.some((svr) => svr.name === s.name) &&
          !dataSkills.some((d) => d.name === s.name)
      ),
    [sortedSkills, clientSkills, serverSkills, dataSkills]
  );

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
      <div className="flex flex-col items-center justify-center p-6 rounded-xl neumorphic text-center">
        <Terminal className="h-6 w-6 text-text-3 mb-1.5" />
        <p className="text-xs font-semibold text-text-1">No skills configured</p>
        <p className="text-[11px] text-text-3 font-mono mt-0.5">
          Technical matrix data will populate once configured.
        </p>
      </div>
    );
  }

  const renderSkillChip = (skill: Skill) => {
    const isSelected = selectedSkill === skill.name;
    return (
      <button
        key={skill.id ?? skill.name}
        type="button"
        onClick={() => setSelectedSkill(skill.name)}
        aria-pressed={isSelected}
        style={brandStyle(skill)}
        className={cn(
          "group/node inline-flex items-center gap-1.5 rounded-md px-2.5 sm:px-2 py-1.5 sm:py-1 text-[11px] sm:text-[10.5px] font-medium transition-all duration-150 min-h-[34px] sm:min-h-[25px] active:scale-95",
          isSelected
            ? "bg-bg-card text-accent font-bold ring-1 ring-accent/50 shadow-xs"
            : "border border-border/50 bg-bg-card/60 text-text-2 hover:border-accent/40 hover:text-accent hover:bg-bg-card"
        )}
      >
        <SkillIconRenderer skill={skill} className="h-3 w-3 sm:h-2.5 sm:w-2.5" />
        <span className="truncate">{skill.name}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-full">
      {/* Top Console Bar */}
      <SectionTopBar
        icon={Activity}
        title="Technical Architecture & Matrix"
        subtitle="// RUNTIME & ECOSYSTEM SPEC"
        badge={`${skills.length} TECHS`}
        secondaryBadge={`${projects.length} PROJECTS`}
      />

      {/* Main Bento Layout Frame: 8 Cols Bento Arena + 4 Cols Inspector HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch lg:h-[450px] xl:h-[470px]">
        {/* LEFT COLUMN: Modular Bento Grid Architecture (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2.5 h-full min-h-0">
          {/* Bento Box 1: Core Production Engines (Banner Bento) */}
          <div className="rounded-xl border border-border/70 bg-bg-card p-2.5 shrink-0">
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-border/40">
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-accent" />
                <span className="font-mono text-[10.5px] font-bold text-text-1 uppercase tracking-wide">
                  Core Production Engines
                </span>
              </div>
              <span className="font-mono text-[8.5px] text-accent font-semibold px-1.5 py-0.5 rounded-md bg-accent/10">
                CORE RUNTIMES
              </span>
            </div>

            {/* 4 Core Engine Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
                      "group relative flex flex-col justify-between rounded-lg p-2 text-left transition-all duration-150 min-h-[58px] active:scale-98",
                      isSelected
                        ? "neumorphic-pressed text-accent ring-1 ring-accent/50"
                        : "neumorphic-chip hover:border-accent/40 hover:-translate-y-0.5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-bg-subtle/70 ring-1 ring-border/50">
                        <SkillIconRenderer skill={skill} />
                      </div>
                      <span className="font-mono text-[8.5px] text-text-3 font-semibold">
                        {matchCount} {matchCount === 1 ? "proj" : "projs"}
                      </span>
                    </div>

                    <div className="mt-1">
                      <p className="text-[11.5px] font-bold text-text-1 group-hover:text-accent transition-colors truncate leading-tight">
                        {skill.name}
                      </p>
                      <p className="font-mono text-[8.5px] text-text-3 capitalize truncate">
                        {skill.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Inline Spec HUD: Instant feedback on touchscreens */}
          {activeSkillObj && (
            <div className="lg:hidden rounded-xl border border-border/80 bg-bg-card p-2.5 flex flex-col gap-1.5 shadow-xs shrink-0">
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <SkillIconRenderer skill={activeSkillObj} />
                  </div>
                  <div>
                    <span className="text-[11.5px] font-bold text-text-1">
                      {activeSkillObj.name}
                    </span>
                    <span className="font-mono text-[8.5px] text-text-3 ml-2 capitalize">
                      {activeSkillObj.category} tier
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[8.5px] font-bold text-accent px-1.5 py-0.5 rounded-md bg-accent/10">
                    {connectedProjects.length} PROJS
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSkill(null)}
                    aria-label="Clear active skill selection"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:text-text-1 active:scale-90"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {connectedProjects.length > 0 ? (
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none]">
                  {connectedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-bg-subtle/50 px-2 py-1 text-xs shrink-0"
                    >
                      <span className="text-[10.5px] font-semibold text-text-1">
                        {p.title}
                      </span>
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent flex items-center"
                          aria-label={`Open ${p.title} live implementation`}
                        >
                          <ArrowUpRight size={11} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9.5px] text-text-3 font-mono py-0.5">
                  Cross-architecture asset integrated across backend routines.
                </p>
              )}
            </div>
          )}

          {/* Subgrid: 4 Distinct Bento Boxes for Domain Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-0">
            {/* Bento Box 2: Client Systems (01_CLIENT) */}
            <div className="rounded-xl border border-border/70 bg-bg-card p-2.5 sm:p-3 flex flex-col justify-between min-h-0 overflow-hidden">
              <div className="min-h-0 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Code2 size={12} className="text-accent shrink-0" />
                    <span className="text-[11px] font-bold text-text-1 truncate">
                      Frontend &amp; UI Systems
                    </span>
                  </div>
                  <span className="font-mono text-[8.5px] font-bold text-accent px-1.5 py-0.5 rounded-md bg-accent/10">
                    01_CLIENT
                  </span>
                </div>
                <div className="flex flex-wrap content-start items-start gap-1.5 flex-1 min-h-0 overflow-y-auto custom-workspace-scroll pr-1">
                  {clientSkills.map(renderSkillChip)}
                </div>
              </div>
              <div className="pt-1.5 mt-1.5 border-t border-border/30 font-mono text-[8.5px] text-text-3 flex items-center justify-between shrink-0">
                <span>{clientSkills.length} Modules</span>
                <span className="text-accent/80 font-medium">Reactive Client</span>
              </div>
            </div>

            {/* Bento Box 3: Server Systems (02_SERVER) */}
            <div className="rounded-xl border border-border/70 bg-bg-card p-2.5 sm:p-3 flex flex-col justify-between min-h-0 overflow-hidden">
              <div className="min-h-0 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Server size={12} className="text-accent shrink-0" />
                    <span className="text-[11px] font-bold text-text-1 truncate">
                      Backend &amp; Architecture
                    </span>
                  </div>
                  <span className="font-mono text-[8.5px] font-bold text-accent px-1.5 py-0.5 rounded-md bg-accent/10">
                    02_SERVER
                  </span>
                </div>
                <div className="flex flex-wrap content-start items-start gap-1.5 flex-1 min-h-0 overflow-y-auto custom-workspace-scroll pr-1">
                  {serverSkills.map(renderSkillChip)}
                </div>
              </div>
              <div className="pt-1.5 mt-1.5 border-t border-border/30 font-mono text-[8.5px] text-text-3 flex items-center justify-between shrink-0">
                <span>{serverSkills.length} Engines</span>
                <span className="text-accent/80 font-medium">REST &amp; Microservices</span>
              </div>
            </div>

            {/* Bento Box 4: Persistence & Infrastructure (03_DATA) */}
            <div className="rounded-xl border border-border/70 bg-bg-card p-2.5 sm:p-3 flex flex-col justify-between min-h-0 overflow-hidden">
              <div className="min-h-0 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Database size={12} className="text-accent shrink-0" />
                    <span className="text-[11px] font-bold text-text-1 truncate">
                      Database &amp; Cloud Infra
                    </span>
                  </div>
                  <span className="font-mono text-[8.5px] font-bold text-accent px-1.5 py-0.5 rounded-md bg-accent/10">
                    03_DATA
                  </span>
                </div>
                <div className="flex flex-wrap content-start items-start gap-1.5 flex-1 min-h-0 overflow-y-auto custom-workspace-scroll pr-1">
                  {dataSkills.map(renderSkillChip)}
                </div>
              </div>
              <div className="pt-1.5 mt-1.5 border-t border-border/30 font-mono text-[8.5px] text-text-3 flex items-center justify-between shrink-0">
                <span>{dataSkills.length} Engines</span>
                <span className="text-accent/80 font-medium">Storage &amp; Containers</span>
              </div>
            </div>

            {/* Bento Box 5: DevOps, Tools & AI (04_INFRA & 05_AI_SPEC) */}
            <div className="rounded-xl border border-border/70 bg-bg-card p-2.5 sm:p-3 flex flex-col justify-between min-h-0 overflow-hidden">
              <div className="min-h-0 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Wrench size={12} className="text-accent shrink-0" />
                    <span className="text-[11px] font-bold text-text-1 truncate">
                      DevOps, Tools &amp; AI
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[8.5px] font-bold text-accent px-1.5 py-0.5 rounded-md bg-accent/10">
                      04_INFRA
                    </span>
                    <span className="font-mono text-[8.5px] font-bold text-accent px-1.5 py-0.5 rounded-md bg-accent/10 hidden sm:inline">
                      05_AI_SPEC
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap content-start items-start gap-1.5 flex-1 min-h-0 overflow-y-auto custom-workspace-scroll pr-1">
                  {toolAndAiSkills.map(renderSkillChip)}
                </div>
              </div>
              <div className="pt-1.5 mt-1.5 border-t border-border/30 font-mono text-[8.5px] text-text-3 flex items-center justify-between shrink-0">
                <span>{toolAndAiSkills.length} Modules</span>
                <span className="text-accent/80 font-medium">Tooling &amp; Intelligence</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Codebase & Project References (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-border/70 bg-bg-card p-3 h-full min-h-0">
          <div>
            {/* HUD Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <FolderGit2 size={12} className="text-accent" />
                <h3 className="font-mono text-[11px] font-bold text-text-1 uppercase">
                  Verified Codebase References
                </h3>
              </div>
              {selectedSkill && (
                <button
                  type="button"
                  onClick={() => setSelectedSkill(null)}
                  className="font-mono text-[9px] text-text-3 hover:text-accent flex items-center gap-0.5 transition-colors"
                >
                  <X size={10} /> Clear
                </button>
              )}
            </div>

            {/* Active Spec Info */}
            {activeSkillObj ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-bg-subtle/60 p-2 border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-bg-card ring-1 ring-border/60">
                      <SkillIconRenderer skill={activeSkillObj} />
                    </div>
                    <div>
                      <p className="text-[11.5px] font-bold text-text-1 leading-tight">
                        {activeSkillObj.name}
                      </p>
                      <p className="font-mono text-[8.5px] text-text-3 capitalize">
                        {activeSkillObj.category} Domain
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-accent">
                    SELECTED
                  </span>
                </div>

                {/* Linked Projects List */}
                <div className="space-y-1">
                  <p className="font-mono text-[9.5px] text-text-3 uppercase tracking-wider">
                    Linked Projects ({connectedProjects.length})
                  </p>

                  {connectedProjects.length > 0 ? (
                    <div className="space-y-1.5 max-h-[265px] overflow-y-auto custom-workspace-scroll pr-0.5">
                      {connectedProjects.map((p) => (
                        <div
                          key={p.id}
                          className="group/proj flex items-center justify-between rounded-md border border-border/60 bg-bg-subtle/40 px-2 py-1.5 text-xs transition-all duration-150 hover:border-accent/50 hover:bg-bg-subtle/70"
                        >
                          <div className="min-w-0 pr-1.5">
                            <p className="font-semibold text-text-1 text-[11px] truncate group-hover/proj:text-accent transition-colors leading-tight">
                              {p.title}
                            </p>
                            <p className="text-[8.5px] text-text-3 font-mono truncate">
                              {p.techStack.slice(0, 3).join(" • ")}
                            </p>
                          </div>
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent hover:bg-accent hover:text-accent-fg transition-colors"
                              title="Open live implementation"
                            >
                              <ArrowUpRight size={10} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-bg-subtle/30 p-2.5 text-center border border-dashed border-border/60">
                      <CheckCircle2 size={13} className="text-accent mx-auto mb-1" />
                      <p className="text-[10.5px] font-medium text-text-2">
                        Cross-Architecture Asset
                      </p>
                      <p className="text-[8.5px] text-text-3 font-mono mt-0.5 leading-snug">
                        Integrated across backend routines, protocols, and tooling pipelines.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Layers size={18} className="text-text-3 mb-1" />
                <p className="text-[11px] font-semibold text-text-2">
                  Select a Technology Node
                </p>
                <p className="text-[9px] text-text-3 font-mono mt-0.5 max-w-[190px]">
                  Click any engine or module across the bento boxes to view real project references.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="pt-1.5 border-t border-border/40 font-mono text-[8.5px] text-text-3 flex items-center justify-between">
            <span>FULL STACK CORE</span>
            <span className="text-accent font-semibold">VERIFIED IMPLEMENTATIONS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
