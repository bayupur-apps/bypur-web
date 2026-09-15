import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Certificate } from "@/lib/types";

interface CertificateCardProps {
  certificate: Certificate;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const validity = certificate.isLifetime
    ? "No expiration"
    : certificate.expirationDate
      ? `Valid until ${formatDate(certificate.expirationDate)}`
      : `Issued ${formatDate(certificate.issueDate)}`;

  return (
    <Card className="group flex h-full flex-col gap-3 rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
      <div className="flex items-start gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg-subtle">
          {certificate.image ? (
            <Image
              src={certificate.image}
              alt={certificate.issuer}
              fill
              sizes="44px"
              className="object-contain p-1.5"
            />
          ) : (
            <Award size={18} className="text-text-3" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold leading-snug text-text-1">
            {certificate.name}
          </h3>
          <p className="mt-0.5 text-[12px] text-text-2">{certificate.issuer}</p>
        </div>
      </div>

      <p className="text-[11px] text-text-3">{validity}</p>

      {certificate.credentialUrl && (
        <a
          href={certificate.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-accent transition-colors hover:text-accent/80"
        >
          Verify credential
          <ExternalLink size={12} />
        </a>
      )}
    </Card>
  );
}
