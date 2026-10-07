"use client";

import { createElement } from "react";
import { ArrowUpRight, Check, Copy, Radio, Clock, ShieldCheck } from "lucide-react";
import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { getIconComponent } from "./utils";
import type { ContactInfo } from "@/lib/types";

interface ContactInfoListProps {
  contactInfo: ContactInfo[];
  whatsapp?: string;
  github?: string;
  linkedin?: string;
}

export function ContactInfoList({
  contactInfo,
  whatsapp,
  github,
  linkedin,
}: ContactInfoListProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col justify-between h-full rounded-2xl neumorphic p-4 sm:p-5 border border-border/60">
      {/* Top Dossier Intro */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Radio size={12} className="text-accent animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
              Transmission Channels
            </span>
          </div>
          <span className="font-mono text-[9px] rounded-md bg-accent/10 text-accent font-semibold px-2 py-0.5">
            ONLINE
          </span>
        </div>

        {/* Direct Channels List */}
        <div className="space-y-2">
          {contactInfo.map((info) => {
            const isCopyable = info.copyable;

            return (
              <div
                key={info.label}
                className="group flex items-center justify-between gap-2.5 rounded-xl neumorphic-chip p-2.5 transition-all duration-150 hover:border-accent/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bg-card text-accent">
                    {createElement(getIconComponent(info.icon || ""), {
                      size: 13,
                      "aria-hidden": true,
                    })}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-mono text-[9px] font-semibold uppercase text-text-3 leading-none mb-0.5">
                      {info.label}
                    </span>
                    <a
                      href={info.href}
                      className="block truncate text-xs font-semibold text-text-1 group-hover:text-accent transition-colors"
                    >
                      {info.value}
                    </a>
                  </div>
                </div>

                {isCopyable ? (
                  <button
                    type="button"
                    onClick={() => copy(info.value)}
                    aria-label={copied ? "Copied" : "Copy email address"}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg neumorphic text-text-3 transition-colors hover:text-text-1 hover:border-accent/40 active:scale-95"
                  >
                    {copied ? (
                      <Check size={12} className="text-success-ink" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                ) : (
                  info.href !== "#" && (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg neumorphic text-text-3 transition-colors hover:text-text-1 hover:border-accent/40"
                    >
                      <ArrowUpRight size={12} />
                    </a>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Telemetry & Verified Social Channels */}
      <div className="mt-3.5 pt-3 border-t border-border/50 flex flex-col gap-2.5">
        {/* SLA and Security Badges */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-bg-subtle/70 p-2">
            <Clock size={12} className="text-accent shrink-0" />
            <span className="truncate">SLA: &lt; 24h</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-bg-subtle/70 p-2">
            <ShieldCheck size={12} className="text-success shrink-0" />
            <span className="truncate">Encrypted Pipeline</span>
          </div>
        </div>

        {/* Social Nodes */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="font-mono text-[10px] text-text-3">Network:</span>
          <div className="flex items-center gap-1.5">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-7 w-7 items-center justify-center rounded-lg neumorphic text-text-3 transition-colors hover:text-text-1 hover:border-accent/40 active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d={SOCIAL_SVG_PATHS.github} />
                </svg>
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-7 w-7 items-center justify-center rounded-lg neumorphic text-text-3 transition-colors hover:text-text-1 hover:border-accent/40 active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d={SOCIAL_SVG_PATHS.linkedin} />
                </svg>
              </a>
            )}
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Chat"
                className="flex h-7 w-7 items-center justify-center rounded-lg neumorphic text-text-3 transition-colors hover:text-success hover:border-success/40 active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d={SOCIAL_SVG_PATHS.whatsapp} />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

