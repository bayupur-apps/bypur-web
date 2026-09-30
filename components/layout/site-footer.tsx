"use client";

import { Globe } from "lucide-react";
import { usePortfolio } from "@/contexts/portfolio-context";
import { getSocialLinks } from "@/lib/helpers";

type NavLink = { label: string; href: string };

interface SiteFooterProps {
  navLinks: NavLink[];
}

/**
 * Deliberately slim: the Contact section sits right above with the CTA,
 * email/phone, location and response time, and About carries the bio - so
 * the footer is just identity, navigation, socials and the legal line.
 */
export default function SiteFooter({ navLinks }: SiteFooterProps) {
  const { profile } = usePortfolio();
  const year = new Date().getFullYear();

  const socials = getSocialLinks(profile.socials);

  return (
    <footer className="relative isolate overflow-hidden border-t border-border glass">
      {/* Hairline highlight along the top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-secondary/50 to-transparent"
      />

      <div className="container-main py-10 sm:py-12">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          {/* Identity */}
          <div>
            <a href="#hero" className="inline-flex min-h-11 items-center text-lg font-bold text-text-1 transition-opacity hover:opacity-80">
              {profile.name}
            </a>
            <p className="text-sm text-text-3">
              {profile.title}
              {profile.location && ` · ${profile.location}`}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-1 gap-y-1 md:max-w-md md:justify-end">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-text-2 transition-colors hover:bg-bg-subtle hover:text-text-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center gap-5 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-text-3">
            &copy; {year} {profile.name}. All rights reserved.
          </p>

          {socials.length > 0 && (
            <ul className="flex items-center gap-1.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-text-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-bg-subtle hover:text-text-1"
                  >
                    {s.path ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                        <path d={s.path} />
                      </svg>
                    ) : (
                      <Globe size={16} />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
