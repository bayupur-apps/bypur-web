"use client";

import { useState, useMemo } from "react";
import { Orbit, Compass } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { DesktopTimeline } from "./experience/desktop-timeline";
import { MobileTimeline } from "./experience/mobile-timeline";
import { ExperienceDetail } from "./experience/experience-detail";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function ExperienceSection() {
  const { profile: profileData, experiences } = usePortfolio();
  const [selectedId, setSelectedId] = useState("");

  const activeSelectedId = useMemo(() => {
    if (selectedId && experiences.some((e) => e.id === selectedId)) {
      return selectedId;
    }
    return experiences[0]?.id || "";
  }, [experiences, selectedId]);

  const selected = useMemo(() => {
    return (
      experiences.find((e) => e.id === activeSelectedId) ||
      experiences[0] ||
      null
    );
  }, [experiences, activeSelectedId]);

  const experienceConfig = profileData.experience || {};

  if (!selected) return null;

  return (
    <SectionContainer id="experience" background="default" className="py-1">
      {/* Top Header Row with Orbital Telemetry */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/30 shadow-[0_0_8px_rgba(2,132,199,0.25)]">
            <Orbit size={13} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-text-1">
              {experienceConfig.title || "Career Logs & Orbital Experience Hub"}
            </h2>
          </div>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent font-mono">
            {experiences.length} STATIONS
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-text-3">
          <span className="hidden sm:inline-flex items-center gap-1">
            <Compass size={11} className="text-accent" /> ZERO-GRAVITY CANVAS
          </span>
          <span className="rounded-full bg-bg-subtle px-2 py-0.5 font-mono text-[9px] text-text-3">
            SYS: STABLE
          </span>
        </div>
      </div>

      {/* Desktop: Orbital timeline + Floating Station detail panel */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-3 items-start">
        <div className="lg:col-span-5 flex flex-col">
          <DesktopTimeline
            experiences={experiences}
            selectedId={activeSelectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <ExperienceDetail experience={selected} />
        </div>
      </div>

      {/* Mobile: zero-gravity vertical timeline */}
      <div className="lg:hidden">
        <MobileTimeline experiences={experiences} />
      </div>
    </SectionContainer>
  );
}
