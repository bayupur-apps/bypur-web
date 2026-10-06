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
    className: "border-success/25 bg-success/10 text-success-ink",
  },
  lifetime: {
    label: "No expiration",
    className: "border-accent/25 bg-accent/10 text-accent",
  },
  expired: {
    label: "Expired",
    className: "border-border bg-bg-subtle text-text-3",
  },
};

function CopyCredentialId({ id }: { id: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-border/70 bg-bg-subtle/70 px-2.5 py-1.5">
      <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-3">ID</span>
      <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-text-2" title={id}>
        {id}
      </code>
      <button
        type="button"
        onClick={() => copy(id)}
        aria-label={copied ? "Credential ID copied" : "Copy credential ID"}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-3 transition-colors hover:bg-bg-card hover:text-text-1"
      >
        {copied ? <Check size={12} className="text-success-ink" /> : <Copy size={12} />}
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
        "group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 neumorphic p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg",
        status === "expired" && "opacity-75 hover:opacity-100"
      )}
    >
      {/* Issuer logo + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-white/90 shadow-sm">
          {certificate.image ? (
            <Image src={certificate.image} alt={certificate.issuer} fill sizes="48px" className="object-contain p-2" />
          ) : (
            <Award size={20} className="text-accent" />
          )}
        </div>
        <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium", statusClass)}>
          {statusLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-4 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-text-1">
        {certificate.name}
      </h3>
      <p className="mt-1 text-sm text-text-2">{certificate.issuer}</p>

      {/* Dates */}
      {(issued || expires) && (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-text-3">
          <CalendarDays size={13} className="shrink-0 text-accent" aria-hidden="true" />
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
          className="flex items-center justify-between border-t border-border/60 pt-4 text-sm font-medium text-accent transition-colors hover:underline"
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
