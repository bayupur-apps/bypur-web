"use client";

import { useState, useEffect, useMemo } from "react";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import StackSection from "@/components/sections/stack";
import CertificatesSection from "@/components/sections/certificates";
import ExperienceSection from "@/components/sections/experience";
import ProjectsSection from "@/components/sections/projects";
import ContactSection from "@/components/sections/contact";
import { PortfolioProvider, usePortfolio } from "@/contexts/portfolio-context";

const allNavLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Certificates", href: "#certificates" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function PortfolioShell() {
  const { certificates } = usePortfolio();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // The Certificates section hides itself when empty - drop its nav link
  // too so header/footer never point at a missing anchor.
  const hasCertificates = certificates.length > 0;
  const navLinks = useMemo(
    () => allNavLinks.filter((link) => hasCertificates || link.href !== "#certificates"),
    [hasCertificates]
  );

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileOpen]);

  return (
    <div className="min-h-screen">
      <SiteHeader
        navLinks={navLinks}
        isMobileOpen={isMobileOpen}
        onToggleMobile={() => setIsMobileOpen((p) => !p)}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <main>
        <HeroSection />
        <AboutSection />
        <StackSection />
        <CertificatesSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <SiteFooter navLinks={navLinks} />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <PortfolioProvider>
      <PortfolioShell />
    </PortfolioProvider>
  );
}
