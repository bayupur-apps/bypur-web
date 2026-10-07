"use client";

import { useState } from "react";
import { Server, ChevronRight, Check, Copy } from "lucide-react";
import { cn } from "@/lib/helpers";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import type { ProjectEndpoint } from "@/lib/types";

interface ProjectApiConsoleProps {
  endpoints?: ProjectEndpoint[];
  projectTitle: string;
}

const METHOD_COLORS: Record<ProjectEndpoint["method"], { badge: string; text: string }> = {
  GET: {
    badge: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    text: "text-sky-600 dark:text-sky-400",
  },
  POST: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  PUT: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
  },
  PATCH: {
    badge: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  DELETE: {
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
  },
  WS: {
    badge: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    text: "text-purple-600 dark:text-purple-400",
  },
};

export function ProjectApiConsole({ endpoints }: ProjectApiConsoleProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { copied, copy } = useCopyToClipboard();

  if (!endpoints || endpoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-text-3 font-mono text-xs">
        <Server size={20} className="text-accent/50 mb-2" />
        <p>Enterprise monolithic / internal REST microservices.</p>
      </div>
    );
  }

  const activeEp = endpoints[selectedIdx] || endpoints[0];
  const methodStyle = METHOD_COLORS[activeEp.method] || METHOD_COLORS.GET;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Endpoints List */}
      <div className="rounded-xl border border-border/70 neumorphic-pressed p-1.5 flex flex-col gap-1 max-h-[160px] overflow-y-auto custom-workspace-scroll">
        {endpoints.map((ep, idx) => {
          const isSelected = selectedIdx === idx;
          const style = METHOD_COLORS[ep.method] || METHOD_COLORS.GET;

          return (
            <button
              key={`${ep.path}-${idx}`}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-150 font-mono",
                isSelected
                  ? "bg-bg-card shadow-sm border border-border text-text-1 font-semibold"
                  : "text-text-3 hover:text-text-2 hover:bg-bg-subtle/50"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold border", style.badge)}>
                  {ep.method}
                </span>
                <span className="truncate text-[11px] text-text-1">{ep.path}</span>
              </div>
              <ChevronRight
                size={13}
                className={cn("shrink-0 transition-transform", isSelected ? "text-accent translate-x-0.5" : "opacity-40")}
              />
            </button>
          );
        })}
      </div>

      {/* Interactive Response / Detail Console */}
      <div className="rounded-xl border border-border/70 bg-bg-card/90 p-3 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2 mb-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className={cn("font-bold", methodStyle.text)}>{activeEp.method}</span>
              <code className="text-text-1 font-bold text-xs">{activeEp.path}</code>
            </div>
            <button
              type="button"
              onClick={() => copy(activeEp.path)}
              aria-label="Copy route path"
              className="flex items-center gap-1 text-[10px] text-text-3 hover:text-text-1"
            >
              {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
              <span>{copied ? "Copied" : "Copy Path"}</span>
            </button>
          </div>

          <p className="text-xs text-text-2 leading-relaxed font-sans mb-2.5">
            {activeEp.description}
          </p>
        </div>

        <div className="rounded-lg bg-bg-subtle/80 p-2 border border-border/40 font-mono text-[10px] text-text-3 flex items-center justify-between">
          <span className="text-accent font-semibold">Protocol: {activeEp.method === "WS" ? "WebSocket / Event-Stream" : "RESTful JSON (HTTPS)"}</span>
          <span className="text-success-ink font-semibold">Status: 200 OK</span>
        </div>
      </div>
    </div>
  );
}
