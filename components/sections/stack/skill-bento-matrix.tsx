"use client";

import { useMemo, useState, useCallback, type CSSProperties } from "react";
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
  GitBranch,
  Cpu,
} from "lucide-react";
import { usePortfolio } from "@/contexts/portfolio-context";
import { cn } from "@/lib/helpers";
import { SectionTopBar } from "@/components/ui/section-top-bar";
import { MagicBento, type MagicBentoItem } from "./magic-bento";

interface SkillBentoMatrixProps {
  skills: Skill[];
}

function SkillIconRenderer({
  skill,
  className,
}: Readonly<{
  skill: Skill;
  className?: string;
}>) {
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

export function SkillBentoMatrix({ skills }: Readonly<SkillBentoMatrixProps>) {
  const { profile: profileData, projects } = usePortfolio();
  const skillsConfig = profileData.skills || {};
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

  // Quick spotlight skills with verified project connections for instant exploration
  const spotlightSkills = useMemo(() => {
    return sortedSkills
      .filter((s) =>
        projects.some((p: Project) =>
          p.techStack.some(
            (t) =>
              t.toLowerCase().includes(s.name.toLowerCase()) ||
              s.name.toLowerCase().includes(t.toLowerCase())
          )
        )
      )
      .slice(0, 6);
  }, [sortedSkills, projects]);

  const renderSkillChip = useCallback(
    (skill: Skill) => {
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
    },
    [selectedSkill]
  );

  const bentoItems: MagicBentoItem[] = useMemo(
    () => [
      {
        id: "core-engines",
        colSpan: 2,
        content: (
          <div className="flex flex-col justify-between h-full">
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
        ),
      },
      {
        id: "client-systems",
        colSpan: 1,
        content: (
          <div className="flex flex-col justify-between h-full min-h-0 overflow-hidden">
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
        ),
      },
      {
        id: "server-systems",
        colSpan: 1,
        content: (
          <div className="flex flex-col justify-between h-full min-h-0 overflow-hidden">
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
        ),
      },
      {
        id: "data-systems",
        colSpan: 1,
        content: (
          <div className="flex flex-col justify-between h-full min-h-0 overflow-hidden">
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
        ),
      },
      {
        id: "infra-systems",
        colSpan: 1,
        content: (
          <div className="flex flex-col justify-between h-full min-h-0 overflow-hidden">
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
        ),
      },
    ],
    [
      coreSkills,
      clientSkills,
      serverSkills,
      dataSkills,
      toolAndAiSkills,
      selectedSkill,
      projects,
      renderSkillChip,
    ]
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

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-full">
      {/* Top Console Bar */}
      <SectionTopBar
        icon={Activity}
        title={skillsConfig.title || "Technical Architecture & Matrix"}
        subtitle="// RUNTIME & ECOSYSTEM SPEC"
        badge={`${skills.length} TECHS`}
        secondaryBadge={`${projects.length} PROJECTS`}
      />

      {/* Main Bento Layout Frame: 8 Cols Bento Arena + 4 Cols Inspector HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch lg:h-[450px] xl:h-[470px]">
        {/* LEFT COLUMN: Modular Bento Grid Architecture with MagicBento (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2.5 h-full min-h-0">
          <MagicBento
            items={bentoItems}
            columns={2}
            gap={10}
            radius={12}
            enableBorderGlow
            enableSpotlight
            clickEffect
            className="flex-1 min-h-0"
            style={{ gridTemplateRows: "auto 1fr 1fr" }}
          />

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
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-3 hover:text-accent flex items-center transition-colors"
                          aria-label={`Open ${p.title} repository`}
                        >
                          <GitBranch size={10} />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent flex items-center transition-colors"
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
        </div>

        {/* RIGHT COLUMN: Codebase & Project References (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-border/80 bg-bg-card/95 backdrop-blur-xs p-3 h-full min-h-0 shadow-xs">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* HUD Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <FolderGit2 size={12} />
                </div>
                <h3 className="font-mono text-[10.5px] font-bold text-text-1 uppercase tracking-wider">
                  Verified References
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {selectedSkill ? (
                  <button
                    type="button"
                    onClick={() => setSelectedSkill(null)}
                    className="font-mono text-[8.5px] text-text-3 hover:text-accent flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/50 hover:border-accent/40 bg-bg-subtle/50 transition-colors"
                    aria-label="Clear active skill selection"
                  >
                    <X size={10} /> Clear
                  </button>
                ) : (
                  <span className="font-mono text-[8px] font-semibold text-accent/90 px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                    LIVE HUD
                  </span>
                )}
              </div>
            </div>

            {/* Active Spec Info */}
            {activeSkillObj ? (
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden space-y-2">
                {/* Active Skill Pill Header */}
                <div className="relative overflow-hidden rounded-lg bg-bg-subtle/70 p-2 border border-border/60 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-card ring-1 ring-border/80 shadow-2xs">
                        <SkillIconRenderer skill={activeSkillObj} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-bold text-text-1 leading-tight truncate">
                          {activeSkillObj.name}
                        </p>
                        <p className="font-mono text-[8.5px] text-text-3 capitalize">
                          {activeSkillObj.category} tier
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-accent">
                      {connectedProjects.length} LINKED
                    </span>
                  </div>
                </div>

                {/* Linked Projects List */}
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between pb-1 shrink-0">
                    <p className="font-mono text-[9px] font-bold text-text-3 uppercase tracking-wider">
                      Target Deployments ({connectedProjects.length})
                    </p>
                    <a
                      href="#projects"
                      className="font-mono text-[8px] text-accent hover:underline flex items-center gap-0.5"
                    >
                      OPEN IN WORK <ArrowUpRight size={9} />
                    </a>
                  </div>

                  {connectedProjects.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto custom-workspace-scroll space-y-2 pr-1 pb-1">
                      {connectedProjects.map((p) => (
                        <div
                          key={p.id}
                          className="group/proj relative flex flex-col gap-1.5 rounded-lg border border-border/60 bg-bg-subtle/40 p-2.5 transition-all duration-150 hover:border-accent/40 hover:bg-bg-subtle/70 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-text-1 text-[11px] truncate group-hover/proj:text-accent transition-colors leading-tight">
                                {p.title}
                              </p>
                              {p.description && (
                                <p className="text-[8.5px] text-text-3 font-mono line-clamp-1 mt-0.5">
                                  {p.description}
                                </p>
                              )}
                            </div>
                            {p.featured && (
                              <span className="shrink-0 font-mono text-[7.5px] font-bold text-accent px-1 py-0.5 rounded bg-accent/10 border border-accent/20">
                                PROD
                              </span>
                            )}
                          </div>

                          {/* Tech stack badges */}
                          <div className="flex flex-wrap items-center gap-1">
                            {p.techStack.slice(0, 4).map((tech) => {
                              const isCurrent =
                                tech.toLowerCase().includes(selectedSkill?.toLowerCase() ?? "") ||
                                (selectedSkill?.toLowerCase() ?? "").includes(tech.toLowerCase());
                              return (
                                <span
                                  key={tech}
                                  className={cn(
                                    "text-[8px] font-mono px-1.5 py-0.2 rounded",
                                    isCurrent
                                      ? "bg-accent/15 text-accent font-bold border border-accent/30"
                                      : "bg-bg-card/70 text-text-3 border border-border/40"
                                  )}
                                >
                                  {tech}
                                </span>
                              );
                            })}
                            {p.techStack.length > 4 && (
                              <span className="text-[7.5px] font-mono text-text-3">
                                +{p.techStack.length - 4}
                              </span>
                            )}
                          </div>

                          {/* Action links */}
                          <div className="flex items-center justify-between pt-1 border-t border-border/30 mt-0.5">
                            <a
                              href="#projects"
                              className="inline-flex items-center gap-1 font-mono text-[8.5px] text-text-3 hover:text-accent transition-colors"
                              title="Inspect this project in the Production Systems section"
                            >
                              <Terminal size={9} />
                              <span>Inspect Spec</span>
                            </a>
                            <div className="flex items-center gap-1">
                              {p.repoUrl && (
                                <a
                                  href={p.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex h-5 w-5 items-center justify-center rounded bg-bg-card text-text-3 hover:text-accent hover:border-accent/40 border border-border/50 transition-colors"
                                  title="View source repository"
                                >
                                  <GitBranch size={10} />
                                </a>
                              )}
                              {p.liveUrl && (
                                <a
                                  href={p.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex h-5 w-5 items-center justify-center rounded bg-accent/10 text-accent hover:bg-accent hover:text-accent-fg transition-colors"
                                  title="Open live production URL"
                                >
                                  <ArrowUpRight size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-bg-subtle/30 p-3 text-center border border-dashed border-border/60 my-auto">
                      <CheckCircle2 size={14} className="text-accent mx-auto mb-1" />
                      <p className="text-[10.5px] font-medium text-text-2">
                        Cross-Architecture Foundation
                      </p>
                      <p className="text-[8.5px] text-text-3 font-mono mt-0.5 leading-snug">
                        Integrated across CI/CD, utility modules, and backend runtime protocols.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Idle Standby State */
              <div className="flex flex-col flex-1 min-h-0 justify-between py-1 space-y-2.5 overflow-y-auto custom-workspace-scroll">
                {/* Telemetry Stat Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border/60 bg-bg-subtle/50 p-2 flex flex-col gap-0.5">
                    <span className="font-mono text-[8px] text-text-3 uppercase tracking-wider">
                      Indexed Runtimes
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-accent">
                        {skills.length}
                      </span>
                      <span className="font-mono text-[8px] text-text-3">modules</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-bg-subtle/50 p-2 flex flex-col gap-0.5">
                    <span className="font-mono text-[8px] text-text-3 uppercase tracking-wider">
                      Production Work
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-accent">
                        {projects.length}
                      </span>
                      <span className="font-mono text-[8px] text-text-3">verified</span>
                    </div>
                  </div>
                </div>

                {/* Quick inspect spotlight */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8.5px] font-bold text-text-2 uppercase tracking-wide flex items-center gap-1">
                      <Cpu size={10} className="text-accent" />
                      Quick Trace Nodes
                    </span>
                    <span className="font-mono text-[7.5px] text-text-3">SELECT NODE</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {spotlightSkills.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setSelectedSkill(s.name)}
                        className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-bg-card px-2 py-1 text-[9.5px] text-text-2 hover:border-accent/50 hover:text-accent transition-colors font-medium active:scale-95"
                      >
                        <SkillIconRenderer skill={s} className="h-2.5 w-2.5" />
                        <span>{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hint banner */}
                <div className="rounded-lg border border-dashed border-border/60 bg-bg-subtle/30 p-2 text-center flex flex-col items-center">
                  <Layers size={14} className="text-accent/80 mb-1" />
                  <p className="text-[10px] font-semibold text-text-2">
                    Interactive Stack Explorer
                  </p>
                  <p className="text-[8px] text-text-3 font-mono mt-0.5 max-w-[200px] leading-tight">
                    Click any technology node on the matrix to inspect linked codebase repositories and live deployments.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="pt-2 border-t border-border/40 font-mono text-[8.5px] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-text-3">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  activeSkillObj ? "bg-accent animate-pulse" : "bg-text-3/50"
                )}
              />
              <span className="uppercase">
                {activeSkillObj ? `NODE: ${activeSkillObj.name}` : "TELEMETRY: STANDBY"}
              </span>
            </div>
            <a
              href="#projects"
              className="text-accent hover:underline flex items-center gap-0.5 font-semibold"
            >
              ALL PROJECTS <ArrowUpRight size={9} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
