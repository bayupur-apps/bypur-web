import type { Certificate } from "@/lib/types";

export type CertificateStatus = "active" | "expired" | "lifetime";

/** "Mar 2024", or "" for an unparsable date. */
export function formatCertDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function getCertificateStatus(cert: Certificate, now: Date = new Date()): CertificateStatus {
  if (cert.isLifetime || !cert.expirationDate) return "lifetime";
  const expires = new Date(cert.expirationDate);
  if (Number.isNaN(expires.getTime())) return "lifetime";
  return expires.getTime() < now.getTime() ? "expired" : "active";
}

/** Newest first; undated certificates go last. */
export function sortCertificates(certs: Certificate[]): Certificate[] {
  const time = (c: Certificate) => {
    const t = new Date(c.issueDate).getTime();
    return Number.isNaN(t) ? -Infinity : t;
  };
  return [...certs].sort((a, b) => time(b) - time(a));
}
