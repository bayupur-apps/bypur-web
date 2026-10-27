"use client";

import { useState, useMemo } from "react";
import { Briefcase } from "lucide-react";
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
        icon={Briefcase}
        title={experienceConfig.title || "Career Experience & Timeline"}
        subtitle="// TRACK RECORD & CONTRIBUTIONS"
        badge={`${experiences.length} ${experiences.length === 1 ? "ROLE" : "ROLES"}`}
        className="mb-3"
      />

      {/* Desktop: Vertical Timeline on Left + Detail Card on Right with Fixed Viewport Height */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-stretch lg:h-[455px] xl:h-[475px] w-full">
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col h-full min-h-0">
          <DesktopTimeline
            experiences={experiences}
            selectedId={activeSelectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="lg:col-span-8 xl:col-span-8 flex flex-col h-full min-h-0">
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
