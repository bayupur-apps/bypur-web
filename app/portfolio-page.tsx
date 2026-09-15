"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import StackSection from "@/components/sections/stack";
import CertificatesSection from "@/components/sections/certificates";
import ExperienceSection from "@/components/sections/experience";
import ProjectsSection from "@/components/sections/projects";
import ContactSection from "@/components/sections/contact";
import { PortfolioProvider } from "@/contexts/portfolio-context";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Certificates", href: "#certificates" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    <PortfolioProvider>
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
    </PortfolioProvider>
  );
}
