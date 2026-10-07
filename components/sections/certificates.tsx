"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Award } from "lucide-react";
import { FadeUp } from "@/components/ui/motion";
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
  const title = certificatesConfig.title || "Credentials that back it up.";

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE);
  const hiddenCount = sorted.length - INITIAL_VISIBLE;

  return (
    <SectionContainer id="certificates" background="default" className="py-1">
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Award size={13} />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-text-1">
            {title}
          </h2>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent font-mono">
            {sorted.length} Credentials
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-text-3">
          Verified certifications &amp; industry credentials
        </span>
      </div>

      <div className="max-h-[390px] overflow-y-auto custom-workspace-scroll pr-1">
        <ul className={cn("grid gap-3.5", gridForCount(sorted.length))}>
          {visible.map((cert, i) => (
            <li key={cert.id}>
              <FadeUp delay={Math.min(i, INITIAL_VISIBLE) * 0.05} className="h-full">
                <CertificateCard certificate={cert} />
              </FadeUp>
            </li>
          ))}
        </ul>
      </div>

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
