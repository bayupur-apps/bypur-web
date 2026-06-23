import { profileDataDefault as profile } from "@/lib/data/profile.default";
import { SOCIAL_SVG_PATHS } from "@/lib/config/constants";
import { Mail, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  const socials = [
    { label: "GitHub", href: profile.socials.github ?? "#", path: SOCIAL_SVG_PATHS.github },
    { label: "LinkedIn", href: profile.socials.linkedin ?? "#", path: SOCIAL_SVG_PATHS.linkedin },
    { label: "Instagram", href: profile.socials.instagram ?? "#", path: SOCIAL_SVG_PATHS.instagram },
    { label: "WhatsApp", href: profile.socials.whatsapp ?? "#", path: SOCIAL_SVG_PATHS.whatsapp },
  ];

  return (
    <footer className="relative isolate overflow-hidden border-t border-border/60 bg-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-240 -translate-x-1/2 rounded-full bg-accent/8 blur-3xl" />

      <div className="container-main py-12 sm:py-16">
        {/* Big interactive CTA */}
        <a href="#contact" className="group mb-10 block sm:mb-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            Got an idea?
          </span>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-4xl font-black leading-[1.05] tracking-tight text-text-1 sm:text-5xl lg:text-6xl">
            <span>Let&apos;s build</span>
            <span className="inline-flex items-baseline gap-3 text-accent">
              something
              <ArrowUpRight className="h-9 w-9 shrink-0 -translate-y-1 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm text-text-3 sm:text-base">
            A quick message is all it takes to start.{" "}
            <span className="text-text-2 underline decoration-border underline-offset-4 transition-colors group-hover:decoration-accent">
              Send the first one
            </span>{" "}
            and let&apos;s see where it goes.
          </p>
        </a>

        {/* Middle grid */}
        <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-[1.6fr_1fr_1fr] md:gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <a href="#hero" aria-label="Home" className="inline-flex w-fit">
              <span className="text-2xl font-bold text-text-1">
                Bayu Purnomo
              </span>
            </a>

            <p className="max-w-sm text-sm leading-relaxed text-text-3">
              {profile.bio}
            </p>

            {/* Socials */}
            <ul className="flex flex-wrap items-center gap-1.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/60 text-text-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/60 text-text-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                >
                  <Mail size={16} />
                </a>
              </li>
            </ul>
          </div>

          {/* Sitemap */}
          <nav className="flex flex-col gap-4" aria-label="Footer navigation">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">
              Sitemap
            </h2>

            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-text-2 transition-colors hover:text-accent"
                  >
                    <span className="h-1 w-1 rounded-full bg-border transition-colors duration-300 group-hover:bg-accent" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-3">
              Get in touch
            </h2>

            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-start gap-2 text-sm text-text-2 transition-colors hover:text-accent"
                >
                  <Mail size={16} className="mt-0.5 shrink-0" />
                  <span className="break-all">{profile.email}</span>
                </a>
              </li>
              {profile.phone && (
                <li>
                  <a
                    href={`tel:${profile.phone.replace(/\s|-/g, "")}`}
                    className="group inline-flex items-start gap-2 text-sm text-text-2 transition-colors hover:text-accent"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{profile.phone}</span>
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2 text-sm text-text-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Indonesia · UTC+7</span>
              </li>
            </ul>

            <div className="mt-2 rounded-lg border border-border/50 bg-bg-subtle/50 p-3">
              <p className="text-[11px] text-text-3">
                <span className="font-semibold text-text-2">Response time:</span> Usually within 1–2 working days
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-text-3">
            © {year} {profile.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-text-3">
            <span>v0.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}