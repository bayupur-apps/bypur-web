"use client";

import { useState, useMemo } from "react";
import { Orbit, Compass } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionTopBar } from "@/components/ui/section-top-bar";
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
    <SectionContainer
      id="experience"
      variant="hero"
      background="default"
      className="py-0 sm:py-0 w-full flex flex-col justify-center my-auto"
      innerClassName="w-full flex flex-col justify-center my-auto"
    >
      {/* Top Header Row: Career Timeline */}
      <SectionTopBar
        icon={Orbit}
        title={experienceConfig.title || "Career Experience & Timeline"}
        subtitle={
          <span className="inline-flex items-center gap-1">
            <Compass size={11} className="text-accent" /> FULL STACK TIMELINE
          </span>
        }
        badge={`${experiences.length} ROLES`}
        className="mb-2"
      />

      {/* Desktop: Orbital timeline + Station detail panel (Height matched with skills matrix) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-3.5 items-stretch lg:h-[450px] xl:h-[470px]">
        <div className="lg:col-span-5 flex flex-col h-full min-h-0">
          <DesktopTimeline
            experiences={experiences}
            selectedId={activeSelectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col h-full min-h-0">
          <ExperienceDetail experience={selected} />
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="lg:hidden">
        <MobileTimeline experiences={experiences} />
      </div>
    </SectionContainer>
  );
}
