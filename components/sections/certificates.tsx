"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionContainer } from "@/components/ui/section-container";
import { CertificateCard } from "./certificates/certificate-card";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function CertificatesSection() {
  const { profile: profileData, certificates } = usePortfolio();

  // No certificates configured yet - hide the section entirely rather
  // than showing an empty shell.
  if (certificates.length === 0) return null;

  const certificatesConfig = profileData.certificates || {};
  const label = certificatesConfig.label || "Certificates";
  const title = certificatesConfig.title || "Credentials that back it up.";
  const titleHighlight = certificatesConfig.titleHighlight || "back it up.";
  const description =
    certificatesConfig.description ||
    "Certifications earned along the way to validate hands-on skills.";

  return (
    <SectionContainer id="certificates" background="default">
      <FadeUp>
        <SectionHeader
          label={label}
          title={
            <>
              {title.replace(titleHighlight, "")}{" "}
              <span className="text-accent">{titleHighlight}</span>
            </>
          }
          description={description}
        />
      </FadeUp>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <FadeUp key={cert.id} delay={i * 0.04}>
            <CertificateCard certificate={cert} />
          </FadeUp>
        ))}
      </div>
    </SectionContainer>
  );
}
