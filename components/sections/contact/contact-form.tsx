import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
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
  const MAX_MSG = 1000;

  const title = formConfig?.title || "Send me a message";
  const subtitle =
    formConfig?.subtitle || "I'll get back to you within 1-2 working days.";
  const projectTypes = formConfig?.projectTypes || [
    "Web app",
    "Landing page",
    "API / Backend",
    "Consulting",
    "Other",
  ];
  const [selectedType, setSelectedType] = useState<string>(
    projectTypes[0] ?? "Other",
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
    <FadeUp delay={0.1}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-3xl border border-border/80 neumorphic p-5 sm:p-7"
      >
        <div>
          <h3 className="text-sm sm:text-[15px] font-semibold text-text-1">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-text-2">{subtitle}</p>
        </div>

        <div className="h-px w-full bg-border/60" />

        {/* Project type */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mono-label text-[10px] font-semibold uppercase tracking-widest text-text-3">
            What&apos;s this about?
          </legend>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {projectTypes.map((type) => (
              <label key={type} className="shrink-0 cursor-pointer">
                <input
                  type="radio"
                  name="project_type"
                  value={type}
                  checked={activeType === type}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-9 sm:min-h-10 items-center justify-center rounded-full border border-border/80 bg-bg-subtle/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-medium text-text-2 transition-all duration-150 hover:border-accent/40 hover:text-text-1 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-fg peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Name + Email */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="mono-label text-[10px] font-semibold uppercase tracking-widest text-text-3">
              Name
            </span>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl border border-border/80 bg-bg-subtle/60 px-3.5 py-2.5 text-[13px] text-text-1 outline-none transition duration-150 placeholder:text-text-3/70 focus:border-accent focus:bg-bg-card focus:ring-2 focus:ring-accent/15"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="mono-label text-[10px] font-semibold uppercase tracking-widest text-text-3">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-border/80 bg-bg-subtle/60 px-3.5 py-2.5 text-[13px] text-text-1 outline-none transition duration-150 placeholder:text-text-3/70 focus:border-accent focus:bg-bg-card focus:ring-2 focus:ring-accent/15"
            />
          </label>
        </div>

        {/* Message */}
        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="mono-label text-[10px] font-semibold uppercase tracking-widest text-text-3">
              Message
            </span>
            <span
              className={`font-mono text-[10px] tabular-nums ${
                message.length > MAX_MSG * 0.9 ? "text-accent" : "text-text-3"
              }`}
            >
              {message.length}/{MAX_MSG}
            </span>
          </div>
          <textarea
            name="message"
            required
            rows={4}
            maxLength={MAX_MSG}
            placeholder="Tell me about your project..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none rounded-xl border border-border/80 bg-bg-subtle/60 px-3.5 py-2.5 text-[13px] text-text-1 outline-none transition duration-150 placeholder:text-text-3/70 focus:border-accent focus:bg-bg-card focus:ring-2 focus:ring-accent/15"
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-[13px] font-semibold text-accent-fg shadow-md shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send
            size={14}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>

        <div aria-live="polite" className="empty:hidden">
          {status === "success" && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-success-ink">
              <CheckCircle2 size={14} />
              Message sent, I will get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-error">
              <AlertCircle size={14} />
              Could not send right now. Please email me directly at {email} instead.
            </p>
          )}
        </div>
      </form>
    </FadeUp>
  );
}
