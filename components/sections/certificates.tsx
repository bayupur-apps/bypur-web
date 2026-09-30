"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { SectionContainer } from "@/components/ui/section-container";
import { CertificateCard } from "./certificates/certificate-card";
import { sortCertificates } from "./certificates/utils";
import { cn } from "@/lib/helpers";
import { usePortfolio } from "@/contexts/portfolio-context";

const INITIAL_VISIBLE = 6;

// A lone card shouldn't sit in the corner of an empty 3-column grid.
const gridForCount = (count: number) =>
  count === 1
    ? "mx-auto max-w-sm grid-cols-1"
    : count === 2
      ? "mx-auto max-w-3xl sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

export default function CertificatesSection() {
  const { profile: profileData, certificates } = usePortfolio();
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => sortCertificates(certificates), [certificates]);

  // No certificates configured yet - hide the section entirely rather
  // than showing an empty shell (the nav link is dropped as well).
  if (sorted.length === 0) return null;

  const certificatesConfig = profileData.certificates || {};
  const label = certificatesConfig.label || "Certificates";
  const title = certificatesConfig.title || "Credentials that back it up.";
  const titleHighlight = certificatesConfig.titleHighlight || "back it up.";
  const description =
    certificatesConfig.description ||
    "Certifications earned along the way to validate hands-on skills.";

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE);
  const hiddenCount = sorted.length - INITIAL_VISIBLE;

  return (
    <SectionContainer id="certificates" background="default">
      <FadeUp>
        <SectionHeader
          label={label}
          title={<HighlightedTitle title={title} highlight={titleHighlight} />}
          description={description}
          className="mx-auto max-w-2xl text-center"
        />
      </FadeUp>

      <ul className={cn("mt-10 grid gap-5", gridForCount(sorted.length))}>
        {visible.map((cert, i) => (
          <li key={cert.id}>
            <FadeUp delay={Math.min(i, INITIAL_VISIBLE) * 0.05} className="h-full">
              <CertificateCard certificate={cert} />
            </FadeUp>
          </li>
        ))}
      </ul>

      {hiddenCount > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border glass px-5 text-sm font-medium text-text-2 transition-all hover:border-secondary/40 hover:text-text-1"
          >
            {showAll ? "Show less" : `Show all certificates (${sorted.length})`}
            <ChevronDown
              size={16}
              className={cn("transition-transform duration-300", showAll && "rotate-180")}
            />
          </button>
        </div>
      )}
    </SectionContainer>
  );
}
