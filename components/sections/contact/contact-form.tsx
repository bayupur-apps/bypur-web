"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Terminal, Sparkles } from "lucide-react";
import { submitContact } from "@/lib/api/portfolio";
import type { ContactConfig } from "@/lib/types";

interface ContactFormProps {
  email: string;
  formConfig?: ContactConfig["form"];
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm({ email, formConfig }: ContactFormProps) {
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const MAX_MSG = 600;

  const projectTypes = formConfig?.projectTypes || [
    "Full-time / Role",
    "Contract / API",
    "Frontend / Next.js",
    "Architecture Consult",
  ];
  const [selectedType, setSelectedType] = useState<string>(
    projectTypes[0] ?? "Full-time / Role"
  );
  const activeType = projectTypes.includes(selectedType)
    ? selectedType
    : projectTypes[0];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await submitContact({
        name,
        email: senderEmail,
        subject: activeType,
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between h-full rounded-2xl neumorphic p-4 sm:p-5 border border-border/60"
    >
      {/* Terminal Form Header */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-accent" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3">
              Message Dispatch Terminal
            </span>
          </div>
          <span className="font-mono text-[9px] text-text-3">
            DIRECT INBOX
          </span>
        </div>

        {/* Inquiry Scope / Project Type Pills */}
        <div className="mb-3">
          <label className="block font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3 mb-1.5">
            Subject Scope
          </label>
          <div className="flex flex-wrap gap-1.5">
            {projectTypes.map((type) => {
              const isSelected = activeType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all duration-150 ${
                    isSelected
                      ? "bg-accent text-accent-fg shadow-xs font-semibold"
                      : "neumorphic-chip text-text-3 hover:text-text-1 hover:border-accent/40"
                  }`}
                >
                  {isSelected && <Sparkles size={9} />}
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Fields (Name + Email) */}
        <div className="grid gap-2.5 sm:grid-cols-2 mb-2.5">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Pratama"
              className="rounded-xl border border-border/70 bg-bg-subtle/50 px-3 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="name@company.com"
              className="rounded-xl border border-border/70 bg-bg-subtle/50 px-3 py-1.5 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Message Input */}
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3">
              Message Payload
            </label>
            <span className="font-mono text-[9px] text-text-3">
              {message.length}/{MAX_MSG}
            </span>
          </div>
          <textarea
            name="message"
            required
            rows={3}
            maxLength={MAX_MSG}
            placeholder="Brief overview of role, scope, or technical challenge..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none rounded-xl border border-border/70 bg-bg-subtle/50 px-3 py-2 text-xs text-text-1 outline-none transition duration-150 placeholder:text-text-3/60 focus:border-accent focus:bg-bg-card focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Action Submit & Status Bar */}
      <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-fg shadow-sm transition-all duration-150 hover:bg-accent-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send
            size={12}
            className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
          <span>{status === "submitting" ? "Transmitting..." : "Send Transmission"}</span>
        </button>

        <div aria-live="polite" className="empty:hidden">
          {status === "success" && (
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-success">
              <CheckCircle2 size={13} />
              <span>Message received, I will respond within 24 hours.</span>
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-error">
              <AlertCircle size={13} />
              <span>Transmission failed. Please email {email} directly.</span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

