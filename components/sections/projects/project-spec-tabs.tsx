"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Layers, Cpu, CheckCircle2 } from "lucide-react";
import { ProjectCover } from "./project-cover";
import { ProjectApiConsole } from "./project-api-console";
import { TechChip } from "@/components/ui/tech-chip";
import { cn } from "@/lib/helpers";
import type { Project } from "@/lib/types";

interface ProjectSpecTabsProps {
  project: Project;
}

type TabKey = "overview" | "api" | "tech";

export function ProjectSpecTabs({ project }: ProjectSpecTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const tabs: { key: TabKey; label: string; icon: typeof Server; count?: number }[] = [
    { key: "overview", label: "Overview & Architecture", icon: Cpu },
    { key: "api", label: "Live API & Interfaces", icon: Server, count: project.endpoints?.length },
    { key: "tech", label: "Tech Stack Spec", icon: Layers, count: project.techStack.length },
  ];

  return (
    <div className="flex flex-col h-full justify-between gap-3">
      {/* Tab Switcher Pills */}
      <div className="flex items-center gap-1.5 border-b border-border/50 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-accent/10 text-accent ring-1 ring-accent/30 font-bold"
                  : "text-text-3 hover:text-text-1 hover:bg-bg-subtle/60"
              )}
            >
              <Icon size={13} className={isActive ? "text-accent" : "opacity-60"} />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={cn(
                    "rounded-md px-1.5 font-mono text-[9px] leading-4",
                    isActive ? "bg-accent/15 text-accent font-bold" : "bg-bg-subtle text-text-3"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Stage */}
      <div className="flex-1 overflow-hidden min-h-[260px] flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch h-full"
            >
              {/* Visual Cover Frame */}
              <div className="sm:col-span-5 relative aspect-video sm:aspect-auto sm:h-full min-h-[160px] rounded-xl overflow-hidden border border-border/60 shadow-inner">
                <ProjectCover project={project} />
              </div>

              {/* Problem Statement & Architecture Notes */}
              <div className="sm:col-span-7 flex flex-col justify-between h-full overflow-y-auto custom-workspace-scroll pr-1.5 gap-2.5">
                <div>
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block mb-1">
                    Problem Solved &amp; Business Impact
                  </span>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-text-2">
                    {project.description}
                  </p>
                </div>

                {project.architectureHighlights && project.architectureHighlights.length > 0 && (
                  <div className="border-t border-border/40 pt-2">
                    <span className="text-[10px] font-mono font-bold text-text-3 uppercase tracking-wider block mb-1.5">
                      Key Capabilities &amp; Optimization
                    </span>
                    <ul className="space-y-1">
                      {project.architectureHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-text-2">
                          <CheckCircle2 size={12} className="text-accent shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "api" && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <ProjectApiConsole
                endpoints={project.endpoints}
                projectTitle={project.title}
              />
            </motion.div>
          )}

          {activeTab === "tech" && (
            <motion.div
              key="tech"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col justify-between h-full gap-3"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block mb-2">
                  Integrated Production Technologies ({project.techStack.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <TechChip key={tech} name={tech} />
                  ))}
                </div>
              </div>

              {project.content && (
                <div className="rounded-xl bg-bg-subtle/70 p-3 border border-border/50 font-mono text-xs text-text-2 leading-relaxed">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-3 block mb-1">
                    System Notes
                  </span>
                  {project.content}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
