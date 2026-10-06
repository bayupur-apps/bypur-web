"use client";

import { createElement } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { getIconComponent } from "./utils";
import type { ContactInfo } from "@/lib/types";

interface ContactInfoListProps {
  contactInfo: ContactInfo[];
  whatsapp?: string;
  availability?: string;
}

const iconTile =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20";

const sideButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-bg-subtle text-text-3 transition-all duration-200 hover:border-accent/40 hover:text-text-1 active:scale-95";

function ContactCard({ info, whatsapp }: { info: ContactInfo; whatsapp?: string }) {
  const { copied, copy } = useCopyToClipboard();
  const isPhone = info.icon === "Phone";

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-border/80 neumorphic p-4 transition-all duration-200 hover:border-accent/40 hover:shadow-lg">
      <span className={iconTile}>
        {createElement(getIconComponent(info.icon || ""), { size: 17, "aria-hidden": true })}
      </span>

      {/* The whole text block is the primary action (mailto:/tel:) */}
      <a href={info.href} className="flex min-w-0 flex-1 flex-col">
        <span className="mono-label text-[10px] font-semibold uppercase tracking-wider text-text-3">{info.label}</span>
        <span className="truncate text-sm font-semibold text-text-1 transition-colors group-hover:text-accent">
          {info.value}
        </span>
      </a>

      {info.copyable && (
        <button
          type="button"
          onClick={() => copy(info.value)}
          aria-label={copied ? `${info.label} copied` : `Copy ${info.label.toLowerCase()}`}
          className={sideButton}
        >
          {copied ? <Check size={15} className="text-success-ink" /> : <Copy size={15} />}
        </button>
      )}

      {isPhone && whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className={`${sideButton} hover:text-success-ink`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d={SOCIAL_SVG_PATHS.whatsapp} />
          </svg>
        </a>
      )}

      {!info.copyable && !(isPhone && whatsapp) && (
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="shrink-0 text-text-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </div>
  );
}

export function ContactInfoList({ contactInfo, whatsapp, availability }: ContactInfoListProps) {
  const actions = contactInfo.filter((c) => c.href && c.href !== "#");
  const notes = contactInfo.filter((c) => !c.href || c.href === "#");

  return (
    <FadeUp delay={0.05} className="flex flex-col gap-3">
      {(availability || notes.length > 0) && (
        <div className="rounded-2xl border border-success/30 neumorphic p-5">
          {availability && (
            <p className="flex items-center gap-2.5 text-sm font-semibold text-text-1">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              {availability}
            </p>
          )}
          {notes.map((note) => {
            return (
              <p key={note.label} className="mt-2 flex items-center gap-2.5 text-sm text-text-2 first:mt-0 font-mono text-xs">
                {createElement(getIconComponent(note.icon || ""), {
                  size: 15,
                  className: "shrink-0 text-accent",
                  "aria-label": note.label,
                })}
                {note.value}
              </p>
            );
          })}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {actions.map((info) => (
          <li key={info.label}>
            <ContactCard info={info} whatsapp={whatsapp} />
          </li>
        ))}
      </ul>
    </FadeUp>
  );
}
