"use client";

import { MessageSquare, Clock, ShieldCheck, Radio, Globe, Send, CheckCircle2, AlertCircle, Sparkles, Check, Copy, ArrowUpRight } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { usePortfolio } from "@/contexts/portfolio-context";
import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { submitContact } from "@/lib/api/portfolio";

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
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const MAX_MSG = 500;

  const projectTypes = [
    "Full-time Role",
    "Project Contract",
    "API / Backend",
    "Architecture",
  ];
  const [selectedType, setSelectedType] = useState<string>(projectTypes[0]);

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
    <SectionContainer id="contact" background="default" className="py-1">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-border/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <MessageSquare size={13} />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-text-1">
            {contactConfig.title || "Communication Hub & Direct Dispatch"}
          </h2>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent font-mono">
            Response SLA &lt; 24h
          </span>
        </div>

        {profileData.availability && (
          <div className="inline-flex items-center gap-2 rounded-full neumorphic-chip px-3 py-1 text-[11px] font-semibold text-text-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-success" />
            </span>
            <span>{profileData.availability}</span>
          </div>
        )}
      </div>

      {/* 3-Column Command Hub (Zero-Scroll on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 min-h-[380px] xl:min-h-[390px] items-stretch">
        {/* COLUMN 1: Direct Transmission Channels */}
        <div className="flex flex-col justify-between h-full rounded-2xl neumorphic p-4 sm:p-4.5">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Radio size={12} className="text-accent" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                  Direct Channels
                </span>
              </div>
              <span className="font-mono text-[9px] rounded-md bg-accent/10 text-accent font-semibold px-2 py-0.5">
                01 // COMMS
              </span>
            </div>

            <div className="space-y-2">
              {/* Email Node */}
              <div className="group flex items-center justify-between gap-2 rounded-xl neumorphic-chip p-2.5 transition-all duration-150 hover:border-accent/40">
                <div className="min-w-0 flex-1">
                  <span className="block font-mono text-[9px] font-semibold uppercase text-text-3 leading-none mb-1">
                    Email Direct
                  </span>
                  <a
                    href={`mailto:${profileData.email}`}
                    className="block truncate text-xs font-semibold text-text-1 group-hover:text-accent transition-colors"
                  >
                    {profileData.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copy(profileData.email)}
                  aria-label={copied ? "Copied" : "Copy email address"}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg neumorphic text-text-3 transition-colors hover:text-text-1 hover:border-accent/40 active:scale-95"
                >
                  {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                </button>
              </div>

              {/* WhatsApp / Phone Node */}
              {profileData.socials.whatsapp && (
                <div className="group flex items-center justify-between gap-2 rounded-xl neumorphic-chip p-2.5 transition-all duration-150 hover:border-accent/40">
                  <div className="min-w-0 flex-1">
                    <span className="block font-mono text-[9px] font-semibold uppercase text-text-3 leading-none mb-1">
                      Instant WhatsApp
                    </span>
                    <span className="block truncate text-xs font-semibold text-text-1">
                      {profileData.phone || "+62 822 4197 1018"}
                    </span>
                  </div>
                  <a
                    href={profileData.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg neumorphic text-text-3 transition-colors hover:text-success hover:border-success/40 active:scale-95"
                  >
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              )}

              {/* Base Location & Timezone Node */}
              <div className="rounded-xl neumorphic-chip p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] font-semibold uppercase text-text-3">
                    Timezone &amp; Base
                  </span>
                  <span className="font-mono text-[10px] text-accent font-semibold">
                    {time ? `${time} WIB` : "Jakarta"}
                  </span>
                </div>
                <span className="block text-xs font-semibold text-text-1">
                  {profileData.location || "Jakarta, Indonesia (UTC+7)"}
                </span>
              </div>
            </div>
          </div>

          {/* Security & SLA strip */}
          <div className="pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-[10px] font-mono text-text-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-bg-subtle/70 p-2">
              <Clock size={11} className="text-accent shrink-0" />
              <span className="truncate">SLA: &lt; 24h</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-bg-subtle/70 p-2">
              <ShieldCheck size={11} className="text-success shrink-0" />
              <span className="truncate">SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Message Dispatch Terminal */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-full rounded-2xl neumorphic p-4 sm:p-4.5"
        >
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <Send size={12} className="text-accent" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                  Quick Dispatch
                </span>
              </div>
              <span className="font-mono text-[9px] rounded-md bg-accent/10 text-accent font-semibold px-2 py-0.5">
                02 // DISPATCH
              </span>
            </div>

            {/* Scope selection */}
            <div className="mb-2">
              <label className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3 mb-1">
                Subject Scope
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {projectTypes.map((type) => {
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-all duration-150 ${
                        isSelected
                          ? "bg-accent text-accent-fg shadow-xs font-semibold"
                          : "neumorphic-chip text-text-3 hover:text-text-1 hover:border-accent/40"
                      }`}
                    >
                      {isSelected && <Sparkles size={8} />}
                      <span className="truncate">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-border/70 bg-bg-subtle/50 px-2.5 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full rounded-xl border border-border/70 bg-bg-subtle/50 px-2.5 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card"
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <textarea
                name="message"
                required
                rows={2}
                maxLength={MAX_MSG}
                placeholder="Brief project details, role description, or inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-border/70 bg-bg-subtle/50 px-2.5 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card"
              />
            </div>
          </div>

          {/* Transmit Action */}
          <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-1.5 text-xs font-semibold text-accent-fg shadow-sm transition-all duration-150 hover:bg-accent-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={11} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              <span>{status === "submitting" ? "Transmitting..." : "Send Transmission"}</span>
            </button>

            <div aria-live="polite" className="empty:hidden text-center">
              {status === "success" && (
                <p className="flex items-center justify-center gap-1 text-[11px] font-medium text-success">
                  <CheckCircle2 size={12} />
                  <span>Message sent successfully!</span>
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center justify-center gap-1 text-[11px] font-medium text-error">
                  <AlertCircle size={12} />
                  <span>Failed. Please email directly.</span>
                </p>
              )}
            </div>
          </div>
        </form>

        {/* COLUMN 3: Identity, Network Nodes & Preferences */}
        <div className="flex flex-col justify-between h-full rounded-2xl neumorphic p-4 sm:p-4.5">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Globe size={12} className="text-accent" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
                  Network &amp; Status
                </span>
              </div>
              <span className="font-mono text-[9px] rounded-md bg-accent/10 text-accent font-semibold px-2 py-0.5">
                03 // NODES
              </span>
            </div>

            {/* Availability & Work Preferences */}
            <div className="space-y-2 mb-3">
              <div className="rounded-xl neumorphic-chip p-2.5">
                <span className="block font-mono text-[9px] font-semibold uppercase text-text-3 mb-1">
                  Availability State
                </span>
                <p className="text-xs font-semibold text-text-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span>Open for Full-time &amp; Contracts</span>
                </p>
              </div>

              <div className="rounded-xl neumorphic-chip p-2.5">
                <span className="block font-mono text-[9px] font-semibold uppercase text-text-3 mb-1">
                  Engagement Modes
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="rounded-md bg-bg-subtle/80 px-2 py-0.5 text-[10px] font-mono text-text-2 font-medium">
                    Remote
                  </span>
                  <span className="rounded-md bg-bg-subtle/80 px-2 py-0.5 text-[10px] font-mono text-text-2 font-medium">
                    Hybrid
                  </span>
                  <span className="rounded-md bg-bg-subtle/80 px-2 py-0.5 text-[10px] font-mono text-text-2 font-medium">
                    Contract / SLA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Social Profile Links */}
          <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
            <span className="font-mono text-[9px] font-semibold uppercase text-text-3">
              Verified Developer Nodes
            </span>
            <div className="grid grid-cols-2 gap-2">
              {profileData.socials.github && (
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-1.5 rounded-xl neumorphic-chip p-2 text-xs font-semibold text-text-2 transition-all hover:text-text-1 hover:border-accent/40 active:scale-95"
                >
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-accent">
                      <path d={SOCIAL_SVG_PATHS.github} />
                    </svg>
                    <span>GitHub</span>
                  </div>
                  <ArrowUpRight size={11} className="text-text-3" />
                </a>
              )}

              {profileData.socials.linkedin && (
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-1.5 rounded-xl neumorphic-chip p-2 text-xs font-semibold text-text-2 transition-all hover:text-text-1 hover:border-accent/40 active:scale-95"
                >
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-accent">
                      <path d={SOCIAL_SVG_PATHS.linkedin} />
                    </svg>
                    <span>LinkedIn</span>
                  </div>
                  <ArrowUpRight size={11} className="text-text-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}


