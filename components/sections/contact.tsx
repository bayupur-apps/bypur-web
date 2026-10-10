"use client";

import {
  MessageSquare,
  Clock,
  Radio,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
  Copy,
  ArrowUpRight,
  Terminal,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { usePortfolio } from "@/contexts/portfolio-context";
import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { submitContact } from "@/lib/api/portfolio";

const PROJECT_TYPES = [
  "Web app",
  "API / Backend",
  "Full-time Role",
  "Architecture",
];

export default function ContactSection() {
  const { profile: profileData } = usePortfolio();
  const { copied, copy } = useCopyToClipboard();

  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Form State
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState<string>(PROJECT_TYPES[0]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const MAX_MSG = 1000;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await submitContact({
        name,
        email: senderEmail,
        subject: selectedType,
        message,
      });
      setStatus("success");
      setName("");
      setSenderEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const contactConfig = profileData.contact || {};

  return (
    <SectionContainer id="contact" background="default" className="py-0 sm:py-0">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/50 pb-2 mb-3">
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-accent/10 text-accent ring-1 ring-accent/20">
              <MessageSquare size={12} />
            </div>
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-text-1 truncate">
              {contactConfig.title || "Communication Hub & Direct Dispatch"}
            </h2>
          </div>
          <span className="shrink-0 rounded-[4px] bg-accent/10 px-2 py-0.5 text-[9.5px] font-bold text-accent font-mono">
            FAST RESPONSE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {profileData.availability && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-bg-card px-2.5 py-0.5 text-[10px] font-semibold text-text-2">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span>{profileData.availability}</span>
            </div>
          )}
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-bg-card px-2.5 py-0.5 text-[10px] font-mono text-text-3">
            <span>Purwokerto</span>
            <span className="text-accent font-semibold">{time ? `${time} WIB` : "--:--"}</span>
          </div>
        </div>
      </div>

      {/* Split-Stage Console: 7 cols Dispatch + 5 cols Comms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:h-[370px] xl:h-[375px] items-stretch">
        {/* LEFT: Dispatch Terminal (7 cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 flex flex-col justify-between h-full rounded-xl border border-border/70 bg-bg-card p-4 sm:p-4.5"
        >
          <div className="flex flex-col gap-2.5">
            {/* Terminal Subheader */}
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Terminal size={11} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text-1">Send me a message</h3>
                  <p className="text-[10px] text-text-3">Direct transmission to inbox with rapid response.</p>
                </div>
              </div>
              <span className="font-mono text-[9px] rounded-md bg-accent/10 text-accent font-semibold px-2 py-0.5 shrink-0">
                01 // DISPATCH
              </span>
            </div>

            {/* Subject Scope */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3">
                  Inquiry Type
                </span>
                <span className="font-mono text-[9px] text-accent">Selected: {selectedType}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = selectedType === type;
                  return (
                    <label
                      key={type}
                      className={`group relative flex items-center justify-center gap-1.5 cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-medium transition-all duration-150 select-none ${
                        isSelected
                          ? "bg-accent text-accent-fg font-semibold shadow-xs"
                          : "border border-border/60 bg-bg-card/50 text-text-2 hover:border-accent/40 hover:text-text-1"
                      }`}
                    >
                      <input
                        type="radio"
                        name="projectType"
                        value={type}
                        checked={isSelected}
                        onChange={() => setSelectedType(type)}
                        className="sr-only"
                      />
                      {isSelected && <Sparkles size={9} className="shrink-0" />}
                      <span className="truncate">{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label htmlFor="contact-name" className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3 mb-1">
                  01 // Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Pratama"
                  className="w-full rounded-md border border-border/70 bg-bg-subtle/50 px-3 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3 mb-1">
                  02 // Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-md border border-border/70 bg-bg-subtle/50 px-3 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Message area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="contact-message" className="font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3">
                  03 // Message Payload
                </label>
                <span className="font-mono text-[9px] text-text-3">
                  {message.length}/{MAX_MSG}
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={2}
                maxLength={MAX_MSG}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Brief overview of role, scope, or technical challenge..."
                className="w-full resize-none rounded-md border border-border/70 bg-bg-subtle/50 px-3 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Transmit action */}
          <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-fg shadow-xs transition-all duration-150 hover:bg-accent-hover active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <Send size={11} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              <span>{status === "submitting" ? "Transmitting..." : "Send Message"}</span>
            </button>

            <div aria-live="polite" className="empty:hidden text-center min-h-[16px]">
              {status === "success" && (
                <p className="flex items-center justify-center gap-1 text-[11px] font-medium text-success">
                  <CheckCircle2 size={12} />
                  <span>Message transmitted successfully. Response within 24 hours.</span>
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center justify-center gap-1 text-[11px] font-medium text-error">
                  <AlertCircle size={12} />
                  <span>Direct transmission failed. Please email {profileData.email} directly.</span>
                </p>
              )}
            </div>
          </div>
        </form>

        {/* RIGHT: Direct Comms & Channels (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full rounded-xl border border-border/70 bg-bg-card p-4 sm:p-4.5">
          <div className="flex flex-col gap-2.5">
            {/* Subheader */}
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Radio size={11} />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                  Direct Channels
                </span>
              </div>
              <span className="font-mono text-[9px] rounded-md bg-accent/10 text-accent font-semibold px-2 py-0.5">
                02 // COMMS
              </span>
            </div>

            {/* Primary Channels */}
            <div className="space-y-2">
              {/* Email Node */}
              <div className="group flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-bg-subtle/40 p-2.5 transition-all duration-150 hover:border-accent/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-card text-accent border border-border/40">
                    <Mail size={13} />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-mono text-[8.5px] font-semibold uppercase text-text-3 leading-none mb-0.5">
                      Email Direct (Primary)
                    </span>
                    <a
                      href={`mailto:${profileData.email}`}
                      className="block truncate text-xs font-semibold text-text-1 group-hover:text-accent transition-colors"
                    >
                      {profileData.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copy(profileData.email)}
                  aria-label={copied ? "Copied" : "Copy email address"}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-3 transition-colors hover:text-text-1 hover:bg-bg-card active:scale-95 cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                </button>
              </div>

              {/* WhatsApp Hotline */}
              {profileData.socials.whatsapp && (
                <div className="group flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-bg-subtle/40 p-2.5 transition-all duration-150 hover:border-accent/40">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-card text-success border border-border/40">
                      <Phone size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-mono text-[8.5px] font-semibold uppercase text-text-3 leading-none mb-0.5">
                        Instant WhatsApp
                      </span>
                      <span className="block truncate text-xs font-semibold text-text-1">
                        {profileData.phone || "+62 881 2785 635"}
                      </span>
                    </div>
                  </div>
                  <a
                    href={profileData.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-3 transition-colors hover:text-success hover:bg-bg-card active:scale-95"
                  >
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              )}

              {/* Base Location Node */}
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-bg-subtle/40 p-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-card text-accent border border-border/40">
                    <MapPin size={13} />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-mono text-[8.5px] font-semibold uppercase text-text-3 leading-none mb-0.5">
                      Base Location
                    </span>
                    <span className="block truncate text-xs font-semibold text-text-1">
                      {profileData.location || "Indonesia"}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[9px] text-accent font-semibold px-2 py-0.5 rounded-md bg-accent/10 shrink-0">
                  WIB (UTC+7)
                </span>
              </div>
            </div>
          </div>

          {/* Developer Networks Footer */}
          <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-1.5">
              {profileData.socials.github && (
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="flex items-center justify-between gap-1.5 rounded-lg border border-border/50 bg-bg-subtle/40 px-3 py-1.5 text-xs font-semibold text-text-2 transition-all hover:text-text-1 hover:border-accent/40 active:scale-95"
                >
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-accent">
                      <path d={SOCIAL_SVG_PATHS.github} />
                    </svg>
                    <span>GitHub</span>
                  </div>
                  <ArrowUpRight size={12} className="text-text-3" />
                </a>
              )}

              {profileData.socials.linkedin && (
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex items-center justify-between gap-1.5 rounded-lg border border-border/50 bg-bg-subtle/40 px-3 py-1.5 text-xs font-semibold text-text-2 transition-all hover:text-text-1 hover:border-accent/40 active:scale-95"
                >
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-accent">
                      <path d={SOCIAL_SVG_PATHS.linkedin} />
                    </svg>
                    <span>LinkedIn</span>
                  </div>
                  <ArrowUpRight size={12} className="text-text-3" />
                </a>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-text-3 px-1">
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-accent shrink-0" />
                Typical Response: Same day
              </span>
              <span>Online Transmission</span>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
