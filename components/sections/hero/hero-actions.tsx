import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getSocialLinks } from "@/lib/helpers";
import type { Profile } from "@/lib/types";

interface HeroActionsProps {
  profileData: Profile;
  className?: string;
}

// Hero only surfaces the two profiles a recruiter / client checks first;
// every other channel lives in Contact and the footer.
const PROFESSIONAL_SOCIALS = new Set(["GitHub", "LinkedIn"]);

/** Primary CTA, CV download and GitHub/LinkedIn in a single row. */
export function HeroActions({ profileData, className }: HeroActionsProps) {
  const primary = profileData.cta?.primary;
  const showCv = profileData.isCvVisible !== false && Boolean(profileData.resumeUrl);
  // Without a CV, fall back to the secondary CTA so the row keeps two buttons.
  const secondary = showCv ? undefined : profileData.cta?.secondary;
  const socials = getSocialLinks(profileData.socials).filter((s) => PROFESSIONAL_SOCIALS.has(s.label));

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3 lg:justify-start", className)}>
      {primary && (
        <Button href={primary.href} variant="primary" icon={ArrowRight} iconPosition="right" className="rounded-full">
          {primary.text}
        </Button>
      )}

      {showCv && (
        <a
          href={profileData.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border glass px-5 text-sm font-medium text-text-1 transition-all hover:border-secondary/40"
        >
          <Download size={15} className="transition-transform duration-200 group-hover:translate-y-0.5" />
          Download CV
        </a>
      )}

      {secondary && (
        <Button href={secondary.href} variant="secondary" className="rounded-full">
          {secondary.text}
        </Button>
      )}

      {socials.length > 0 && (
        <ul className="flex items-center gap-1 sm:ml-1">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full text-text-3 transition-colors hover:bg-bg-subtle hover:text-text-1"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden="true">
                  <path d={s.path ?? ""} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
