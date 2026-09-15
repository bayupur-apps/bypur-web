import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { getIconComponent } from "./utils";
import type { ContactInfo } from "@/lib/types";

interface ContactInfoListProps {
  contactInfo: ContactInfo[];
  email: string;
}

export function ContactInfoList({ contactInfo, email }: ContactInfoListProps) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <FadeUp delay={0.05}>
        <ul className="flex flex-col gap-3 sm:gap-3.5">
          {contactInfo.map((c) => {
            const Icon = getIconComponent(c.icon);
            const isActionable = Boolean(c.href && c.href !== "#");
            const Wrapper = isActionable ? "a" : "div";

            return (
              <li key={c.label}>
                <Wrapper
                  {...(isActionable ? { href: c.href } : {})}
                  className={`group flex items-center gap-3 rounded-xl border border-border/80 bg-bg-card p-3.5 sm:p-4 shadow-xs transition-all duration-200 ${
                    isActionable ? "hover:border-accent/40 hover:shadow-md hover:shadow-accent/5" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-bg-subtle text-accent shadow-xs group-hover:scale-105 group-hover:border-accent/30 group-hover:bg-accent/10 transition-all duration-200">
                    <Icon size={16} className="text-accent" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-text-3">
                      {c.label}
                    </span>
                    <span className="truncate text-xs sm:text-[13px] font-semibold text-text-1 group-hover:text-accent transition-colors duration-150">
                      {c.value}
                    </span>
                  </div>
                  {c.copyable ? (
                    <button
                      type="button"
                      aria-label={copied ? "Copied" : "Copy email"}
                      className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-bg-subtle text-text-3 transition-all duration-200 hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:scale-95"
                      onClick={(e) => {
                        e.preventDefault();
                        copyEmail();
                      }}
                    >
                      {copied ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  ) : isActionable ? (
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-text-3 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent"
                    />
                  ) : null}
                </Wrapper>
              </li>
            );
          })}
        </ul>
      </FadeUp>
    </div>
  );
}
