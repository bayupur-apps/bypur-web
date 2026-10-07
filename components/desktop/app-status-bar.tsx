"use client";

import { usePortfolio } from "@/contexts/portfolio-context";
import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";

export function AppStatusBar() {
  const { profile } = usePortfolio();
  const socials = profile.socials || {};

  const socialLinks: { key: keyof typeof SOCIAL_SVG_PATHS; label: string; href: string }[] = [
    ...(socials.github ? [{ key: "github" as const, label: "GitHub", href: socials.github }] : []),
    ...(socials.linkedin ? [{ key: "linkedin" as const, label: "LinkedIn", href: socials.linkedin }] : []),
    ...(socials.whatsapp ? [{ key: "whatsapp" as const, label: "WhatsApp", href: socials.whatsapp }] : []),
  ];

  return (
    <div className="relative z-30 hidden md:block w-full shrink-0 pb-2 pt-1">
      <footer className="flex h-8 w-full items-center justify-between border-t border-border/60 px-2 text-xs text-text-3">
        {/* LEFT: Copyright & Tech Stack */}
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-text-2 text-[11px]">
            &copy; {new Date().getFullYear()} {profile.name || "Bayu Purnomo"}
          </span>
          <span className="text-border">/</span>
          <span className="text-[11px] text-text-3">
            Built with Next.js 15, React 19 &amp; Tailwind CSS
          </span>
        </div>

        {/* RIGHT: Real Social Channels & Location */}
        <div className="flex items-center gap-4">
          {profile.location && (
            <span className="hidden lg:inline text-[11px] text-text-3">
              {profile.location}
            </span>
          )}

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3.5 border-l border-border/60 pl-3.5">
              {socialLinks.map((link) => {
                const path = SOCIAL_SVG_PATHS[link.key];
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-text-3 transition-colors hover:text-accent"
                    aria-label={link.label}
                  >
                    {path && (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d={path} />
                      </svg>
                    )}
                    <span className="hidden xl:inline text-[11px]">{link.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
