"use client";

import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/sections/hero";
import StackSection from "@/components/sections/stack";
import ProjectsSection from "@/components/sections/projects";
import ExperienceSection from "@/components/sections/experience";
import CertificatesSection from "@/components/sections/certificates";
import ContactSection from "@/components/sections/contact";

interface AppWorkspaceCanvasProps {
  activeView: string;
}

export function AppWorkspaceCanvas({ activeView }: AppWorkspaceCanvasProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative flex-1 h-full w-full overflow-hidden focus:outline-none"
    >
      <div className="h-full w-full overflow-y-auto px-2 sm:px-4 py-2 pb-24 md:pb-2 flex flex-col md:justify-center custom-workspace-scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full my-auto py-1"
          >
            {activeView === "bio" && <HeroSection />}

            {activeView === "stack" && <StackSection />}

            {activeView === "projects" && <ProjectsSection />}

            {activeView === "experience" && <ExperienceSection />}

            {activeView === "certificates" && <CertificatesSection />}

            {activeView === "contact" && <ContactSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
