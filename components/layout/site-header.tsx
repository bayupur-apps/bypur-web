"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/helpers";

// Dynamic import to skip SSR for theme toggle (avoid hydration mismatch)
const ThemeToggle = dynamic(
  () => import("./theme-toggle").then((mod) => ({ default: mod.ThemeToggle })),
  { ssr: false }
);

type NavLink = { label: string; href: string };

type Props = {
  navLinks: NavLink[];
  isMobileOpen: boolean;
  onToggleMobile: () => void;
  onCloseMobile: () => void;
};

export default function SiteHeader({ navLinks, isMobileOpen, onToggleMobile, onCloseMobile }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Handle scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = navLinks.map((link) => document.querySelector(link.href));
    sections.forEach((section) => section && observer.observe(section));

    return () => observer.disconnect();
  }, [navLinks]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "px-3 pt-3 sm:px-4" : "px-0 pt-0"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 items-center justify-between gap-3 border px-4 transition-all duration-300 sm:h-16 sm:gap-4 sm:px-5",
          scrolled
            ? "max-w-5xl rounded-xl border-border bg-bg/85 shadow-lg backdrop-blur-xl"
            : "max-w-7xl border-transparent"
        )}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="flex shrink-0 items-center text-lg font-semibold tracking-tight text-text-1 transition-opacity hover:opacity-80"
        >
          Bayu Purnomo
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                    activeSection === link.href
                      ? "bg-accent/10 text-accent"
                      : "text-text-3 hover:bg-bg-subtle/60 hover:text-text-1"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Theme toggle - dynamically imported to avoid hydration mismatch */}
          <ThemeToggle />

          {/* CTA */}
          <a
            href="#contact"
            className="group hidden h-9 items-center gap-1.5 rounded-full bg-accent pl-4 pr-3 text-sm font-medium text-accent-fg shadow-sm shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30 sm:inline-flex"
          >
            Get in touch
          </a>

          {/* Mobile menu */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-subtle/50 text-text-2 transition-all hover:border-accent/40 hover:text-text-1 md:hidden"
            onClick={onToggleMobile}
            aria-label="Menu"
            aria-expanded={isMobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-3 mt-2 origin-top overflow-hidden rounded-xl border border-border bg-bg/95 shadow-xl backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col p-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onCloseMobile}
                  className="flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium text-text-2 transition-all hover:bg-bg-subtle hover:text-text-1"
                >
                  {link.label}
                  <ArrowUpRight size={14} className="text-text-3" />
                </a>
              ))}
              <a
                href="#contact"
                onClick={onCloseMobile}
                className="mt-1 flex items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-3 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
              >
                Get in touch
                <ArrowUpRight size={14} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
   
