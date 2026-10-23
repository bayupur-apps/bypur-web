"use client";

import { useSyncExternalStore, useEffect, useCallback, useState, useMemo } from "react";
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
  Copy,
  Check,
  FileText,
} from "lucide-react";
import { TechChip } from "@/components/ui/tech-chip";
import { ProjectGallery } from "./project-gallery";
import { ProjectLightbox } from "./project-lightbox";
import { hasRealImage } from "./utils";
import { cn } from "@/lib/helpers";
import type { Project, ProjectEndpoint } from "@/lib/types";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "overview" | "stack" | "endpoints";

const METHOD_STYLES: Record<ProjectEndpoint["method"], string> = {
  GET: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  POST: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  PATCH: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  DELETE: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  WS: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

/** Inner modal content, mounted with key={project.id} so state resets automatically without useEffect */
function ProjectDetailContent({
  project,
  onClose,
}: Readonly<{ project: Project; onClose: () => void }>) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const galleryImages = useMemo(() => {
    const rawList = project.images ?? project.gallery;
    if (Array.isArray(rawList)) {
      return rawList.filter((img) => hasRealImage(img));
    }
    if (project.imageUrl && hasRealImage(project.imageUrl)) {
      return [project.imageUrl];
    }
    return [];
  }, [project]);

  const handleCopyEndpoint = (path: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(path);
      setCopiedEndpoint(path);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    }
  };

  const hasEndpoints = Boolean(project.endpoints && project.endpoints.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 20 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-3xl max-h-[90dvh] sm:max-h-[86vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-border/80 shadow-2xl z-10 overflow-hidden bg-bg-card"
    >
      {/* Mobile Sheet Pull Bar Indicator */}
      <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-bg-card shrink-0">
        <div className="h-1 w-10 rounded-full bg-border" />
      </div>

      {/* Top Bar Header */}
      <div className="shrink-0 flex items-center justify-between gap-3 border-b border-border/60 px-4 sm:px-6 py-3 bg-bg-card">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-accent">
              Technical Specification
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 border border-accent/30 px-2 py-0.5 font-mono text-[9px] font-bold text-accent">
                <Sparkles size={9} />
                Featured
              </span>
            )}
            {galleryImages.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border/60 bg-bg-subtle/50 px-2 py-0.5 font-mono text-[9px] text-text-3">
                {galleryImages.length} Visual Assets
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
          className="flex min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-bg-subtle/60 text-text-3 transition-colors hover:text-text-1 hover:border-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable Modal Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-workspace-scroll">
        {/* Media Gallery Section */}
        <div className="space-y-2">
          <ProjectGallery
            project={project}
            activeIndex={activePhotoIdx}
            onChangeIndex={setActivePhotoIdx}
            onOpenLightbox={(idx) => {
              setActivePhotoIdx(idx);
              setIsLightboxOpen(true);
            }}
          />
        </div>

        {/* Navigation Segment Tabs */}
        <div className="flex items-center gap-1.5 border-b border-border/60 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
              activeTab === "overview"
                ? "bg-accent/10 text-accent ring-1 ring-accent/30 font-bold"
                : "text-text-3 hover:text-text-1 hover:bg-bg-subtle/50"
            )}
          >
            <Cpu size={13} className={activeTab === "overview" ? "text-accent" : "opacity-60"} />
            <span>Overview &amp; Architecture</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stack")}
            className={cn(
              "inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
              activeTab === "stack"
                ? "bg-accent/10 text-accent ring-1 ring-accent/30 font-bold"
                : "text-text-3 hover:text-text-1 hover:bg-bg-subtle/50"
            )}
          >
            <Layers size={13} className={activeTab === "stack" ? "text-accent" : "opacity-60"} />
            <span>Tech Stack</span>
            <span className="rounded-md bg-bg-subtle px-1.5 font-mono text-[9px] text-text-3">
              {project.techStack.length}
            </span>
          </button>

          {hasEndpoints && (
            <button
              type="button"
              onClick={() => setActiveTab("endpoints")}
              className={cn(
                "inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                activeTab === "endpoints"
                  ? "bg-accent/10 text-accent ring-1 ring-accent/30 font-bold"
                  : "text-text-3 hover:text-text-1 hover:bg-bg-subtle/50"
              )}
            >
              <Server size={13} className={activeTab === "endpoints" ? "text-accent" : "opacity-60"} />
              <span>API &amp; Interfaces</span>
              <span className="rounded-md bg-bg-subtle px-1.5 font-mono text-[9px] text-text-3">
                {project.endpoints!.length}
              </span>
            </button>
          )}
        </div>

        {/* Tab Stage Content */}
        <div>
          {/* TAB 1: Overview & Architecture */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Problem Statement & Description */}
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                  System Overview &amp; Purpose
                </span>
                <p className="text-xs sm:text-[13px] leading-relaxed text-text-2">
                  {project.description}
                </p>
              </div>

              {/* Architecture Highlights */}
              {project.architectureHighlights && project.architectureHighlights.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-bg-subtle/40 p-3 sm:p-4">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Cpu size={13} className="text-accent" />
                    <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-text-2">
                      Key Architectural Capabilities
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {project.architectureHighlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-text-2"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-accent shrink-0 mt-0.5"
                        />
                        <span className="leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deep-dive Content Note */}
              {project.content && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FileText size={12} className="text-text-3" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                      Engineering Implementation Context
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-bg-subtle/70 p-3 text-xs sm:text-[12.5px] leading-relaxed text-text-2 font-mono whitespace-pre-line">
                    {project.content}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Tech Stack */}
          {activeTab === "stack" && (
            <div className="space-y-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3 block">
                Production Dependencies &amp; Frameworks
              </span>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <TechChip key={tech} name={tech} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: API & Interfaces */}
          {activeTab === "endpoints" && hasEndpoints && (
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3 block">
                Exposed Endpoints &amp; Contracts
              </span>
              <div className="rounded-xl border border-border/60 overflow-hidden divide-y divide-border/50 bg-bg-subtle/40">
                {project.endpoints!.map((ep, idx) => {
                  const isCopied = copiedEndpoint === ep.path;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs hover:bg-bg-subtle/80 transition-colors"
                    >
                      <div className="flex items-center gap-2 font-mono min-w-0">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[9.5px] font-bold border shrink-0",
                            METHOD_STYLES[ep.method]
                          )}
                        >
                          {ep.method}
                        </span>
                        <code className="text-text-1 text-[11.5px] font-semibold truncate">
                          {ep.path}
                        </code>
                      </div>

                      <div className="flex items-center gap-2 justify-between sm:justify-end">
                        <span className="text-[10.5px] sm:text-[11px] text-text-3">
                          {ep.description}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyEndpoint(ep.path)}
                          aria-label={`Copy endpoint ${ep.path}`}
                          className="flex min-h-8 min-w-8 items-center justify-center rounded-md border border-border/60 bg-bg-card text-text-3 hover:text-text-1 hover:border-accent/40 transition-colors"
                        >
                          {isCopied ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Action Bar Footer: 44px tap targets on mobile */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-4 sm:px-6 py-3 border-t border-border/60 bg-bg-card">
        <div className="flex flex-wrap items-center gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 sm:min-h-8 items-center gap-1.5 rounded-lg bg-accent px-4 py-1 text-xs font-semibold text-accent-fg shadow-xs transition-all hover:bg-accent-hover active:scale-95"
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
              <span>Private Enterprise Repository</span>
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

      {/* Fullscreen Lightbox Portal */}
      <ProjectLightbox
        images={galleryImages}
        activeIndex={activePhotoIdx}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={setActivePhotoIdx}
        title={project.title}
      />
    </motion.div>
  );
}

export function ProjectDetailModal({ project, isOpen, onClose }: Readonly<ProjectDetailModalProps>) {
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
          />

          {/* Dialog Card keyed by project.id */}
          <ProjectDetailContent key={project.id} project={project} onClose={onClose} />
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
