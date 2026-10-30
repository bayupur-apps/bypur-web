"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Award,
  ShieldCheck,
  CalendarDays,
  ArrowUpRight,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Layers,
  LayoutList,
} from "lucide-react";
import { SectionTopBar } from "@/components/ui/section-top-bar";
import { CardSwap, type CardSwapItem } from "@/components/ui/card-swap";
import { usePortfolio } from "@/contexts/portfolio-context";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/helpers";
import type { Certificate } from "@/lib/types";
import { formatCertDate, getCertificateStatus, sortCertificates } from "./certificates/utils";

function CopyLicenseId({ id }: Readonly<{ id: string }>) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        copy(id);
      }}
      aria-label={copied ? "Credential ID copied" : "Copy credential ID"}
      className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-bg-card/90 px-2 py-1 font-mono text-[9.5px] text-text-2 hover:border-accent/50 hover:text-accent transition-colors shadow-2xs"
    >
      <span className="text-text-3 uppercase">ID:</span>
      <span className="font-semibold text-text-1">{id}</span>
      {copied ? (
        <Check size={11} className="text-emerald-500 shrink-0" />
      ) : (
        <Copy size={11} className="text-text-3 shrink-0" />
      )}
    </button>
  );
}

const CATEGORY_MAP: Record<string, string> = {
  "AWS Certified Solutions Architect": "Cloud & DevOps",
  "Professional Cloud Architect": "Cloud & DevOps",
  "Meta Certified Front-End Developer": "Frontend",
  "HashiCorp Certified: Terraform Associate": "Cloud & DevOps",
  "Certified Kubernetes Administrator (CKA)": "Cloud & DevOps",
  "Advanced PostgreSQL 15 DBA & Performance": "Database",
};

export default function CertificatesSection() {
  const { profile: profileData, certificates } = usePortfolio();
  const sorted = useMemo(() => sortCertificates(certificates), [certificates]);
  const certificatesConfig = profileData.certificates || {};

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeDeckIndex, setActiveDeckIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"deck" | "list">("deck");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    sorted.forEach((c) => {
      const cat = CATEGORY_MAP[c.name] ?? "Architecture";
      set.add(cat);
    });
    return Array.from(set);
  }, [sorted]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return sorted;
    return sorted.filter((c) => (CATEGORY_MAP[c.name] ?? "Architecture") === activeCategory);
  }, [sorted, activeCategory]);

  const activeCert: Certificate | null = useMemo(() => {
    return filtered[activeDeckIndex] ?? filtered[0] ?? null;
  }, [filtered, activeDeckIndex]);

  // Convert filtered certificates into CardSwap items
  const swapItems: CardSwapItem[] = useMemo(() => {
    return filtered.map((cert) => {
      const status = getCertificateStatus(cert);
      const issued = formatCertDate(cert.issueDate);
      const expires = cert.expirationDate ? formatCertDate(cert.expirationDate) : "";

      return {
        id: cert.id,
        content: (
          <div className="relative h-full w-full rounded-2xl border border-border/80 bg-bg-card dark:bg-gradient-to-b dark:from-[#181B26] dark:via-[#12141D] dark:to-[#0D0F15] p-4 sm:p-5 flex flex-col justify-between shadow-md dark:shadow-2xl overflow-hidden group hover:border-accent/60 transition-colors">
            {/* Ambient Radial Foil Glare */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/[0.08] dark:bg-accent/[0.12] blur-2xl group-hover:bg-accent/[0.15] dark:group-hover:bg-accent/[0.2] transition-all duration-300"
            />

            {/* Top Card Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-2 z-10 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent" />
                <span className="font-mono text-[10px] font-bold text-text-1 uppercase tracking-wider">
                  {cert.issuer}
                </span>
              </div>
              <span
                className={cn(
                  "font-mono text-[8.5px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1",
                  status === "active"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                    : status === "lifetime"
                      ? "border-accent/40 bg-accent/10 text-amber-700 dark:text-accent font-bold"
                      : "border-border bg-bg-subtle text-text-3"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    status === "expired" ? "bg-text-3" : "bg-emerald-500 animate-pulse"
                  )}
                />
                {status === "lifetime"
                  ? "Lifetime"
                  : status === "active"
                    ? "Active"
                    : "Expired"}
              </span>
            </div>

            {/* Middle Card Body: Official SVG Badge + Title */}
            <div className="flex items-center gap-3.5 sm:gap-4 my-auto py-1 z-10">
              {/* Badge Image Container */}
              <div className="relative h-18 w-18 sm:h-22 sm:w-22 shrink-0 rounded-xl bg-bg-subtle/70 dark:bg-bg-card/90 p-1 border border-border/80 shadow-xs dark:shadow-md">
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    sizes="88px"
                    className="object-contain p-0.5 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Award size={32} />
                  </div>
                )}
              </div>

              {/* Title & Issuer Info */}
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[8.5px] font-bold text-amber-700 dark:text-accent uppercase tracking-wider">
                  {CATEGORY_MAP[cert.name] ?? "Professional Accreditation"}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-text-1 leading-snug line-clamp-2 mt-0.5">
                  {cert.name}
                </h3>
                <div className="flex items-center gap-2 font-mono text-[9px] text-text-3 mt-1.5">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={10} className="text-accent shrink-0" />
                    Issued {issued}
                  </span>
                  {expires && <span>· Valid thru {expires}</span>}
                  {cert.isLifetime && <span className="text-amber-700 dark:text-accent font-semibold">· Lifetime</span>}
                </div>
              </div>
            </div>

            {/* Bottom Card Footer: License ID + External Verify Link */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40 z-10 shrink-0">
              {cert.credentialId ? (
                <CopyLicenseId id={cert.credentialId} />
              ) : (
                <span className="font-mono text-[8.5px] font-semibold text-text-3">{cert.issuer}</span>
              )}

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 font-mono text-[9.5px] font-bold text-accent-fg hover:bg-accent-hover transition-colors shadow-xs"
                >
                  <span>Verify</span>
                  <ArrowUpRight size={11} />
                </a>
              )}
            </div>
          </div>
        ),
      };
    });
  }, [filtered]);

  if (sorted.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-full">
      {/* Top Console Bar */}
      <SectionTopBar
        icon={Award}
        title={certificatesConfig.title || "Professional Credentials & Licenses"}
        subtitle="// VERIFIED ACCREDITATIONS"
        badge={`${sorted.length} CREDENTIALS`}
        className="mb-1"
      />

      {/* Top Toolbar: Category Filters & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveDeckIndex(0);
                }}
                className={cn(
                  "font-mono text-[9px] font-semibold min-h-10 sm:min-h-[26px] px-3 sm:px-2.5 py-1.5 sm:py-1 rounded-md transition-colors whitespace-nowrap active:scale-95 inline-flex items-center",
                  isActive
                    ? "bg-accent text-accent-fg shadow-2xs font-bold"
                    : "bg-bg-card text-text-3 border border-border/60 hover:text-text-1 hover:border-accent/40"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right Action: Dual-Mode Switcher + Beacon */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: 3D Coverflow vs Quick Scan List */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border/70 bg-bg-card text-[9px] font-mono shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("deck")}
              className={cn(
                "flex items-center gap-1 min-h-10 sm:min-h-[26px] px-2.5 sm:px-2 py-1.5 sm:py-1 rounded-md transition-all active:scale-95",
                viewMode === "deck"
                  ? "bg-accent/15 text-accent font-bold shadow-2xs border border-accent/30"
                  : "text-text-3 hover:text-text-1"
              )}
              aria-label="3D Stage View"
            >
              <Layers size={11} />
              <span className="hidden xs:inline">3D STAGE</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1 min-h-10 sm:min-h-[26px] px-2.5 sm:px-2 py-1.5 sm:py-1 rounded-md transition-all active:scale-95",
                viewMode === "list"
                  ? "bg-accent/15 text-accent font-bold shadow-2xs border border-accent/30"
                  : "text-text-3 hover:text-text-1"
              )}
              aria-label="Full Registry View"
            >
              <LayoutList size={11} />
              <span className="hidden xs:inline">FULL REGISTRY</span>
            </button>
          </div>

          {/* Active Status Beacon */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[8.5px] text-text-3">
            <CheckCircle2 size={11} className="text-accent" />
            <span className="font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
              {filtered.length} OF {sorted.length} LICENSES
            </span>
          </div>
        </div>
      </div>

      {/* Center: Dual-Mode Viewport */}
      {viewMode === "deck" ? (
        /* Mode 1: 3D Panoramic Coverflow Deck */
        <div className="h-[360px] sm:h-[385px] lg:h-[405px] xl:h-[425px] w-full flex items-center justify-center my-auto relative overflow-hidden">
          {/* Subtle Ambient Studio Bloom Behind the Floating Deck */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_640px_320px_at_50%_45%,rgba(245,158,11,0.06)_0%,transparent_75%)]"
          />

          <CardSwap
            key={activeCategory}
            items={swapItems}
            delay={4000}
            pauseOnHover
            onIndexChange={setActiveDeckIndex}
            renderNavScrubber={(idx, total, onSelect) => (
              /* Custom Interactive Thumbnail Scrubber */
              <div className="flex items-center gap-1.5 bg-bg-card/90 border border-border/80 rounded-xl px-2.5 py-1 shadow-xs backdrop-blur-xs">
                {filtered.map((cert, i) => {
                  const isCurrent = i === idx;
                  return (
                    <button
                      key={cert.id}
                      type="button"
                      onClick={() => onSelect(i)}
                      title={cert.name}
                      aria-label={`Jump to ${cert.name}`}
                      className={cn(
                        "relative h-6 w-6 rounded-md transition-all duration-200 p-0.5 border flex items-center justify-center",
                        isCurrent
                          ? "border-accent bg-accent/15 scale-110 shadow-xs"
                          : "border-border/60 bg-bg-subtle/60 opacity-60 hover:opacity-100 hover:border-accent/40"
                      )}
                    >
                      {cert.image ? (
                        <Image
                          src={cert.image}
                          alt=""
                          fill
                          sizes="24px"
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <Award size={10} className="text-accent" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      ) : (
        /* Mode 2: Quick-Scan Grid (All Visible at Once) */
        <div className="h-[360px] sm:h-[385px] lg:h-[405px] xl:h-[425px] w-full overflow-y-auto py-1 pr-1 custom-workspace-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filtered.map((cert) => {
              const status = getCertificateStatus(cert);
              const issued = formatCertDate(cert.issueDate);
              const expires = cert.expirationDate ? formatCertDate(cert.expirationDate) : "";

              return (
                <div
                  key={cert.id}
                  className="group relative rounded-xl border border-border/80 bg-bg-card p-3 flex flex-col justify-between hover:border-accent/50 transition-all shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Card Top: Issuer & Status */}
                    <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-border/40">
                      <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-wider truncate">
                        {cert.issuer}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[8px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0",
                          status === "active"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                            : status === "lifetime"
                              ? "border-accent/40 bg-accent/10 text-amber-700 dark:text-accent font-bold"
                              : "border-border bg-bg-subtle text-text-3"
                        )}
                      >
                        {status === "lifetime"
                          ? "Lifetime"
                          : status === "active"
                            ? "Active"
                            : "Expired"}
                      </span>
                    </div>

                    {/* Card Body: Badge + Title */}
                    <div className="flex items-start gap-2.5 py-2">
                      <div className="relative h-11 w-11 shrink-0 rounded-lg bg-bg-subtle/80 dark:bg-bg-card p-0.5 border border-border/80 shadow-2xs">
                        {cert.image ? (
                          <Image
                            src={cert.image}
                            alt={cert.name}
                            fill
                            sizes="44px"
                            className="object-contain p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
                          />
                        ) : (
                          <Award size={18} className="text-accent m-auto" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11.5px] font-bold text-text-1 leading-snug line-clamp-2">
                          {cert.name}
                        </h4>
                        <div className="flex items-center gap-1.5 font-mono text-[8.5px] text-text-3 mt-1">
                          <span>{issued}</span>
                          {expires && <span>· thru {expires}</span>}
                          {cert.isLifetime && <span className="text-amber-700 dark:text-accent font-semibold">· Lifetime</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: License ID & Instant Verify Button */}
                  <div className="flex items-center justify-between gap-1 pt-2 border-t border-border/40 mt-1">
                    {cert.credentialId ? (
                      <CopyLicenseId id={cert.credentialId} />
                    ) : (
                      <span className="font-mono text-[8px] font-semibold text-text-3">{cert.issuer}</span>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 font-mono text-[8.5px] font-bold text-accent-fg hover:bg-accent-hover transition-colors shadow-2xs shrink-0"
                      >
                        <span>Verify</span>
                        <ArrowUpRight size={10} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Telemetry Footer Strip */}
      <div className="pt-2 border-t border-border/40 font-mono text-[8.5px] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-text-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>
            {viewMode === "deck"
              ? `Focus: ${activeCert?.name ?? "Credential"}`
              : `Full Registry: ${filtered.length} of ${sorted.length} Credentials`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[8.5px] text-text-3 hidden sm:inline">
            {viewMode === "deck"
              ? "Click adjacent cards to center focus"
              : "Validated directly with official issuing authority"}
          </span>
          {viewMode === "deck" && activeCert?.credentialUrl && (
            <a
              href={activeCert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center gap-0.5 font-semibold"
            >
              Open Verification <ExternalLink size={9} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
