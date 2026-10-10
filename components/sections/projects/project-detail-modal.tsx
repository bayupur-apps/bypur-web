"use client";

import { useSyncExternalStore, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowUpRight,
  Code2,
  Lock,
  Sparkles,
  Server,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { TechChip } from "@/components/ui/tech-chip";
import { ProjectCover } from "./project-cover";
import { cn } from "@/lib/helpers";
import type { Project, ProjectEndpoint } from "@/lib/types";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const METHOD_STYLES: Record<ProjectEndpoint["method"], string> = {
  GET: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  POST: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  PATCH: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  DELETE: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  WS: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted || !project) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs"
          />

          {/* Modal Card / Bottom Sheet on Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[88dvh] sm:max-h-[82vh] flex flex-col rounded-t-2xl sm:rounded-xl border border-border/80 shadow-2xl z-10 overflow-hidden bg-bg-card"
          >
            {/* Mobile Sheet Pull Bar Indicator */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-bg-card">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Pinned Top Bar Header */}
            <div className="shrink-0 flex items-start justify-between gap-3 border-b border-border/60 px-4 sm:px-6 pt-3 sm:pt-4 pb-3 bg-bg-card">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                    Technical Specification
                  </span>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 border border-accent/30 px-2 py-0.5 font-mono text-[9px] font-bold text-accent">
                      <Sparkles size={9} />
                      Featured
                    </span>
                  )}
                </div>
                <h2
                  id="modal-project-title"
                  className="text-sm sm:text-base font-bold tracking-tight text-text-1 truncate"
                >
                  {project.title}
                </h2>
              </div>

              {/* Close Button: 44x44px touch target on mobile */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project overview"
                className="flex min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-bg-subtle/50 text-text-3 transition-colors hover:text-text-1 hover:border-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-workspace-scroll">
              {/* Visual Header Banner */}
              <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden border border-border/60 shadow-inner">
                <ProjectCover project={project} />
              </div>

              {/* Overview & Purpose */}
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3 block mb-1">
                  System Overview &amp; Purpose
                </span>
                <p className="text-xs sm:text-[13px] leading-relaxed text-text-2">
                  {project.description}
                </p>
                {project.content && (
                  <p className="text-xs leading-relaxed text-text-3 font-mono mt-2 bg-bg-subtle/70 p-2.5 rounded-xl border border-border/50">
                    {project.content}
                  </p>
                )}
              </div>

              {/* Architecture Highlights */}
              {project.architectureHighlights && project.architectureHighlights.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Cpu size={12} className="text-accent" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                      Key Architectural Capabilities
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {project.architectureHighlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-text-2"
                      >
                        <CheckCircle2
                          size={13}
                          className="text-accent shrink-0 mt-0.5"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* API Endpoints & Interfaces */}
              {project.endpoints && project.endpoints.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Server size={12} className="text-accent" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                      API &amp; Real-time Interfaces
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/60 overflow-hidden divide-y divide-border/50 bg-bg-subtle/40">
                    {project.endpoints.map((ep, idx) => (
                      <div
                        key={idx}
                        className="p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs"
                      >
                        <div className="flex items-center gap-2 font-mono">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[9px] font-bold border",
                              METHOD_STYLES[ep.method]
                            )}
                          >
                            {ep.method}
                          </span>
                          <code className="text-text-1 text-[11px] font-semibold break-all">
                            {ep.path}
                          </code>
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-text-3 break-words">
                          {ep.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Chips */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers size={12} className="text-accent" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                    Integrated Stack
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <TechChip key={tech} name={tech} />
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Action Bar Footer: 44px tap targets on mobile */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-4 sm:px-5 py-3 border-t border-border/60 bg-bg-card">
              <div className="flex flex-wrap items-center gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1 text-xs font-semibold text-accent-fg shadow-xs transition-all hover:bg-accent-hover active:scale-95"
                  >
                    <span>Launch Live Demo</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 rounded-lg border border-border/70 bg-bg-subtle/50 px-3.5 py-1 text-xs font-medium text-text-2 transition-all hover:text-text-1 hover:border-accent/40 active:scale-95"
                  >
                    <Code2 size={13} />
                    <span>View Repository</span>
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 rounded-lg border border-border/50 bg-bg-subtle/40 px-3 py-1 font-mono text-[10px] text-text-3">
                    <Lock size={11} />
                    <span>Private Repository</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-11 sm:min-h-8 items-center justify-center rounded-lg border border-border/70 bg-bg-subtle px-4 py-1 text-xs font-medium text-text-2 transition-colors hover:bg-bg-card hover:text-text-1 active:scale-95"
              >
                Close Specs
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}


