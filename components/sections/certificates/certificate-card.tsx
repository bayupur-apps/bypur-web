"use client";

import Image from "next/image";
import { ArrowUpRight, Award, CalendarDays, Check, Copy } from "lucide-react";
import { cn } from "@/lib/helpers";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import type { Certificate } from "@/lib/types";
import { formatCertDate, getCertificateStatus, type CertificateStatus } from "./utils";

interface CertificateCardProps {
  certificate: Certificate;
}

const STATUS_STYLES: Record<CertificateStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  lifetime: {
    label: "No expiration",
    className: "border-secondary/25 bg-secondary/10 text-accent dark:text-secondary",
  },
  expired: {
    label: "Expired",
    className: "border-border bg-bg-subtle text-text-3",
  },
};

function CopyCredentialId({ id }: { id: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-border bg-bg-subtle px-2.5 py-1.5">
      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-text-3">ID</span>
      <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-text-2" title={id}>
        {id}
      </code>
      <button
        type="button"
        onClick={() => copy(id)}
        aria-label={copied ? "Credential ID copied" : "Copy credential ID"}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-3 transition-colors hover:bg-bg-card hover:text-text-1"
      >
        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      </button>
    </div>
  );
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const status = getCertificateStatus(certificate);
  const { label: statusLabel, className: statusClass } = STATUS_STYLES[status];
  const issued = formatCertDate(certificate.issueDate);
  const expires = formatCertDate(certificate.expirationDate);

  return (
    <article
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border glass p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl hover:shadow-secondary/10",
        status === "expired" && "opacity-75 hover:opacity-100"
      )}
    >
      {/* Hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-12 -z-10 h-36 w-36 rounded-full bg-secondary/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Issuer logo + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white/80 shadow-sm dark:bg-white/90">
          {certificate.image ? (
            <Image src={certificate.image} alt={certificate.issuer} fill sizes="48px" className="object-contain p-2" />
          ) : (
            <Award size={20} className="text-accent" />
          )}
        </div>
        <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium", statusClass)}>
          {statusLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-4 line-clamp-2 text-[15px] font-semibold leading-snug text-text-1">
        {certificate.name}
      </h3>
      <p className="mt-1 text-sm text-text-2">{certificate.issuer}</p>

      {/* Dates */}
      {(issued || expires) && (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-3">
          <CalendarDays size={13} className="shrink-0" aria-hidden="true" />
          {issued && <span>Issued {issued}</span>}
          {issued && expires && <span aria-hidden="true">·</span>}
          {expires && <span>{status === "expired" ? "Expired" : "Expires"} {expires}</span>}
        </p>
      )}

      {/* Credential ID */}
      {certificate.credentialId && (
        <div className="mt-4">
          <CopyCredentialId id={certificate.credentialId} />
        </div>
      )}

      {/* Verify - the spacer pins it to the bottom while keeping a minimum gap */}
      {certificate.credentialUrl && (
        <div className="min-h-5 flex-1" aria-hidden="true" />
      )}
      {certificate.credentialUrl && (
        <a
          href={certificate.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border-t border-border pt-4 text-sm font-medium text-accent transition-colors hover:text-accent-hover dark:text-secondary dark:hover:text-secondary-hover"
        >
          Verify credential
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      )}
    </article>
  );
}
