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
    className: "border-success/30 bg-success/10 text-success-ink",
  },
  lifetime: {
    label: "No expiration",
    className: "border-accent/30 bg-accent/10 text-accent",
  },
  expired: {
    label: "Expired",
    className: "border-border bg-bg-subtle text-text-3",
  },
};

function CopyCredentialId({ id }: { id: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex min-w-0 items-center justify-between gap-1.5 rounded-lg border border-border/50 bg-bg-subtle/50 px-2.5 py-1">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="shrink-0 font-mono text-[9px] font-semibold uppercase tracking-wider text-text-3">ID</span>
        <code className="min-w-0 truncate font-mono text-[10.5px] text-text-2" title={id}>
          {id}
        </code>
      </div>
      <button
        type="button"
        onClick={() => copy(id)}
        aria-label={copied ? "Credential ID copied" : "Copy credential ID"}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-text-3 transition-colors hover:text-text-1"
      >
        {copied ? <Check size={11} className="text-success-ink" /> : <Copy size={11} />}
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
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-bg-card p-4 sm:p-4.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40",
        status === "expired" && "opacity-75 hover:opacity-100"
      )}
    >
      {/* Issuer logo + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-bg-subtle/70">
          {certificate.image ? (
            <Image src={certificate.image} alt={certificate.issuer} fill sizes="40px" className="object-contain p-1.5" />
          ) : (
            <Award size={18} className="text-accent" />
          )}
        </div>
        <span className={cn("rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-medium", statusClass)}>
          {statusLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug tracking-tight text-text-1">
        {certificate.name}
      </h3>
      <p className="mt-0.5 text-xs text-text-2">{certificate.issuer}</p>

      {/* Dates */}
      {(issued || expires) && (
        <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-text-3">
          <CalendarDays size={12} className="shrink-0 text-accent" aria-hidden="true" />
          {issued && <span>Issued {issued}</span>}
          {issued && expires && <span aria-hidden="true">·</span>}
          {expires && <span>{status === "expired" ? "Expired" : "Expires"} {expires}</span>}
        </p>
      )}

      {/* Credential ID */}
      {certificate.credentialId && (
        <div className="mt-3">
          <CopyCredentialId id={certificate.credentialId} />
        </div>
      )}

      {/* Verify link pinned to bottom */}
      {certificate.credentialUrl && (
        <div className="min-h-3 flex-1" aria-hidden="true" />
      )}
      {certificate.credentialUrl && (
        <a
          href={certificate.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          <span>Verify credential</span>
          <ArrowUpRight
            size={13}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      )}
    </article>
  );
}
