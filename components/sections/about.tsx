import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionContainer } from "@/components/ui/section-container";
import { NarrativeSection } from "./about/narrative-section";
import { ServicesList } from "./about/services-list";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function AboutSection() {
  const { profile: profileData, services: servicesData, loading } = usePortfolio();

  // Derived data
  const aboutLabel = profileData.about?.label || "About";
  const aboutTitle = profileData.about?.title || "A developer who cares about";
  const aboutTitleHighlight = profileData.about?.titleHighlight || "the full picture.";

  if (loading) {
    return (
      <SectionContainer id="about" background="subtle">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="about" background="subtle">
      <FadeUp>
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeader
            label={aboutLabel}
            title={
              <>
                {aboutTitle}{" "}
                <span className="text-accent">{aboutTitleHighlight}</span>
              </>
            }
          />
        </div>
      </FadeUp>

      {/* Narrative - Centered */}
      <div className="mx-auto mt-6 max-w-3xl">
        <NarrativeSection profileData={profileData} />
      </div>

      {/* Services - Card Grid below */}
      <div className="mt-16 border-t border-border/40 pt-16">
        <FadeUp>
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-text-1 sm:text-3xl">
              What I Do
            </h3>
            <p className="mt-2 text-sm text-text-3">
              Services and expertise I offer
            </p>
          </div>
        </FadeUp>
        <ServicesList services={servicesData} />
      </div>
    </SectionContainer>
  );
}
