"use client";

import { usePortfolio } from "@/contexts/portfolio-context";
import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import { normalizeExternalUrl } from "@/lib/helpers";

import { Mail } from "lucide-react";

export function AppStatusBar() {
  const { profile, settings } = usePortfolio();
  const socials = profile.socials || {};

  const effectiveGithub = settings?.social_github || socials.github;
  const effectiveLinkedin = settings?.social_linkedin || socials.linkedin;
  const effectiveWhatsapp = settings?.social_whatsapp || socials.whatsapp;
  const effectiveEmail = settings?.owner_email || settings?.contact_email || profile.email;

  const socialLinks: { key: "github" | "linkedin" | "whatsapp"; label: string; href: string }[] = [
    ...(effectiveGithub ? [{ key: "github" as const, label: "GitHub", href: normalizeExternalUrl(effectiveGithub) }] : []),
    ...(effectiveLinkedin ? [{ key: "linkedin" as const, label: "LinkedIn", href: normalizeExternalUrl(effectiveLinkedin) }] : []),
    ...(effectiveWhatsapp ? [{ key: "whatsapp" as const, label: "WhatsApp", href: normalizeExternalUrl(effectiveWhatsapp) }] : []),
  ];

  const displayName = settings?.site_name || profile.name || "Bayu Purnomo";

  return (
    <div className="relative z-30 hidden md:block w-full shrink-0 pb-2 pt-1">
      <footer className="flex h-8 w-full items-center justify-between border-t border-border/60 px-2 text-xs text-text-3">
        {/* LEFT: Clean Copyright Statement */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-2 text-[11px]">
            &copy; {new Date().getFullYear()} {displayName}
          </span>
        </div>

        {/* RIGHT: Direct Social Channels & Email */}
        {(socialLinks.length > 0 || effectiveEmail) && (
          <div className="flex items-center gap-3.5">
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
            {effectiveEmail && (
              <a
                href={`mailto:${effectiveEmail}`}
                className="flex items-center gap-1.5 text-xs text-text-3 transition-colors hover:text-accent"
                aria-label="Email"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden xl:inline text-[11px]">Email</span>
              </a>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}
